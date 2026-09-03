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
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl overflow-hidden mb-8 transition-all duration-300 scroll-mt-20 bg-white"
    >
      {/* Top Banner Stripe */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="px-4 sm:px-7 py-4 bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ border: '1.5px solid #000000' }}
            className="w-10 h-10 rounded-xl bg-black text-amber-300 flex items-center justify-center shrink-0 shadow-2xs"
          >
            <Armchair className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{ border: '1px solid #000000' }}
                className="text-[11px] font-mono font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-black bg-amber-200"
              >
                Limited Slots Available
              </span>
              <span className="text-xs text-slate-700 hidden sm:inline font-bold">• Live Availability</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 font-heading">
              Confirm Your Seat Now
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            style={{ border: '1px solid #000000' }}
            className="text-xs sm:text-sm text-black bg-emerald-200 font-mono font-extrabold flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-900 shrink-0" />
            100% Refundable Token ₹250
          </span>
        </div>
      </div>

      {/* VIEW 1: Form View */}
      {viewState === 'form' && (
        <div className="p-4 sm:p-7">
          <div className="max-w-4xl mx-auto">
            <div
              className="mb-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100"
            >
              <div>
                <p className="text-sm text-slate-600 font-normal">
                  Fill in your travel details below to reserve your priority travel slot and lock in today&apos;s rates for{' '}
                  <span className="font-bold text-slate-900">{destination || 'your destination'}</span>.
                </p>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium shrink-0">
                Trip Style: <span className="text-indigo-600 font-bold">{tripSummary.travelStyle}</span>
              </div>
            </div>

            <form onSubmit={handlePayAndBookSeat} className="space-y-5" id="seat-booking-form">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Destination Field */}
                <div>
                  <label
                    htmlFor="booking-destination"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Destination <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-destination"
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        if (errors.destination) setErrors({ ...errors, destination: '' });
                      }}
                      placeholder="e.g. Goa, Paris, Manali"
                      style={{ border: '1.5px solid #000000' }}
                      className={`w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm rounded-xl bg-slate-50 hover:bg-white transition-all text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs ${
                        errors.destination ? 'ring-2 ring-rose-500 bg-rose-50/50' : ''
                      }`}
                    />
                  </div>
                  {errors.destination && (
                    <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* 2. Your Name */}
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Enter your full name"
                      style={{ border: '1.5px solid #000000' }}
                      className={`w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm rounded-xl bg-slate-50 hover:bg-white transition-all text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs ${
                        errors.name ? 'ring-2 ring-rose-500 bg-rose-50/50' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 3. Contact Number */}
                <div>
                  <label
                    htmlFor="booking-contact"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Contact Number / Phone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-contact"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => {
                        setContactNumber(e.target.value);
                        if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                      }}
                      placeholder="e.g. +91 98765 43210"
                      style={{ border: '1.5px solid #000000' }}
                      className={`w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm rounded-xl bg-slate-50 hover:bg-white transition-all text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs ${
                        errors.contactNumber ? 'ring-2 ring-rose-500 bg-rose-50/50' : ''
                      }`}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* 4. Date and Day Selection */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Travel Date &amp; Day <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-date"
                      type="date"
                      value={travelDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (errors.travelDate) setErrors({ ...errors, travelDate: '' });
                      }}
                      style={{ border: '1.5px solid #000000' }}
                      className={`w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm rounded-xl bg-slate-50 hover:bg-white transition-all text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs ${
                        errors.travelDate ? 'ring-2 ring-rose-500 bg-rose-50/50' : ''
                      }`}
                    />
                  </div>
                  <div
                    style={{ border: '1.2px solid #000000' }}
                    className="mt-1.5 flex items-center justify-between text-xs text-slate-900 px-3 py-1.5 bg-slate-100/90 rounded-lg shadow-2xs"
                  >
                    <span className="font-mono font-black text-slate-950">{selectedDayInfo.day}</span>
                    <span className="font-mono font-bold text-slate-700">{selectedDayInfo.formattedDate}</span>
                  </div>
                  {errors.travelDate && (
                    <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.travelDate}
                    </p>
                  )}
                </div>

                {/* 5. Confirm Budget */}
                <div>
                  <label
                    htmlFor="booking-budget"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Confirm Budget
                  </label>
                  <div className="relative">
                    <Wallet className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-budget"
                      type="text"
                      value={confirmedBudget}
                      onChange={(e) => setConfirmedBudget(e.target.value)}
                      placeholder="e.g. ₹ 20,000"
                      style={{ border: '1.5px solid #000000' }}
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm rounded-xl bg-slate-50 hover:bg-white transition-all text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs"
                    />
                  </div>
                  <p className="mt-1 text-xs font-mono font-bold text-slate-600">
                    Est. Total for {tripSummary.duration} Days
                  </p>
                </div>

                {/* 6. Members Count */}
                <div>
                  <label
                    htmlFor="booking-members"
                    className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                  >
                    Members (Travelers) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="members-minus-btn"
                      onClick={() => setMembers((m) => Math.max(1, m - 1))}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-10 h-10 rounded-xl text-black font-black bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center active:scale-95 cursor-pointer text-lg shadow-2xs"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <Users className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
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
                        style={{ border: '1.5px solid #000000' }}
                        className="w-full pl-9 pr-3 py-2 text-center text-sm font-mono font-black text-slate-950 rounded-xl bg-slate-50 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs"
                      />
                    </div>
                    <button
                      type="button"
                      id="members-plus-btn"
                      onClick={() => setMembers((m) => Math.min(50, m + 1))}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-10 h-10 rounded-xl text-black font-black bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center active:scale-95 cursor-pointer text-lg shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-1 text-xs font-mono font-bold text-slate-600 text-center">
                    {members === 1 ? '1 Seat Booking' : `${members} Seats Reserved Together`}
                  </p>
                </div>
              </div>

              {/* Optional: Special Preferences / Notes */}
              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 mb-1.5"
                >
                  Special Notes or Requirements (Optional)
                </label>
                <input
                  id="booking-notes"
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Airport pickup needed, prefer morning departure, vegetarian food preference"
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-950 font-medium rounded-xl bg-slate-50 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs"
                />
              </div>

              {/* Inclusions & Guarantees summary badge */}
              <div
                style={{ border: '1.5px solid #000000' }}
                className="p-3.5 rounded-2xl text-xs sm:text-sm text-slate-800 flex flex-wrap items-center justify-between gap-3 bg-amber-50/60 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-slate-950 font-black">What your ₹250 seat token secures:</strong> Guaranteed departure slot, instant itinerary price lock, verified hotel coordination, and 24/7 travel concierge.
                  </span>
                </div>
                <div
                  style={{ border: '1px solid #000000' }}
                  className="text-xs font-mono font-extrabold text-black bg-emerald-200 px-3 py-1 rounded-full shrink-0 shadow-2xs"
                >
                  Fully Refundable within 24h
                </div>
              </div>

              {/* ACTION BUTTONS AREA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* BIG PRIMARY BUTTON: Paid 250₹ for book your seat */}
                <button
                  type="submit"
                  id="pay-250-book-seat-btn"
                  disabled={isProcessingPayment}
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full sm:w-auto px-7 py-3.5 min-h-[48px] text-sm sm:text-base font-mono font-extrabold text-white bg-slate-950 hover:bg-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] group"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Securing Your Seat Slot...</span>
                    </div>
                  ) : (
                    <>
                      <Armchair className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span>Paid 250₹ For Book Your Seat</span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                {/* SMALLER SECONDARY OPTION: Let give me time to think */}
                <button
                  type="button"
                  id="time-to-think-btn"
                  onClick={handleTimeThink}
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full sm:w-auto px-5 py-3.5 min-h-[48px] text-xs sm:text-sm font-mono font-bold text-slate-900 hover:text-black bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-slate-700" />
                  <span>Let give me time to think</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: "Time to Think" (Thank You Screen - Compact One-Screen Fit) */}
      {viewState === 'time_to_think' && (
        <div id="thank-you-view" className="p-5 sm:p-7 text-center animate-fade-in">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Heart / Check badge */}
            <div
              style={{ border: '1.5px solid #000000' }}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-amber-50 text-slate-900 flex items-center justify-center shadow-2xs"
            >
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900" />
            </div>

            {/* BIG THANK YOU WORDING */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-heading">
                THANK YOU
              </h1>
              <div
                style={{ border: '1.2px solid #000000' }}
                className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-950 font-mono text-xs font-bold shadow-2xs"
              >
                Inquiry Ref: {inquiryId}
              </div>
            </div>

            {/* Required user message */}
            <div
              style={{ border: '1.5px solid #000000' }}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 text-slate-900 space-y-1.5 text-left shadow-2xs"
            >
              <p className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                Thank you for visiting us! We will review your data and tell you if any seats are available for that date.
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Our trip coordinators will check live local slot availability, transportation schedules, and accommodation options for{' '}
                <strong className="text-slate-950 font-bold">{destination}</strong> and notify you promptly via your provided details.
              </p>
            </div>

            {/* Captured Inquiry Summary Recap Card */}
            <div
              style={{ border: '1.5px solid #000000' }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white text-left text-xs font-mono space-y-2 text-slate-900 shadow-2xs"
            >
              <div
                className="flex justify-between items-center pb-2 border-b border-slate-200 font-bold text-xs sm:text-sm"
              >
                <span className="text-slate-950 font-black">Inquiry Snapshot</span>
                <span
                  style={{ border: '1px solid #000000' }}
                  className="text-xs font-bold text-slate-950 bg-amber-200 px-2.5 py-0.5 rounded-full"
                >
                  Status: Pending Review
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-xs">
                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Destination:</span>
                  <span className="font-bold text-slate-950 truncate block">{destination || tripSummary.destination}</span>
                </div>
                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Date &amp; Day:</span>
                  <span className="font-bold text-slate-950 truncate block">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                </div>
                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Travelers:</span>
                  <span className="font-bold text-slate-950">{members} Person(s)</span>
                </div>
                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Estimated Budget:</span>
                  <span className="font-bold text-slate-950">{confirmedBudget}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                id="inquiry-download-btn"
                onClick={() => handleDownloadReceipt('inquiry')}
                style={{ border: '1.5px solid #000000' }}
                className="px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-900" />
                <span>Download Inquiry Slip</span>
              </button>

              <button
                type="button"
                id="open-screen-thankyou-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{ border: '1.5px solid #000000' }}
                className="px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>View On Screen</span>
              </button>

              <button
                type="button"
                id="inquiry-change-btn"
                onClick={() => setViewState('form')}
                style={{ border: '1.5px solid #000000' }}
                className="px-5 py-2.5 min-h-[40px] text-xs sm:text-sm font-extrabold text-white bg-slate-950 hover:bg-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span>Ready to Book? Back to Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: "Paid 250₹" Confirmation Screen - BIG CONGRATULATIONS (Compact One-Screen Fit) */}
      {viewState === 'paid_confirmed' && (
        <div id="booking-confirmed-view" className="p-5 sm:p-7 text-center animate-fade-in">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Celebration Icon & Ribbons */}
            <div className="relative inline-block">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-950 flex items-center justify-center shadow-xs animate-bounce-slow"
              >
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-900" />
              </div>
              <span
                style={{ border: '1px solid #000000' }}
                className="absolute -bottom-1 -right-2 px-2.5 py-0.5 bg-amber-200 text-slate-950 font-mono font-black text-[10px] sm:text-xs rounded-full shadow-2xs"
              >
                ★ 100% VERIFIED
              </span>
            </div>

            {/* Congratulations Banner */}
            <div className="space-y-1">
              <div
                style={{ border: '1.2px solid #000000' }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-mono text-xs font-extrabold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                <span>OFFICIAL BOOKING CONFIRMED • ADVANCE ₹250 PAID</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 font-heading">
                🎉 CONGRATULATIONS! 🎉
              </h1>
              
              <p className="text-sm sm:text-base font-bold text-slate-900 max-w-xl mx-auto">
                {name || 'Valued Traveler'}, your seat for <span className="underline decoration-black decoration-2">{destination}</span> is locked in!
              </p>
            </div>

            {/* Boarding Pass / Ticket Voucher Card */}
            <div
              style={{ border: '1.5px solid #000000' }}
              className="rounded-2xl p-4 sm:p-5 bg-white text-left space-y-3 shadow-xs"
            >
              {/* Top Bar with Brand & Booking ID */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-dashed border-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    style={{ border: '1.2px solid #000000' }}
                    className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs"
                  >
                    TH
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block leading-none">Pass ID</span>
                    <span className="text-base sm:text-lg font-mono font-black text-slate-950 tracking-wide">{bookingId}</span>
                  </div>
                </div>
                
                <div
                  style={{ border: '1.2px solid #000000' }}
                  className="text-right bg-emerald-100 px-3 py-1 rounded-xl shadow-2xs"
                >
                  <span className="text-[10px] font-mono uppercase text-emerald-950 font-bold block leading-none">Token Status</span>
                  <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-950">₹ 250 Paid (Secured)</span>
                </div>
              </div>

              {/* Grid with Trip Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Destination</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-900 shrink-0" />
                    <span className="truncate">{destination}</span>
                  </p>
                </div>

                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Date &amp; Day</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 flex items-center gap-1 truncate">
                    <Calendar className="w-3 h-3 text-slate-900 shrink-0" />
                    <span className="truncate">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                  </p>
                </div>

                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Passengers</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-900 shrink-0" />
                    <span>{members} Seat(s)</span>
                  </p>
                </div>

                <div style={{ border: '1.2px solid #000000' }} className="p-2.5 rounded-xl bg-slate-50 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Contact</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                    {name || 'Traveler'} ({contactNumber || 'Saved'})
                  </p>
                </div>
              </div>

              {/* WhatsApp & Concierge Guarantee Notice */}
              <div
                style={{ border: '1.2px solid #000000' }}
                className="p-2.5 rounded-xl bg-emerald-50 text-xs text-emerald-950 flex items-center gap-2 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <p className="text-xs text-emerald-950 font-medium">
                  Lead coordinator will WhatsApp <span className="font-bold text-black">{contactNumber}</span> within 4 hours with hotel vouchers and driver details.
                </p>
              </div>
            </div>

            {/* High Priority Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                id="receipt-download-btn"
                onClick={() => handleDownloadReceipt('booking')}
                style={{ border: '1.5px solid #000000' }}
                className="px-5 py-2.5 min-h-[42px] text-xs sm:text-sm font-extrabold text-white bg-slate-950 hover:bg-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download Ticket &amp; Receipt</span>
              </button>

              <button
                type="button"
                id="open-screen-ticket-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{ border: '1.5px solid #000000' }}
                className="px-4 py-2.5 min-h-[42px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>View On Screen</span>
              </button>

              <button
                type="button"
                id="back-to-plan-btn"
                onClick={() => setViewState('form')}
                style={{ border: '1.5px solid #000000' }}
                className="px-4 py-2.5 min-h-[42px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-4 h-4 text-slate-700" />
                <span>Book Another / Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT ON-SCREEN MODAL / POPUP: Compact One-Screen Fit without Scrolling */}
      {isDirectModalOpen && (
        <div
          id="direct-ticket-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDirectModalOpen(false);
            }
          }}
        >
          <div
            id="direct-ticket-modal-content"
            style={{ border: '2px solid #000000' }}
            className="relative w-full max-w-xl sm:max-w-2xl rounded-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col bg-white shadow-2xl text-slate-900"
            role="dialog"
            aria-modal="true"
            aria-label={viewState === 'paid_confirmed' ? 'Congratulations Booking Ticket' : 'Thank You Inquiry'}
          >
            {/* Modal Header Bar - Compact */}
            <div className="px-4 py-3 sm:px-6 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div
                  style={{ border: '1.2px solid #000000' }}
                  className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-bold text-xs"
                >
                  TH
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block leading-none">
                    Tripholic Travel Pass
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {viewState === 'paid_confirmed' ? 'Official Booking Confirmation' : 'Inquiry Slip'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="direct-modal-close-btn"
                  onClick={() => setIsDirectModalOpen(false)}
                  style={{ border: '1.2px solid #000000' }}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 flex items-center justify-center transition-all cursor-pointer"
                  title="Close Screen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal One-Screen Body (No Scroll required) */}
            <div className="p-4 sm:p-5 space-y-3 overflow-hidden">
              {viewState === 'paid_confirmed' ? (
                /* CONGRATULATIONS ON-SCREEN CONTENT */
                <div className="space-y-3 text-center">
                  {/* Top Celebration Header */}
                  <div className="space-y-0.5">
                    <div
                      style={{ border: '1.2px solid #000000' }}
                      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-mono text-[10px] sm:text-xs font-bold"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-800" />
                      <span>OFFICIAL CONFIRMATION • ₹250 ADVANCE PAID</span>
                      <Sparkles className="w-3 h-3 text-emerald-800" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-heading">
                      🎉 CONGRATULATIONS! 🎉
                    </h2>

                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {name || 'Valued Traveler'}, your seat for <span className="underline decoration-black decoration-2">{destination}</span> is reserved!
                    </p>
                  </div>

                  {/* Compact Boarding Pass Ticket */}
                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="rounded-2xl p-3.5 sm:p-4 text-left space-y-2.5 bg-slate-50 shadow-2xs"
                  >
                    {/* Ticket Header Bar */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-slate-300">
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="text-[9px] font-mono uppercase text-slate-500 block leading-none font-bold">Booking ID</span>
                          <span className="text-sm sm:text-base font-mono font-bold text-slate-950 tracking-wide">{bookingId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBookingCode}
                          style={{ border: '1px solid #000000' }}
                          className="text-[10px] px-2 py-0.5 bg-white hover:bg-slate-100 rounded font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer text-slate-900"
                          title="Copy code"
                        >
                          {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div
                        style={{ border: '1px solid #000000' }}
                        className="bg-emerald-100 px-2.5 py-1 rounded-lg text-right"
                      >
                        <span className="text-[9px] font-mono uppercase text-emerald-950 font-bold block leading-none">Token Status</span>
                        <span className="text-xs font-mono font-bold text-emerald-950">₹ 250 Paid (Locked)</span>
                      </div>
                    </div>

                    {/* Trip Details 4-Column Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-xl bg-white shadow-2xs">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Destination</span>
                        <p className="text-xs font-bold text-slate-950 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-900 shrink-0" />
                          <span className="truncate">{destination}</span>
                        </p>
                      </div>

                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-xl bg-white shadow-2xs">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Travel Date</span>
                        <p className="text-xs font-bold text-slate-950 flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 text-slate-900 shrink-0" />
                          <span className="truncate">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                        </p>
                      </div>

                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-xl bg-white shadow-2xs">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Seats</span>
                        <p className="text-xs font-bold text-slate-950 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-900 shrink-0" />
                          <span>{members} Reserved</span>
                        </p>
                      </div>

                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-xl bg-white shadow-2xs">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Contact</span>
                        <p className="text-xs font-bold text-slate-950 truncate">
                          {name} ({contactNumber})
                        </p>
                      </div>
                    </div>

                    {/* Budget & Barcode Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                        <span className="font-bold">PASS CODE:</span>
                        <span className="tracking-widest text-slate-900 select-none font-black">|||| ||| |||| || |||</span>
                      </div>
                      <div
                        style={{ border: '1px solid #000000' }}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded shadow-2xs"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>100% Guaranteed Slot • ₹{confirmedBudget} Est.</span>
                      </div>
                    </div>

                    {/* WhatsApp Notice - Single line */}
                    <div
                      style={{ border: '1px solid #000000' }}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-950 text-[11px] font-medium flex items-center gap-2 shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <p className="truncate text-slate-800">
                        Lead coordinator will WhatsApp <strong className="text-slate-950">{contactNumber}</strong> within 4 hours with hotel vouchers and driver info.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* THANK YOU ON-SCREEN CONTENT */
                <div className="space-y-3 text-center">
                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-slate-900 flex items-center justify-center shadow-2xs"
                  >
                    <Sparkles className="w-5 h-5 text-slate-900" />
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-heading">
                      THANK YOU
                    </h2>
                    <div
                      style={{ border: '1.2px solid #000000' }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-mono text-[10px] sm:text-xs font-bold"
                    >
                      <span>Inquiry Ref: {inquiryId}</span>
                      <button
                        type="button"
                        onClick={handleCopyBookingCode}
                        className="text-[10px] font-mono hover:text-indigo-600 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-600 inline" /> : <Copy className="w-2.5 h-2.5 inline" />}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-50 text-slate-900 space-y-1 text-left shadow-2xs"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-950 leading-snug">
                      Thank you for visiting us! We will review your data and tell you if any seats are available for that date.
                    </p>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      Our trip coordinators will check live local slot availability, transportation schedules, and accommodation options for{' '}
                      <strong className="text-slate-950 font-bold">{destination}</strong> and notify you promptly via your provided details.
                    </p>
                  </div>

                  {/* Inquiry details summary */}
                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="p-2.5 rounded-xl bg-white text-left text-[11px] font-mono space-y-1 text-slate-900 shadow-2xs"
                  >
                    <div className="flex justify-between items-center pb-1 border-b border-slate-200 font-bold">
                      <span className="text-slate-950 font-black">Inquiry Summary</span>
                      <span
                        style={{ border: '1px solid #000000' }}
                        className="text-slate-950 bg-amber-200 px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        Status: Under Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 font-medium">
                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Destination:</span>
                        <span className="font-bold text-slate-950 truncate block">{destination || tripSummary.destination}</span>
                      </div>
                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Date:</span>
                        <span className="font-bold text-slate-950 truncate block">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                      </div>
                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Travelers:</span>
                        <span className="font-bold text-slate-950">{members} Person(s)</span>
                      </div>
                      <div style={{ border: '1.2px solid #000000' }} className="p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Budget:</span>
                        <span className="font-bold text-slate-950">{confirmedBudget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions - Compact */}
            <div className="px-4 py-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="direct-modal-download-btn"
                  onClick={() => handleDownloadReceipt(viewState === 'paid_confirmed' ? 'booking' : 'inquiry')}
                  style={{ border: '1.5px solid #000000' }}
                  className="px-3.5 py-1.5 min-h-[36px] text-xs sm:text-sm font-extrabold text-white bg-slate-950 hover:bg-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download {viewState === 'paid_confirmed' ? 'Ticket' : 'Slip'}</span>
                </button>

                {viewState === 'paid_confirmed' && (
                  <button
                    type="button"
                    id="direct-modal-print-btn"
                    onClick={handlePrint}
                    style={{ border: '1.5px solid #000000' }}
                    className="px-3 py-1.5 min-h-[36px] text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Print ticket voucher"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
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
                    style={{ border: '1.5px solid #000000' }}
                    className="px-3.5 py-1.5 min-h-[36px] text-xs sm:text-sm font-extrabold text-white bg-slate-950 hover:bg-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Armchair className="w-3.5 h-3.5" />
                    <span>Ready to Book ₹250</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="modal-close-explore-btn"
                    onClick={() => setIsDirectModalOpen(false)}
                    style={{ border: '1.5px solid #000000' }}
                    className="px-3.5 py-1.5 min-h-[36px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs"
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

