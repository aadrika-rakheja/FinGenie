import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import MainHeader from '../../components/MainHeader'
import BottomNavigation from '../../components/BottomNavigation'
import BudgetCategoryCard from './BudgetCategoryCard'
import AddBudgetDialog from './AddBudgetDialog'
import ConfirmDialog from './ConfirmDialog'
import { addBudget, deleteBudget, editBudget, getAllBudgets, getBudgetSummary } from '../../services/budgetService'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export default function BudgetPage({ theme, onToggleTheme }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isDark = theme === 'dark'
  const [budgets, setBudgets] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [summary,setSummary]=useState({});
  const [editingBudget, setEditingBudget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

 useEffect(() => {
  const loadBudgets = async () => {
    const res = await getAllBudgets();
    if (res.success) setBudgets(res.data);
  };

  loadBudgets();
}, []);

  const fetchBudgets = async () => {
    const res = await getAllBudgets();
    if (res.success) setBudgets(res.data);
  }

useEffect(() => {
  const loadSummary = async () => {
    const res = await getBudgetSummary(selectedMonth, selectedYear);
    if (res.success) setSummary(res.data);
  };

  loadSummary();
}, [selectedMonth, selectedYear]);

   

  const handleAddBudget = async ({ category, limit, month, year }) => {
    try {
      const b = {
        month,
        year,
        monthlyLimit: Number(limit),
        category,
        createdBy: 'Manual'
      }
      const res = await addBudget(b)
      if (res.success) {
        await fetchBudgets()
      }
    } catch (error) {
      console.error('Error adding budget:', error)
    }
  }

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setIsDialogOpen(true)
  }

  const handleDeleteBudget = (budget) => {
    setDeleteTarget(budget)
  }

  const confirmDeleteBudget = async () => {
    if (!deleteTarget) return
    try {
      await deleteBudget(deleteTarget._id)
      await fetchBudgets()
      setDeleteTarget(null)
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const handleSaveBudget = async ({ category, limit, month, year }) => {
    try {
      if (editingBudget) {
        await editBudget(editingBudget._id, {
          category,
          monthlyLimit: Number(limit),
          month: Number(month),
          year: Number(year)
        })
      } else {
        await addBudget({
          category,
          monthlyLimit: Number(limit),
          month: Number(month),
          year: Number(year),
          createdBy: 'Manual'
        })
      }

      await fetchBudgets()
      setEditingBudget(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving budget:', error)
    }
  }

  const selectedDate = new Date(selectedYear, selectedMonth - 1)
  const monthLabel = monthNames[selectedMonth - 1]
  const filteredBudgets = budgets.filter(
    (budget) => budget.month === selectedMonth && budget.year === selectedYear
  )

  const handleMonthChange = (direction) => {
    const current = new Date(selectedYear, selectedMonth - 1)
    const next = new Date(current)
    next.setMonth(current.getMonth() + direction)
    setSelectedMonth(next.getMonth() + 1)
    setSelectedYear(next.getFullYear())
  }

  const prevDate = new Date(selectedYear, selectedMonth - 2)
  const prevMonth = prevDate.getMonth() + 1
  const prevYear = prevDate.getFullYear()
  const hasPreviousMonthBudgets = budgets.some(
    (budget) => budget.month === prevMonth && budget.year === prevYear
  )

  const handleCopyLastMonthBudgets = async () => {
    if (!hasPreviousMonthBudgets) return

    const previousBudgets = budgets.filter(
      (budget) => budget.month === prevMonth && budget.year === prevYear
    )

    await Promise.all(
      previousBudgets.map((budget) =>
        addBudget({
          month: selectedMonth,
          year: selectedYear,
          monthlyLimit: budget.monthlyLimit,
          category: budget.category,
          createdBy: 'Copied'
        })
      )
    )

    await fetchBudgets()
  }



  const burnConfig = {
  excellent: {
    text: "Well below plan",
    color: "text-[#2dd4bf]",
    icon: "check_circle"
  },
  "on-track": {
    text: "On track",
    color: "text-[#2dd4bf]",
    icon: "trending_up"
  },
  warning: {
    text: "Slightly above plan",
    color: "text-[#fb923c]",
    icon: "warning"
  },
  danger: {
    text: "Overspending",
    color: "text-[#ef4444]",
    icon: "error"
  }
};
const status = burnConfig[summary.burnStatus]  || burnConfig["on-track"];




  return (
    <div className={isDark ? 'min-h-screen bg-[#0b1326] text-[#f1f5f9]' : 'min-h-screen bg-[#f8f9ff] text-[#0b1c30]'}>
      <Sidebar theme={theme} />
      <MainHeader theme={theme} onToggleTheme={onToggleTheme} />
      <AddBudgetDialog open={isDialogOpen} theme={theme} onClose={() => { setIsDialogOpen(false); setEditingBudget(null) }} onSave={handleSaveBudget}  editingBudget={editingBudget} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        theme={theme}
        title="Delete Budget"
        message={
          deleteTarget
            ? `Do you really want to delete the budget for ${deleteTarget.category || deleteTarget.title}?`
            : ''
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBudget}
      />

      <main className="pt-24 pb-24 lg:pb-12 lg:ml-[280px] px-4 lg:px-10 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
           
            <h1 className={isDark ? 'text-4xl sm:text-5xl font-bold text-[#f8fafc] tracking-tight' : 'text-4xl sm:text-5xl font-bold text-[#0b1c30] tracking-tight'}>Monthly Budget</h1>
            <p className={isDark ? 'text-sm text-[#94a3b8]' : 'text-sm text-[#64748b]'}>
              Precision-engineered insights for your {monthLabel} spending.
            </p>
          </div>

          
          <div className="flex gap-3 flex-wrap">
            <button className="bg-[#2dd4bf] text-[#0f172a] font-semibold px-6 py-3 rounded-2xl flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-md shadow-[#0f766e]/20">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              AI Suggest
            </button>
            <button onClick={() => setIsDialogOpen(true)} className={isDark ? 'border border-[#475569]/50 text-[#e2e8f0] px-6 py-3 rounded-2xl hover:bg-[#131b2e] transition-all' : 'border border-[#d3e4fe] text-[#0b1c30] px-6 py-3 rounded-2xl hover:bg-[#eff4ff] transition-all'}>
              + Add Budget
            </button>
          </div>
        </div>
      
      <div
  className={`w-full rounded-2xl mb-8 border px-6 py-4 flex items-center justify-between ${
    isDark
      ? "bg-[#131b2e] border-[#334155]"
      : "bg-white border-[#dbeafe]"
  }`}
>
  <div className="flex items-center gap-3">
    <span
      className={`material-symbols-outlined ${
        isDark ? "text-teal-400" : "text-teal-600"
      }`}
    >
      calendar_month
    </span>

    <div>
      <p
        className={`text-xs uppercase tracking-wider ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Budget Period
      </p>

      <h3
        className={`text-xl font-semibold ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {monthLabel} {selectedYear}
      </h3>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={() => handleMonthChange(-1)}
      className={`w-10 h-10 rounded-xl transition ${
        isDark
          ? "bg-[#1e293b] hover:bg-[#334155]"
          : "bg-slate-100 hover:bg-slate-200"
      }`}
    >
      <span className="material-symbols-outlined">chevron_left</span>
    </button>

    <button
      onClick={() => handleMonthChange(1)}
      className={`w-10 h-10 rounded-xl transition ${
        isDark
          ? "bg-[#1e293b] hover:bg-[#334155]"
          : "bg-slate-100 hover:bg-slate-200"
      }`}
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
</div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className={isDark ? 'rounded-3xl p-6 bg-[#131b2e] border border-[#475569]/20 shadow-sm' : 'rounded-3xl p-6 bg-white border border-[#d3e4fe] shadow-sm'}>
            <span className="text-xs uppercase tracking-[0.24em] text-[#94a3b8]">Total Budget</span>
            <div className="mt-4">
              <p className={isDark ? 'text-3xl font-bold text-[#f8fafc]' : 'text-3xl font-bold text-[#0b1c30]'}>{summary.totalBudget}</p>
              <div className="mt-2 flex items-center gap-2 text-[#2dd4bf] text-xs">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>4.2% from last month</span>
              </div>
            </div>
          </div>
          <div className={isDark ? 'rounded-3xl p-6 bg-[#131b2e] border border-[#475569]/20 shadow-sm' : 'rounded-3xl p-6 bg-white border border-[#d3e4fe] shadow-sm'}>
            <span className="text-xs uppercase tracking-[0.24em] text-[#94a3b8]">Spent to Date</span>
            <div className="mt-4">
              <p className={isDark ? 'text-3xl font-bold text-[#f8fafc]' : 'text-3xl font-bold text-[#0b1c30]'}>{summary.totalSpent}</p>
              <div className={isDark ? 'mt-2 text-[#94a3b8] text-xs' : 'mt-2 text-[#64748b] text-xs'}>{summary.percentageUsed?.toFixed(2)}% of total limit</div>
            </div>
          </div>
          <div className={isDark ? 'rounded-3xl p-6 bg-[#131b2e] border border-[#475569]/20 shadow-sm' : 'rounded-3xl p-6 bg-white border border-[#d3e4fe] shadow-sm'}>
            <span className="text-xs uppercase tracking-[0.24em] text-[#94a3b8]">Daily Burn Rate</span>
            <div className="mt-4">
              <p className={isDark ? 'text-3xl font-bold text-[#f8fafc]' : 'text-3xl font-bold text-[#0b1c30]'}>{summary.burnRate?.toFixed(2)}</p>
              <div className={`mt-2 text-xs flex items-center gap-1 ${status.color}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {status?.icon}
                </span>
                {status?.text}
              </div>
            </div>
          </div>
          <div className={isDark ? 'rounded-3xl p-6 bg-[#0f172a] border border-[#2dd4bf]/20 shadow-sm' : 'rounded-3xl p-6 bg-[#ecfdf5] border border-[#2dd4bf]/30 shadow-sm'}>
            <span className="text-xs uppercase tracking-[0.24em] text-[#2dd4bf]">Safe to Spend</span>
            <div className="mt-4">
              <p className="text-3xl font-bold text-[#2dd4bf]">{summary.remaining}</p>
              <div className={isDark ? 'mt-2 text-[#94a3b8] text-xs' : 'mt-2 text-[#475569] text-xs'}>Remaining for {summary.daysRemaining} days</div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className={isDark ? 'text-2xl font-semibold text-[#f8fafc] mb-6' : 'text-2xl font-semibold text-[#0f172a] mb-6'}>Category Breakdown</h2>
          {filteredBudgets.length === 0 ? (
            <div className={isDark ? 'rounded-3xl p-10 bg-[#131b2e] border border-[#475569]/30 shadow-sm' : 'rounded-3xl p-10 bg-white border border-[#d3e4fe] shadow-sm'}>
              <p className={isDark ? 'text-xl font-semibold text-[#f8fafc] mb-3' : 'text-xl font-semibold text-[#0b1c30] mb-3'}>📅 New Month Started!</p>
              <p className={isDark ? 'text-sm text-[#94a3b8] mb-6' : 'text-sm text-[#64748b] mb-6'}>
                No budgets are available for {monthLabel} {selectedYear} yet. Would you like to:
              </p>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleCopyLastMonthBudgets}
                  disabled={!hasPreviousMonthBudgets}
                  className={`w-full rounded-2xl px-5 py-4 text-left font-medium transition ${
                    hasPreviousMonthBudgets
                      ? 'bg-[#e6fffa] text-[#0f766e] hover:bg-[#d1fae5]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800/80 dark:text-slate-500'
                  }`}
                >
                  🟢 Copy last month&apos;s budgets
                </button>
                <button
                  type="button"
                  // onClick={handleGenerateAIBudgets}
                  className="w-full rounded-2xl bg-[#f8fafc] text-[#0b1c30] px-5 py-4 text-left font-medium hover:bg-[#e2f4ff] transition dark:bg-[#0f172a] dark:text-[#f8fafc] dark:hover:bg-[#122033]"
                >
                  ✨ Generate a new budget with AI
                </button>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full rounded-2xl bg-[#e0f2fe] text-[#0c4a6e] px-5 py-4 text-left font-medium hover:bg-[#bae6fd] transition dark:bg-[#112633] dark:text-[#a5f3fc] dark:hover:bg-[#13334b]"
                >
                  📝 Create budgets manually
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBudgets.map((budget) => (
                <BudgetCategoryCard
                  key={budget._id}
                  theme={theme}
                  {...budget}
                  onEdit={() => handleEditBudget(budget)}
                  onDelete={() => handleDeleteBudget(budget)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className={isDark ? 'rounded-3xl p-6 bg-[#131b2e] border border-[#475569]/20 shadow-sm' : 'rounded-3xl p-6 bg-white border border-[#d3e4fe] shadow-sm'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center text-[#2dd4bf]">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <div>
                <p className={isDark ? 'text-sm uppercase tracking-[0.24em] text-[#94a3b8]' : 'text-sm uppercase tracking-[0.24em] text-[#64748b]'}>Real-time Analysis</p>
                <h3 className={isDark ? 'text-xl font-semibold text-[#f8fafc]' : 'text-xl font-semibold text-[#0b1c30]'}>Advisor Insight</h3>
              </div>
            </div>
            <div className={isDark ? 'rounded-3xl bg-[#0f172a] p-5 border-l-4 border-[#2dd4bf]' : 'rounded-3xl bg-[#f0fdfa] p-5 border-l-4 border-[#2dd4bf]'}>
              <p className={isDark ? 'text-[#e2e8f0]' : 'text-[#0f766e]'}>
                "You are currently pacing <span className="font-semibold text-[#2dd4bf]">12% lower</span> in Entertainment than last month. Consider reallocating $200 to your <span className="font-semibold text-[#f87171]">Travel budget</span> to cover the unexpected surge in commute costs."
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className={isDark ? 'px-4 py-2 rounded-2xl bg-[#0f172a] border border-[#2dd4bf]/30 text-[#2dd4bf] hover:bg-[#131b2e] transition' : 'px-4 py-2 rounded-2xl bg-white border border-[#d3e4fe] text-[#0f766e] hover:bg-[#eff6ff] transition'}>Apply Reallocation</button>
              <button className={isDark ? 'px-4 py-2 rounded-2xl bg-[#0f172a] border border-[#475569]/30 text-[#cbd5e1] hover:bg-[#131b2e] transition' : 'px-4 py-2 rounded-2xl bg-white border border-[#d3e4fe] text-[#64748b] hover:bg-[#eff4ff] transition'}>See Projected Savings</button>
              <button className={isDark ? 'px-4 py-2 rounded-2xl bg-[#0f172a] border border-[#475569]/30 text-[#cbd5e1] hover:bg-[#131b2e] transition' : 'px-4 py-2 rounded-2xl bg-white border border-[#d3e4fe] text-[#64748b] hover:bg-[#eff4ff] transition'}>Analyze Subscriptions</button>
            </div>
          </div>
          <div className={isDark ? 'rounded-3xl p-6 bg-[#131b2e] border border-[#475569]/20 shadow-sm' : 'rounded-3xl p-6 bg-white border border-[#d3e4fe] shadow-sm'}>
            <div className="flex justify-between items-center mb-6">
              <span className={isDark ? 'text-xs uppercase tracking-[0.24em] text-[#94a3b8]' : 'text-xs uppercase tracking-[0.24em] text-[#64748b]'}>Spending Velocity</span>
              <span className="text-xs text-[#2dd4bf] bg-[#0f172a] px-2 py-1 rounded-full">+15% vs Avg</span>
            </div>
            <div className="flex items-end gap-2 h-32 px-2">
              {[40, 55, 75, 45, 90, 65, 30].map((height, index) => (
                <div key={index} className="w-full rounded-t-xl bg-[#0f172a] relative overflow-hidden group" style={{ height: `${height}%` }}>
                  <div className={index === 4 ? 'absolute inset-x-0 bottom-0 bg-[#f87171] rounded-t-xl h-full transition-all group-hover:h-full' : 'absolute inset-x-0 bottom-0 bg-[#2dd4bf] rounded-t-xl h-full transition-all group-hover:h-full'} />
                </div>
              ))}
            </div>
            <div className={isDark ? 'mt-4 text-[10px] text-[#94a3b8] uppercase tracking-[0.24em] flex justify-between' : 'mt-4 text-[10px] text-[#64748b] uppercase tracking-[0.24em] flex justify-between'}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation theme={theme} activeItem="Finance" />
    </div>
  )
}
