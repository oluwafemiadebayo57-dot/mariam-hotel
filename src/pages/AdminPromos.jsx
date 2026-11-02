import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { uploadImage } from '../lib/imgbb';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // New Promo Form State
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    image: ''
  });

  const fetchPromos = async () => {
    try {
      const q = query(collection(db, "promos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPromos(data);
    } catch (error) {
      console.error("Error fetching promos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setNewPromo(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      alert("Image upload failed. Check your ImgBB API key.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newPromo.image) {
      alert("Please upload an image for the promo.");
      return;
    }

    try {
      await addDoc(collection(db, "promos"), {
        ...newPromo,
        createdAt: new Date() // Use client date or serverTimestamp
      });
      setNewPromo({ title: '', description: '', image: '' });
      fetchPromos(); // Refresh the list
      alert("Promo added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add promo.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promo?")) {
      try {
        await deleteDoc(doc(db, "promos", id));
        setPromos(promos.filter(p => p.id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to delete.");
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-luxury-gold">Loading Promos...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-luxury-gold mb-2">Promos & Events Manager</h1>
          <p className="text-gray-400 text-sm">Upload flyers and announcements for the homepage.</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white border border-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
          &larr; Back to Reservations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD NEW PROMO FORM */}
        <div className="lg:col-span-1 bg-luxury-charcoal border border-white/10 p-6 rounded-xl h-fit">
          <h2 className="text-xl text-white font-serif mb-4">Create New Promo</h2>
          <form onSubmit={handleAddPromo} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Event Title</label>
              <input required type="text" value={newPromo.title} onChange={e => setNewPromo({...newPromo, title: e.target.value})} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none" placeholder="e.g. Friday Night Live" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Short Description</label>
              <textarea required rows="2" value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none" placeholder="Join us for drinks and live music!"></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Flyer / Image</label>
              {newPromo.image && <img src={newPromo.image} className="w-full h-32 object-cover rounded-lg mb-2" alt="Preview" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold file:text-black hover:file:bg-luxury-gold-soft" />
              {isUploading && <p className="text-xs text-luxury-gold mt-2">Uploading image...</p>}
            </div>
            <button type="submit" disabled={isUploading} className="w-full bg-luxury-gold text-black font-bold py-3 rounded-lg hover:bg-luxury-gold-soft transition-colors disabled:opacity-50">
              Publish Promo
            </button>
          </form>
        </div>

        {/* LIST OF PROMOS */}
        <div className="lg:col-span-2 space-y-4">
          {promos.length === 0 ? (
            <div className="bg-luxury-charcoal border border-white/10 p-8 rounded-xl text-center text-gray-500">
              No promos yet. Upload your first one!
            </div>
          ) : (
            promos.map(promo => (
              <div key={promo.id} className="bg-luxury-charcoal border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                <img src={promo.image} className="w-24 h-24 object-cover rounded-lg shrink-0" alt={promo.title} />
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-lg">{promo.title}</h3>
                  <p className="text-gray-400 text-sm">{promo.description}</p>
                </div>
                <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-400 p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}