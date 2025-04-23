import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import CompletedDeliveryCard from './CompletedDeliveryCard';

interface Order {
  id: string;
  status: string;
  destination: string;
  deliveryDate?: string;
}

const DriverDashboard: React.FC = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const driverId = 'driver132'; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
      }
    );

    const fetchCompletedDeliveries = async () => {
      try {
        const res = await fetch(`http://localhost:8082/api/v1/delivery/completed-deliveries/${driverId}`);
        const data = await res.json();
        
        // Process the data to ensure delivery dates are available
        // In a real scenario, this would come from your API
        const processedOrders = data.map((order: any) => ({
          ...order,
          // If your API returns dates, use those. Otherwise, we're adding mock dates for demonstration
          deliveryDate: order.deliveryDate || order.completedAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setOrders(processedOrders);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchCompletedDeliveries();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // First letter of the driver name for the profile icon
  const profileInitial = "J";

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {/* Attractive Profile Icon */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-2xl font-bold text-white">{profileInitial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div className="ml-4 flex flex-col items-start space-y-1">
            <h1 className="text-2xl font-bold text-white">
              John Doe
            </h1>
            <p className="text-sm text-white">
              Driver ID: <strong>{driverId}</strong>
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors"
            onClick={() => handleNavigate('/driver/home')}
          >
            Home
          </button>
          <button
            className="bg-orange-500 text-white border border-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors"
            onClick={() => handleNavigate('/driver/profile')}
          >
            Profile
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors"
            onClick={() => handleNavigate('/pages/Delivery/DeliveryHomePage')}
          >
            Deliveries
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="bg-white p-5 rounded-lg mb-6 shadow-md text-white"
      >
        <h2 className="text-lg font-semibold mb-4 text-orange-500">
          Current Location
        </h2>
        {location ? (
          <div className="h-64 rounded-lg overflow-hidden">
            <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '10px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={location}>
                <Popup>Current Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        )}
      </div>
      
      {/* Deliveries Summary - Horizontal Scrollable */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-orange-500">
            Completed Deliveries
          </h2>
          <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            {orders.length} total
          </span>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <div className="inline-flex rounded-full bg-gray-200 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">No completed deliveries yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
              {orders.map((order) => (
                <CompletedDeliveryCard key={order.id} order={order} />
              ))}
            </div>
            
            {/* Optional shadow indicators for scroll */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;