import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Hero from '../components/home/Hero';
import RoomCard from '../components/rooms/RoomCard';
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
    <div className="bg-brand-offwhite min-h-screen">
      <Hero />
      
      {/* 1. WELCOME / ABOUT SECTION (Split Layout) */}
      <section className="py-16 md:py-24 bg-brand-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="md:w-1/2">
            <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Welcome to Mariam</span>
            <h3 className="text-3xl md:text-5xl font-serif text-brand-text leading-tight">
              Where exceptional comfort meets the heart of Akure.
            </h3>
          </div>
          <div className="md:w-1/2">
            <p className="text-brand-text-muted text-lg leading-relaxed">
              Whether you're traveling for business or unwinding for the weekend, Mariam Hotel & Bar offers an oasis of luxury. Enjoy our premium amenities, secure environment, and unmatched hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ROOMS (Editorial Header) */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 border-b border-gray-200 pb-6 gap-4">
            <div>
              <h2 className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase mb-2">Our Accommodations</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-brand-text">Featured Rooms</h3>
            </div>
            <Link to="/rooms" className="text-brand-blue hover:text-brand-blue-hover transition-colors font-bold flex items-center gap-2">
              View All Rooms &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-brand-blue-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase mb-2">The Mariam Standard</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-brand-text">Why Guests Love Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-brand-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-brand-blue" />
              </div>
              <h4 className="text-xl text-brand-text font-serif mb-3">Unbeatable Security</h4>
              <p className="text-brand-text-muted text-sm">24/7 security personnel, CCTV surveillance, and secure parking so you can rest easy.</p>
            </div>
            
            <div className="bg-brand-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">BEST RATES</div>
              <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-brand-blue" />
              </div>
              <h4 className="text-xl text-brand-text font-serif mb-3">24/7 Power & Service</h4>
              <p className="text-brand-text-muted text-sm">Uninterrupted power supply and round-the-clock room service for a seamless stay.</p>
            </div>

            <div className="bg-brand-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Waves size={32} className="text-brand-blue" />
              </div>
              <h4 className="text-xl text-brand-text font-serif mb-3">Relax & Unwind</h4>
              <p className="text-brand-text-muted text-sm">Take a refreshing dip in our pristine swimming pool or enjoy a cocktail at the bar & lounge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROMOS */}
      {promos.length > 0 && (
        <section className="py-16 md:py-24 bg-brand-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-serif text-brand-blue mb-2">Latest Happenings</h3>
              <p className="text-brand-text-muted">Don't miss out on our exclusive events and offers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {promos.map(promo => (
                <div key={promo.id} className="bg-brand-offwhite rounded-2xl overflow-hidden border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl text-brand-text font-serif mb-2">{promo.title}</h4>
                    <p className="text-brand-text-muted text-sm">{promo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. LOCATION & CONTACT */}
      <section id="location" className="py-16 md:py-24 bg-brand-offwhite border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Find Us</span>
              <h3 className="text-3xl md:text-4xl font-serif text-brand-text mb-6">Perfectly Located in Akure</h3>
              <p className="text-brand-text-muted mb-8">
                We are situated in a serene, secure neighborhood, just minutes away from the city center. Easy to find, hard to leave.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                    <MapPin size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-brand-text font-bold mb-1">Address</h4>
                    <p className="text-brand-text-muted text-sm leading-relaxed">14 Lafe Road, beside Lafe Inn Road,<br/>Akure 340271, Ondo State, Nigeria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                    <Phone size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-brand-text font-bold mb-1">Reservations</h4>
                    <div className="flex flex-col gap-1 text-brand-text-muted text-sm font-medium">
                      <a href="tel:+2347083093585" className="hover:text-brand-blue transition-colors">0708 309 3585</a>
                      <a href="tel:+2348033643328" className="hover:text-brand-blue transition-colors">0803 364 3328</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                    <Mail size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-brand-text font-bold mb-1">Email</h4>
                    <p className="text-brand-text-muted text-sm">hello@mariamhotel.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.806654316186!2d5.165793774363989!3d7.2628322141316675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10478f20cfe840f3%3A0x488123854ad5533!2sMariam%20Hotel%20and%20Bar!5e0!3m2!1sen!2sng!4v1793679592184!5m2!1sen!2sng" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mariam Hotel and Bar Location"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}