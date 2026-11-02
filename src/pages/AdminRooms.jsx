import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { uploadImage } from '../lib/imgbb';
import { useNavigate } from 'react-router-dom';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch rooms from Firebase
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If database is empty, we initialize it with default rooms
        if (roomsData.length === 0) {
          await seedDefaultRooms();
        } else {
          // Sort so standard, deluxe, vip order is kept
          const order = { standard: 1, deluxe: 2, vip: 3 };
          roomsData.sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));
          setRooms(roomsData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // A helper to put the initial data into Firebase so we have something to edit
  const seedDefaultRooms = async () => {
    const defaults = [
      { id: 'standard', name: 'Standard Room', price: 25000, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' },
      { id: 'deluxe', name: 'Deluxe Room', price: 45000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop' },
      { id: 'vip', name: 'VIP Suite', price: 80000, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop' }
    ];
    
    for (const room of defaults) {
      await setDoc(doc(db, "rooms", room.id), room);
    }
    setRooms(defaults);
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setEditingRoom({ ...editingRoom, image: imageUrl });
    } catch (error) {
      alert("Image upload failed. Did you add your ImgBB API key to .env.local?");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const roomRef = doc(db, "rooms", editingRoom.id);
      await updateDoc(roomRef, {
        name: editingRoom.name,
        price: Number(editingRoom.price),
        image: editingRoom.image
      });
      
      // Update local state
      setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
      setEditingRoom(null);
      alert("Room updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update room.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-luxury-gold">Loading Rooms Manager...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-luxury-gold mb-2">Manage Rooms</h1>
          <p className="text-gray-400 text-sm">Update prices, names, and photos instantly.</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white border border-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
          &larr; Back to Reservations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-luxury-charcoal border border-white/10 rounded-xl overflow-hidden">
            <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-xl text-white font-serif mb-1">{room.name}</h3>
              <p className="text-luxury-gold font-bold mb-4">₦{room.price?.toLocaleString()} / night</p>
              <button 
                onClick={() => setEditingRoom(room)}
                className="w-full bg-royal hover:bg-royal-dark text-white py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Edit Room
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-luxury-charcoal border border-luxury-gold/30 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-serif text-white mb-6">Edit {editingRoom.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Room Name</label>
                <input 
                  type="text" 
                  value={editingRoom.name} 
                  onChange={e => setEditingRoom({...editingRoom, name: e.target.value})}
                  className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Price per Night (₦)</label>
                <input 
                  type="number" 
                  value={editingRoom.price} 
                  onChange={e => setEditingRoom({...editingRoom, price: e.target.value})}
                  className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Room Photo</label>
                <img src={editingRoom.image} className="w-full h-32 object-cover rounded-lg mb-2" alt="Preview" />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold file:text-black hover:file:bg-luxury-gold-soft" 
                />
                {isUploading && <p className="text-xs text-luxury-gold mt-2">Uploading image...</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditingRoom(null)} className="flex-1 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={isUploading} className="flex-1 py-2 rounded-lg bg-luxury-gold text-black font-bold hover:bg-luxury-gold-soft transition-colors disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}