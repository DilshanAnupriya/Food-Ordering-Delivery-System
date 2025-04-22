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
  const navigate = useNavigate();

  const driverId = 'driver12'; 

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

      {/* Deliveries Summary */}
      <div
        className="bg-white p-5 rounded-lg shadow-md text-white"
      >
        <h2 className="text-lg font-semibold mb-4 text-orange-500">
          Completed Deliveries
        </h2>
        {orders.length === 0 ? (
          <p>No completed deliveries yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white text-gray-800 rounded-lg border-2 border-yellow-400 shadow-md"
              >
                <p className="font-bold">Order ID: {order.id}</p>
                <p className="text-lg">{order.destination}</p>
                <p className="text-green-500 font-semibold">
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