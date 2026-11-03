import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function RoomCard({ room }) {
  const displayFeatures = room.features || ['Free Wi-Fi', 'Air Conditioning', 'Smart TV'];
  const displayDescription = room.description || 'Experience comfort and luxury in our beautifully designed rooms.';

  return (
    <div className="group bg-brand-white rounded-2xl overflow-hidden border border-gray-200 hover:border-brand-blue/30 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-brand-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
          <span className="text-brand-blue font-bold">₦{room.price?.toLocaleString()}</span>
          <span className="text-brand-text-muted text-xs"> / night</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif text-brand-text mb-2">{room.name}</h3>
        <p className="text-brand-text-muted text-sm mb-6 flex-grow">{displayDescription}</p>
        
        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-xs text-brand-text font-medium">
              <Check size={14} className="text-brand-blue" />
              {feature}
            </li>
          ))}
        </ul>

        <Link 
          to={`/booking?room=${room.id}`} 
          className="w-full block text-center bg-brand-blue text-white hover:bg-brand-blue-hover py-3 rounded-lg font-semibold transition-colors shadow-md"
        >
          Reserve This Room
        </Link>
      </div>
    </div>
  );
}