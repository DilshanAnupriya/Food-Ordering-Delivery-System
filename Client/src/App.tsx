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
import CartPage from "./pages/Restaurant/Cart.tsx";
import OrderList from "./pages/orders/OrderList.tsx";
import OrderForm from "./pages/orders/OrderForm.tsx";
import OrderDetail from "./pages/orders/OrderDetail.tsx";
import OrderTracking from "./pages/orders/OrderTracking.tsx";



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
                    <Route path="/cart/:id" element={<CartPage/>}/> {/* Changed from /cart/:id to /cart */}
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