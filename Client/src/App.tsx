// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/layout/Navbar';
import ContactUs from './pages/ContactUs/ContactUs';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import DriverDashboard from './pages/Delivery/DriverDashboard';
import DriverDeliveryPageWrapper from './pages/Delivery/DriverDeliveryPageWrapper';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/" element={<Home />} />
        <Route path="/driver-delivery/:driverId" element={<DriverDeliveryPageWrapper />} />
        <Route path="/driver-delivery" element={<DriverDeliveryPageWrapper />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;