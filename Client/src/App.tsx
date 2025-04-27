import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactUs from './pages/ContactUs/ContactUs';
import Home from './pages/Home';
import Checkout from './pages/Payment/Checkout';
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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/checkout" element={<Checkout />} />
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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
