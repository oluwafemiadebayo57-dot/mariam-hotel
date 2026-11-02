import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Room data from Firebase
  const [roomsData, setRoomsData] = useState([]);
  const [roomRates, setRoomRates] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roomType: 'standard',
    checkIn: '',
    checkOut: '',
    guests: '1',
    paymentMethod: 'deposit',
    specialRequests: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch live room prices from Firebase
  useEffect(() => {
    const fetchRates = async () => {
      const snapshot = await getDocs(collection(db, "rooms"));
      const rates = {};
      const data = [];
      snapshot.forEach(doc => {
        rates[doc.id] = doc.data().price;
        data.push({ id: doc.id, ...doc.data() });
      });
      setRoomRates(rates);
      setRoomsData(data);
      
      // Auto-select room from URL if it exists, otherwise default to first room
      const roomParam = searchParams.get('room');
      if (roomParam && rates[roomParam]) {
        setFormData(prev => ({ ...prev, roomType: roomParam }));
      } else if (data.length > 0) {
        setFormData(prev => ({ ...prev, roomType: data[0].id }));
      }
    };
    fetchRates();
  }, [searchParams]);

  // Calculate Price dynamically based on live rates
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && roomRates[formData.roomType]) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalPrice(diffDays * roomRates[formData.roomType]);
      } else {
        setTotalPrice(0);
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.roomType, roomRates]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const amountToPay = formData.paymentMethod === 'deposit' ? (totalPrice * 0.5) : totalPrice;

    try {
      await addDoc(collection(db, "reservations"), {
        ...formData,
        totalPrice: totalPrice,
        amountPaid: amountToPay,
        status: "pending_verification",
        createdAt: serverTimestamp(),
      });

      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1000);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const amountToTransfer = formData.paymentMethod === 'deposit' ? (totalPrice * 0.5) : totalPrice;

    return (
      <div className="bg-luxury-charcoal p-10 rounded-2xl border border-luxury-gold/30 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-luxury-gold/50">
          <svg className="w-10 h-10 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-3xl font-serif text-white mb-2">Awaiting Payment</h3>
        <p className="text-gray-400 mb-6">
          Your reservation is saved! To secure your room, please transfer the amount below. Your booking will be confirmed as soon as we verify the payment.
        </p>
        
        <div className="bg-luxury-black p-6 rounded-xl border border-white/10 text-left mb-8 max-w-sm mx-auto">
          <p className="text-sm text-gray-400 mb-1">
            {formData.paymentMethod === 'deposit' ? 'Amount to Transfer (50% Deposit):' : 'Total Amount to Transfer:'}
          </p>
          <p className="text-luxury-gold text-3xl font-bold mb-4">₦{amountToTransfer.toLocaleString()}</p>
          
          <div className="space-y-2 border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400">Bank Name: <span className="text-white font-medium">GTBank</span></p>
            <p className="text-sm text-gray-400">Account Name: <span className="text-white font-medium">Mariam Hotel & Bar</span></p>
            <p className="text-sm text-gray-400">Account Number: <span className="text-white font-bold text-lg tracking-wider">0123456789</span></p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">Use <strong className="text-white">{formData.fullName}</strong> as the transfer description.</p>
        
        <a href={`https://wa.me/2348000000000?text=Hello%20Mariam%20Hotel,%20I%20just%20booked%20the%20${formData.roomType}%20room%20and%20made%20a%20transfer%20of%20₦${amountToTransfer.toLocaleString()}.%20My%20name%20is%20${formData.fullName}.`} target="_blank" rel="noreferrer" className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4 w-full">
          Send Payment Receipt on WhatsApp
        </a>

        <button onClick={() => setIsSubmitted(false)} className="text-royal hover:text-white transition-colors text-sm underline">
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-luxury-charcoal p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl max-w-3xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="080 1234 5678" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
          <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors appearance-none">
            {roomsData.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - ₦{room.price.toLocaleString()}/night
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests</label>
          <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors appearance-none">
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
          <input required type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors [color-scheme:dark]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Date</label>
          <input required type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors [color-scheme:dark]" />
        </div>

        <div className="md:col-span-2 bg-luxury-black p-4 rounded-lg border border-white/10">
          <label className="block text-sm font-medium text-luxury-gold mb-3">Payment Options</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-white/5 rounded-lg hover:border-luxury-gold/30 transition-colors bg-white/5">
              <input type="radio" name="paymentMethod" value="deposit" checked={formData.paymentMethod === 'deposit'} onChange={handleChange} className="mt-1 accent-luxury-gold" />
              <div>
                <span className="text-white text-sm font-medium block">Pay 50% Deposit Now (Recommended)</span>
                <span className="text-gray-400 text-xs">Secure your room with a 50% transfer. Pay the rest when you arrive.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-white/5 rounded-lg hover:border-luxury-gold/30 transition-colors bg-white/5">
              <input type="radio" name="paymentMethod" value="full" checked={formData.paymentMethod === 'full'} onChange={handleChange} className="mt-1 accent-luxury-gold" />
              <div>
                <span className="text-white text-sm font-medium block">Pay 100% Full Amount Now</span>
                <span className="text-gray-400 text-xs">Pay everything upfront and simply pick up your keys on arrival.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests (Optional)</label>
          <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="2" className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="Any special requests?"></textarea>
        </div>
      </div>

      <div className="bg-luxury-black/50 border border-luxury-gold/30 rounded-xl p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm mb-1">Total Reservation Cost</p>
          <p className="text-luxury-gold text-3xl font-serif">₦{totalPrice.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm mb-1">Due Today</p>
          <p className="text-white text-xl font-bold">
            ₦{formData.paymentMethod === 'deposit' ? (totalPrice * 0.5).toLocaleString() : totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <button disabled={isLoading || totalPrice === 0} type="submit" className="w-full bg-luxury-gold hover:bg-luxury-gold-soft text-black font-bold text-lg py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? 'Processing...' : `Reserve & Pay ₦${(formData.paymentMethod === 'deposit' ? totalPrice * 0.5 : totalPrice).toLocaleString()}`}
      </button>
      <p className="text-center text-xs text-gray-500 mt-4">You will be shown the Hotel's bank account details on the next screen.</p>
    </form>
  );
}