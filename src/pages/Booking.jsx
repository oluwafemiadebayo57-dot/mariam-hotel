import BookingForm from '../components/rooms/BookingForm';

export default function Booking() {
  return (
    <div className="bg-brand-offwhite min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CREATIVE EDITORIAL HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 border-b border-gray-200 pb-8 gap-6">
          <div>
            <span className="text-brand-blue font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Secure Your Reservation</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-text leading-tight">
              Book Your Stay
            </h1>
          </div>
          <p className="text-brand-text-muted max-w-md md:text-right text-sm leading-relaxed">
            Fill out the form below to reserve your room. Pay a 50% deposit to guarantee your booking instantly. No hidden fees.
          </p>
        </div>

        <BookingForm />

      </div>
    </div>
  );
}