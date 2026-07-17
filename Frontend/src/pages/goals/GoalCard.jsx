import React, { useState } from 'react'

const statusStyles = {
  Active: {
    border: 'border-[#2dd4bf]/50',
    ring: 'ring-[#2dd4bf]/10',
    label: 'bg-emerald-500/10 text-emerald-400',
  },
  Lagging: {
    border: 'border-[#f97316]/50',
    ring: 'ring-[#f97316]/10',
    label: 'bg-orange-500/10 text-orange-400',
  },
  Completed: {
    border: 'border-[#22c55e]/50',
    ring: 'ring-[#22c55e]/10',
    label: 'bg-teal-500/10 text-teal-300',
  },
}

const priorityStyles = {
  High: 'bg-red-500/10 text-red-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  Low: 'bg-emerald-500/10 text-emerald-400',
}

export default function GoalCard({ theme, goal, onEdit, onDelete, onAddSaving, onViewHistory }) {
  const isDark = theme === 'dark'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const status = statusStyles[goal?.status] || statusStyles.Active
  const progress = goal?.targetAmount ? Math.min(Math.max((goal.currentSavings / goal.targetAmount) * 100, 0), 100) : 0

  const cardClass = isDark
    ? `rounded-3xl border ${status.border} bg-[#131b2e] text-[#f1f5f9] shadow-sm ring-1 ${status.ring}`
    : `rounded-3xl border ${status.border} bg-white text-[#0b1c30] shadow-sm ring-1 ${status.ring}`
  const progressBg = isDark ? 'bg-[#0f172a]' : 'bg-[#eff6ff]'

  return (
    <div className={`${cardClass} overflow-hidden relative group`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className={isDark ? 'rounded-3xl bg-[#112b2a] p-3 text-[#2dd4bf]' : 'rounded-3xl bg-[#ecfdf5] p-3 text-[#047857]'}>
            <span className="text-xl">{goal?.goalIcon || '💰'}</span>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${status.label}`}>
              {goal?.status || 'Active'}
            </span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${priorityStyles[goal?.priority || 'Medium']}`}>
              {goal?.priority || 'Medium'} Priority
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={isDark ? 'text-xl font-semibold text-[#f8fafc]' : 'text-xl font-semibold text-[#0f172a]'}>{goal?.goalName || 'Savings Goal'}</h3>
          <p className={isDark ? 'text-sm text-[#94a3b8]' : 'text-sm text-[#64748b]'}>{goal?.description || 'Track your savings goal progress'} </p>
        </div>

        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#94a3b8] mb-1">Progress</p>
            <h4 className={isDark ? 'text-2xl font-bold text-[#2dd4bf]' : 'text-2xl font-bold text-[#0f172a]'}>{Math.round(progress)}%</h4>
          </div>
          <div className="text-right">
            <p className={isDark ? 'text-xs text-[#94a3b8]' : 'text-xs text-[#64748b]'}>
              ₹{Number(goal?.currentSavings || 0).toLocaleString()} / ₹{Number(goal?.targetAmount || 0).toLocaleString()}
            </p>
            <p className={isDark ? 'text-[10px] text-[#2dd4bf] font-bold mt-2' : 'text-[10px] text-[#0f766e] font-bold mt-2'}>
              {goal?.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline'}
            </p>
          </div>
        </div>

        <div className={`w-full h-3 rounded-full ${progressBg} overflow-hidden mb-6`}>
          <div className={`h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400`} style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {goal.status === 'Completed' ? (
            <button
              type="button"
              onClick={onViewHistory}
              className="sm:col-span-2 w-full rounded-3xl bg-[#61d9c9] px-5 py-3 text-sm font-semibold text-[#0f172a] hover:bg-[#22c5ac] transition"
            >
              View Contributions
            </button>
            ) : (
            <>
              <button
                type="button"
                onClick={onAddSaving}
                className="w-full rounded-3xl bg-[#61d9c9] px-5 py-3 text-sm font-semibold text-[#0f172a] hover:bg-[#22c5ac] transition"
              >
                Add Savings
              </button>
              <button
                type="button"
                onClick={onViewHistory}
                className={isDark ? 'w-full rounded-3xl border border-[#475569]/30 bg-[#131b2e] px-5 py-3 text-sm font-semibold text-[#94a3b8] hover:bg-[#1e293b] transition' : 'w-full rounded-3xl border border-[#d3e4fe] bg-white px-5 py-3 text-sm font-semibold text-[#0b1c30] hover:bg-[#f8fbff] transition'}
              >
                View History
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
