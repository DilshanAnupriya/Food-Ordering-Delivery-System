import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import CompletedDeliveryCard from './CompletedDeliveryCard';
import Footer from "../../components/layout/Footer";
import NavigationBar from "../../components/layout/Navbar";
// import SubNav from "../../components/layout/SubNav";

interface Order {
  id: string;
  orderId?: string;
  status: string;
  destination: string;
  deliveryDate?: string;
}

const DriverDashboard: React.FC = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
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
        const processedOrders = data.map((order: any) => ({
          ...order,
          // If your API returns dates, use those. Otherwise, we're adding mock dates for demonstration
          deliveryDate: order.deliveryDate || order.completedAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setOrders(processedOrders);
        setFilteredOrders(processedOrders);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchCompletedDeliveries();
  }, []);

  // Filter orders whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => {
        const displayId = order.orderId || order.id;
        return displayId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // First letter of the driver name for the profile icon
  const profileInitial = "J";

  return (
    
    <div>
      {/* <div className="w-full">
          <SubNav />
       </div> */}
       <div className="w-full">
          <NavigationBar />
       </div>
      
    <div className="max-w-7xl mx-auto px-4 py-8" >
      {/* Header */}
      <div className="flex justify-between  h-20 w- bg-black items-center mb-7">
        
        <div className="flex items-center">
          {/* Attractive Profile Icon */}
          <div className="relative ml-4" >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-2xl font-bold text-white">{profileInitial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div className="ml-4 flex flex-col  b items-start space-y-1">
            <h1 className="text-2xl font-bold text-white">
              John Doe
            </h1>
            <p className="text-sm text-white">
              Driver ID: <strong>{driverId}</strong>
            </p>
          </div>
        </div>

        <div className="flex space-x-4 bg">
          
          <button
            className="bg-orange-500 text-white border border-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors"
            onClick={() => handleNavigate('/driver/profile')}
          >
            Profile
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-yellow-400 hover:text-black transition-colors"
            onClick={() => handleNavigate('/pages/Delivery/DeliveryHomePage')}
          >
            Deliveries
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="bg-orange-50 p-5 rounded-lg mb-6 shadow-md text-white"
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
      <div className="bg-orange-50 p-5 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-orange-500">
            Completed Deliveries
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar - Now on the right side */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              {filteredOrders.length} of {orders.length} total
            </span>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <div className="inline-flex rounded-full bg-gray-200 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">
              {searchTerm ? "No deliveries match your search." : "No completed deliveries yet."}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
              {filteredOrders.map((order) => (
                <CompletedDeliveryCard 
                  key={order.id} 
                  order={order} 
                />
              ))}
            </div>
            
            {/* Optional shadow indicators for scroll */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>
   
   
    </div>
      <Footer />
      </div>
     
  );
};

export default DriverDashboard;