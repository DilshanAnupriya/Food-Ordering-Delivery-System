import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContactUs from './pages/ContactUs/ContactUs';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

function App() {
    return (
        <Router>

            <Routes>
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/" element={<Home/>} />
            </Routes>
            <Footer />
        </Router>
      
    );
}

export default App;