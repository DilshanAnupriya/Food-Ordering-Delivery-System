import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ import Routes!
import Home from './pages/Home';
import Restaurants from './pages/Restaurant/Restaurants';
import Restaurant from "./pages/Restaurant/Restaurant.tsx";
import RestaurantCreate from "./pages/Restaurant/RestaurantCreate.tsx";
import OrderDetail from './pages/orders/OrderDetail';
import OrderForm from './pages/orders/OrderForm';
import OrderTracking from './pages/orders/OrderTracking';
import OrderList from './pages/orders/OrderList';

function App() {
    return (
        <Router>
            <Routes> {/* ✅ wrap routes here */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/restaurant/create" element={<RestaurantCreate />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/orders/:orderId/edit" element={<OrderForm />} />
                <Route path="/track" element={<OrderTracking />} />

            </Routes>
        </Router>
    );
}

export default App;
