import React from 'react';
import {
  DollarSign,
  PieChart,
  BedDouble,
  Utensils,
  Car,
  Ticket,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { BudgetBreakdown as BudgetType } from '../types';

interface BudgetBreakdownProps {
  budget: BudgetType;
  duration: number;
  travelers: number;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  budget,
  duration,
  travelers,
}) => {
  const {
    currency,
    userBudget,
    estimatedTotal,
    breakdown,
    budgetStatus,
    budgetNote,
    costSavingTips,
    optionalSplurges,
  } = budget;

  const categories = [
    {
      name: 'Accommodation',
      amount: breakdown.accommodation,
      icon: BedDouble,
      color: 'bg-indigo-500',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-900',
      desc: 'Hotels, homestays or boutique resorts',
    },
    {
      name: 'Food & Dining',
      amount: breakdown.food,
      icon: Utensils,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-900',
      desc: 'All meals, snacks & beverages',
    },
    {
      name: 'Local Transport',
      amount: breakdown.transportation,
      icon: Car,
      color: 'bg-sky-500',
      bgLight: 'bg-sky-50',
      textColor: 'text-sky-900',
      desc: 'Scooters, taxis & regional transit',
    },
    {
      name: 'Activities & Tickets',
      amount: breakdown.activities,
      icon: Ticket,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      desc: 'Water sports, entry passes & tours',
    },
    {
      name: 'Miscellaneous',
      amount: breakdown.miscellaneous,
      icon: HelpCircle,
      color: 'bg-slate-500',
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-900',
      desc: 'Emergency buffer, tips & shopping',
    },
  ];

  const totalCalculated = categories.reduce((sum, c) => sum + c.amount, 0) || estimatedTotal || 1;
  const isUnderBudget = estimatedTotal <= userBudget;
  const savings = Math.max(0, userBudget - estimatedTotal);
  const percentUsed = Math.min(100, Math.round((estimatedTotal / userBudget) * 100));

  return (
    <section
      id="budget-section"
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
            >
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading">
              Budget Breakdown &amp; Estimates
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Categorized realistic financial estimates for <span className="font-black text-black">{travelers} traveler(s)</span> across <span className="font-black text-black">{duration} days</span>.
          </p>
        </div>

        {/* Status Badge */}
        <div
          style={{ border: '1.5px solid #000000' }}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-extrabold flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 shadow-2xs ${
            isUnderBudget 
              ? 'bg-emerald-200 text-black' 
              : 'bg-amber-200 text-black'
          }`}
        >
          {isUnderBudget ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-900 shrink-0" />
              <span className="truncate">WITHIN BUDGET ({currency} {savings.toLocaleString()} BUFFER)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />
              <span>BUDGET STRETCHED</span>
            </>
          )}
        </div>
      </div>

      {/* Comparison Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-5 sm:my-6">
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 rounded-2xl bg-slate-50"
        >
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">Traveler-Decided Budget</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 font-mono">
            {currency} {userBudget.toLocaleString()}
          </p>
          <span className="text-xs text-slate-600 font-medium">Total traveler budget cap</span>
        </div>

        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 rounded-2xl bg-emerald-100/70"
        >
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-emerald-950">Estimated Cost</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 font-mono">
            {currency} {estimatedTotal.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-900 font-extrabold">
            {percentUsed}% allocated
          </span>
        </div>

        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 rounded-2xl bg-slate-50"
        >
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">Per Person / Day</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 font-mono">
            {currency} {Math.round(estimatedTotal / (duration * travelers)).toLocaleString()}
          </p>
          <span className="text-xs text-slate-600 font-medium">Per traveler daily</span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold text-black mb-2">
          <span>COST DISTRIBUTION</span>
          <span>{currency} {estimatedTotal.toLocaleString()} TOTAL</span>
        </div>
        <div
          style={{ border: '1.5px solid #000000' }}
          className="h-4 rounded-full overflow-hidden flex p-0.5 gap-0.5 bg-slate-100"
        >
          {categories.map((c) => {
            const pct = Math.round((c.amount / totalCalculated) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={c.name}
                style={{ width: `${pct}%` }}
                className={`${c.color} h-full rounded-full transition-all duration-500 hover:opacity-90`}
                title={`${c.name}: ${currency} ${c.amount} (${pct}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = Math.round((cat.amount / totalCalculated) * 100);

          return (
            <div
              key={cat.name}
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  style={{ border: '1px solid #000000' }}
                  className={`p-2.5 rounded-xl ${cat.bgLight} ${cat.textColor} shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-slate-950 truncate">{cat.name}</h4>
                  <p className="text-xs text-slate-600 font-medium mb-1 line-clamp-1">{cat.desc}</p>
                  <span className="text-xs font-mono font-extrabold text-indigo-900">{pct}% of total</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-mono font-black text-slate-950">
                  {currency} {cat.amount.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Note */}
      {budgetNote && (
        <div
          style={{ border: '1.5px solid #000000' }}
          className="mt-5 sm:mt-6 p-4 rounded-2xl text-xs sm:text-sm text-slate-800 bg-slate-50"
        >
          <span className="font-mono font-extrabold uppercase tracking-wider text-black text-xs">Financial Rationale: </span>
          <span className="font-medium">{budgetNote}</span>
        </div>
      )}

      {/* Cost Saving Tips */}
      {costSavingTips && costSavingTips.length > 0 && (
        <div
          style={{ borderTop: '1.5px solid #000000' }}
          className="mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-800" />
            <span>Cost-Optimization Recommendations</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {costSavingTips.map((tip, idx) => (
              <div
                key={idx}
                style={{ border: '1.5px solid #000000', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm text-emerald-950 flex items-start gap-2 bg-emerald-50/80 font-medium"
              >
                <span className="font-extrabold text-emerald-800 shrink-0">▪</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Splurges */}
      {optionalSplurges && optionalSplurges.length > 0 && (
        <div
          style={{ borderTop: '1.5px solid #000000' }}
          className="mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-indigo-800" />
            <span>Optional Upgrades &amp; Add-ons</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {optionalSplurges.map((splurge, idx) => (
              <div
                key={idx}
                style={{ border: '1.5px solid #000000', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 bg-slate-50"
              >
                <div>
                  <h5 className="font-black text-slate-950 text-sm">{splurge.item}</h5>
                  <p className="text-slate-700 text-xs mt-0.5 font-medium">{splurge.reason}</p>
                </div>
                <span
                  style={{ border: '1px solid #000000' }}
                  className="px-3 py-1 text-xs font-mono font-extrabold text-black bg-amber-100 rounded-lg shrink-0 shadow-2xs"
                >
                  {splurge.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
