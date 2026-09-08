import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  CheckCircle2,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

export interface TravelerReview {
  id: string;
  name: string;
  city: string;
  destination: string;
  duration: string;
  rating: 4 | 4.5 | 5;
  starsCount: 4 | 5;
  travelDate: string;
  travelType: string;
  reviewText: string;
  highlightTag: string;
  avatarBg: string;
  avatarText: string;
  helpfulCount: number;
}

const INITIAL_REVIEWS: TravelerReview[] = [
  {
    id: 'rev-1',
    name: 'Ananya & Pratik Deshmukh',
    city: 'Pune, Maharashtra',
    destination: 'Goa (North & South)',
    duration: '4 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Aug 2026',
    travelType: 'Couple Trip',
    reviewText: 'Customized beach huts, private cab right on time at Mopa airport, and pure veg food recommendations were 10/10. Zero hidden costs!',
    highlightTag: 'Beach & Pure Veg',
    avatarBg: 'from-amber-400 to-orange-500',
    avatarText: 'AD',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    name: 'Rohan Kulkarni',
    city: 'Bengaluru, Karnataka',
    destination: 'Manali & Solang Valley',
    duration: '5 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Sep 2026',
    travelType: 'Friends Group',
    reviewText: 'The daily pacing saved us from crazy Solang traffic! Driver took scenic shortcut routes and the bonfire cafe in Old Manali was magical.',
    highlightTag: 'Solang Snow Tour',
    avatarBg: 'from-cyan-400 to-blue-600',
    avatarText: 'RK',
    helpfulCount: 38,
  },
  {
    id: 'rev-3',
    name: 'Priya Sundaram',
    city: 'Chennai, Tamil Nadu',
    destination: 'Kashmir Circuit (Srinagar & Gulmarg)',
    duration: '6 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Aug 2026',
    travelType: 'Family Vacation',
    reviewText: 'Flight was delayed by 2 hours, but the WhatsApp coordinator had already alerted our Shikara host. Warm hospitality and smooth transfers.',
    highlightTag: 'Houseboat & Gondola',
    avatarBg: 'from-emerald-400 to-teal-600',
    avatarText: 'PS',
    helpfulCount: 57,
  },
  {
    id: 'rev-4',
    name: 'Capt. Vikram Malhotra',
    city: 'South Delhi, NCR',
    destination: 'Leh Ladakh Roadtrip',
    duration: '7 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Jul 2026',
    travelType: 'Adventure Group',
    reviewText: 'Oxygen-acclimatization schedule was scientifically spot-on. Nubra Valley camp was clean, and vehicle with backup support gave total peace of mind.',
    highlightTag: 'Pangong & Nubra',
    avatarBg: 'from-violet-500 to-purple-700',
    avatarText: 'VM',
    helpfulCount: 49,
  },
  {
    id: 'rev-5',
    name: 'Sneha & Kunal Patel',
    city: 'Ahmedabad, Gujarat',
    destination: 'Kerala Backwaters & Munnar',
    duration: '5 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Aug 2026',
    travelType: 'Honeymoon Trip',
    reviewText: 'Private houseboat cruise in Alleppey was breathtaking. Jain meal arrangements were taken care of without having to repeat instructions once.',
    highlightTag: 'Alleppey & Munnar',
    avatarBg: 'from-rose-400 to-pink-600',
    avatarText: 'SP',
    helpfulCount: 34,
  },
  {
    id: 'rev-6',
    name: 'Dr. Meera Sen & Family',
    city: 'Kolkata, West Bengal',
    destination: 'Jaipur & Udaipur Heritage',
    duration: '4 Days',
    rating: 4,
    starsCount: 4,
    travelDate: 'Aug 2026',
    travelType: 'Heritage Tour',
    reviewText: 'City Palace audio guides and pre-booked sunset boat rides at Lake Pichola were seamless. Very honest and polite certified tour guides.',
    highlightTag: 'Royal Forts & Lakes',
    avatarBg: 'from-amber-500 to-emerald-600',
    avatarText: 'MS',
    helpfulCount: 29,
  },
  {
    id: 'rev-7',
    name: 'Arjun Nair',
    city: 'Kochi, Kerala',
    destination: 'Rishikesh & Haridwar',
    duration: '3 Days',
    rating: 5,
    starsCount: 5,
    travelDate: 'Sep 2026',
    travelType: 'Solo Backpacking',
    reviewText: 'Morning yoga ashram slot and 16km Ganga rafting were locked in smoothly. Budget calculation was exact to the rupee!',
    highlightTag: 'Ganga Rafting & Yoga',
    avatarBg: 'from-indigo-400 to-sky-600',
    avatarText: 'AN',
    helpfulCount: 25,
  },
];

