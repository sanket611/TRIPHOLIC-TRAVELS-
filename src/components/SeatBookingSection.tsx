import React, { useState, useId } from 'react';
import {
  Armchair,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  MapPin,
  Users,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  RotateCcw,
  Check,
  MessageCircle,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { TripPlan } from '../types';

interface SeatBookingSectionProps {
  plan: TripPlan;
}

export const SeatBookingSection: React.FC<SeatBookingSectionProps> = ({ plan }) => {
  const { tripSummary, budget } = plan;

  // Form State initialized with plan details
  const [destination, setDestination] = useState<string>(tripSummary.destination || '');
  const [name, setName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  
  // Default date: 14 days from today
  const defaultDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [travelDate, setTravelDate] = useState<string>(defaultDateStr());
  const [confirmedBudget, setConfirmedBudget] = useState<string>(
    budget?.userBudget ? `${tripSummary.budgetFormatted || `₹ ${budget.userBudget}`}` : '₹ 20,000'
  );
  const [members, setMembers] = useState<number>(tripSummary.travelers || 2);
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // UI Flow State: 'form' | 'time_to_think' | 'paid_confirmed'
  const [viewState, setViewState] = useState<'form' | 'time_to_think' | 'paid_confirmed'>('form');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generated Reference IDs
  const [bookingId, setBookingId] = useState<string>('');
  const [inquiryId, setInquiryId] = useState<string>('');

  // Format the date into readable Day & Date (e.g., Saturday, 12 Sep 2026)
  const formatDayAndDate = (dateStr: string) => {
    if (!dateStr) return { day: 'Not selected', formattedDate: 'Please choose a date' };
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const fullDate = d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return { day: dayName, formattedDate: fullDate };
    } catch {
      return { day: 'Day', formattedDate: dateStr };
    }
  };

  const selectedDayInfo = formatDayAndDate(travelDate);

  // Validate form before submitting payment
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required.';
    }
    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Please enter your contact number.';
    } else if (!/^[0-9+\s-]{8,15}$/.test(contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid phone number (8-15 digits).';
    }

    if (!travelDate) {
      newErrors.travelDate = 'Please select your preferred travel date.';
    }

    if (members < 1) {
      newErrors.members = 'Members must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler for Paid ₹250 Option
  const handlePayAndBookSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const destCode = (destination.trim().slice(0, 3) || 'TRP').toUpperCase();
      setBookingId(`BK-${randomCode}-${destCode}`);
      setIsProcessingPayment(false);
      setViewState('paid_confirmed');
    }, 900);
  };

  // Handler for "Let give me time to think" Option
  const handleTimeThink = () => {
    // Generate inquiry reference ID
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const destCode = (destination.trim().slice(0, 3) || 'INQ').toUpperCase();
    setInquiryId(`INQ-${randomCode}-${destCode}`);
    setViewState('time_to_think');
  };

  // Download booking or inquiry voucher as text file
  const handleDownloadReceipt = (type: 'booking' | 'inquiry') => {
    const isBooking = type === 'booking';
    const content = `
======================================================
     EXPLOREAI - TRAVEL SEAT ${isBooking ? 'CONFIRMATION RECEIPT' : 'INQUIRY SLIP'}
======================================================
Reference ID     : ${isBooking ? bookingId : inquiryId}
Status           : ${isBooking ? 'PAID & CONFIRMED (₹250 ADVANCE TOKEN)' : 'UNDER REVIEW (AVAILABILITY CHECK)'}
Generated Date   : ${new Date().toLocaleString()}

TRIP DETAILS:
------------------------------------------------------
Destination      : ${destination}
Travel Date      : ${selectedDayInfo.day}, ${selectedDayInfo.formattedDate}
Members/Travelers: ${members} Person(s)
Confirmed Budget : ${confirmedBudget}
Special Request  : ${specialRequest || 'None'}

PASSENGER / CONTACT DETAILS:
------------------------------------------------------
Primary Contact  : ${name || 'Valued Traveler'}
Contact Number   : ${contactNumber || 'Provided'}

PAYMENT SUMMARY:
------------------------------------------------------
Seat Token Fee   : ${isBooking ? '₹250 (Paid Successfully)' : '₹0.00 (Inquiry Only)'}
Balance Payment  : ${isBooking ? 'To be adjusted in final itinerary billing' : 'Payable upon confirmation'}

${isBooking 
  ? 'Note: Your seats and priority guide allocation are reserved for the specified date.' 
  : 'Thank you for visiting us! We will review your data and tell you if any seats are available for your selected date.'}
======================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isBooking ? 'Seat-Booking-Receipt' : 'Seat-Inquiry-Slip'}-${destination.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="seat-booking-section"
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] overflow-hidden mb-8 transition-all duration-300 scroll-mt-20"
    >
      {/* Top Banner Stripe */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 27, 75, 0.85))',
          backdropFilter: 'blur(8px)',
          borderBottom: '1.5px solid #000000',
        }}
        className="px-4 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-violet-600/40 border border-black flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
            <Armchair className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full text-black font-extrabold"
              >
                Limited Slots
              </span>
              <span className="text-xs text-indigo-100 hidden sm:inline font-bold">• Live Availability</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-heading">
              Confirm Your Seat Now
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="text-xs sm:text-sm text-black font-mono font-extrabold flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            100% Refundable Token ₹250
          </span>
        </div>
      </div>

      {/* VIEW 1: Form View */}
      {viewState === 'form' && (
        <div className="p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div
              style={{
                borderBottom: '1.5px solid #000000',
              }}
              className="mb-6 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm sm:text-base text-slate-950 font-bold">
                  Fill in your travel details below to reserve your priority travel slot and lock in today&apos;s rates for{' '}
                  <span className="font-extrabold text-black">{destination || 'your destination'}</span>.
                </p>
              </div>
              <div className="text-xs sm:text-sm font-mono text-black font-extrabold shrink-0">
                Trip Style: <span className="text-violet-800 font-extrabold">{tripSummary.travelStyle}</span>
              </div>
            </div>

            <form onSubmit={handlePayAndBookSeat} className="space-y-6" id="seat-booking-form">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* 1. Destination Field */}
                <div>
                  <label
                    htmlFor="booking-destination"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Destination <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-destination"
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        if (errors.destination) setErrors({ ...errors, destination: '' });
                      }}
                      placeholder="e.g. Goa, Paris, Manali"
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 min-h-[46px] text-sm sm:text-base rounded-xl shadow-sm transition-all text-black font-bold focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs ${
                        errors.destination ? 'border-rose-600 ring-2 ring-rose-500' : ''
                      }`}
                    />
                  </div>
                  {errors.destination && (
                    <p className="mt-1 text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* 2. Your Name */}
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Enter your full name"
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 min-h-[46px] text-sm sm:text-base rounded-xl shadow-sm transition-all text-black font-bold focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs ${
                        errors.name ? 'border-rose-600 ring-2 ring-rose-500' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 3. Contact Number */}
                <div>
                  <label
                    htmlFor="booking-contact"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Contact Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-contact"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => {
                        setContactNumber(e.target.value);
                        if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                      }}
                      placeholder="e.g. +91 98765 43210"
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 min-h-[46px] text-sm sm:text-base rounded-xl shadow-sm transition-all text-black font-bold focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs ${
                        errors.contactNumber ? 'border-rose-600 ring-2 ring-rose-500' : ''
                      }`}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* 4. Date and Day Selection */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Date &amp; Day <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-date"
                      type="date"
                      value={travelDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (errors.travelDate) setErrors({ ...errors, travelDate: '' });
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 min-h-[46px] text-sm sm:text-base rounded-xl shadow-sm transition-all text-black font-bold focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs ${
                        errors.travelDate ? 'border-rose-600 ring-2 ring-rose-500' : ''
                      }`}
                    />
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.90)',
                      border: '1.5px solid #000000',
                    }}
                    className="mt-1.5 flex items-center justify-between text-xs font-mono text-black px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    <span className="font-extrabold text-black">{selectedDayInfo.day}</span>
                    <span className="font-bold text-slate-800">{selectedDayInfo.formattedDate}</span>
                  </div>
                  {errors.travelDate && (
                    <p className="mt-1 text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.travelDate}
                    </p>
                  )}
                </div>

                {/* 5. Confirm Budget */}
                <div>
                  <label
                    htmlFor="booking-budget"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Confirm Budget
                  </label>
                  <div className="relative">
                    <Wallet className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-budget"
                      type="text"
                      value={confirmedBudget}
                      onChange={(e) => setConfirmedBudget(e.target.value)}
                      placeholder="e.g. ₹ 20,000"
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className="w-full pl-10 pr-3.5 py-3 min-h-[46px] text-sm sm:text-base rounded-xl shadow-sm transition-all text-black font-bold focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs"
                    />
                  </div>
                  <p className="mt-1 text-xs text-black font-mono font-bold">
                    Est. Total for {tripSummary.duration} Days
                  </p>
                </div>

                {/* 6. Members Count */}
                <div>
                  <label
                    htmlFor="booking-members"
                    className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                  >
                    Members (Travelers) <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="members-minus-btn"
                      onClick={() => setMembers((m) => Math.max(1, m - 1))}
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className="w-12 h-12 rounded-xl text-black font-extrabold hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-95 cursor-pointer text-lg shadow-sm"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <Users className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="booking-members"
                        type="number"
                        min="1"
                        max="50"
                        value={members}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setMembers(isNaN(val) ? 1 : Math.max(1, val));
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.90)',
                          border: '1.5px solid #000000',
                        }}
                        className="w-full pl-9 pr-3 py-3 min-h-[46px] text-center text-base font-extrabold text-black rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs"
                      />
                    </div>
                    <button
                      type="button"
                      id="members-plus-btn"
                      onClick={() => setMembers((m) => Math.min(50, m + 1))}
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className="w-12 h-12 rounded-xl text-black font-extrabold hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-95 cursor-pointer text-lg shadow-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-black font-mono font-bold text-center">
                    {members === 1 ? '1 Seat Booking' : `${members} Seats Reserved Together`}
                  </p>
                </div>
              </div>

              {/* Optional: Special Preferences / Notes */}
              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5"
                >
                  Special Notes or Requirements (Optional)
                </label>
                <input
                  id="booking-notes"
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Airport pickup needed, prefer morning departure, vegetarian food preference"
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="w-full px-4 py-3 min-h-[46px] text-sm sm:text-base text-black font-bold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-black backdrop-blur-xs"
                />
              </div>

              {/* Inclusions & Guarantees summary badge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="p-4 rounded-2xl text-xs sm:text-sm text-black flex flex-wrap items-center justify-between gap-3 backdrop-blur-md shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-800 shrink-0" />
                  <span>
                    <strong className="text-black font-extrabold">What your ₹250 seat token secures:</strong> Guaranteed departure slot, instant itinerary price lock, verified hotel coordination, and 24/7 travel concierge.
                  </span>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="font-mono text-xs sm:text-sm text-black px-3 py-1 rounded-xl shrink-0 shadow-xs font-extrabold"
                >
                  Fully Refundable within 24h
                </div>
              </div>

              {/* ACTION BUTTONS AREA */}
              <div className="pt-3 flex flex-col items-center gap-3.5">
                {/* BIG PRIMARY BUTTON: Paid 250₹ for book your seat */}
                <button
                  type="submit"
                  id="pay-250-book-seat-btn"
                  disabled={isProcessingPayment}
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="w-full sm:max-w-xl py-4 px-6 min-h-[56px] text-base sm:text-lg font-extrabold text-white bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 hover:from-violet-800 hover:via-indigo-800 hover:to-purple-800 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] group"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Securing Your Seat Slot...</span>
                    </div>
                  ) : (
                    <>
                      <Armchair className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span>Paid 250₹ For Book Your Seat</span>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* SMALLER SECONDARY OPTION: Let give me time to think */}
                <button
                  type="button"
                  id="time-to-think-btn"
                  onClick={handleTimeThink}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="px-6 py-3 min-h-[44px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm backdrop-blur-xs"
                >
                  <Clock className="w-4 h-4 text-black" />
                  <span>Let give me time to think</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: "Time to Think" (Thank You Screen) */}
      {viewState === 'time_to_think' && (
        <div id="thank-you-view" className="p-6 sm:p-12 text-center backdrop-blur-md animate-fade-in">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Heart / Check badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-violet-700 to-indigo-700 text-white flex items-center justify-center border-2 border-black shadow-md">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            </div>

            {/* BIG THANK YOU WORDING */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 font-heading">
                THANK YOU
              </h1>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="inline-block px-4 py-1.5 rounded-full text-black font-mono text-xs sm:text-sm font-extrabold shadow-sm backdrop-blur-xs"
              >
                Inquiry Ref: {inquiryId}
              </div>
            </div>

            {/* Required user message */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-5 sm:p-6 rounded-2xl backdrop-blur-md shadow-sm text-slate-950 space-y-3"
            >
              <p className="text-base sm:text-lg font-extrabold text-black leading-relaxed">
                Thank you for visiting us! We will review your data and tell you if any seats are available for that date.
              </p>
              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-bold">
                Our trip coordinators will check live local slot availability, transportation schedules, and accommodation options for{' '}
                <strong className="text-black font-extrabold">{destination}</strong> and notify you promptly via your provided details.
              </p>
            </div>

            {/* Captured Inquiry Summary Recap Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-4 sm:p-5 rounded-2xl backdrop-blur-md text-left text-xs sm:text-sm font-mono space-y-2 text-black shadow-sm"
            >
              <div
                style={{
                  borderBottom: '1.5px solid #000000',
                }}
                className="flex justify-between items-center pb-2 text-black font-extrabold text-sm sm:text-base"
              >
                <span>Inquiry Snapshot</span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs font-mono font-extrabold text-emerald-900 px-2.5 py-0.5 rounded-lg"
                >
                  Status: Pending Review
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-bold">
                <div>
                  <span className="text-slate-800">Destination:</span>{' '}
                  <span className="font-extrabold text-black">{destination || tripSummary.destination}</span>
                </div>
                <div>
                  <span className="text-slate-800">Date &amp; Day:</span>{' '}
                  <span className="font-extrabold text-black">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                </div>
                <div>
                  <span className="text-slate-800">Travelers:</span>{' '}
                  <span className="font-extrabold text-black">{members} Person(s)</span>
                </div>
                <div>
                  <span className="text-slate-800">Estimated Budget:</span>{' '}
                  <span className="font-extrabold text-black">{confirmedBudget}</span>
                </div>
                {name && (
                  <div>
                    <span className="text-slate-800">Name:</span>{' '}
                    <span className="font-extrabold text-black">{name}</span>
                  </div>
                )}
                {contactNumber && (
                  <div>
                    <span className="text-slate-800">Contact:</span>{' '}
                    <span className="font-extrabold text-black">{contactNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="inquiry-download-btn"
                onClick={() => handleDownloadReceipt('inquiry')}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-5 py-3 min-h-[44px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Inquiry Slip</span>
              </button>

              <button
                type="button"
                id="inquiry-change-btn"
                onClick={() => setViewState('form')}
                style={{
                  border: '1.5px solid #000000',
                }}
                className="px-5 py-3 min-h-[44px] text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span>Ready to Book? Back to Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: "Paid 250₹" Confirmation Screen */}
      {viewState === 'paid_confirmed' && (
        <div id="booking-confirmed-view" className="p-6 sm:p-12 text-center backdrop-blur-md animate-fade-in">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-600 text-white flex items-center justify-center border-2 border-black shadow-md">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            <div className="space-y-2">
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-4 py-1.5 rounded-full text-emerald-950 font-mono text-xs sm:text-sm font-extrabold shadow-sm"
              >
                Seat Confirmed • ₹250 Advance Received
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-heading">
                Your Seat is Booked!
              </h2>
              <p className="text-sm sm:text-base text-slate-900 max-w-md mx-auto font-bold">
                Congratulations <strong className="text-black font-extrabold">{name || 'Traveler'}</strong>, your seat allocation for{' '}
                <strong className="text-violet-900 font-extrabold">{destination}</strong> has been secured.
              </p>
            </div>

            {/* Booking Receipt Voucher Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-5 rounded-2xl backdrop-blur-md shadow-md text-left space-y-4"
            >
              <div
                style={{
                  borderBottom: '1.5px solid #000000',
                }}
                className="flex flex-wrap items-center justify-between gap-2 pb-3"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-800 block font-bold">Booking Reference ID</span>
                  <span className="text-lg sm:text-xl font-mono font-extrabold text-black">{bookingId}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-800 block font-bold">Token Amount</span>
                  <span className="text-base sm:text-lg font-mono font-extrabold text-emerald-900">₹ 250 (Paid)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono font-bold text-black">
                <div>
                  <span className="text-slate-800 block">Destination:</span>
                  <span className="font-extrabold text-black text-sm sm:text-base">{destination}</span>
                </div>
                <div>
                  <span className="text-slate-800 block">Travel Date &amp; Day:</span>
                  <span className="font-extrabold text-black">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                </div>
                <div>
                  <span className="text-slate-800 block">Seats Reserved:</span>
                  <span className="font-extrabold text-black">{members} Passenger(s)</span>
                </div>
                <div>
                  <span className="text-slate-800 block">Primary Contact:</span>
                  <span className="font-extrabold text-black">{name} ({contactNumber})</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #000000',
                }}
                className="p-3.5 rounded-xl text-xs sm:text-sm text-black flex items-start gap-2 font-bold shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Our representative will contact you via WhatsApp/Call at <strong className="text-black">{contactNumber}</strong> within 4 hours to verify pickup coordinates and hotel check-in preferences.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="receipt-download-btn"
                onClick={() => handleDownloadReceipt('booking')}
                style={{
                  border: '1.5px solid #000000',
                }}
                className="px-6 py-3.5 min-h-[46px] text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Booking Receipt</span>
              </button>

              <button
                type="button"
                id="back-to-plan-btn"
                onClick={() => setViewState('form')}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-5 py-3.5 min-h-[46px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Edit / Book Another</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
