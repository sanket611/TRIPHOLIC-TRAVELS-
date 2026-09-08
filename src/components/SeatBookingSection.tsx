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

export interface BookingOptionItem {
  id: string;
  label: string;
  icon: string;
  desc: string;
  activeColor: string;
  badge: string;
}

export const BOOKING_OPTIONS: BookingOptionItem[] = [
  { id: 'window_seat', label: 'Window / Front Seat', icon: '🪟', desc: 'Preferred seating arrangement', activeColor: 'bg-sky-100 text-sky-950 border-sky-600', badge: 'Popular' },
  { id: 'veg_meals', label: 'Pure Veg / Dietary Food', icon: '🥗', desc: '100% vegetarian / custom dining', activeColor: 'bg-emerald-100 text-emerald-950 border-emerald-600', badge: 'Fresh & Clean' },
  { id: 'pickup_drop', label: 'Cab Pickup & Drop', icon: '🚗', desc: 'Private airport / station taxi transfer', activeColor: 'bg-amber-100 text-amber-950 border-amber-600', badge: 'Hassle-Free' },
  { id: 'morning_slot', label: 'Morning Departure', icon: '🌅', desc: 'Early start for full-day sightseeing', activeColor: 'bg-orange-100 text-orange-950 border-orange-600', badge: 'Full Day' },
  { id: 'flexible_shield', label: 'Reschedule Guarantee', icon: '🛡️', desc: 'Zero cancellation fee date swap', activeColor: 'bg-purple-100 text-purple-950 border-purple-600', badge: 'Safe' },
  { id: 'tour_guide', label: 'Dedicated Tour Host', icon: '🎙️', desc: 'Certified local English & Hindi guide', activeColor: 'bg-teal-100 text-teal-950 border-teal-600', badge: 'Guided' },
  { id: 'bed_type', label: 'Twin / King Bed Choice', icon: '🏨', desc: 'Custom hotel room bedding setup', activeColor: 'bg-indigo-100 text-indigo-950 border-indigo-600', badge: 'Comfort' },
  { id: 'concierge_wa', label: '24/7 WhatsApp Concierge', icon: '📱', desc: 'Live travel coordinator assistance', activeColor: 'bg-green-100 text-green-950 border-green-600', badge: '24/7 Live' },
];

interface SeatBookingSectionProps {
  plan: TripPlan;
}

export const SeatBookingSection: React.FC<SeatBookingSectionProps> = ({ plan }) => {
  const { tripSummary, budget } = plan;

  // Form State initialized to blank on website open, giving user their own mind to select what they want
  const [destination, setDestination] = useState<string>(tripSummary.destination || '');
  const [name, setName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>(tripSummary.startDate || '');
  const [confirmedBudget, setConfirmedBudget] = useState<string>(
    tripSummary.budgetFormatted || (budget?.userBudget ? `₹ ${budget.userBudget}` : '')
  );
  const [members, setMembers] = useState<number | string>(tripSummary.travelers ? tripSummary.travelers : '');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // Multiple selection booking options: starts blank / unselected on open
  const [selectedBookingOptions, setSelectedBookingOptions] = useState<string[]>([]);

  // Clear any older drafts from session on mount to guarantee fresh blank state
  useEffect(() => {
    try {
      sessionStorage.removeItem('tripholic_booking_think_draft');
    } catch {}
  }, []);

  const handleToggleBookingOption = (id: string) => {
    setSelectedBookingOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetBookingFields = () => {
    setDestination('');
    setName('');
    setContactNumber('');
    setTravelDate('');
    setConfirmedBudget('');
    setMembers('');
    setSpecialRequest('');
    setSelectedBookingOptions([]);
    setErrors({});
  };

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

    const membersNum = Number(members);
    if (!members || isNaN(membersNum) || membersNum < 1) {
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

    // Save preferences to sessionStorage (active browser session only - wiped when user exits & returns fresh)
    try {
      sessionStorage.setItem(
        'tripholic_booking_think_draft',
        JSON.stringify({
          destination,
          name,
          contactNumber,
          travelDate,
          confirmedBudget,
          members,
          specialRequest,
          selectedBookingOptions,
          inquiryId: code,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      );
    } catch {}

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
    const selectedOptionsSummary = selectedBookingOptions.length > 0
      ? selectedBookingOptions
          .map((id) => {
            const opt = BOOKING_OPTIONS.find((o) => o.id === id);
            return opt ? `  - [✓] ${opt.icon} ${opt.label} (${opt.desc})` : `  - [✓] ${id}`;
          })
          .join('\n')
      : '  - None custom-selected (Standard seat & service)';

    const content = `
======================================================
     TRIPHOLIC - TRAVEL SEAT ${isBooking ? 'CONFIRMATION TICKET & RECEIPT' : 'INQUIRY SLIP'}
======================================================
Reference ID     : ${isBooking ? bookingId : inquiryId}
Status           : ${isBooking ? 'PAID & CONFIRMED (₹250 ADVANCE TOKEN)' : 'UNDER REVIEW (AVAILABILITY CHECK)'}
Generated Date   : ${new Date().toLocaleString()}

TRIP DETAILS:
------------------------------------------------------
Destination      : ${destination || 'Flexible / Inquired'}
Travel Date      : ${selectedDayInfo.day}, ${selectedDayInfo.formattedDate}
Members/Travelers: ${members || 1} Person(s)
Confirmed Budget : ${confirmedBudget || 'Standard'}
Special Request  : ${specialRequest || 'None'}

BOOKING PREFERENCES & ADD-ONS (SELECTED):
------------------------------------------------------
${selectedOptionsSummary}

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
  : 'Thank you for visiting us! Take all the time you need to think. When you exit and visit again, you will be given fresh blank options so you can choose freely with your own mind.'}
======================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isBooking ? 'Tripholic-Ticket-Receipt' : 'Tripholic-Inquiry-Slip'}-${(destination || 'Inquiry').replace(/\s+/g, '-')}.txt`;
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
      {/* Top Banner Stripe - Compact */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="px-4 sm:px-6 py-3 bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            style={{ border: '1.5px solid #000000' }}
            className="w-9 h-9 rounded-xl bg-black text-amber-300 flex items-center justify-center shrink-0 shadow-2xs"
          >
            <Armchair className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{ border: '1px solid #000000' }}
                className="text-[10px] font-mono font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full text-black bg-amber-200"
              >
                Limited Slots Available
              </span>
              <span className="text-xs text-slate-700 hidden sm:inline font-bold">• Live Availability</span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 font-heading">
              Confirm Your Seat Now
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            style={{ border: '1px solid #000000' }}
            className="text-xs text-black bg-emerald-200 font-mono font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-900 shrink-0" />
            100% Refundable Token ₹250
          </span>
        </div>
      </div>

      {/* VIEW 1: Form View - Compact Single Screen Fit without Scrolling, Less Blank Data */}
      {viewState === 'form' && (
        <div className="p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            {/* Form Top Context Bar - Compact with Clear/Reset Option */}
            <div className="mb-2.5 pb-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  style={{ border: '1px solid #000000' }}
                  className="text-[10px] font-mono font-black uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-100 text-slate-900"
                >
                  Custom Preferences
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  Priority slot reservation for <strong className="text-slate-950 font-black">{destination || 'your destination'}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="reset-booking-btn"
                  onClick={handleResetBookingFields}
                  style={{ border: '1.2px solid #000000' }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  title="Clear all booking input columns to blank"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Blank</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePayAndBookSeat} autoComplete="off" className="space-y-3" id="seat-booking-form">
              {/* Form Grid: 3 columns, 2 clean rows with vibrant colorful cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* 1. Destination Field - Rose Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-50/70 to-orange-50/50 border border-rose-200 shadow-2xs">
                  <label
                    htmlFor="booking-destination"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-rose-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-rose-200 text-rose-800 flex items-center justify-center text-[10px]">📍</span>
                      <span>Destination</span>
                    </span>
                    <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className={`w-full pl-8 pr-2.5 py-1.5 min-h-[36px] text-xs sm:text-sm rounded-xl bg-white hover:bg-rose-50/30 transition-all text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white shadow-2xs ${
                        errors.destination ? 'ring-2 ring-rose-500 bg-rose-50/80' : ''
                      }`}
                    />
                  </div>
                  {errors.destination && (
                    <p className="mt-1 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* 2. Your Name - Indigo Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-200 shadow-2xs">
                  <label
                    htmlFor="booking-name"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-indigo-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-indigo-200 text-indigo-800 flex items-center justify-center text-[10px]">👤</span>
                      <span>Your Full Name</span>
                    </span>
                    <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className={`w-full pl-8 pr-2.5 py-1.5 min-h-[36px] text-xs sm:text-sm rounded-xl bg-white hover:bg-indigo-50/30 transition-all text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-2xs ${
                        errors.name ? 'ring-2 ring-rose-500 bg-rose-50/80' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 3. Contact Number - Emerald Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200 shadow-2xs">
                  <label
                    htmlFor="booking-contact"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-emerald-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">📱</span>
                      <span>Contact Number</span>
                    </span>
                    <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className={`w-full pl-8 pr-2.5 py-1.5 min-h-[36px] text-xs sm:text-sm rounded-xl bg-white hover:bg-emerald-50/30 transition-all text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white shadow-2xs ${
                        errors.contactNumber ? 'ring-2 ring-rose-500 bg-rose-50/80' : ''
                      }`}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* 4. Date and Day Selection - Sky Blue Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-50/70 to-cyan-50/50 border border-sky-200 shadow-2xs">
                  <label
                    htmlFor="booking-date"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-sky-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-sky-200 text-sky-800 flex items-center justify-center text-[10px]">🗓️</span>
                      <span>Travel Date &amp; Day</span>
                    </span>
                    <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className={`w-full pl-8 pr-2.5 py-1.5 min-h-[36px] text-xs sm:text-sm rounded-xl bg-white hover:bg-sky-50/30 transition-all text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white shadow-2xs ${
                        errors.travelDate ? 'ring-2 ring-rose-500 bg-rose-50/80' : ''
                      }`}
                    />
                  </div>
                  <div
                    style={{ border: '1px solid #bae6fd' }}
                    className="mt-1 flex items-center justify-between text-[10px] text-sky-950 px-2 py-0.5 bg-gradient-to-r from-sky-100 to-blue-100 rounded-md shadow-2xs"
                  >
                    <span className="font-mono font-black text-sky-950">{selectedDayInfo.day}</span>
                    <span className="font-mono font-bold text-sky-800">{selectedDayInfo.formattedDate}</span>
                  </div>
                  {errors.travelDate && (
                    <p className="mt-1 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.travelDate}
                    </p>
                  )}
                </div>

                {/* 5. Confirm Budget - Warm Amber Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-50/70 to-yellow-50/50 border border-amber-200 shadow-2xs">
                  <label
                    htmlFor="booking-budget"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-amber-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-amber-200 text-amber-800 flex items-center justify-center text-[10px]">💰</span>
                      <span>Confirm Budget</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Est. Total</span>
                  </label>
                  <div className="relative">
                    <Wallet className="w-3.5 h-3.5 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-budget"
                      type="text"
                      value={confirmedBudget}
                      onChange={(e) => setConfirmedBudget(e.target.value)}
                      placeholder="e.g. ₹ 20,000"
                      style={{ border: '1.5px solid #000000' }}
                      className="w-full pl-8 pr-2.5 py-1.5 min-h-[36px] text-xs sm:text-sm rounded-xl bg-white hover:bg-amber-50/30 transition-all text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs"
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-mono font-bold text-amber-800">
                    Est. Total for {tripSummary.duration} Days
                  </p>
                </div>

                {/* 6. Members Count - Purple Accent */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-50/70 to-violet-50/50 border border-purple-200 shadow-2xs">
                  <label
                    htmlFor="booking-members"
                    className="flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-purple-950 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-purple-200 text-purple-800 flex items-center justify-center text-[10px]">💺</span>
                      <span>Travelers / Seats</span>
                    </span>
                    <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      id="members-minus-btn"
                      onClick={() => setMembers((m) => Math.max(1, m - 1))}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-8 h-8 rounded-lg text-purple-950 font-black bg-purple-100 hover:bg-purple-200 transition-all flex items-center justify-center active:scale-95 cursor-pointer text-sm shadow-2xs shrink-0"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <Users className="w-3.5 h-3.5 text-purple-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
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
                        className="w-full pl-7 pr-2 py-1 text-center text-xs sm:text-sm font-mono font-black text-slate-950 rounded-lg bg-white hover:bg-purple-50/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white shadow-2xs min-h-[32px]"
                      />
                    </div>
                    <button
                      type="button"
                      id="members-plus-btn"
                      onClick={() => setMembers((m) => Math.min(50, m + 1))}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-8 h-8 rounded-lg text-purple-950 font-black bg-purple-100 hover:bg-purple-200 transition-all flex items-center justify-center active:scale-95 cursor-pointer text-sm shadow-2xs shrink-0"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] font-mono font-bold text-purple-800 text-center">
                    {members === 1 ? '1 Seat Booking' : `${members} Seats Reserved Together`}
                  </p>
                </div>
              </div>

              {/* 7. Trip Booking Preferences & Add-ons */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Trip Preferences &amp; Add-ons</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedBookingOptions.length > 0 && (
                      <button
                        type="button"
                        id="clear-booking-options-btn"
                        onClick={() => setSelectedBookingOptions([])}
                        className="text-[10px] font-mono font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Unselect All ({selectedBookingOptions.length})
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {BOOKING_OPTIONS.map((opt) => {
                    const isSelected = selectedBookingOptions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`booking-opt-${opt.id}`}
                        onClick={() => handleToggleBookingOption(opt.id)}
                        style={{
                          border: isSelected ? '1.5px solid #000000' : '1px solid #cbd5e1',
                        }}
                        className={`p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between min-h-[60px] shadow-2xs ${
                          isSelected
                            ? `${opt.activeColor} shadow-xs scale-[1.01]`
                            : 'bg-white text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{opt.icon}</span>
                          <span
                            style={{ border: '1px solid #000000' }}
                            className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded shadow-2xs ${
                              isSelected ? 'bg-black text-amber-300' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ Added' : '+ Add'}
                          </span>
                        </div>
                        <div className="mt-1">
                          <div className="text-[11px] font-black leading-tight truncate">{opt.label}</div>
                          <div className={`text-[9px] truncate ${isSelected ? 'opacity-80 font-medium' : 'text-slate-500'}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Notes - Compact single line */}
              <div>
                <input
                  id="booking-notes"
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Special requests: airport pickup, veg meals, morning departure (Optional)"
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full px-3 py-1.5 min-h-[34px] text-xs text-slate-950 font-medium rounded-xl bg-slate-50 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-2xs"
                />
              </div>

              {/* Token Guarantee badge - Ultra-compact single line */}
              <div
                style={{ border: '1.5px solid #000000' }}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">
                    <strong className="text-slate-950 font-black">₹250 token secures:</strong> Slot guarantee, hotel allotment &amp; price lock.
                  </span>
                </div>
                <span
                  style={{ border: '1px solid #000000' }}
                  className="text-[10px] font-mono font-black text-black bg-emerald-200 px-2 py-0.5 rounded-md shrink-0 shadow-2xs"
                >
                  100% Refundable in 24h
                </span>
              </div>

              {/* ACTION BUTTONS AREA - Side-by-Side, Vibrant & Attractive */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {/* BIG PRIMARY BUTTON: Paid 250₹ for book your seat */}
                <button
                  type="submit"
                  id="pay-250-book-seat-btn"
                  disabled={isProcessingPayment}
                  style={{
                    border: '2px solid #000000',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                  }}
                  className="w-full sm:w-auto px-7 py-2.5 min-h-[44px] text-xs sm:text-sm font-mono font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] group"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Securing Your Seat Slot...</span>
                    </div>
                  ) : (
                    <>
                      <Armchair className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span>Paid 250₹ For Book Your Seat</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* SECONDARY OPTION: Let give me time to think */}
                <button
                  type="button"
                  id="time-to-think-btn"
                  onClick={handleTimeThink}
                  style={{
                    border: '1.8px solid #d97706',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-mono font-black text-amber-950 hover:text-black bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>Let give me time to think</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: "Time to Think" (Inquiry Slip - Bigger Card, Customer Name Included in Both Thank You & Info) */}
      {viewState === 'time_to_think' && (
        <div id="thank-you-view" className="p-6 sm:p-9 text-center animate-fade-in">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Heart / Sparkles Icon */}
            <div
              style={{ border: '2px solid #000000' }}
              className="w-18 h-18 sm:w-22 sm:h-22 mx-auto rounded-3xl bg-amber-100 text-slate-950 flex items-center justify-center shadow-xs"
            >
              <Sparkles className="w-9 h-9 sm:w-11 sm:h-11 text-slate-950" />
            </div>

            {/* BIG THANK YOU WORDING WITH CUSTOMER NAME */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 font-heading">
                THANK YOU FOR VISITING US{name.trim() ? `, ${name.trim().toUpperCase()}` : ''}!
              </h1>
              <div
                style={{ border: '1.5px solid #000000' }}
                className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-950 font-mono text-xs sm:text-sm font-black shadow-2xs"
              >
                Official Inquiry Reference: {inquiryId}
              </div>
            </div>

            {/* REQUIRED USER MESSAGE WITH CUSTOMER NAME IN GREETING AND SUBSEQUENT INFORMATION */}
            <div
              style={{ border: '2px solid #000000', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              className="p-6 sm:p-7 rounded-3xl bg-amber-50/90 text-slate-950 space-y-3.5 text-left shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  style={{ border: '1px solid #000000' }}
                  className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 bg-amber-200 px-2.5 py-0.5 rounded-md"
                >
                  Personalized Traveler Notice
                </span>
              </div>

              {/* Requirement: "thank you for visiting us add there customer name" */}
              <p className="text-base sm:text-xl font-black text-slate-950 leading-snug">
                Thank you for visiting us, <span className="underline decoration-black decoration-2 text-indigo-950">{name.trim() || 'Valued Traveler'}</span>! We will review your data and tell you if any seats are available for that date.
              </p>

              {/* Requirement: "and after that there give infromation there also add the customer name." */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-black/20 space-y-2">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wide text-slate-600 block">
                  Trip Availability &amp; Booking Information for {name.trim() || 'Valued Traveler'}:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  Dear <strong className="text-slate-950 font-black">{name.trim() || 'Valued Traveler'}</strong>, our lead travel coordinators for <strong className="text-slate-950 font-black">{destination}</strong> have received your detailed inquiry. We will review your travel data, schedule preferences, and hotel allotments for <strong className="text-slate-950">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</strong> and notify you directly, <strong className="text-slate-950 font-black">{name.trim() || 'Valued Traveler'}</strong>, at <span className="font-mono font-bold text-indigo-950 underline">{contactNumber || 'your registered phone number'}</span> with confirmed seat availability and locked rates.
                </p>
              </div>
            </div>

            {/* Official Inquiry Slip Voucher Card - Colourful, Attractive & Special */}
            <div
              style={{ border: '2px solid #000000' }}
              className="p-6 sm:p-8 rounded-3xl bg-white text-left text-xs font-mono space-y-5 text-slate-900 shadow-md relative overflow-hidden"
            >
              {/* Top Colorful Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600" />

              <div
                className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-200 gap-3 pt-1"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-2xs"
                  >
                    TH
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-xl font-black text-slate-950 font-heading block">
                        Official Inquiry Slip
                      </span>
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                        Draft Saved
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 font-mono font-medium">
                      Guest: <strong className="text-slate-950">{name.trim() || 'Valued Guest'}</strong> • Ref: <span className="text-indigo-600 font-bold">{inquiryId}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{ border: '1.5px solid #000000' }}
                    className="text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-300 px-4 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-900" />
                    <span>Status: Priority Review</span>
                  </span>
                </div>
              </div>

              {/* Big 4-Column Colourful Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* 1. Destination - Emerald Vibrant */}
                <div
                  style={{ border: '1.5px solid #10b981' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 text-emerald-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-emerald-700 block text-[11px] uppercase font-mono font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Destination
                  </span>
                  <span className="font-black text-slate-950 truncate block text-base sm:text-lg mt-1">
                    {destination || tripSummary.destination}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium mt-0.5">Top Handpicked Route</span>
                </div>

                {/* 2. Date & Day - Sky Blue Vibrant */}
                <div
                  style={{ border: '1.5px solid #0284c7' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100/70 text-sky-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-sky-700 block text-[11px] uppercase font-mono font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-sky-600" /> Date &amp; Day
                  </span>
                  <span className="font-black text-slate-950 truncate block text-base sm:text-lg mt-1">
                    {selectedDayInfo.day}, {selectedDayInfo.formattedDate}
                  </span>
                  <span className="text-[10px] text-sky-700 font-medium mt-0.5">Custom Start Time</span>
                </div>

                {/* 3. Travelers / Seats - Purple Vibrant */}
                <div
                  style={{ border: '1.5px solid #8b5cf6' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100/70 text-purple-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-purple-700 block text-[11px] uppercase font-mono font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-600" /> Travelers
                  </span>
                  <span className="font-black text-slate-950 block text-base sm:text-lg mt-1">
                    {members} Person(s)
                  </span>
                  <span className="text-[10px] text-purple-700 font-medium mt-0.5">Reserved Seat Allotment</span>
                </div>

                {/* 4. Estimated Budget - Warm Amber Vibrant */}
                <div
                  style={{ border: '1.5px solid #f59e0b' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/70 text-amber-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-amber-700 block text-[11px] uppercase font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Budget Lock
                  </span>
                  <span className="font-black text-slate-950 block text-base sm:text-lg mt-1">
                    {confirmedBudget}
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium mt-0.5">Price Protection Guarantee</span>
                </div>
              </div>

              {/* Selected Preferences Badges - Colourful */}
              {selectedBookingOptions.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-mono font-bold text-slate-600 uppercase block mb-1.5">
                    Requested Add-on Preferences:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBookingOptions.map((optId) => {
                      const item = BOOKING_OPTIONS.find((b) => b.id === optId);
                      return (
                        <span
                          key={optId}
                          style={{ border: '1.2px solid #000000' }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs ${
                            item?.activeColor || 'bg-slate-100 text-slate-950'
                          }`}
                        >
                          <span>{item?.icon || '✓'}</span>
                          <span>{item?.label || optId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-700 gap-2">
                <span>Guest Name: <strong className="text-black font-black text-sm sm:text-base">{name.trim() || 'Valued Guest'}</strong></span>
                <span>Contact Phone: <strong className="text-black font-mono font-bold text-sm sm:text-base">{contactNumber || 'Not specified'}</strong></span>
              </div>

              {/* Reassurance Notice - Colourful & Warm */}
              <div
                style={{ border: '1.5px solid #f59e0b' }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 text-[11px] sm:text-xs text-amber-950 font-medium flex items-start gap-2.5 shadow-2xs"
              >
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Fresh Mind Guarantee:</strong> Your selections are saved for this session so you don't lose your work! Take all the time you need. When you exit and visit again later, all options return to clean blank so you can choose freely with your own fresh mind.
                </p>
              </div>
            </div>

            {/* Action Buttons - Colourful & User Likely */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="inquiry-download-btn"
                onClick={() => handleDownloadReceipt('inquiry')}
                style={{ border: '1.8px solid #059669' }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-black text-emerald-950 hover:text-black bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Download Inquiry Slip</span>
              </button>

              <button
                type="button"
                id="open-screen-thankyou-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{ border: '1.8px solid #4f46e5' }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-black text-indigo-950 hover:text-black bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-indigo-700" />
                <span>View Full Screen Slip</span>
              </button>

              <button
                type="button"
                id="inquiry-change-btn"
                onClick={() => setViewState('form')}
                style={{
                  border: '2px solid #000000',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-mono font-black text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:bg-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 group"
              >
                <RotateCcw className="w-4 h-4 text-amber-300 group-hover:-rotate-90 transition-transform" />
                <span>Modify &amp; Book My Seat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: "Paid 250₹" Confirmation Screen - BIG OFFICIAL BOOKING CONFIRMATION */}
      {viewState === 'paid_confirmed' && (
        <div id="booking-confirmed-view" className="p-6 sm:p-9 text-center animate-fade-in">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Celebration Icon & Ribbons */}
            <div className="relative inline-block">
              <div
                style={{ border: '2px solid #000000' }}
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-emerald-100 text-emerald-950 flex items-center justify-center shadow-xs animate-bounce-slow"
              >
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-900" />
              </div>
              <span
                style={{ border: '1.5px solid #000000' }}
                className="absolute -bottom-1 -right-2 px-3.5 py-0.5 bg-amber-300 text-slate-950 font-mono font-black text-xs rounded-full shadow-xs"
              >
                ★ 100% VERIFIED
              </span>
            </div>

            {/* Congratulations Banner with Customer Name */}
            <div className="space-y-2">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-950 font-mono text-xs sm:text-sm font-black shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>OFFICIAL BOOKING CONFIRMATION • ADVANCE ₹250 PAID</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 font-heading">
                🎉 CONGRATULATIONS{name.trim() ? `, ${name.trim().toUpperCase()}` : ''}! 🎉
              </h1>
              
              <p className="text-base sm:text-xl font-bold text-slate-900 max-w-2xl mx-auto">
                <span className="font-black underline decoration-black decoration-2">{name || 'Valued Traveler'}</span>, your seat for <span className="underline decoration-black decoration-2 font-black">{destination}</span> is locked in!
              </p>
            </div>

            {/* Boarding Pass / Ticket Voucher Card - Colourful, Attractive & VIP Special */}
            <div
              style={{ border: '2px solid #000000' }}
              className="rounded-3xl p-6 sm:p-8 bg-white text-left space-y-5 shadow-xl relative overflow-hidden"
            >
              {/* Top Rainbow/Airline Strip */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

              {/* Top Bar with Brand & Booking ID */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dashed border-slate-400 pt-1"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ border: '1.5px solid #000000' }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-base shadow-2xs"
                  >
                    TH
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold uppercase text-emerald-800 block leading-none">
                        VIP Priority Boarding Pass
                      </span>
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                        100% Guaranteed
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-mono font-black text-slate-950 tracking-wider mt-1 block">
                      {bookingId}
                    </span>
                  </div>
                </div>
                
                <div
                  style={{ border: '1.5px solid #059669' }}
                  className="text-right bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-2xl shadow-2xs"
                >
                  <span className="text-[11px] font-mono uppercase text-emerald-950 font-black block leading-none">Token Receipt</span>
                  <span className="text-sm sm:text-base font-mono font-black text-emerald-950">₹ 250 Paid (Guaranteed Slot)</span>
                </div>
              </div>

              {/* Grid with Trip Details - Colourful & Vibrant 4-Column Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* Destination */}
                <div
                  style={{ border: '1.5px solid #059669' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 text-emerald-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800 block">Destination</span>
                  <p className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-1.5 mt-1 truncate">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">{destination}</span>
                  </p>
                  <span className="text-[10px] text-emerald-700 font-medium mt-1">Confirmed Spot</span>
                </div>

                {/* Date & Day */}
                <div
                  style={{ border: '1.5px solid #0284c7' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100/80 text-sky-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-xs font-mono font-bold uppercase text-sky-800 block">Date &amp; Day</span>
                  <p className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-1.5 mt-1 truncate">
                    <Calendar className="w-4 h-4 text-sky-700 shrink-0" />
                    <span className="truncate">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                  </p>
                  <span className="text-[10px] text-sky-700 font-medium mt-1">Departure Confirmed</span>
                </div>

                {/* Passengers */}
                <div
                  style={{ border: '1.5px solid #7c3aed' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100/80 text-purple-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-xs font-mono font-bold uppercase text-purple-800 block">Passengers</span>
                  <p className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>{members} Seat(s)</span>
                  </p>
                  <span className="text-[10px] text-purple-700 font-medium mt-1">Direct Allotment</span>
                </div>

                {/* Passenger Name */}
                <div
                  style={{ border: '1.5px solid #d97706' }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/80 text-amber-950 shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-xs font-mono font-bold uppercase text-amber-800 block">Primary Guest</span>
                  <p className="text-base sm:text-lg font-black text-slate-950 mt-1 truncate">
                    {name || 'Traveler'}
                  </p>
                  <span className="text-[10px] text-amber-700 font-medium mt-1">Verified Traveler</span>
                </div>
              </div>

              {/* Selected Preferences Badges - Colourful */}
              {selectedBookingOptions.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-mono font-bold text-slate-600 uppercase block mb-1.5">
                    Confirmed VIP Trip Add-ons:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBookingOptions.map((optId) => {
                      const item = BOOKING_OPTIONS.find((b) => b.id === optId);
                      return (
                        <span
                          key={optId}
                          style={{ border: '1.2px solid #000000' }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs ${
                            item?.activeColor || 'bg-slate-100 text-slate-950'
                          }`}
                        >
                          <span>{item?.icon || '✓'}</span>
                          <span>{item?.label || optId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extra Details Row: Budget, Contact, Inclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div style={{ border: '1.2px solid #cbd5e1' }} className="p-3.5 rounded-2xl bg-slate-50 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-mono text-slate-600 font-bold uppercase">Locked Budget:</span>
                  <span className="font-mono font-black text-slate-950 text-base">{confirmedBudget}</span>
                </div>
                <div style={{ border: '1.2px solid #cbd5e1' }} className="p-3.5 rounded-2xl bg-slate-50 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-mono text-slate-600 font-bold uppercase">Registered Phone:</span>
                  <span className="font-mono font-black text-slate-950 text-base">{contactNumber || 'Verified in App'}</span>
                </div>
              </div>

              {/* WhatsApp & Concierge Guarantee Notice - Vibrant Emerald */}
              <div
                style={{ border: '1.8px solid #059669' }}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-xs sm:text-sm text-emerald-950 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0" />
                  <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                    Lead travel coordinator will WhatsApp <strong className="text-black font-black text-sm">{contactNumber}</strong> within 4 hours with hotel vouchers, driver details, and complete schedule.
                  </p>
                </div>
                <span
                  style={{ border: '1px solid #059669' }}
                  className="hidden sm:inline-block px-3 py-1 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs shrink-0 shadow-2xs"
                >
                  Priority Concierge
                </span>
              </div>
            </div>

            {/* High Priority Actions - Colourful & User Likely */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="receipt-download-btn"
                onClick={() => handleDownloadReceipt('booking')}
                style={{
                  border: '2px solid #000000',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 group"
              >
                <Download className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Download Ticket &amp; Receipt</span>
              </button>

              <button
                type="button"
                id="open-screen-ticket-btn"
                onClick={() => setIsDirectModalOpen(true)}
                style={{ border: '1.8px solid #4f46e5' }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-black text-indigo-950 hover:text-black bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-indigo-700" />
                <span>View Full Screen Pass</span>
              </button>

              <button
                type="button"
                id="back-to-plan-btn"
                onClick={() => setViewState('form')}
                style={{ border: '1.8px solid #cbd5e1' }}
                className="px-6 py-3 min-h-[46px] text-xs sm:text-sm font-bold text-slate-800 hover:text-black bg-white hover:bg-slate-100 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
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
            className="relative w-full max-w-2xl sm:max-w-3xl rounded-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col bg-white shadow-2xl text-slate-900"
            role="dialog"
            aria-modal="true"
            aria-label={viewState === 'paid_confirmed' ? 'Official Booking Confirmation' : 'Thank You Inquiry'}
          >
            {/* Top Colorful Accent Ribbon */}
            <div className="h-2.5 bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 via-teal-400 to-emerald-500 shrink-0" />

            {/* Modal Header Bar */}
            <div className="px-5 py-3 sm:px-6 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ border: '1.5px solid #000000' }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-amber-300 font-black text-sm shadow-xs"
                >
                  TH
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.2 rounded-full border border-indigo-200">
                      Tripholic Travel Pass
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      ✓ Instant Sync
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-950 leading-tight block mt-0.5">
                    {viewState === 'paid_confirmed' ? 'Official Boarding Pass & Confirmation' : 'Official Inquiry Reservation Slip'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="direct-modal-close-btn"
                  onClick={() => setIsDirectModalOpen(false)}
                  style={{ border: '1.2px solid #000000' }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-rose-100 hover:text-rose-700 text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Close Screen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {viewState === 'paid_confirmed' ? (
                /* CONGRATULATIONS ON-SCREEN CONTENT */
                <div className="space-y-4 text-center">
                  {/* Top Celebration Header */}
                  <div className="space-y-1.5">
                    <div
                      style={{ border: '1.5px solid #059669' }}
                      className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-950 font-mono text-xs font-black shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                      <span>OFFICIAL CONFIRMATION • ₹250 ADVANCE PAID &amp; LOCKED</span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950 font-heading">
                      🎉 CONGRATULATIONS! 🎉
                    </h2>

                    <p className="text-sm sm:text-base font-bold text-slate-900">
                      <span className="font-black underline decoration-emerald-500 decoration-3 text-indigo-950">{name || 'Valued Traveler'}</span>, your seat for <span className="underline decoration-emerald-500 decoration-3 font-black text-emerald-900">{destination}</span> is officially locked!
                    </p>
                  </div>

                  {/* Clear & Large Boarding Pass Ticket - Colorful & Attractive */}
                  <div
                    style={{ border: '2px solid #000000', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.12)' }}
                    className="rounded-2xl p-4 sm:p-5 text-left space-y-3 bg-gradient-to-b from-white via-slate-50/50 to-white shadow-md relative overflow-hidden"
                  >
                    {/* Airline Colorful Header Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600" />

                    {/* Ticket Header Bar */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-dashed border-slate-300 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-2xs">
                          <Armchair className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 block leading-none font-bold">Booking Reference ID</span>
                          <span className="text-base sm:text-lg font-mono font-black text-indigo-950 tracking-wide">{bookingId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBookingCode}
                          style={{ border: '1.2px solid #000000' }}
                          className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer text-slate-900 shadow-2xs"
                          title="Copy code"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div
                        style={{ border: '1.5px solid #059669' }}
                        className="bg-gradient-to-r from-emerald-100 to-teal-100 px-3.5 py-1.5 rounded-xl text-right shadow-2xs"
                      >
                        <span className="text-[10px] font-mono uppercase text-emerald-900 font-extrabold block leading-none">Token Status</span>
                        <span className="text-xs sm:text-sm font-mono font-black text-emerald-950 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                          ₹ 250 Paid (Locked)
                        </span>
                      </div>
                    </div>

                    {/* Trip Details 4-Column Grid with Rich Themed Pastels */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div style={{ border: '1.5px solid #10b981' }} className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/60 shadow-2xs">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> Destination
                        </span>
                        <p className="text-xs sm:text-sm font-black text-slate-950 truncate mt-0.5">
                          {destination}
                        </p>
                        <span className="text-[9px] text-emerald-700 font-medium">VIP Route</span>
                      </div>

                      <div style={{ border: '1.5px solid #0284c7' }} className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100/60 shadow-2xs">
                        <span className="text-[10px] font-mono font-bold uppercase text-sky-700 block flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-600" /> Travel Date
                        </span>
                        <p className="text-xs sm:text-sm font-black text-slate-950 truncate mt-0.5">
                          {selectedDayInfo.day}, {selectedDayInfo.formattedDate}
                        </p>
                        <span className="text-[9px] text-sky-700 font-medium">Locked Date</span>
                      </div>

                      <div style={{ border: '1.5px solid #8b5cf6' }} className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100/60 shadow-2xs">
                        <span className="text-[10px] font-mono font-bold uppercase text-purple-700 block flex items-center gap-1">
                          <Users className="w-3 h-3 text-purple-600" /> Seats
                        </span>
                        <p className="text-xs sm:text-sm font-black text-slate-950 mt-0.5">
                          {members} Reserved Together
                        </p>
                        <span className="text-[9px] text-purple-700 font-medium">Group Blocked</span>
                      </div>

                      <div style={{ border: '1.5px solid #f59e0b' }} className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100/60 shadow-2xs">
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block flex items-center gap-1">
                          <User className="w-3 h-3 text-amber-600" /> Passenger
                        </span>
                        <p className="text-xs sm:text-sm font-black text-slate-950 truncate mt-0.5">
                          {name || 'Traveler'}
                        </p>
                        <span className="text-[9px] text-amber-700 font-medium">Lead Guest</span>
                      </div>
                    </div>

                    {/* Barcode & Guarantee Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-500">BOARDING CODE:</span>
                        <span className="tracking-widest text-slate-950 select-none font-black">||| ||||| || |||| |||</span>
                      </div>
                      <div
                        style={{ border: '1.2px solid #059669' }}
                        className="flex items-center gap-1.5 text-xs font-black text-emerald-950 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-lg shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>100% Guaranteed Slot • ₹{confirmedBudget} Locked</span>
                      </div>
                    </div>

                    {/* WhatsApp Notification Card in Radiant Emerald */}
                    <div
                      style={{ border: '1.5px solid #059669' }}
                      className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-950 text-xs font-medium flex items-center gap-2.5 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        💬
                      </div>
                      <p className="text-slate-900 leading-snug">
                        Our lead coordinator will reach out to <strong className="text-black font-black underline decoration-emerald-500">{name || 'you'}</strong> on WhatsApp at <strong className="text-indigo-950 font-mono font-black">{contactNumber}</strong> within 4 hours with hotel vouchers and driver details.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* THANK YOU ON-SCREEN CONTENT WITH CUSTOMER NAME - Decorated & Colorful */
                <div className="space-y-4 text-center">
                  <div className="relative inline-block mx-auto">
                    <div
                      style={{ border: '2px solid #000000' }}
                      className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-200 via-orange-200 to-amber-300 text-slate-900 flex items-center justify-center shadow-xs"
                    >
                      <Sparkles className="w-7 h-7 text-amber-900" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-2 py-0.2 bg-indigo-600 text-white font-mono text-[9px] font-black rounded-full shadow-2xs">
                      ★ SAVED
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      style={{ border: '1.2px solid #d97706' }}
                      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 font-mono text-xs font-black shadow-2xs"
                    >
                      <span>Inquiry Slip Ref: {inquiryId}</span>
                      <button
                        type="button"
                        onClick={handleCopyBookingCode}
                        className="text-xs font-mono hover:text-indigo-600 transition-colors ml-1"
                        title="Copy code"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> : <Copy className="w-3.5 h-3.5 text-indigo-600 inline" />}
                      </button>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950 font-heading">
                      THANK YOU FOR VISITING US{name.trim() ? `, ${name.trim().toUpperCase()}` : ''}!
                    </h2>
                  </div>

                  {/* Decorated Reassurance Box */}
                  <div
                    style={{ border: '1.8px solid #000000', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)' }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-yellow-50 text-slate-900 space-y-2.5 text-left shadow-2xs"
                  >
                    <p className="text-sm sm:text-base font-black text-slate-950 leading-snug">
                      Thank you for visiting us, <span className="underline decoration-amber-500 decoration-3 text-indigo-950">{name.trim() || 'Valued Traveler'}</span>! We will review your data and tell you if any seats are available for that date.
                    </p>
                    <div className="p-3 bg-white/95 rounded-xl border border-amber-300/80 shadow-2xs">
                      <span className="text-[11px] font-mono font-bold text-amber-900 block uppercase mb-1">
                        Trip Information for {name.trim() || 'Valued Traveler'}:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        Dear <strong className="text-slate-950 font-black">{name.trim() || 'Valued Traveler'}</strong>, our trip coordinators will check live local slot availability, transportation schedules, and accommodation options for <strong className="text-indigo-950 font-black">{destination}</strong>. We will contact you directly, <strong className="text-slate-950 font-black">{name.trim() || 'Valued Traveler'}</strong>, at <span className="font-mono font-bold text-emerald-950 underline">{contactNumber || 'provided phone number'}</span> with current seat openings.
                      </p>
                    </div>
                  </div>

                  {/* Inquiry details summary with 4 colorful mini cards */}
                  <div
                    style={{ border: '1.8px solid #000000' }}
                    className="p-3 sm:p-4 rounded-2xl bg-white text-left text-xs font-mono space-y-2.5 text-slate-900 shadow-2xs"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-bold">
                      <span className="text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Inquiry Summary Card</span>
                      </span>
                      <span
                        style={{ border: '1px solid #d97706' }}
                        className="text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-black"
                      >
                        Status: Under Review
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium">
                      <div style={{ border: '1.2px solid #10b981' }} className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                        <span className="text-emerald-700 block text-[10px] uppercase font-bold">Destination:</span>
                        <span className="font-black text-slate-950 truncate block mt-0.5">{destination || tripSummary.destination}</span>
                      </div>
                      <div style={{ border: '1.2px solid #0284c7' }} className="p-2.5 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50">
                        <span className="text-sky-700 block text-[10px] uppercase font-bold">Date &amp; Day:</span>
                        <span className="font-black text-slate-950 truncate block mt-0.5">{selectedDayInfo.day}, {selectedDayInfo.formattedDate}</span>
                      </div>
                      <div style={{ border: '1.2px solid #8b5cf6' }} className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
                        <span className="text-purple-700 block text-[10px] uppercase font-bold">Travelers:</span>
                        <span className="font-black text-slate-950 block mt-0.5">{members} Person(s)</span>
                      </div>
                      <div style={{ border: '1.2px solid #f59e0b' }} className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                        <span className="text-amber-700 block text-[10px] uppercase font-bold">Budget:</span>
                        <span className="font-black text-slate-950 block mt-0.5">{confirmedBudget}</span>
                      </div>
                    </div>

                    {/* Selected Preferences in Modal */}
                    {selectedBookingOptions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                          Options &amp; Preferences:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedBookingOptions.map((optId) => {
                            const item = BOOKING_OPTIONS.find((b) => b.id === optId);
                            return (
                              <span
                                key={optId}
                                style={{ border: '1px solid #000000' }}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-900 text-[10px] font-bold"
                              >
                                {item?.icon} {item?.label || optId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-700">
                      <span>Traveler: <strong className="text-slate-950 font-black">{name.trim() || 'Valued Guest'}</strong></span>
                      <span>Phone: <strong className="text-slate-950 font-mono font-bold">{contactNumber || 'Not specified'}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions - Compact, Colorful & Attractive */}
            <div className="px-4 py-3 sm:px-6 bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="direct-modal-download-btn"
                  onClick={() => handleDownloadReceipt(viewState === 'paid_confirmed' ? 'booking' : 'inquiry')}
                  style={{ border: '1.8px solid #000000', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  className="px-4 py-2 min-h-[38px] text-xs sm:text-sm font-black text-white bg-gradient-to-r from-slate-900 to-indigo-950 hover:bg-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download {viewState === 'paid_confirmed' ? 'Ticket' : 'Slip'}</span>
                </button>

                {viewState === 'paid_confirmed' && (
                  <button
                    type="button"
                    id="direct-modal-print-btn"
                    onClick={handlePrint}
                    style={{ border: '1.5px solid #000000' }}
                    className="px-3.5 py-2 min-h-[38px] text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    title="Print ticket voucher"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span className="hidden sm:inline">Print Voucher</span>
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
                      border: '2px solid #000000',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                    }}
                    className="px-4 py-2 min-h-[38px] text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Armchair className="w-4 h-4 text-amber-300" />
                    <span>Ready to Book ₹250</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="modal-close-explore-btn"
                    onClick={() => setIsDirectModalOpen(false)}
                    style={{ border: '1.5px solid #000000' }}
                    className="px-4 py-2 min-h-[38px] text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-white hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
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

