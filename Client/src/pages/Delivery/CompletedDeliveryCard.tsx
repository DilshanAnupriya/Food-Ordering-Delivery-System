import React from 'react';

interface Order {
  id: string;
  orderId?: string; // Adding an optional orderId field from database
  status: string;
  destination: string;
  deliveryDate?: string;
}

interface CompletedDeliveryCardProps {
  order: Order;
  onDelete: (orderId: string) => void;
}

const CompletedDeliveryCard: React.FC<CompletedDeliveryCardProps> = ({ order, onDelete }) => {
  // Format date nicely or use placeholder if missing
  const formattedDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date not available';

  // Use orderId from database if available, otherwise fallback to id
  const displayOrderId = order.orderId || order.id;

  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete order ${displayOrderId}?`)) {
      onDelete(order.id);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-md overflow-hidden flex-shrink-0 w-64 transform hover:scale-105 transition-transform duration-300">
      <div className="bg-yellow-500 h-2 w-full"></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
            {order.status}
          </span>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete delivery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="font-bold text-gray-800 mb-2 truncate">{displayOrderId}</p>
        
        {/* Delivery Date Section */}
        <div className="flex items-center mb-2 border-b border-gray-200 pb-2">
          <div className="flex-shrink-0 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <span className="text-xs text-gray-500">Delivered on</span>
            <p className="text-xs font-medium text-gray-800">{formattedDate}</p>
          </div>
        </div>
        
        {/* Add destination information */}
        {order.destination && (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <span className="text-xs text-gray-500">Destination</span>
              <p className="text-xs font-medium text-gray-800 truncate">{order.destination}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveryCard;