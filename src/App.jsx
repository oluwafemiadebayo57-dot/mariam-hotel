import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRooms from './pages/AdminRooms';
import AdminPromos from './pages/AdminPromos'; // Added
import AdminSettings from './pages/AdminSettings';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-luxury-black text-white">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/promos" element={<AdminPromos />} /> 
              <Route path="/admin/settings" element={<AdminSettings />} />
{/* Added */}
            </Routes>
          </main>

          <Footer />
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;