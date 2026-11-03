import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = "https://res.cloudinary.com/izxlyyn5/image/upload/v1793678002/photo_6003547764035358116_y.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-luxury-black/90 backdrop-blur-md border-b border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="Mariam Hotel & Bar Logo" 
              className="h-12 w-auto object-contain rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-widest text-luxury-gold uppercase leading-none">Mariam</span>
              <span className="text-[9px] tracking-[0.3em] text-white/70 uppercase">Hotel & Bar</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-300 hover:text-luxury-gold transition-colors text-sm font-medium uppercase tracking-wider">Home</Link>
            <Link to="/rooms" className="text-gray-300 hover:text-luxury-gold transition-colors text-sm font-medium uppercase tracking-wider">Rooms</Link>
            <Link to="/booking" className="bg-royal hover:bg-royal-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(10,61,145,0.5)]">Book Now</Link>
            <Link to="/admin" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest border border-gray-800 px-3 py-1.5 rounded-md">Admin</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-luxury-gold focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-luxury-charcoal border-t border-luxury-gold/20">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-white hover:text-luxury-gold">Home</Link>
            <Link to="/rooms" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-white hover:text-luxury-gold">Rooms</Link>
            <Link to="/booking" onClick={() => setIsOpen(false)} className="block px-3 py-3 mt-2 w-full text-center bg-royal text-white rounded-md font-semibold">Book Now</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-sm text-gray-400 hover:text-white mt-4">Admin Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}