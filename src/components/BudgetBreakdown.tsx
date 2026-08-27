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
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-emerald-600/15 text-emerald-700 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Budget Breakdown & Estimates
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Categorized realistic financial estimates for <span className="font-bold text-slate-950">{travelers} traveler(s)</span> across <span className="font-bold text-slate-950">{duration} days</span>.
          </p>
        </div>

        {/* Status Badge */}
        <div
          style={{
            background: isUnderBudget ? 'rgba(236, 253, 245, 0.75)' : 'rgba(254, 243, 199, 0.75)',
            border: isUnderBudget ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
          }}
          className={`px-3 py-2 sm:py-1.5 rounded-full text-xs font-mono font-bold flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 shadow-2xs backdrop-blur-md ${
            isUnderBudget ? 'text-emerald-950' : 'text-amber-950'
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
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 rounded-2xl backdrop-blur-md shadow-xs"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">Traveler-Decided Budget</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {currency} {userBudget.toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-slate-600">Total traveler budget cap</span>
        </div>

        <div
          style={{
            background: 'rgba(236, 253, 245, 0.45)',
            border: '1px solid rgba(16, 185, 129, 0.30)',
          }}
          className="p-4 rounded-2xl backdrop-blur-md shadow-xs"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900">Estimated Cost</span>
          <p className="text-2xl font-black text-emerald-950 font-mono mt-1">
            {currency} {estimatedTotal.toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-emerald-800 font-semibold">
            {percentUsed}% allocated
          </span>
        </div>

        <div
          style={{
            background: 'rgba(238, 242, 255, 0.45)',
            border: '1px solid rgba(99, 102, 241, 0.30)',
          }}
          className="p-4 rounded-2xl backdrop-blur-md shadow-xs"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900">Per Person / Day</span>
          <p className="text-2xl font-black text-blue-950 font-mono mt-1">
            {currency} {Math.round(estimatedTotal / (duration * travelers)).toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-blue-800">Per traveler daily</span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-2">
          <span>COST DISTRIBUTION</span>
          <span>{currency} {estimatedTotal.toLocaleString()} TOTAL</span>
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.40)',
            border: '1px solid rgba(255, 255, 255, 0.50)',
          }}
          className="h-3.5 sm:h-3 rounded-full overflow-hidden flex p-0.5 gap-0.5 shadow-2xs backdrop-blur-xs"
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
              style={{
                background: 'rgba(255, 255, 255, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.40)',
              }}
              className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-md hover:bg-white/40 transition-all flex items-start justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.50)',
                    border: '1px solid rgba(255, 255, 255, 0.60)',
                  }}
                  className={`p-2.5 rounded-xl ${cat.textColor} shrink-0 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{cat.name}</h4>
                  <p className="text-[11px] text-slate-700 mb-1 line-clamp-1">{cat.desc}</p>
                  <span className="text-[10px] font-mono font-bold text-slate-600">{pct}% of total</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
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
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
          }}
          className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-2xl text-xs text-slate-800 backdrop-blur-md shadow-2xs"
        >
          <span className="font-mono font-bold uppercase tracking-wider text-slate-900 text-[11px]">Financial Rationale: </span>
          <span>{budgetNote}</span>
        </div>
      )}

      {/* Cost Saving Tips */}
      {costSavingTips && costSavingTips.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.30)',
          }}
          className="mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-700" />
            <span>Cost-Optimization Recommendations</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {costSavingTips.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(236, 253, 245, 0.45)',
                  border: '1px solid rgba(16, 185, 129, 0.30)',
                }}
                className="p-3.5 rounded-2xl text-xs text-emerald-950 flex items-start gap-2 font-medium backdrop-blur-md shadow-2xs"
              >
                <span className="font-bold text-emerald-700 shrink-0">▪</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Splurges */}
      {optionalSplurges && optionalSplurges.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.30)',
          }}
          className="mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-blue-700" />
            <span>Optional Upgrades & Add-ons</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {optionalSplurges.map((splurge, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(238, 242, 255, 0.45)',
                  border: '1px solid rgba(99, 102, 241, 0.30)',
                }}
                className="p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 backdrop-blur-md shadow-2xs"
              >
                <div>
                  <h5 className="font-bold text-blue-950">{splurge.item}</h5>
                  <p className="text-blue-900 text-[11px] mt-0.5">{splurge.reason}</p>
                </div>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.65)',
                  }}
                  className="px-2.5 py-1 text-xs font-mono font-bold text-blue-950 rounded-lg shrink-0 shadow-2xs"
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
