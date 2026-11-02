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
      roomsData.sort((a, b) => order[a.id] - order[b.id]);
      
      setRooms(roomsData);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-luxury-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-4">Our Rooms & Suites</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience comfort and luxury at Mariam Hotel. By booking directly with us, you guarantee the best rates with zero third-party commission fees.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}