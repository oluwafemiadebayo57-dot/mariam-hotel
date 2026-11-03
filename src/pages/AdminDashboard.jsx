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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh] bg-brand-offwhite">
      
      {/* Header with Navigation Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-blue mb-2">Reservations Manager</h1>
          <p className="text-brand-text-muted text-sm">Welcome back, {currentUser?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/rooms')} className="bg-brand-white border border-gray-300 text-brand-text px-5 py-2.5 rounded-lg hover:border-brand-blue transition-colors font-medium text-sm shadow-sm">
            Manage Rooms
          </button>
          <button onClick={() => navigate('/admin/promos')} className="bg-brand-white border border-gray-300 text-brand-text px-5 py-2.5 rounded-lg hover:border-brand-blue transition-colors font-medium text-sm shadow-sm">
            Manage Promos
          </button>
          <button onClick={() => navigate('/admin/settings')} className="bg-brand-white border border-gray-300 text-brand-text px-5 py-2.5 rounded-lg hover:border-brand-blue transition-colors font-medium text-sm shadow-sm">
            Site Settings
          </button>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-brand-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-brand-text-muted text-sm font-medium mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-brand-text">{reservations.length}</p>
        </div>
        <div className="bg-brand-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-brand-text-muted text-sm font-medium mb-2">Action Needed (Pending)</p>
          <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-brand-blue p-6 rounded-xl shadow-md text-white">
          <p className="text-blue-200 text-sm font-medium mb-2">Verified Revenue</p>
          <p className="text-3xl font-bold text-white">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending_verification', 'confirmed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap shadow-sm ${
              filter === f ? 'bg-brand-blue text-white' : 'bg-brand-white text-brand-text-muted border border-gray-200 hover:text-brand-blue'
            }`}
          >
            {f === 'all' ? 'All Bookings' : f === 'pending_verification' ? 'Pending Payment' : 'Confirmed'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-brand-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-offwhite border-b border-gray-200 text-brand-text-muted text-sm">
                <th className="p-4 font-bold">Guest Info</th>
                <th className="p-4 font-bold">Room & Dates</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-text-muted">Loading reservations...</td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-text-muted">No bookings found for this filter.</td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-brand-blue-light/30 transition-colors">
                    <td className="p-4">
                      <p className="text-brand-text font-bold">{res.fullName}</p>
                      <p className="text-brand-text-muted text-sm">{res.phone}</p>
                      <p className="text-gray-400 text-xs">{res.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-brand-blue text-sm font-bold uppercase">{res.roomType}</p>
                      <p className="text-brand-text-muted text-sm">{res.checkIn} to {res.checkOut}</p>
                      <p className="text-gray-400 text-xs">{res.guests} Guest(s)</p>
                    </td>
                    <td className="p-4">
                      <p className="text-brand-text font-bold">₦{res.amountPaid?.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs line-through">Total: ₦{res.totalPrice?.toLocaleString()}</p>
                      <p className="text-brand-blue text-[10px] uppercase font-bold mt-1">{res.paymentMethod === 'deposit' ? '50% Deposit' : 'Full Payment'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        res.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {res.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {res.status === 'pending_verification' && (
                        <div className="flex flex-col gap-2 items-end">
                          <button onClick={() => updateStatus(res.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition-colors text-xs font-bold shadow-sm">
                            Confirm Payment
                          </button>
                          <button onClick={() => updateStatus(res.id, 'cancelled')} className="text-red-500 hover:text-red-700 text-xs font-medium">
                            Cancel
                          </button>
                        </div>
                      )}

                      {res.status === 'confirmed' && (
                        <a 
                          href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=Hello%20${res.fullName},%20your%20booking%20at%20Mariam%20Hotel%20for%20the%20${res.roomType}%20room%20(${res.checkIn}%20to%20${res.checkOut})%20has%20been%20successfully%20confirmed!%20We%20look%20forward%20to%20hosting%20you.`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-1.5 rounded-lg transition-colors text-xs font-bold shadow-sm"
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