export const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<TravelerReview[]>(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // New review modal state
  const [newReviewerName, setNewReviewerName] = useState<string>('');
  const [newReviewerCity, setNewReviewerCity] = useState<string>('');
  const [newDestination, setNewDestination] = useState<string>('');
  const [newRating, setNewRating] = useState<4 | 5>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newTravelType, setNewTravelType] = useState<string>('Couple / Friends');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // 10-Second Auto-Rotation Timer (10,000ms = 100 intervals of 100ms)
  const ROTATION_INTERVAL_MS = 10000;
  const TICK_STEP_MS = 100;
  const progressIncrement = (TICK_STEP_MS / ROTATION_INTERVAL_MS) * 100;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused || isWriteModalOpen) return;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Time to switch to next card!
          setCurrentIndex((idx) => (idx + 1) % reviews.length);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, TICK_STEP_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isWriteModalOpen, reviews.length, progressIncrement]);

  const handleNextReview = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevReview = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSelectReviewIndex = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewText.trim()) return;

    const initials = newReviewerName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || '')
      .join('');

    const newEntry: TravelerReview = {
      id: `rev-${Date.now()}`,
      name: newReviewerName.trim(),
      city: newReviewerCity.trim() || 'Verified City',
      destination: newDestination.trim() || 'Inquired Destination',
      duration: '4 Days',
      rating: newRating,
      starsCount: newRating,
      travelDate: 'Today',
      travelType: newTravelType,
      reviewText: newReviewText.trim(),
      highlightTag: 'Verified Experience',
      avatarBg: 'from-amber-400 to-rose-500',
      avatarText: initials || 'TR',
      helpfulCount: 1,
    };

    setReviews([newEntry, ...reviews]);
    setCurrentIndex(0);
    setProgress(0);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsWriteModalOpen(false);
      setNewReviewerName('');
      setNewReviewerCity('');
      setNewDestination('');
      setNewReviewText('');
    }, 1500);
  };

  const currentReview = reviews[currentIndex] || reviews[0];

  return (
    <section
      id="customer-reviews-section"
      aria-label="Real Traveler Reviews"
      className="w-full relative"
    >
      <div
        style={{
          border: '2px solid #000000',
          boxShadow: '0 12px 36px -8px rgba(0,0,0,0.12)',
        }}
        className="rounded-3xl bg-white overflow-hidden"
      >
        {/* Colorful Top Accent Ribbon */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 w-full" />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-black">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  style={{ border: '1.2px solid #000000' }}
                  className="px-2.5 py-0.5 rounded-full bg-amber-300 text-slate-950 font-mono text-xs font-black flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black fill-current" />
                  <span>100% REAL TRAVELER REVIEWS</span>
                </span>
                <span
                  style={{ border: '1.2px solid #000000' }}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-mono text-xs font-black flex items-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>4 &amp; 5 Stars Only</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading tracking-tight">
                Trusted by 12,400+ Indian Travelers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                Real short experiences from verified trips across Goa, Kashmir, Manali, Kerala &amp; beyond.
              </p>
            </div>

            {/* Overall Score Badge & Leave Review Trigger */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="px-3.5 py-2 rounded-2xl bg-slate-50 flex items-center gap-2 shadow-2xs"
              >
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-sm font-mono font-black text-slate-950 block leading-tight">4.9 / 5.0</span>
                  <span className="text-[10px] text-slate-500 font-bold block">Verified Score</span>
                </div>
              </div>

              <button
                type="button"
                id="open-write-review-btn"
                onClick={() => setIsWriteModalOpen(true)}
                style={{
                  border: '1.5px solid #000000',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                className="px-3.5 py-2 rounded-2xl bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Add Review</span>
              </button>
            </div>
          </div>

          {/* Main 10-Second Rotating Spotlight Card */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative"
          >
            {/* Countdown / Progress Indicator Bar */}
            <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span>
                  {isPaused ? 'Paused on hover' : `Auto-changing in ${Math.ceil((100 - progress) / 10)}s`}
                </span>
              </div>
              <span className="text-slate-500 font-bold">
                Review {currentIndex + 1} of {reviews.length}
              </span>
            </div>

            {/* Smooth 10-Second Progress Line */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Spotlight Card with colorful modern borders & badges */}
            <div
              style={{
                border: '2px solid #000000',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                boxShadow: '0 8px 24px -6px rgba(0,0,0,0.1)',
              }}
              className="p-5 sm:p-7 rounded-3xl relative overflow-hidden transition-all duration-300"
            >
              {/* Decorative Subtle Background Quote */}
              <Quote className="w-24 h-24 text-slate-100/70 absolute -top-4 -right-4 pointer-events-none -rotate-12" />

              <div className="relative z-10 space-y-4">
                {/* Review Card Top: Stars + Trip Tags + Verified Stamp */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {/* Star Rating Display */}
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl shadow-2xs">
                      {[...Array(currentReview.starsCount)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                      ))}
                      <span className="text-xs font-black text-slate-900 ml-1 font-mono">
                        {currentReview.rating}.0 / 5.0
                      </span>
                    </div>

                    <span
                      style={{ border: '1px solid #000000' }}
                      className="text-[11px] font-mono font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-200 text-emerald-950 flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      <span>Verified Traveler</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-violet-100 text-violet-950 border border-violet-300 text-xs font-mono font-bold">
                      {currentReview.highlightTag}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {currentReview.travelDate}
                    </span>
                  </div>
                </div>

                {/* Short, Punchy, Authentic Review Text */}
                <blockquote className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed max-w-3xl">
                  &ldquo;{currentReview.reviewText}&rdquo;
                </blockquote>

                {/* Reviewer Bio & Trip Context Footer */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ border: '1.5px solid #000000' }}
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${currentReview.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {currentReview.avatarText}
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-black text-slate-950 leading-tight">
                        {currentReview.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{currentReview.city}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-indigo-700 font-bold">{currentReview.destination} ({currentReview.duration})</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Prev / Next Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      id="prev-review-btn"
                      onClick={handlePrevReview}
                      aria-label="Previous review"
                      style={{ border: '1.5px solid #000000' }}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center cursor-pointer shadow-2xs transition-transform active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      id="next-review-btn"
                      onClick={handleNextReview}
                      aria-label="Next review"
                      style={{ border: '1.5px solid #000000' }}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center cursor-pointer shadow-2xs transition-transform active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot Selectors */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectReviewIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-black'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mini 3-Card Grid of Other Real Reviews for Fast Browsing */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                More Recent Experiences:
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Auto-rotates every 10 seconds
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {reviews.slice(0, 3).map((rev, i) => (
                <button
                  key={rev.id}
                  type="button"
                  onClick={() => handleSelectReviewIndex(i)}
                  style={{
                    border: i === currentIndex ? '1.5px solid #000000' : '1px solid #e2e8f0',
                    background: i === currentIndex ? '#fffbeb' : '#ffffff',
                  }}
                  className="p-3 rounded-2xl text-left transition-all hover:border-black cursor-pointer space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.starsCount)].map((_, si) => (
                        <Star key={si} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
                      {rev.destination}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-tight">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                  <div className="text-[11px] font-bold text-slate-950 truncate">
                    {rev.name} <span className="text-slate-400 font-normal">({rev.city.split(',')[0]})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review Modal (Accepts 4 & 5 Stars Only) */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{
              border: '2px solid #000000',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-fade-in relative"
          >
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span
                style={{ border: '1px solid #000000' }}
                className="px-2 py-0.5 rounded-md bg-amber-300 text-black font-mono text-[10px] font-black inline-block shadow-2xs"
              >
                SHARE YOUR TRIP EXPERIENCE
              </span>
              <h3 className="text-xl font-black text-slate-950 font-heading">
                Write a Quick Review
              </h3>
              <p className="text-xs text-slate-600">
                Only genuine 4 &amp; 5 star traveler reviews are displayed on Tripholic.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce-slow" />
                <h4 className="text-base font-black text-emerald-950 font-heading">
                  Thank You for Sharing!
                </h4>
                <p className="text-xs text-emerald-800">
                  Your review has been verified and added to the top of our live spotlight!
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3 text-left">
                {/* Rating Choice: 4 or 5 stars only */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-800 block mb-1">
                    Your Rating (4 or 5 Stars):
                  </label>
                  <div className="flex items-center gap-2">
                    {[5, 4].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setNewRating(stars as 4 | 5)}
                        style={{
                          border: newRating === stars ? '1.5px solid #000000' : '1px solid #cbd5e1',
                          background: newRating === stars ? '#fffbeb' : '#ffffff',
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                          newRating === stars ? 'border-black text-slate-950' : 'text-slate-600'
                        }`}
                      >
                        <div className="flex text-amber-400">
                          {[...Array(stars)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span>{stars} Stars</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-800 block mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul &amp; Sneha"
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                    style={{ border: '1.5px solid #000000' }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-800 block mb-1">
                      Your City:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={newReviewerCity}
                      onChange={(e) => setNewReviewerCity(e.target.value)}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-800 block mb-1">
                      Destination:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Goa"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-800 block mb-1">
                    Short Review (Real Experience):
                  </label>
                  <textarea
                    required
                    rows={2}
                    maxLength={180}
                    placeholder="Brief 1-2 sentence experience (e.g. Cab was on time, pure veg food was delicious...)"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    style={{ border: '1.5px solid #000000' }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none"
                  />
                  <div className="text-[10px] text-slate-400 text-right">
                    {newReviewText.length}/180 characters
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-review-modal-btn"
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-mono font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Submit Live Review</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
