import BookingForm from '../components/rooms/BookingForm';

export default function Booking() {
  return (
    <div className="bg-luxury-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-4">Book Your Stay</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Secure your room directly with Mariam Hotel & Bar. Best rates guaranteed.
          </p>
        </div>

        <BookingForm />

      </div>
    </div>
  );
}