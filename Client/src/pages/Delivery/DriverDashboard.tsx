import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

interface Order {
  id: string;
  status: string;
  destination: string;
}

const DriverDashboard: React.FC = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  const driverId = 'driver23'; 
  const driverName = 'John Doe';

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
        const res = await fetch(`http://localhost:8082/api/v1/deliveries?driverId=${driverId}&status=completed`);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchCompletedDeliveries();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {/* Enhanced Profile Icon */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-gray-100 shadow-md">
              {/* Using a profile icon for when no image is available */}
              <div className="absolute inset-0 flex items-center justify-center bg-yellow-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Actual profile image that will overlay the icon if loaded */}
              <img 
                src="/driver.jpg" 
                alt={driverName} 
                className="h-full w-full object-cover absolute inset-0" 
                onError={(e) => {
                  // This hides the broken image icon if the image fails to load
                  e.currentTarget.style.display = 'none';
                }} 
              />
            </div>
            {/* Online status indicator */}
            <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></div>
          </div>
          <div className="ml-4 flex flex-col items-start space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {driverName}
            </h1>
            <p className="text-sm text-gray-600">
              Driver ID: <strong>{driverId}</strong>
            </p>
            <div 
              className={`px-2 py-0.5 text-xs rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} cursor-pointer`}
              onClick={toggleOnlineStatus}
            >
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center"
            onClick={() => handleNavigate('/driver/home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>
          <button
            className="bg-white text-yellow-500 border border-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-50 transition-colors flex items-center"
            onClick={() => handleNavigate('/driver/profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Profile
          </button>
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors flex items-center"
            onClick={() => handleNavigate('/pages/Delivery/DeliveryHomePage')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1H4V5h7v5h2V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v5h-1V8h-4V7z" />
            </svg>
            Deliveries
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="bg-gray-900 p-5 rounded-lg mb-6 shadow-md text-white"
      >
        <h2 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
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

      {/* Deliveries Summary */}
      <div
        className="bg-gray-900 p-5 rounded-lg shadow-md text-white"
      >
        <h2 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1H4V5h7v5h2V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v5h-1V8h-4V7z" />
          </svg>
          Completed Deliveries
        </h2>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4">No completed deliveries yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white text-gray-800 rounded-lg border-2 border-yellow-400 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="font-bold">Order ID: {order.id}</p>
                </div>
                <p className="text-lg ml-7">{order.destination}</p>
                <p className="text-green-500 font-semibold ml-7">
                  {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;