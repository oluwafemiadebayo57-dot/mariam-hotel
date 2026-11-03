const LOGO_URL = "https://res.cloudinary.com/izxlyyn5/image/upload/v1793678002/photo_6003547764035358116_y.jpg";

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal border-t border-luxury-gold/20 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          {/* Logo in Footer */}
          <img 
            src={LOGO_URL} 
            alt="Mariam Hotel & Bar Logo" 
            className="h-16 w-auto object-contain mb-4 rounded-full" 
          />
          <h2 className="text-2xl font-serif text-luxury-gold tracking-widest uppercase mb-2">Mariam Hotel & Bar</h2>
          <p className="text-gray-400 text-sm">No 14, Lafe Street, Beside Lafe-in Hotel, Akure, Ondo State.</p>
        </div>

        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-luxury-gold transition-colors">Instagram</a>
          <a href="#" className="hover:text-luxury-gold transition-colors">Facebook</a>
          <a href="#" className="hover:text-luxury-gold transition-colors">WhatsApp</a>
        </div>
        
      </div>
      <div className="mt-8 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Mariam Hotel & Bar. All rights reserved.
      </div>
    </footer>
  );
}