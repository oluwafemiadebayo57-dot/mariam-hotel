import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resData = [];
      snapshot.forEach((doc) => {
        resData.push({ id: doc.id, ...doc.data() });
      });
      setReservations(resData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const resRef = doc(db, 'reservations', id);
      await updateDoc(resRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + (r.amountPaid || r.totalPrice), 0);

  const pendingCount = reservations.filter(r => r.status === 'pending_verification').length;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      
      {/* Header with Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-luxury-gold mb-2">Reservations Manager</h1>
          <p className="text-gray-400 text-sm">Welcome back, {currentUser?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/rooms')} className="bg-luxury-gold text-black px-5 py-2.5 rounded-lg hover:bg-luxury-gold-soft transition-colors font-medium text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            Manage Rooms
          </button>
          <button onClick={() => navigate('/admin/promos')} className="bg-royal text-white px-5 py-2.5 rounded-lg hover:bg-royal-dark transition-colors font-medium text-sm shadow-[0_0_15px_rgba(10,61,145,0.3)]">
            Manage Promos
          </button>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-lg transition-colors border border-red-500/30 font-medium text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-luxury-charcoal border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-white">{reservations.length}</p>
        </div>
        <div className="bg-luxury-charcoal border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">Action Needed (Pending)</p>
          <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-luxury-charcoal border border-luxury-gold/30 p-6 rounded-xl bg-gradient-to-br from-luxury-charcoal to-royal-dark/20">
          <p className="text-luxury-gold text-sm mb-2">Verified Revenue</p>
          <p className="text-3xl font-bold text-luxury-gold">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending_verification', 'confirmed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f ? 'bg-luxury-gold text-black' : 'bg-luxury-charcoal text-gray-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Bookings' : f === 'pending_verification' ? 'Pending Payment' : 'Confirmed'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-luxury-charcoal border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-black border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Guest Info</th>
                <th className="p-4 font-medium">Room & Dates</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading reservations...</td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No bookings found for this filter.</td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{res.fullName}</p>
                      <p className="text-gray-400 text-sm">{res.phone}</p>
                      <p className="text-gray-500 text-xs">{res.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-luxury-gold text-sm font-semibold uppercase">{res.roomType}</p>
                      <p className="text-gray-300 text-sm">{res.checkIn} to {res.checkOut}</p>
                      <p className="text-gray-500 text-xs">{res.guests} Guest(s)</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">₦{res.amountPaid?.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs line-through">Total: ₦{res.totalPrice?.toLocaleString()}</p>
                      <p className="text-gray-500 text-[10px] uppercase mt-1">{res.paymentMethod === 'deposit' ? '50% Deposit' : 'Full Payment'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                        res.status === 'pending_verification' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {res.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {res.status === 'pending_verification' && (
                        <div className="flex flex-col gap-2 items-end">
                          <button onClick={() => updateStatus(res.id, 'confirmed')} className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-medium border border-green-500/30">
                            Confirm Payment
                          </button>
                          <button onClick={() => updateStatus(res.id, 'cancelled')} className="text-red-400 hover:text-red-300 text-xs">
                            Cancel
                          </button>
                        </div>
                      )}

                      {res.status === 'confirmed' && (
                        <a 
                          href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=Hello%20${res.fullName},%20your%20booking%20at%20Mariam%20Hotel%20for%20the%20${res.roomType}%20room%20(${res.checkIn}%20to%20${res.checkOut})%20has%20been%20successfully%20confirmed!%20We%20look%20forward%20to%20hosting%20you.`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                        >
                          Send WhatsApp
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}