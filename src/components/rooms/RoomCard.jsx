import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function RoomCard({ room }) {
  // Add fallbacks in case the admin didn't add features/description in the database yet
  const displayFeatures = room.features || ['Free Wi-Fi', 'Air Conditioning', 'Smart TV'];
  const displayDescription = room.description || 'Experience comfort and luxury in our beautifully designed rooms.';

  return (
    <div className="group bg-luxury-charcoal rounded-2xl overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col shadow-xl">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-luxury-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-luxury-gold/30">
          <span className="text-luxury-gold font-bold">₦{room.price?.toLocaleString()}</span>
          <span className="text-gray-400 text-xs"> / night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif text-white mb-2">{room.name}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow">{displayDescription}</p>
        
        {/* Features List */}
        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-xs text-gray-300">
              <Check size={14} className="text-royal" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Link 
          to={`/booking?room=${room.id}`} 
          className="w-full block text-center bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black py-3 rounded-lg font-semibold transition-colors"
        >
          Reserve This Room
        </Link>
      </div>
    </div>
  );
}