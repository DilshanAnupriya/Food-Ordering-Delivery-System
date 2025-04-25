import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, OrderItem, OrderStatus } from '../../types/Order/order';
import { orderService } from '../../services/Orders/orderService';
import NavigationBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';

const OrderForm: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(orderId);
  
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [order, setOrder] = useState<Order>({
    userId: 0,
    restaurantId: 0,
    status: OrderStatus.PLACED,
    deliveryAddress: '',
    contactPhone: '',
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    totalAmount: 0,
    orderItems: []
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await orderService.getOrderById(parseInt(orderId!));
          setOrder(data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  if (loading) return <div className="text-center mt-10">Loading order data...</div>;

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden">
      <div className="w-full">
         <SubNav/> 
      </div>
      <div className="w-full">
        < NavigationBar/>
      </div>
    <div className="container mx-auto px-30 py-8">
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
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Delivery Address</label>
            <input
              type="text"
              name="deliveryAddress"
              value={order.deliveryAddress}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
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