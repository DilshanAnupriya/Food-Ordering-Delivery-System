import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactUs from './pages/ContactUs/ContactUs';
import Home from './pages/Home';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider } from './services/auth/authContext';
import Restaurants from './pages/Restaurant/Restaurants';
import Restaurant from './pages/Restaurant/Restaurant';
import RestaurantCreate from './pages/Restaurant/RestaurantCreate';
import DriverDashboard from './pages/Delivery/DriverDashboard';
import DriverDeliveryPageWrapper from './pages/Delivery/DriverDeliveryPageWrapper';
import CustomerTrackingPage from './pages/Delivery/CustomerTraking';  
import AdminDashboard from './pages/AdminDashboard.tsx'; 
import CartPage from "./pages/Restaurant/Cart.tsx";
import OrderList from "./pages/orders/OrderList.tsx";
import OrderForm from "./pages/orders/OrderForm.tsx";
import OrderDetail from "./pages/orders/OrderDetail.tsx";
import OrderTracking from "./pages/orders/OrderTracking.tsx";
import Checkout from './pages/Payment/Checkout.tsx';
import RestaurantAdminDashboard from "./pages/Restaurant/Admin/RestaurantAdminDashboard.tsx";
import UpdateRestaurantPage from "./pages/Restaurant/Admin/RestaurantUpdate.tsx";
import RestuarantAdminFoodItem from "./pages/Restaurant/Admin/RestuarantAdminFoodItem.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/" element={<Home />} />
                
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/restaurant/:id" element={<Restaurant />} />
                    <Route path="/restaurant/create" element={<RestaurantCreate />} />

                    <Route path="/driver-delivery" element={<DriverDeliveryPageWrapper />} />
                    <Route path="/driver-dashboard" element={<DriverDashboard />} />
                    <Route path="/customer-tracking" element={<CustomerTrackingPage />} />
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/cart/:id" element={<CartPage />} />
                    <Route path='/admin-restaurant' element={<RestaurantAdminDashboard/>}/>
                    <Route path='/update/:id' element={<UpdateRestaurantPage/>} />
                    <Route path='/admin-fooditems' element={<RestuarantAdminFoodItem/>} />

                    <Route path='/checkout' element={<Checkout />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/new" element={<OrderForm />} />
                    <Route path="/orders/:orderId" element={<OrderDetail />} />
                    <Route path="/orders/:orderId/edit" element={<OrderForm />} />
                    <Route path="/track" element={<OrderTracking />} />
                    
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
