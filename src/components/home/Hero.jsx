import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative bg-brand-white overflow-hidden py-16 lg:py-24">
      {/* Subtle Blue Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue-light blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue-light">
              <span className="text-brand-blue text-sm font-bold tracking-widest uppercase">
                Now Open • Akure
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-text leading-tight mb-6">
              Experience <span className="text-brand-blue">True Comfort</span> <br className="hidden sm:block" /> in Akure.
            </h1>
            
            <p className="text-brand-text-muted text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
              Welcome to Mariam Hotel & Bar. Book directly with us to get the best rates, enjoy premium amenities, and experience unmatched hospitality.
            </p>

            <div className="mb-10 bg-brand-offwhite p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-brand-blue text-sm uppercase tracking-widest font-bold mb-4 text-center lg:text-left">
                Premium Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-brand-text font-medium">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Swimming Pool</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> 24/7 Power</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Bar & Lounge</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Secure Parking</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> High-Speed Wi-Fi</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Air-Conditioned</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/booking" className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                Book Your Room
              </Link>
              <a href="#location" className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-4 rounded-full font-bold transition-all text-center flex items-center justify-center gap-2">
                Get Directions
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              <img 
                src="https://res.cloudinary.com/izxlyyn5/image/upload/v1793591570/photo_5999117672773259392_x.jpg" 
                alt="Mariam Hotel Exterior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}