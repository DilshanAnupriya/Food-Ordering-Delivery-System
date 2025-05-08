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

interface CustomerTrackingPageProps {
  orderId?: string;
}

const CustomerTrackingPage: React.FC<CustomerTrackingPageProps> = ({ orderId = '18' }) => {
  const [customerLocation, setCustomerLocation] = useState<Location | null>(null);
  const [delivery, setDelivery] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

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
          setError('Unable to load delivery tracking information. Please try again later.');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Error</h3>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden">
      <div className="w-full">
          <SubNav />
       </div>
       <div className="w-full">
          <NavigationBar />
       </div>
      {/* Top navigation bar */}
      <nav className="max-w-7xl bg-black mx-auto px-4 py-1">
      <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"></div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active 
                </div>
                <span className="text-gray-600">|</span>
                <div className="text-white">Order ID: <span className="font-medium">{orderId}</span></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-orange-50 rounded-xl shadow-md overflow-hidden">
          {/* Header with gradient background */}
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <h1 className="text-2xl font-bold text-white">
              Track Your Delivery
            </h1>
            <p className="text-blue-100 mt-1">
              Real-time updates on your order
            </p>
          </div>

          {/* Loading state */}
          {loading && !delivery ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-500">Loading delivery information...</p>
              </div>
            </div>
          ) : delivery ? (
            <div className="p-6">
              {/* Delivery Status Card */}
              <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Delivery Status</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-1 mr-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-700 mr-2">Driver:</span>
                        <span className="text-gray-900"> Jehan Kulathunga</span>
                      </div>
                     
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-1 mr-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-700 mr-2">Status:</span>
                        {delivery.isDelivered ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Delivered
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            On the way
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {delivery.isDelivered && (
                    <div className="mt-6 md:mt-0 px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Your order has been delivered!
                    </div>
                  )}
                </div>
              </div>

              {/* Map container */}
              {mapCenter && (
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 mb-6">
                  <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium text-gray-700">Live Tracking</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                        <span>Driver</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        <span>You</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-96 w-full">
                    <MapContainer
                      center={mapCenter}
                      zoom={13}
                      scrollWheelZoom={true}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      
                      {/* Customer marker with green icon */}
                      {isValidCoords(delivery.customerLatitude, delivery.customerLongitude) && (
                        <Marker 
                          position={[delivery.customerLatitude, delivery.customerLongitude]}
                          icon={customerIcon}
                        >
                          <Popup>Your Location</Popup>
                        </Marker>
                      )}
                      
                      {/* Driver marker with blue icon */}
                      {isValidCoords(delivery.driverLatitude, delivery.driverLongitude) && (
                        <Marker 
                          position={[delivery.driverLatitude, delivery.driverLongitude]}
                          icon={driverIcon}
                        >
                          <Popup>Driver:  Jehan Kulathunga</Popup>
                        </Marker>
                      )}

                      {/* Polyline between driver and customer */}
                      {isValidCoords(delivery.driverLatitude, delivery.driverLongitude) && 
                       isValidCoords(delivery.customerLatitude, delivery.customerLongitude) && (
                        <Polyline 
                          positions={[
                            [delivery.driverLatitude, delivery.driverLongitude],
                            [delivery.customerLatitude, delivery.customerLongitude]
                          ]}
                          color="#3B82F6"
                          weight={4}
                          opacity={0.7}
                          
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>
              )}
              
              {/* Delivery info card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <div className="flex items-start">
                <div className="bg-orange-100 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Delivery Information</h3>
                    <p className="text-orange-700">
                      Your delivery is being tracked in real-time. The map shows both your location and your driver's current location, connected by a route line. The page will automatically refresh every few seconds to update the driver's position.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Delivery</h3>
              <p className="text-gray-600 text-center">We couldn't find any active delivery for this order ID.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerTrackingPage;