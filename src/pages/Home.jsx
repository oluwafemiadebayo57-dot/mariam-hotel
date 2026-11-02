import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Hero from '../components/home/Hero';
import RoomCard from '../components/rooms/RoomCard';
// Added Waves icon
import { MapPin, Phone, Mail, ShieldCheck, Clock, Waves } from 'lucide-react';

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      const q = query(collection(db, "promos"), orderBy("createdAt", "desc"), limit(3));
      const snapshot = await getDocs(q);
      setPromos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchRooms = async () => {
      const snapshot = await getDocs(collection(db, "rooms"));
      const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const order = { standard: 1, deluxe: 2, vip: 3 };
      roomsData.sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));
      setFeaturedRooms(roomsData.slice(0, 3));
    };

    fetchPromos();
    fetchRooms();
  }, []);

  return (
    <div className="bg-luxury-black min-h-screen">
      <Hero />
      
      {/* WELCOME / ABOUT SECTION */}
      <section className="py-24 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-luxury-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4">Welcome to Mariam</h2>
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-6 max-w-3xl mx-auto leading-tight">
            Where exceptional comfort meets the heart of Akure.
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Whether you're traveling for business or unwinding for the weekend, Mariam Hotel & Bar offers an oasis of luxury. Enjoy our premium amenities, secure environment, and unmatched hospitality.
          </p>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-luxury-gold text-sm font-semibold tracking-[0.2em] uppercase mb-2">Our Accommodations</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-white">Featured Rooms</h3>
            </div>
            <Link to="/rooms" className="text-royal hover:text-luxury-gold transition-colors font-medium mt-4 md:mt-0 flex items-center gap-2">
              View All Rooms &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-royal-dark/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-luxury-gold text-sm font-semibold tracking-[0.2em] uppercase mb-2">The Mariam Standard</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-white">Why Guests Love Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-luxury-charcoal p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-luxury-gold" />
              </div>
              <h4 className="text-xl text-white font-serif mb-3">Unbeatable Security</h4>
              <p className="text-gray-400 text-sm">24/7 security personnel, CCTV surveillance, and secure parking so you can rest easy.</p>
            </div>
            
            <div className="bg-luxury-charcoal p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-royal text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">BEST RATES</div>
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-luxury-gold" />
              </div>
              <h4 className="text-xl text-white font-serif mb-3">24/7 Power & Service</h4>
              <p className="text-gray-400 text-sm">Uninterrupted power supply and round-the-clock room service for a seamless stay.</p>
            </div>

            {/* UPDATED CARD FOR SWIMMING POOL */}
            <div className="bg-luxury-charcoal p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Waves size={32} className="text-luxury-gold" />
              </div>
              <h4 className="text-xl text-white font-serif mb-3">Relax & Unwind</h4>
              <p className="text-gray-400 text-sm">Take a refreshing dip in our pristine swimming pool or enjoy a cocktail at the bar & lounge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      {promos.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-luxury-gold mb-2">Latest Happenings</h2>
              <p className="text-gray-400">Don't miss out on our exclusive events and offers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promos.map(promo => (
                <div key={promo.id} className="bg-luxury-charcoal rounded-2xl overflow-hidden border border-white/10 group">
                  <div className="h-64 overflow-hidden">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white font-serif mb-2">{promo.title}</h3>
                    <p className="text-gray-400 text-sm">{promo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATION & CONTACT */}
      <section id="location" className="py-24 bg-luxury-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-luxury-gold text-sm font-semibold tracking-[0.2em] uppercase mb-2">Find Us</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">Perfectly Located in Akure</h3>
              <p className="text-gray-400 mb-8">
                We are situated in a serene, secure neighborhood, just minutes away from the city center. Easy to find, hard to leave.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Address</h4>
                    <p className="text-gray-400 text-sm">No 14, Lafe Street, Beside Lafe-in hotel,<br/>Akure, Ondo State, Nigeria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Reservations</h4>
                    <p className="text-gray-400 text-sm">+234 800 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-400 text-sm">hello@mariamhotel.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] bg-luxury-black rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-royal/5 group-hover:bg-royal/10 transition-colors"></div>
              <div className="text-center relative z-10 p-6">
                <MapPin size={48} className="text-luxury-gold mx-auto mb-4 opacity-50" />
                <p className="text-white font-serif text-xl mb-2">Google Maps Integration</p>
                <p className="text-gray-500 text-sm">Embed your map here for easy directions.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}