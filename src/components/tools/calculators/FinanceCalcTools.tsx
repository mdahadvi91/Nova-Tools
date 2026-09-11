import React, { useState } from 'react';
import { DollarSign, Percent, Users, Calculator, TrendingUp, Calendar } from 'lucide-react';

interface FinanceCalcProps {
  calcType: 'loan' | 'compound' | 'tip' | 'discount' | 'date';
}

export const FinanceCalcTools: React.FC<FinanceCalcProps> = ({ calcType }) => {
  // 1. Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  // 2. Compound Interest State
  const [initialPrincipal, setInitialPrincipal] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [investmentYears, setInvestmentYears] = useState(20);

  // 3. Tip Calculator State
  const [billAmount, setBillAmount] = useState(85.0);
  const [tipPercent, setTipPercent] = useState(18);
  const [partySize, setPartySize] = useState(3);

  // 4. Discount State
  const [originalPrice, setOriginalPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(25);

  // 5. Date Difference State
  const [startDate, setStartDate] = useState('2000-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Loan calculation
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanYears * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;
  const totalLoanPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalLoanPayment - loanAmount;

  // Compound calculation
  const r = annualReturn / 100 / 12;
  const n = investmentYears * 12;
  let futureValue = initialPrincipal * Math.pow(1 + r, n);
  if (r > 0) {
    futureValue += monthlyDeposit * ((Math.pow(1 + r, n) - 1) / r);
  } else {
    futureValue += monthlyDeposit * n;
  }
  const totalPrincipalInvested = initialPrincipal + monthlyDeposit * n;
  const totalCompoundInterest = futureValue - totalPrincipalInvested;

  // Tip calculation
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalBillWithTip = billAmount + tipAmount;
  const perPersonAmount = partySize > 0 ? totalBillWithTip / partySize : totalBillWithTip;

  // Discount calculation
  const savings = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - savings;

  // Date Diff calculation
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = (diffDays / 365.25).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. LOAN / MORTGAGE CALCULATOR */}
      {calcType === 'loan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Loan Principal Amount ($)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Loan Term (Years)
              </label>
              <select
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              >
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Estimated Monthly Payment
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${monthlyPayment.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Total Principal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ${loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Total Interest Paid:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ${totalInterest.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Total Cost of Loan:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${totalLoanPayment.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPOUND INTEREST CALCULATOR */}
      {calcType === 'compound' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Initial Deposit ($)
              </label>
              <input
                type="number"
                value={initialPrincipal}
                onChange={(e) => setInitialPrincipal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Est. Return (%/yr)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Time Horizon (Yrs)
                </label>
                <input
                  type="number"
                  value={investmentYears}
                  onChange={(e) => setInvestmentYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Future Value After {investmentYears} Years
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${Math.round(futureValue).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Your Total Contributions:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ${Math.round(totalPrincipalInvested).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Compound Interest Earned:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +${Math.round(totalCompoundInterest).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TIP & BILL SPLITTER */}
      {calcType === 'tip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Bill Subtotal ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tip Percentage ({tipPercent}%)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 18, 20, 25].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipPercent(t)}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      tipPercent === t
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'liquid-glass'
                    }`}
                  >
                    {t}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Number of People Splitting
              </label>
              <input
                type="number"
                min="1"
                value={partySize}
                onChange={(e) => setPartySize(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Each Person Pays
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${perPersonAmount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Tip Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ${tipAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Total with Tip:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${totalBillWithTip.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DISCOUNT & SALE CALCULATOR */}
      {calcType === 'discount' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Original Tag Price ($)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Discount Off (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Discounted Final Price
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${finalPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-center text-xs font-bold text-emerald-600">
              You save ${savings.toFixed(2)} ({discountPercent}%)
            </div>
          </div>
        </div>
      )}

      {/* 5. DATE & AGE CALCULATOR */}
      {calcType === 'date' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Start Date / Birthdate
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                End Date (Defaults to Today)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Calculated Span
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {diffYears} Years
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Equal to {diffDays.toLocaleString()} total days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
