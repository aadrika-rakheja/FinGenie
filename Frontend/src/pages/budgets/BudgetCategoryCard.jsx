import React, { useState } from 'react'

const iconMap = {
  food: 'restaurant',
  transport: 'directions_car',
  shopping: 'shopping_bag',
  'bills & utilities': 'receipt_long',
  healthcare: 'local_hospital',
  entertainment: 'movie',
  travel: 'flight',
  education: 'school',
  rent: 'home',
  insurance: 'shield',
  investments: 'show_chart',
  'gifts & donations': 'card_giftcard',
  'personal care': 'spa',
  others: 'more_horiz'
}

export default function BudgetCategoryCard({
  theme,
  category,
  monthlyLimit,
  spent,
  remaining,
  percentage,
  onEdit,
  onDelete
}) {
  const isDark = theme === 'dark'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const bgColor = isDark ? 'bg-[#131b2e]' : 'bg-white'
  const normalizedCategory = category?.toString().trim().toLowerCase() || ''
  const categoryIcon = iconMap[normalizedCategory] || 'category'

  let statusTone = 'primary'
  let statusLabel = 'On Track'
  let icon = 'check_circle'
  let subtitle = `₹${remaining?.toLocaleString()} remaining`
  const formattedPercentage = Number(percentage || 0).toFixed(2)

  if (percentage >= 100) {
    statusTone = 'error'
    statusLabel = 'Budget Exceeded'
    icon = 'error'
    subtitle = `Exceeded by ₹${Math.abs(remaining).toLocaleString()}`
  } else if (percentage >= 80) {
    statusTone = 'warning'
    statusLabel = 'Almost Full'
    icon = 'warning'
    subtitle = `Only ₹${remaining.toLocaleString()} left`
  }

  const statusBg =
    statusTone === 'error'
      ? (isDark ? 'bg-red-500/10' : 'bg-red-100')
      : statusTone === 'warning'
      ? (isDark ? 'bg-yellow-500/10' : 'bg-yellow-100')
      : (isDark ? 'bg-emerald-500/10' : 'bg-emerald-100')

  const statusText =
    statusTone === 'error'
      ? (isDark ? 'text-red-400' : 'text-red-700')
      : statusTone === 'warning'
      ? (isDark ? 'text-yellow-400' : 'text-yellow-700')
      : (isDark ? 'text-emerald-400' : 'text-emerald-700')

  const toneBorder =
    statusTone === 'error'
      ? 'group-hover:border-red-400'
      : statusTone === 'warning'
      ? 'group-hover:border-orange-400'
      : 'group-hover:border-emerald-400'

  const toneProgress =
    statusTone === 'error'
      ? 'bg-red-500'
      : statusTone === 'warning'
      ? 'bg-orange-500'
      : 'bg-emerald-500'

  const cardBorder = isDark ? 'border border-[#475569]/20' : 'border border-[#d3e4fe]'
  const progressBarBg = isDark ? 'bg-[#0f172a]' : 'bg-[#eff6ff]'

  return (
    <div className={`rounded-3xl overflow-hidden ${cardBorder} ${bgColor} shadow-sm hover:shadow-xl transition-all duration-300 relative group border-2 ${toneBorder}`}>
      <div className="p-6 hover:-translate-y-0.5 transform transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusTone === 'error' ? 'bg-red-500/10 text-red-500' : statusTone === 'primary' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}
          >
            <span className="material-symbols-outlined">{categoryIcon}</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className={isDark ? 'text-[#94a3b8] opacity-60 hover:opacity-100 transition' : 'text-[#64748b] opacity-70 hover:opacity-100 transition'}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {isMenuOpen && (
              <div className={isDark ? 'absolute right-0 top-full mt-2 w-40 rounded-2xl border border-[#475569]/40 bg-[#131b2e] shadow-2xl z-20' : 'absolute right-0 top-full mt-2 w-40 rounded-2xl border border-[#d3e4fe] bg-white shadow-2xl z-20'}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    onEdit?.()
                  }}
                  className={isDark ? 'block w-full px-4 py-3 text-left text-sm text-[#f1f5f9] hover:bg-[#1e293b]' : 'block w-full px-4 py-3 text-left text-sm text-[#0b1c30] hover:bg-[#eff4ff]'}
                >
                  Edit Budget
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    onDelete?.()
                  }}
                  className={isDark ? 'block w-full px-4 py-3 text-left text-sm text-[#fda4af] hover:bg-[#1e293b]' : 'block w-full px-4 py-3 text-left text-sm text-[#b91c1c] hover:bg-[#fee2e2]'}
                >
                  Delete Budget
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className={isDark ? 'text-xl font-semibold text-[#f8fafc]' : 'text-xl font-semibold text-[#0f172a]'}>{category}</h3>
        <p className={isDark ? 'text-sm text-[#94a3b8] mt-1' : 'text-sm text-[#64748b] mt-1'}>{subtitle}</p>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-3">
            <span className={isDark ? 'text-[#cbd5e1]' : 'text-[#475569]'}>Spent: ₹{Number(spent || 0).toLocaleString()}</span>
            <span className={isDark ? 'text-[#f8fafc] font-semibold' : 'text-[#0f172a] font-semibold'}>Limit: ₹{Number(monthlyLimit || 0).toLocaleString()}</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${progressBarBg}`}>
            <div className={`h-full ${toneProgress} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(Math.max(Number(percentage || 0), 0), 100)}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className={isDark ? 'text-xs text-[#94a3b8]' : 'text-xs text-[#64748b]'}>{formattedPercentage}% utilized</span>
          <span className={`text-xs py-1 px-2 rounded-full ${statusBg} ${statusText} font-medium`}>{statusLabel}</span>
        </div>
      </div>
      {statusTone === 'error' && <div className="absolute top-0 left-0 h-1 w-full bg-red-500 animate-pulse" />}
    </div>
  )
}
