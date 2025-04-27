import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, OrderItem, OrderStatus } from '../../types/Order/order';
import { orderService } from '../../services/Orders/orderService';
import NavigationBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icon issue
// Removed unnecessary line as _getIconUrl is not a valid property
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component for location selection
const LocationMarker: React.FC<{
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected delivery location</Popup>
    </Marker>
  ) : null;
};

const OrderForm: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(orderId);
  
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [position, setPosition] = useState<[number, number] | null>(null);
  // Removed unused locationAddress state
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  const [order, setOrder] = useState<Order>({
    userId: 0,
    restaurantId: 0,
    status: OrderStatus.PLACED,
    deliveryAddress: '',
    longitude: null,
    latitude: null,
    contactPhone: '',
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    totalAmount: 0,
    orderItems: []
  });

  // Reference to the map component
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await orderService.getOrderById(parseInt(orderId!));
          setOrder(data);
          
          // Set position if latitude and longitude exist
          if (data.latitude && data.longitude) {
            setPosition([data.latitude, data.longitude]);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          alert('Failed to fetch order details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId, isEditMode]);

  useEffect(() => {
    // Get user's current location when component mounts
    if (navigator.geolocation && !isEditMode) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          
          // Set order's latitude and longitude
          setOrder(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          
          // Reverse geocode to get address
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default position (if user denies location access)
          setPosition([40.7128, -74.0060]);  // New York City coordinates
        }
      );
    }
    
    setMapLoaded(true);
  }, [isEditMode]);

  const reverseGeocode = async (lat: number, lng: number): Promise<void> => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Removed setLocationAddress as it is not defined
        setOrder(prev => ({
          ...prev,
          deliveryAddress: data.display_name
        }));
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setOrder(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    // Get address from coordinates
    await reverseGeocode(lat, lng);
  };

  const calculateTotals = () => {
    const subtotal = order.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const tax = subtotal * 0.1; 
    const deliveryFee = 5; 
    const totalAmount = subtotal + tax + deliveryFee;

    setOrder({
      ...order,
      subtotal,
      tax,
      deliveryFee,
      totalAmount
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [order.orderItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For new orders, keep status as PLACED
    if (!isEditMode && name === 'status') {
      return;
    }
    
    setOrder({
      ...order,
      [name]: name === 'userId' || name === 'restaurantId' ? parseInt(value) || 0 : value
    });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...order.orderItems];
    
    if (field === 'quantity' || field === 'unitPrice') {
      // Fix for NaN - use parseFloat and handle empty values
      const numValue = value === '' ? 0 : parseFloat(value);
      
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: isNaN(numValue) ? 0 : numValue
      };
      
      // Recalculate total price for this item
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? (isNaN(numValue) ? 0 : numValue) : updatedItems[index].quantity;
        const unitPrice = field === 'unitPrice' ? (isNaN(numValue) ? 0 : numValue) : updatedItems[index].unitPrice;
        updatedItems[index].totalPrice = quantity * unitPrice;
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'menuItemId' ? parseInt(value) || 0 : value
      };
    }
    
    setOrder({
      ...order,
      orderItems: updatedItems
    });
  };

  const addItem = () => {
    const newItem: OrderItem = {
      menuItemId: 0,
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    
    setOrder({
      ...order,
      orderItems: [...order.orderItems, newItem]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = order.orderItems.filter((_, i) => i !== index);
    setOrder({
      ...order,
      orderItems: updatedItems
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrder({
      ...order,
      deliveryAddress: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        // For existing orders, we keep the current status
        await orderService.updateOrder(parseInt(orderId!), order);
        alert('Order updated successfully');
      } else {
        // For new orders, we set the status to PLACED
        const newOrder = {
          ...order,
          status: OrderStatus.PLACED
        };
        await orderService.createOrder(newOrder);
        alert('Order created successfully');
      }
      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order');
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          
          // Set order's latitude and longitude
          setOrder(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          
          // Reverse geocode to get address
          reverseGeocode(latitude, longitude);
          
          // Center map on new position
          if (mapRef.current) {
            if (mapRef.current) {
              mapRef.current.flyTo([latitude, longitude], 15);
            }
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading order data...</div>;

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden">
      <div className="w-full">
         <SubNav/> 
      </div>
      <div className="w-full">
        <NavigationBar/>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Order' : 'Create New Order'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-200 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">User ID</label>
              <input
                type="number"
                name="userId"
                value={order.userId || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Restaurant ID</label>
              <input
                type="number"
                name="restaurantId"
                value={order.restaurantId || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              {isEditMode ? (
                <select
                  name="status"
                  value={order.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={OrderStatus.PLACED}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={order.contactPhone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Map and location section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Location</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                  >
                    Use My Current Location
                  </button>
                  
                  {/* Map container */}
                  <div className="border rounded shadow-md" style={{ height: '400px' }}>
                    {mapLoaded && (
                      <MapContainer
                        center={position || [40.7128, -74.0060]} // Default to NYC if no position
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        ref={mapRef}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker 
                          position={position}
                          setPosition={setPosition}
                          onLocationSelect={handleLocationSelect}
                        />
                      </MapContainer>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    Click on the map to select delivery location or use your current location
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    name="deliveryAddress"
                    value={order.deliveryAddress}
                    onChange={handleAddressChange}
                    required
                    rows={4}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      readOnly
                      value={order.latitude !== null ? order.latitude.toFixed(6) : ''}
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Longitude</label>
                    <input
                      type="text"
                      readOnly
                      value={order.longitude !== null ? order.longitude.toFixed(6) : ''}
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add Item
              </button>
            </div>

            {order.orderItems.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded">
                No items added yet. Click "Add Item" to add order items.
              </div>
            ) : (
              order.orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-4 p-4 bg-gray-50 rounded">
                  {/* Preserve the item ID for update operations */}
                  {item.id && (
                    <input 
                      type="hidden" 
                      name={`orderItems[${index}].id`} 
                      value={item.id} 
                    />
                  )}
                  <div className="col-span-3">
                    <label className="block text-gray-700 text-sm mb-1">Item Name</label>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm mb-1">Menu Item ID</label>
                    <input
                      type="number"
                      value={item.menuItemId || ''}
                      onChange={(e) => handleItemChange(index, 'menuItemId', e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm mb-1">Total Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.totalPrice || ''}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 h-10 w-10 flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-700">Subtotal:</div>
                <div className="text-right">${order.subtotal.toFixed(2)}</div>
                
                <div className="text-gray-700">Tax:</div>
                <div className="text-right">${order.tax.toFixed(2)}</div>
                
                <div className="text-gray-700">Delivery Fee:</div>
                <div className="text-right">${order.deliveryFee.toFixed(2)}</div>
                
                <div className="font-semibold">Total:</div>
                <div className="text-right font-semibold">${order.totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {isEditMode ? 'Update Order' : 'Create Order'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default OrderForm;