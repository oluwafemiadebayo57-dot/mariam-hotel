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

  const [newPromo, setNewPromo] = useState({ title: '', description: '', image: '' });

  const fetchPromos = async () => {
    try {
      const q = query(collection(db, "promos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPromos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        createdAt: new Date()
      });
      setNewPromo({ title: '', description: '', image: '' });
      fetchPromos();
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

  if (loading) return <div className="text-center py-20 text-brand-blue font-bold">Loading Promos...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh] bg-brand-offwhite">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-blue mb-2">Promos & Events Manager</h1>
          <p className="text-brand-text-muted text-sm">Upload flyers and announcements for the homepage.</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="text-brand-text-muted hover:text-brand-blue border border-gray-300 bg-brand-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
          &larr; Back to Reservations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD NEW PROMO FORM */}
        <div className="lg:col-span-1 bg-brand-white border border-gray-200 p-6 rounded-xl h-fit shadow-sm">
          <h2 className="text-xl text-brand-blue font-serif mb-4">Create New Promo</h2>
          <form onSubmit={handleAddPromo} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1">Event Title</label>
              <input required type="text" value={newPromo.title} onChange={e => setNewPromo({...newPromo, title: e.target.value})} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-2 text-brand-text focus:border-brand-blue focus:outline-none" placeholder="e.g. Friday Night Live" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1">Short Description</label>
              <textarea required rows="2" value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-2 text-brand-text focus:border-brand-blue focus:outline-none" placeholder="Join us for drinks and live music!"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1">Flyer / Image</label>
              {newPromo.image && <img src={newPromo.image} className="w-full h-32 object-cover rounded-lg mb-2" alt="Preview" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-brand-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-hover" />
              {isUploading && <p className="text-xs text-brand-blue font-bold mt-2">Uploading image...</p>}
            </div>
            <button type="submit" disabled={isUploading} className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-hover transition-colors disabled:opacity-50 shadow-sm">
              Publish Promo
            </button>
          </form>
        </div>

        {/* LIST OF PROMOS */}
        <div className="lg:col-span-2 space-y-4">
          {promos.length === 0 ? (
            <div className="bg-brand-white border border-gray-200 p-8 rounded-xl text-center text-brand-text-muted">
              No promos yet. Upload your first one!
            </div>
          ) : (
            promos.map(promo => (
              <div key={promo.id} className="bg-brand-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <img src={promo.image} className="w-24 h-24 object-cover rounded-lg shrink-0" alt={promo.title} />
                <div className="flex-grow">
                  <h3 className="text-brand-text font-bold text-lg">{promo.title}</h3>
                  <p className="text-brand-text-muted text-sm">{promo.description}</p>
                </div>
                <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 p-2">
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