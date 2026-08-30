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
      textColor: 'text-indigo-700',
      desc: 'Hotels, homestays or boutique resorts',
    },
    {
      name: 'Food & Dining',
      amount: breakdown.food,
      icon: Utensils,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      desc: 'All meals, snacks & beverages',
    },
    {
      name: 'Local Transport',
      amount: breakdown.transportation,
      icon: Car,
      color: 'bg-sky-500',
      bgLight: 'bg-sky-50',
      textColor: 'text-sky-700',
      desc: 'Scooters, taxis & regional transit',
    },
    {
      name: 'Activities & Tickets',
      amount: breakdown.activities,
      icon: Ticket,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      desc: 'Water sports, entry passes & tours',
    },
    {
      name: 'Miscellaneous',
      amount: breakdown.miscellaneous,
      icon: HelpCircle,
      color: 'bg-slate-500',
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-700',
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
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Budget Breakdown & Estimates
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Categorized realistic financial estimates for <span className="font-semibold text-slate-900">{travelers} traveler(s)</span> across <span className="font-semibold text-slate-900">{duration} days</span>.
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 border shadow-2xs ${
            isUnderBudget 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {isUnderBudget ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">WITHIN BUDGET ({currency} {savings.toLocaleString()} BUFFER)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>BUDGET STRETCHED</span>
            </>
          )}
        </div>
      </div>

      {/* Comparison Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-5 sm:my-6">
        <div
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Traveler-Decided Budget</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {currency} {userBudget.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 font-medium">Total traveler budget cap</span>
        </div>

        <div
          className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Estimated Cost</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            {currency} {estimatedTotal.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-700 font-semibold">
            {percentUsed}% allocated
          </span>
        </div>

        <div
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Per Person / Day</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {currency} {Math.round(estimatedTotal / (duration * travelers)).toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 font-medium">Per traveler daily</span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-2">
          <span>COST DISTRIBUTION</span>
          <span>{currency} {estimatedTotal.toLocaleString()} TOTAL</span>
        </div>
        <div
          className="h-3.5 rounded-full overflow-hidden flex p-0.5 gap-0.5 bg-slate-100 border border-slate-200"
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
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-2.5 rounded-xl ${cat.bgLight} ${cat.textColor} shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">{cat.name}</h4>
                  <p className="text-xs text-slate-500 font-normal mb-1 line-clamp-1">{cat.desc}</p>
                  <span className="text-xs font-semibold text-indigo-600">{pct}% of total</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-bold text-slate-900">
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
          className="mt-5 sm:mt-6 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200"
        >
          <span className="font-semibold uppercase tracking-wider text-slate-900 text-xs">Financial Rationale: </span>
          <span>{budgetNote}</span>
        </div>
      )}

      {/* Cost Saving Tips */}
      {costSavingTips && costSavingTips.length > 0 && (
        <div
          className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200"
        >
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Cost-Optimization Recommendations</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {costSavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-start gap-2 bg-emerald-50/70 border border-emerald-200/80"
              >
                <span className="font-bold text-emerald-600 shrink-0">▪</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Splurges */}
      {optionalSplurges && optionalSplurges.length > 0 && (
        <div
          className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200"
        >
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Optional Upgrades & Add-ons</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {optionalSplurges.map((splurge, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 bg-slate-50 border border-slate-200"
              >
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{splurge.item}</h5>
                  <p className="text-slate-600 text-xs mt-0.5">{splurge.reason}</p>
                </div>
                <span
                  className="px-3 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg shrink-0 shadow-2xs"
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
