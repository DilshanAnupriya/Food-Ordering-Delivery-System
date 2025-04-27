import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ import Routes!
import Home from './pages/Home';
import Restaurants from './pages/Restaurant/Restaurants';
import Restaurant from "./pages/Restaurant/Restaurant.tsx";
import RestaurantCreate from "./pages/Restaurant/RestaurantCreate.tsx";

function App() {
    return (
        <Router>
            <Routes> {/* ✅ wrap routes here */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/restaurant/create" element={<RestaurantCreate />} />
            </Routes>
        </Router>
    );
}

export default App;