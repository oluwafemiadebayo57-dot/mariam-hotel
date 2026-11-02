import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative bg-luxury-black overflow-hidden py-16 lg:py-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-royal/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 backdrop-blur-sm">
              <span className="text-luxury-gold text-sm font-semibold tracking-widest uppercase">
                Now Open • Akure
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-luxury-gold-soft">Luxury</span> <br className="hidden sm:block" /> in Akure.
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
              Welcome to Mariam Hotel & Bar. Book directly with us to get the best rates, enjoy premium amenities, and experience unmatched hospitality.
            </p>

            <div className="mb-10 bg-luxury-charcoal/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <h3 className="text-luxury-gold text-sm uppercase tracking-widest font-semibold mb-4 text-center lg:text-left">
                Premium Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> Swimming Pool</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> 24/7 Power Supply</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> Exclusive Bar & Lounge</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> Secure Parking</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> Free High-Speed Wi-Fi</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-royal"></span> Fully Air-Conditioned</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/booking" className="bg-luxury-gold hover:bg-luxury-gold-soft text-black px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-1 text-center">
                Book Your Room
              </Link>
              <a href="#location" className="border border-white/20 hover:border-luxury-gold text-white px-8 py-4 rounded-full font-semibold transition-all text-center flex items-center justify-center gap-2">
                Get Directions
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-royal to-luxury-gold rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
            
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-luxury-charcoal aspect-[4/5] lg:aspect-auto lg:h-[600px]">
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