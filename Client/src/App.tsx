import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContactUs from './pages/ContactUs/ContactUs';

import Home from './pages/Home';
import Checkout from './pages/Payment/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/" element={<Home/>} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
               
            </Routes>
           
        </Router>
    );
}

export default App;