import { useState, useEffect } from 'react';
import RoomCard from '../components/rooms/RoomCard';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const order = { standard: 1, deluxe: 2, vip: 3 };
      roomsData.sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));
      
      setRooms(roomsData);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-brand-offwhite min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CREATIVE EDITORIAL HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 border-b border-gray-200 pb-8 gap-6">
          <div>
            <span className="text-brand-blue font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Discover Your Stay</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-text leading-tight">
              Rooms & Suites
            </h1>
          </div>
          <p className="text-brand-text-muted max-w-md md:text-right text-sm leading-relaxed">
            Experience unmatched comfort. By booking directly with us, you secure the best rates with zero third-party commission fees.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-brand-blue font-bold py-20">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}