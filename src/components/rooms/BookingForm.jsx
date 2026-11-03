import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc } from 'firebase/firestore';

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Room data
  const [roomsData, setRoomsData] = useState([]);
  const [roomRates, setRoomRates] = useState({});

  // Dynamic Hotel Settings (Bank details)
  const [hotelSettings, setHotelSettings] = useState({
    bankName: 'GTBank',
    accountName: 'Mariam Hotel & Bar',
    accountNumber: '0123456789'
  });

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

  const today = new Date().toISOString().split("T")[0];

  // Fetch Rooms and Settings
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Rooms
      const snapshot = await getDocs(collection(db, "rooms"));
      const rates = {};
      const data = [];
      snapshot.forEach(doc => {
        rates[doc.id] = doc.data().price;
        data.push({ id: doc.id, ...doc.data() });
      });
      setRoomRates(rates);
      setRoomsData(data);
      
      const roomParam = searchParams.get('room');
      if (roomParam && rates[roomParam]) {
        setFormData(prev => ({ ...prev, roomType: roomParam }));
      } else if (data.length > 0) {
        setFormData(prev => ({ ...prev, roomType: data[0].id }));
      }

      // 2. Fetch Hotel Settings (Bank Details)
      try {
        const settingsRef = doc(db, "settings", "hotelInfo");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setHotelSettings(settingsSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchData();
  }, [searchParams]);

  // Calculate Price dynamically
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
      <div className="bg-brand-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-xl text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-blue/20">
          <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-3xl font-serif text-brand-text mb-2">Awaiting Payment</h3>
        <p className="text-brand-text-muted mb-6">
          Your reservation is saved! To secure your room, please transfer the amount below. Your booking will be confirmed as soon as we verify the payment.
        </p>
        
        <div className="bg-brand-offwhite p-6 rounded-xl border border-gray-200 text-left mb-8 max-w-sm mx-auto">
          <p className="text-sm text-brand-text-muted mb-1 font-medium">
            {formData.paymentMethod === 'deposit' ? 'Amount to Transfer (50% Deposit):' : 'Total Amount to Transfer:'}
          </p>
          <p className="text-brand-blue text-3xl font-bold mb-4">₦{amountToTransfer.toLocaleString()}</p>
          
          <div className="space-y-2 border-t border-gray-200 pt-4">
            {/* DYNAMIC BANK DETAILS */}
            <p className="text-sm text-brand-text-muted">Bank Name: <span className="text-brand-text font-bold">{hotelSettings.bankName}</span></p>
            <p className="text-sm text-brand-text-muted">Account Name: <span className="text-brand-text font-bold">{hotelSettings.accountName}</span></p>
            <p className="text-sm text-brand-text-muted">Account Number: <span className="text-brand-blue font-bold text-lg tracking-wider">{hotelSettings.accountNumber}</span></p>
          </div>
        </div>

        <p className="text-sm text-brand-text-muted mb-6">Use <strong className="text-brand-text">{formData.fullName}</strong> as the transfer description.</p>
        
        <a 
          href={`https://wa.me/${hotelSettings.phone1 ? hotelSettings.phone1.replace(/[^0-9]/g, '') : '2347083093585'}?text=Hello%20Mariam%20Hotel,%20I%20just%20booked%20the%20${formData.roomType}%20room%20and%20made%20a%20transfer%20of%20₦${amountToTransfer.toLocaleString()}.%20My%20name%20is%20${formData.fullName}.`} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4 w-full shadow-md"
        >
          Send Payment Receipt on WhatsApp
        </a>

        <button onClick={() => setIsSubmitted(false)} className="text-brand-blue hover:text-brand-blue-hover transition-colors text-sm underline font-medium">
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-xl max-w-3xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Full Name</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Phone Number</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" placeholder="080 1234 5678" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-brand-text mb-2">Email Address</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Room Type</label>
          <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors appearance-none">
            {roomsData.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - ₦{room.price.toLocaleString()}/night
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Number of Guests</label>
          <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors appearance-none">
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Check-in Date</label>
          <input required type="date" min={today} name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-text mb-2">Check-out Date</label>
          <input required type="date" min={formData.checkIn || today} name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" />
        </div>

        {/* PAYMENT METHOD */}
        <div className="md:col-span-2 bg-brand-offwhite p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-bold text-brand-blue mb-3">Payment Options</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-brand-blue/50 transition-colors bg-white">
              <input type="radio" name="paymentMethod" value="deposit" checked={formData.paymentMethod === 'deposit'} onChange={handleChange} className="mt-1 accent-brand-blue" />
              <div>
                <span className="text-brand-text text-sm font-bold block">Pay 50% Deposit Now (Recommended)</span>
                <span className="text-brand-text-muted text-xs">Secure your room with a 50% transfer. Pay the rest when you arrive.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-brand-blue/50 transition-colors bg-white">
              <input type="radio" name="paymentMethod" value="full" checked={formData.paymentMethod === 'full'} onChange={handleChange} className="mt-1 accent-brand-blue" />
              <div>
                <span className="text-brand-text text-sm font-bold block">Pay 100% Full Amount Now</span>
                <span className="text-brand-text-muted text-xs">Pay everything upfront and simply pick up your keys on arrival.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-brand-text mb-2">Special Requests (Optional)</label>
          <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="2" className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" placeholder="Any special requests?"></textarea>
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div className="bg-brand-blue-light border border-brand-blue/20 rounded-xl p-5 md:p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-brand-text-muted text-sm font-medium mb-1">Total Reservation Cost</p>
          <p className="text-brand-blue text-3xl font-serif font-bold">₦{totalPrice.toLocaleString()}</p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-brand-blue/10 pt-3 sm:pt-0 sm:pl-6">
          <p className="text-brand-text-muted text-sm font-medium mb-1">Due Today</p>
          <p className="text-brand-blue-hover text-2xl font-bold">
            ₦{formData.paymentMethod === 'deposit' ? (totalPrice * 0.5).toLocaleString() : totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <button disabled={isLoading || totalPrice === 0} type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-lg py-4 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
        {isLoading ? 'Processing...' : `Reserve & Pay ₦${(formData.paymentMethod === 'deposit' ? totalPrice * 0.5 : totalPrice).toLocaleString()}`}
      </button>
      <p className="text-center text-xs text-brand-text-muted mt-4">You will be shown the Hotel's bank account details on the next screen.</p>
    </form>
  );
}