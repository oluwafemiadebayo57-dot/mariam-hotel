const LOGO_URL = "https://res.cloudinary.com/izxlyyn5/image/upload/v1793678002/photo_6003547764035358116_y.jpg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-brand-blue-hover via-brand-blue to-brand-blue-hover text-white pt-10 pb-6 md:py-16 mt-auto relative overflow-hidden">
      
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start max-w-sm">
            <div className="bg-white p-1 rounded-full shadow-lg mb-4">
              <img 
                src={LOGO_URL} 
                alt="Mariam Hotel & Bar Logo" 
                className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-full" 
              />
            </div>
            
            <h2 className="text-xl md:text-2xl font-serif text-white tracking-widest uppercase mb-2 md:mb-3 text-center md:text-left">
              Mariam Hotel & Bar
            </h2>
            <p className="text-blue-200 text-xs md:text-sm leading-relaxed text-center md:text-left">
              14 Lafe Road, beside Lafe Inn Road,<br/> Akure 340271, Ondo State, Nigeria.
            </p>
          </div>

          {/* Links Columns - Side by side on mobile using grid */}
          <div className="grid grid-cols-2 gap-8 md:flex md:flex-row md:gap-24 w-full md:w-auto text-center md:text-left mt-2 md:mt-0">
            
            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-[0.15em] text-[10px] md:text-xs">Contact Us</h3>
              <div className="flex flex-col gap-2 text-xs md:text-sm text-blue-200">
                <a href="mailto:hello@mariamhotel.com" className="hover:text-white transition-colors break-all">hello@mariamhotel.com</a>
                <a href="tel:+2347083093585" className="hover:text-white transition-colors font-medium">0708 309 3585</a>
                <a href="tel:+2348033643328" className="hover:text-white transition-colors font-medium">0803 364 3328</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-[0.15em] text-[10px] md:text-xs">Follow Us</h3>
              <div className="flex flex-col gap-2 text-xs md:text-sm text-blue-200">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="https://wa.me/2347083093585" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </div>
            </div>

          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-10 md:mt-16 pt-6 border-t border-white/10 text-center text-[10px] md:text-xs text-blue-300/60">
          &copy; {new Date().getFullYear()} Mariam Hotel & Bar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}