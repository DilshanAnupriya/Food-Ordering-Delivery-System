import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/layout/Navbar';
import ContactUs from './pages/ContactUs/ContactUs';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Checkout from './pages/Payment/Checkout';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/" element={<Home/>} />
                <Route path="/checkout" Component={Checkout} />
            </Routes>
            <Footer />
        </Router>
      
    );
}

export default App;