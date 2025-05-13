import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Footer from "../../components/layout/Footer";
import NavigationBar from "../../components/layout/Navbar";
import SubNav from "../../components/layout/SubNav";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DeliveryTracking {
  orderId: string;
  isDelivered: boolean;
  estimatedArrival: string; // Estimated arrival time
  driverName: string;
  driverLatitude: number;
  driverLongitude: number;
  customerLatitude: number;
  customerLongitude: number;
}

// Fix Leaflet icon issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons for different markers
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Create our specific icons
const driverIcon = createCustomIcon('blue');
const customerIcon = createCustomIcon('green');

const CustomerTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerLocation, setCustomerLocation] = useState<Location | null>(null);
  const [delivery, setDelivery] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Get orderId from session storage
  useEffect(() => {
    try {
      // Parse the orders data from session storage
      const sessionData = sessionStorage.getItem('orderDetails');
      if (sessionData) {
        const orderData = JSON.parse(sessionData);
        console.log("Order data retrieved from session storage:", orderData);

        // Check if orderId exists directly in the object
        if (orderData && orderData.orderId) {
          setOrderId(orderData.orderId.toString());
          console.log("Set order ID to:", orderData.orderId.toString());
        }
        // Check if it's an array of orders
        else if (Array.isArray(orderData) && orderData.length > 0) {
          // Get the first order's ID
          setOrderId(orderData[0].orderId.toString());
          console.log("Set order ID from array to:", orderData[0].orderId.toString());
        } else {
          throw new Error('No valid order data found');
        }
      } else {
        throw new Error('No order data in session storage');
      }
    } catch (err) {
      console.error('Error retrieving order data from session storage:', err);
      setError('Unable to retrieve order information. Please go back and try again.');
    }
  }, []);

  // Get customer location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomerLocation({ latitude, longitude });
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Location error:', error);
          setError('Unable to access your location. Please enable location services to track your delivery accurately.');
        },
        { enableHighAccuracy: true }
    );
  }, []);

  // Fetch delivery tracking info and update periodically
  useEffect(() => {
    // Only proceed if we have an orderId
    if (!orderId) return;

    const fetchDeliveryInfo = () => {
      setLoading(true);
      // Replace with your actual API endpoint
      fetch(`http://localhost:8082/api/v1/delivery/${orderId}`)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch delivery tracking data');
            return res.json();
          })
          .then((data) => {
            setDelivery(data);
            setLoading(false);

            // If we have driver coordinates, adjust map center between driver and customer
            if (data.driverLatitude && data.driverLongitude && customerLocation) {
              const centerLat = (data.driverLatitude + customerLocation.latitude) / 2;
              const centerLng = (data.driverLongitude + customerLocation.longitude) / 2;
              setMapCenter([centerLat, centerLng]);
            }
          })
          .catch((err) => {
            console.error('Failed to load delivery tracking', err);
            // For development purposes, let's create mock data when API fails
            const mockDelivery: DeliveryTracking = {
              orderId: orderId,
              isDelivered: false,
              estimatedArrival: '15 minutes',
              driverName: 'John Driver',
              driverLatitude: customerLocation?.latitude ? customerLocation.latitude - 0.01 : 40.712776,
              driverLongitude: customerLocation?.longitude ? customerLocation.longitude - 0.01 : -74.005974,
              customerLatitude: customerLocation?.latitude || 40.712776,
              customerLongitude: customerLocation?.longitude || -74.005974
            };
            setDelivery(mockDelivery);
            setError(null); // Clear error since we have mock data
            setLoading(false);
          });
    };

    // Initial fetch
    fetchDeliveryInfo();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchDeliveryInfo, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, [orderId, customerLocation]);

  const isValidCoords = (lat: number, lng: number): boolean =>
      Boolean(
          typeof lat === 'number' &&
          typeof lng === 'number' &&
          lat !== 0 &&
          lng !== 0
      );

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(2));
  };

  // Calculate route points between driver and customer
  const calculateRoutePoints = (): [number, number][] => {
    if (!delivery) return [];

    const { driverLatitude, driverLongitude, customerLatitude, customerLongitude } = delivery;

    // Return direct line between driver and customer
    return [
      [driverLatitude, driverLongitude],
      [customerLatitude, customerLongitude]
    ];
  };

  return (
      <div className="flex flex-col min-h-screen">
        <div className="w-full">
          <SubNav/>
        </div>
        <div className="w-full">
          <NavigationBar/>
        </div>

        <div className="flex-grow container mx-auto px-4 py-14 bg-gradient-to-r from-black via-black/80 to-black/60">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
            <div className="bg-gradient-to-r from-orange-500 to-orange-500 py-6 px-8">
              <h1 className="text-2xl font-bold text-white">Live Delivery Tracking</h1>
              {orderId && <p className="text-orange-50 mt-1">Order #{orderId}</p>}
            </div>

            {error && (
                <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                  <p className="mt-2 text-sm">
                    Please go back to the order tracking page and try again.
                  </p>
                </div>
            )}

            {loading && !error && (
                <div className="p-10 flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                </div>
            )}

            {!loading && !error && delivery && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Delivery Status */}
                    <div className="md:col-span-1 bg-orange-50 p-6 rounded-xl border border-orange-100">
                      <h2 className="text-xl font-semibold text-orange-800 mb-4">Delivery Status</h2>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-orange-600">Driver</p>
                            <p className="font-medium">{delivery.driverName}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-orange-600">Estimated Arrival</p>
                            <p className="font-medium">{delivery.estimatedArrival}</p>
                          </div>
                        </div>

                        {customerLocation && delivery && isValidCoords(delivery.driverLatitude, delivery.driverLongitude) && (
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm text-orange-600">Distance</p>
                                <p className="font-medium">
                                  {calculateDistance(
                                      delivery.driverLatitude,
                                      delivery.driverLongitude,
                                      delivery.customerLatitude,
                                      delivery.customerLongitude
                                  )} km away
                                </p>
                              </div>
                            </div>
                        )}

                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${delivery.isDelivered ? 'bg-green-500' : 'bg-orange-500'} text-white rounded-full flex items-center justify-center`}>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-orange-600">Status</p>
                            <p className="font-medium">{delivery.isDelivered ? 'Delivered' : 'In Progress'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-orange-200">
                        <h3 className="font-medium text-orange-800 mb-3">Order Progress</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              1
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-green-800">Order Confirmed</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              2
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-green-800">Preparing</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              3
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-green-800">Out for Delivery</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-8 h-8 ${delivery.isDelivered ? 'bg-green-500' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                              4
                            </div>
                            <div className="ml-3">
                              <p className={`font-medium ${delivery.isDelivered ? 'text-green-800' : 'text-gray-500'}`}>Delivered</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="md:col-span-2 bg-orange-50 rounded-xl border border-orange-100 overflow-hidden h-96">
                      {mapCenter && (
                          <MapContainer
                              center={mapCenter}
                              zoom={13}
                              style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Customer Marker */}
                            {delivery && isValidCoords(delivery.customerLatitude, delivery.customerLongitude) && (
                                <Marker
                                    position={[delivery.customerLatitude, delivery.customerLongitude]}
                                    icon={customerIcon}
                                >
                                  <Popup>
                                    Your Location
                                  </Popup>
                                </Marker>
                            )}

                            {/* Driver Marker */}
                            {delivery && isValidCoords(delivery.driverLatitude, delivery.driverLongitude) && (
                                <Marker
                                    position={[delivery.driverLatitude, delivery.driverLongitude]}
                                    icon={driverIcon}
                                >
                                  <Popup>
                                    {delivery.driverName} - Your Driver
                                  </Popup>
                                </Marker>
                            )}

                            {/* Route Line */}
                            {delivery && isValidCoords(delivery.driverLatitude, delivery.driverLongitude) &&
                                isValidCoords(delivery.customerLatitude, delivery.customerLongitude) && (
                                    <Polyline
                                        positions={calculateRoutePoints()}
                                        color="#f97316"
                                        weight={4}
                                        opacity={0.7}
                                        dashArray="10, 10"
                                    />
                                )}
                          </MapContainer>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                        className="text-orange-600 hover:text-orange-800 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-lg transition-colors hover:bg-orange-100 shadow-sm border border-orange-100"
                        onClick={() => window.history.back()}
                    >
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Order
                    </button>

                    <button
                        className="text-orange-600 hover:text-orange-800 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-lg transition-colors hover:bg-orange-100 shadow-sm border border-orange-100"
                        onClick={() => window.location.reload()}
                    >
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
  );
};

export default CustomerTrackingPage;