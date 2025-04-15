import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          {/* Your routes will go here */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;