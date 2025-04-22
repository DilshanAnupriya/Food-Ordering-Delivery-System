import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/layout/Navbar';
import ContactUs from './pages/ContactUs/ContactUs';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Checkout from './pages/Payment/Checkout';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import OrderForm from './pages/orders/OrderForm';
import OrderTracking from './pages/orders/OrderTracking';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/" element={<Home/>} />
                <Route path="/checkout" Component={Checkout} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/orders/:orderId/edit" element={<OrderForm />} />
                <Route path="/track" element={<OrderTracking />} />
            </Routes>
            <Footer />
        </Router>
      
    );
}

export default App;