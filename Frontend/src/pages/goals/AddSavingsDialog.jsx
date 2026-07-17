import React, { useState, useEffect } from 'react'

const paymentMethods = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking'
]

export default function AddSavingsDialog({
  open,
  theme,
  goal,
  onClose,
  onSave
}) {
  const isDark = theme === 'dark'

  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')

  useEffect(() => {
    if (open) {
      setAmount('')
      setPaymentMethod('UPI')
    }
  }, [open])

  if (!open || !goal) return null

  const currentSavings = goal.currentSavings || 0
  const targetAmount = goal.targetAmount || 0
  const remaining = Math.max(targetAmount - currentSavings, 0)
  const progress =
    targetAmount > 0
      ? Math.round((currentSavings / targetAmount) * 100)
      : 0

  const handleSubmit = (e) => {
    e.preventDefault()

    onSave({
      goalId: goal._id,
      amount: Number(amount),
      paymentMethod
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div
        className={
          isDark
            ? 'w-full max-w-md rounded-3xl border border-[#1e293b] bg-[#0f172a] shadow-2xl'
            : 'w-full max-w-md rounded-3xl border border-[#dbe4f0] bg-white shadow-2xl'
        }
      >

        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold'}>
            Add Savings
          </h2>
          <p className={isDark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-500'}>
            Add a new contribution to this goal.
          </p>
        </div>

        <div
          className={
            isDark
              ? 'mx-6 mt-6 rounded-2xl border border-[#1e293b] bg-[#111827] p-5'
              : 'mx-6 mt-6 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5'
          }
        >
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2dd4bf]/20 text-3xl">
              {goal.goalIcon}
            </div>
            <div>
              <h3 className={isDark ? 'text-lg font-bold text-white' : 'text-lg font-bold'}>
                {goal.goalName}
              </h3>
              <p className="text-sm text-slate-500">
                {progress}% Completed
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Saved</span>
              <span className="font-semibold text-[#2dd4bf]">
                ₹{currentSavings.toLocaleString()}
              </span>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Remaining</span>
              <span className="font-semibold text-[#fb7185]">
                ₹{remaining.toLocaleString()}
              </span>
            </div>
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-slate-500">Target</span>
              <span className="font-semibold">
                ₹{targetAmount.toLocaleString()}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-[#2dd4bf] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Amount
            </label>

            <div
              className={
                isDark
                  ? 'flex items-center rounded-2xl border border-[#334155] bg-[#111827] px-4'
                  : 'flex items-center rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4'
              }
            >
              <span className="mr-2 text-slate-500">₹</span>

              <input
                type="number"
                min="1"
                required
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={
                isDark
                  ? 'w-full rounded-2xl border border-[#334155] bg-[#111827] px-4 py-4 outline-none'
                  : 'w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-4 outline-none'
              }
            >

              {paymentMethods.map((method) => (
                <option
                  key={method}
                  value={method}
                >
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={
                isDark
                  ? 'rounded-2xl border border-[#334155] px-5 py-3 text-slate-300 hover:bg-[#1e293b]'
                  : 'rounded-2xl border border-[#dbe4f0] px-5 py-3 text-slate-700 hover:bg-[#f8fafc]'
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-[#2dd4bf] px-6 py-3 font-semibold text-[#0f172a] transition hover:brightness-95"
            >
              Add Savings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}