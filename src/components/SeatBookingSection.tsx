import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  X,
  Printer,
  QrCode,
  Share2,
  Copy,
  ExternalLink
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
  const [isDirectModalOpen, setIsDirectModalOpen] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Generated Reference IDs
  const [bookingId, setBookingId] = useState<string>('');
  const [inquiryId, setInquiryId] = useState<string>('');

  // Sync destination if plan changes
  useEffect(() => {
    if (tripSummary.destination) {
      setDestination(tripSummary.destination);
    }
  }, [tripSummary.destination]);

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

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDirectModalOpen) {
        setIsDirectModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirectModalOpen]);

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

  // Handler for Paid ₹250 Option -> Opens Direct On-Screen Congratulations Modal
  const handlePayAndBookSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const destCode = (destination.trim().slice(0, 3) || 'TRP').toUpperCase();
      const code = `BK-${randomCode}-${destCode}`;
      setBookingId(code);
      setIsProcessingPayment(false);
      setViewState('paid_confirmed');
      setIsDirectModalOpen(true); // Opens direct on-screen popup!
    }, 850);
  };

  // Handler for "Let give me time to think" Option -> Opens Direct On-Screen Thank You Modal
  const handleTimeThink = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const destCode = (destination.trim().slice(0, 3) || 'INQ').toUpperCase();
    const code = `INQ-${randomCode}-${destCode}`;
    setInquiryId(code);
    setViewState('time_to_think');
    setIsDirectModalOpen(true); // Opens direct on-screen popup!
  };

  const handleCopyBookingCode = () => {
    const code = viewState === 'paid_confirmed' ? bookingId : inquiryId;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Download booking or inquiry voucher as text file
  const handleDownloadReceipt = (type: 'booking' | 'inquiry') => {
    const isBooking = type === 'booking';
    const content = `
======================================================
     TRIPHOLIC - TRAVEL SEAT ${isBooking ? 'CONFIRMATION TICKET & RECEIPT' : 'INQUIRY SLIP'}
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
Contact Number   : ${contactNumber || 'Provided in app'}

PAYMENT SUMMARY:
------------------------------------------------------
Seat Token Fee   : ${isBooking ? '₹250 (Paid Successfully)' : '₹0.00 (Inquiry Only)'}
Balance Payment  : ${isBooking ? 'To be adjusted in final itinerary billing' : 'Payable upon confirmation'}
Guarantee        : 100% Refundable within 24 hours

${isBooking 
  ? 'Note: Your seats and priority guide allocation are reserved for the specified date. Tripholic concierge will reach out to you shortly.' 
  : 'Thank you for visiting us! We will review your data and tell you if any seats are available for that date.'}
======================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isBooking ? 'Tripholic-Ticket-Receipt' : 'Tripholic-Inquiry-Slip'}-${destination.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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
                id="open-screen-thankyou-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-5 py-3 min-h-[44px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-violet-700" />
                <span>View On Screen</span>
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

      {/* VIEW 3: "Paid 250₹" Confirmation Screen - BIG CONGRATULATIONS */}
      {viewState === 'paid_confirmed' && (
        <div id="booking-confirmed-view" className="p-6 sm:p-12 text-center backdrop-blur-md animate-fade-in">
          <div className="max-w-3xl mx-auto space-y-7">
            {/* Massive Celebration Icon & Ribbons */}
            <div className="relative inline-block">
              <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center border-2 border-black shadow-2xl animate-bounce-slow">
                <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16 text-white drop-shadow-md" />
              </div>
              <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-amber-400 text-black font-mono font-black text-xs sm:text-sm rounded-full border border-black shadow-md">
                ★ 100% VERIFIED
              </span>
            </div>

            {/* Huge Congratulations Banner */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-950 border-2 border-black font-mono text-sm sm:text-base font-black shadow-md animate-pulse">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>OFFICIAL BOOKING CONFIRMED • ADVANCE ₹250 PAID</span>
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 font-heading leading-tight">
                🎉 CONGRATULATIONS! 🎉
              </h1>
              
              <p className="text-lg sm:text-2xl font-black text-violet-950 max-w-2xl mx-auto leading-snug">
                {name || 'Valued Traveler'}, your seat for <span className="underline decoration-violet-500 decoration-4">{destination}</span> is locked in!
              </p>
              <p className="text-sm sm:text-base text-slate-800 font-bold max-w-xl mx-auto">
                Your travel itinerary and VIP seat reservation are now officially confirmed in the Tripholic system.
              </p>
            </div>

            {/* Luxury Boarding Pass / Ticket Voucher Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                border: '2px solid #000000',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              }}
              className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl text-left space-y-6 relative overflow-hidden"
            >
              {/* Top Bar with Brand & Booking ID */}
              <div
                style={{
                  borderBottom: '2px dashed #000000',
                }}
                className="flex flex-wrap items-center justify-between gap-3 pb-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black text-base border border-black shadow-xs">
                    TH
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold uppercase text-slate-600 block">Tripholic Travel Pass</span>
                    <span className="text-lg sm:text-2xl font-mono font-black text-black tracking-wider">{bookingId}</span>
                  </div>
                </div>
                
                <div className="text-right bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-300">
                  <span className="text-[11px] font-mono uppercase text-emerald-800 font-bold block">Token Status</span>
                  <span className="text-base sm:text-xl font-mono font-black text-emerald-900">₹ 250 Paid (Secured)</span>
                </div>
              </div>

              {/* Grid with Trip Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-black/10">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-600">Destination</span>
                  <p className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-violet-700 shrink-0" />
                    <span className="truncate">{destination}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-600">Travel Date &amp; Day</span>
                  <p className="text-sm sm:text-base font-black text-black flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-violet-700 shrink-0" />
                    <span>{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-600">Passengers</span>
                  <p className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-violet-700 shrink-0" />
                    <span>{members} Reserved Seat(s)</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-600">Primary Contact</span>
                  <p className="text-sm sm:text-base font-black text-black truncate">
                    {name} ({contactNumber})
                  </p>
                </div>
              </div>

              {/* WhatsApp & Concierge Guarantee Notice */}
              <div
                style={{
                  background: 'rgba(236, 253, 245, 0.95)',
                  border: '1.5px solid #059669',
                }}
                className="p-4 rounded-2xl text-xs sm:text-sm text-emerald-950 flex items-start gap-3 font-bold shadow-xs"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-950 text-sm">
                    Trip Concierge WhatsApp Notification Active
                  </p>
                  <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                    Our lead travel coordinator will contact <span className="underline font-bold text-black">{contactNumber}</span> within 4 hours to confirm pickup coordination, hotel vouchers, and dietary requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* High Priority Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                id="receipt-download-btn"
                onClick={() => handleDownloadReceipt('booking')}
                style={{
                  border: '2px solid #000000',
                }}
                className="px-8 py-4 min-h-[52px] text-sm sm:text-base font-black text-white bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 hover:from-violet-800 hover:to-indigo-800 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer shadow-xl hover:scale-105"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <span>Download Official Ticket &amp; Receipt</span>
              </button>

              <button
                type="button"
                id="open-screen-ticket-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #000000',
                }}
                className="px-6 py-4 min-h-[52px] text-sm sm:text-base font-black text-black hover:bg-black hover:text-white rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-violet-700" />
                <span>View Ticket On Screen</span>
              </button>

              <button
                type="button"
                id="back-to-plan-btn"
                onClick={() => setViewState('form')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #000000',
                }}
                className="px-6 py-4 min-h-[52px] text-sm sm:text-base font-black text-black hover:bg-black hover:text-white rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Book Another Seat / Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT ON-SCREEN MODAL / POPUP: Instant View without Scrolling */}
      {isDirectModalOpen && (
        <div
          id="direct-ticket-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDirectModalOpen(false);
            }
          }}
        >
          <div
            id="direct-ticket-modal-content"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
              border: '3px solid #000000',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0,0,0,0.3)',
            }}
            className="relative w-full max-w-3xl rounded-[32px] overflow-hidden my-auto max-h-[92vh] flex flex-col shadow-2xl animate-scale-up text-slate-950"
            role="dialog"
            aria-modal="true"
            aria-label={viewState === 'paid_confirmed' ? 'Congratulations Booking Ticket' : 'Thank You Inquiry'}
          >
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white flex items-center justify-between border-b-2 border-black shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-amber-300 font-black text-sm border border-white/20">
                  TH
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">
                    Tripholic Travel Pass
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {viewState === 'paid_confirmed' ? 'Official Booking Confirmation' : 'Inquiry Slip'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="direct-modal-close-btn"
                  onClick={() => setIsDirectModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer font-bold"
                  title="Close Screen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
              {viewState === 'paid_confirmed' ? (
                /* CONGRATULATIONS ON-SCREEN CONTENT */
                <div className="space-y-6 text-center">
                  {/* Top Celebration Header */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 border-2 border-black font-mono text-xs sm:text-sm font-black shadow-sm">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>OFFICIAL CONFIRMATION • ₹250 ADVANCE PAID</span>
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 font-heading">
                      🎉 CONGRATULATIONS! 🎉
                    </h2>

                    <p className="text-base sm:text-xl font-black text-violet-950">
                      {name || 'Valued Traveler'}, your seat for <span className="underline decoration-violet-500 decoration-3">{destination}</span> is reserved!
                    </p>
                  </div>

                  {/* High-Fidelity Boarding Pass Ticket */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '2.5px solid #000000',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    }}
                    className="rounded-3xl p-5 sm:p-7 text-left space-y-5 relative overflow-hidden"
                  >
                    {/* Ticket Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-slate-300">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Booking Reference</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-mono font-black text-black tracking-wider">{bookingId}</span>
                          <button
                            type="button"
                            onClick={handleCopyBookingCode}
                            className="text-xs px-2 py-1 bg-slate-100 hover:bg-black hover:text-white rounded-lg border border-black font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 text-right">
                        <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Token Status</span>
                        <span className="text-sm sm:text-base font-mono font-black text-emerald-900">₹ 250 Paid (Locked)</span>
                      </div>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-black/10">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Destination</span>
                        <p className="text-base font-black text-black flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-violet-700 shrink-0" />
                          <span className="truncate">{destination}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Travel Date</span>
                        <p className="text-sm font-black text-black flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-violet-700 shrink-0" />
                          <span>{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Passengers</span>
                        <p className="text-base font-black text-black flex items-center gap-1">
                          <Users className="w-4 h-4 text-violet-700 shrink-0" />
                          <span>{members} Reserved Seat(s)</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Primary Contact</span>
                        <p className="text-sm font-black text-black truncate">
                          {name} ({contactNumber})
                        </p>
                      </div>
                    </div>

                    {/* Special Preferences & Budget Info */}
                    {(specialRequest || confirmedBudget) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200">
                          <span className="text-slate-500 font-bold block">Estimated Budget:</span>
                          <span className="text-black font-extrabold text-sm">{confirmedBudget}</span>
                        </div>
                        {specialRequest && (
                          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200">
                            <span className="text-slate-500 font-bold block">Special Request:</span>
                            <span className="text-black font-bold text-xs truncate block">{specialRequest}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Barcode & Security Stamp */}
                    <div className="pt-3 border-t-2 border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-slate-500 tracking-widest">VALIDATED BOARDING PASS TICKET</div>
                        <div className="flex items-center gap-1 font-mono text-sm tracking-widest text-slate-800 select-none">
                          ||| | |||| | || ||||| ||| || |||| ||| ||||
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>100% Guaranteed Slot</span>
                      </div>
                    </div>

                    {/* WhatsApp Notice */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium space-y-1">
                      <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Trip Concierge WhatsApp Notification Active</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Our lead travel coordinator will contact <span className="underline font-bold text-black">{contactNumber}</span> within 4 hours to coordinate pickup, hotel vouchers, and special requests.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* THANK YOU ON-SCREEN CONTENT */
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-violet-700 to-indigo-700 text-white flex items-center justify-center border-2 border-black shadow-md">
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 font-heading">
                      THANK YOU
                    </h2>
                    <div className="inline-block px-4 py-1 rounded-full bg-slate-100 border border-black text-black font-mono text-xs font-extrabold">
                      Inquiry Ref: {inquiryId}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border-2 border-black text-slate-950 space-y-2 text-left">
                    <p className="text-base sm:text-lg font-extrabold text-black leading-relaxed">
                      Thank you for visiting us! We will review your data and tell you if any seats are available for that date.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                      Our trip coordinators will check live local slot availability, transportation schedules, and accommodation options for{' '}
                      <strong className="text-black font-extrabold">{destination}</strong> and notify you promptly via your provided details.
                    </p>
                  </div>

                  {/* Inquiry details summary */}
                  <div className="p-4 rounded-2xl bg-white border border-black/15 text-left text-xs font-mono space-y-2 text-black shadow-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-black/10 font-extrabold">
                      <span>Inquiry Summary</span>
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Status: Pending Review
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold">
                      <div>
                        <span className="text-slate-500">Destination:</span>{' '}
                        <span className="font-extrabold text-black">{destination || tripSummary.destination}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Date:</span>{' '}
                        <span className="font-extrabold text-black">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Travelers:</span>{' '}
                        <span className="font-extrabold text-black">{members} Person(s)</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Budget:</span>{' '}
                        <span className="font-extrabold text-black">{confirmedBudget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="direct-modal-download-btn"
                  onClick={() => handleDownloadReceipt(viewState === 'paid_confirmed' ? 'booking' : 'inquiry')}
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download {viewState === 'paid_confirmed' ? 'Ticket & Receipt' : 'Inquiry Slip'}</span>
                </button>

                {viewState === 'paid_confirmed' && (
                  <button
                    type="button"
                    id="direct-modal-print-btn"
                    onClick={handlePrint}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Print ticket voucher"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {viewState === 'time_to_think' ? (
                  <button
                    type="button"
                    id="modal-ready-to-book-btn"
                    onClick={() => {
                      setIsDirectModalOpen(false);
                      setViewState('form');
                    }}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Armchair className="w-4 h-4" />
                    <span>Ready to Book ₹250</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="modal-close-explore-btn"
                    onClick={() => setIsDirectModalOpen(false)}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-black hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Close &amp; View Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

