import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = "https://res.cloudinary.com/izxlyyn5/image/upload/v1793678002/photo_6003547764035358116_y.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24"> {/* Increased height to fit larger logo */}
          
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="Mariam Hotel & Bar Logo" 
              className="h-16 w-16 object-cover rounded-full shadow-sm border border-gray-100" 
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-serif tracking-widest text-brand-blue uppercase leading-none">Mariam</span>
              <span className="text-[10px] tracking-[0.3em] text-brand-text-muted uppercase mt-1">Hotel & Bar</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-brand-text-muted hover:text-brand-blue transition-colors text-sm font-semibold uppercase tracking-wider">Home</Link>
            <Link to="/rooms" className="text-brand-text-muted hover:text-brand-blue transition-colors text-sm font-semibold uppercase tracking-wider">Rooms</Link>
            <Link to="/booking" className="bg-brand-blue hover:bg-brand-blue-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Book Now</Link>
            <Link to="/admin" className="text-xs text-gray-400 hover:text-brand-blue transition-colors uppercase tracking-widest border border-gray-300 px-3 py-1.5 rounded-md">Admin</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-blue focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-white border-t border-gray-200 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 text-base font-medium text-brand-text hover:text-brand-blue">Home</Link>
            <Link to="/rooms" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 text-base font-medium text-brand-text hover:text-brand-blue">Rooms</Link>
            <Link to="/booking" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 mt-2 bg-brand-blue text-white rounded-full font-semibold">Book Now</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 text-sm text-gray-400 mt-2">Admin Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}