import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import MainHeader from '../../components/MainHeader'
import BottomNavigation from '../../components/BottomNavigation'
import GoalCard from './GoalCard'
import GoalFormDialog from './GoalFormDialog'
import { getGoals, addGoal, editGoal, deleteGoal, getGoalSummary } from '../../services/goalService'

const filterOptions = ['All', 'Active', 'Completed', 'Lagging', 'High Priority']
const sortOptions = ['Nearest Deadline', 'Progress', 'Priority']

const priorityOrder = { High: 3, Medium: 2, Low: 1 }

export default function GoalsPage({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'
  const [goals, setGoals] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [summary, setSummary] = useState({})
  const [filterOption, setFilterOption] = useState('All')
  const [sortOption, setSortOption] = useState('Nearest Deadline')

  const navigate = useNavigate()

  const fetchGoals = async () => {
    try {
      const goalsRes = await getGoals()
      const summaryRes = await getGoalSummary()

      if (goalsRes.success) {
        setGoals(goalsRes.data)
      }

      if (summaryRes.success) {
        setSummary(summaryRes.data)
      }
      
    } catch (e) {
      console.error(e)
    }
  }

  const getGoalProgress = (goal) => {
    if (!goal || !goal.targetAmount) return 0
    return Math.min(Math.max((goal.currentSavings / goal.targetAmount) * 100, 0), 100)
  }

  const displayGoals = useMemo(() => {
    const filtered = goals.filter((goal) => {
      if (filterOption === 'Active') return goal.status === 'Active'
      if (filterOption === 'Completed') return goal.status === 'Completed'
      if (filterOption === 'Lagging') return goal.status === 'Lagging'
      if (filterOption === 'High Priority') return goal.priority === 'High'
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sortOption === 'Progress') {
        return getGoalProgress(b) - getGoalProgress(a)
      }
      if (sortOption === 'Priority') {
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      }
      const aDate = a.targetDate ? new Date(a.targetDate).getTime() : 0
      const bDate = b.targetDate ? new Date(b.targetDate).getTime() : 0
      return aDate - bDate
    })
  }, [goals, filterOption, sortOption])


  useEffect(() => {
    fetchGoals()
  }, [])

  const remainingPercentage = (summary.totalSaved / (summary.totalSaved + summary.totalRemaining)) * 100
  const progress = Math.min(Math.max(remainingPercentage || 0, 0), 100)

  const filterButtonClass = (option) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    filterOption === option
      ? isDark
        ? 'bg-[#152e37] text-[#2dd4bf]'
        : 'bg-[#e6fffb] text-[#0f766e] border border-[#2dd4bf]'
      : isDark
        ? 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#152e37]'
        : 'bg-white text-[#64748b] border border-[#d3e4fe] hover:bg-[#f8fbff]'
  }`
  const sortButtonClass = isDark
    ? 'rounded-2xl border border-[#334155] bg-[#131b2e] px-4 py-3 text-sm text-[#f1f5f9] hover:bg-[#1f2a3b]'
    : 'rounded-2xl border border-[#d3e4fe] bg-white px-4 py-3 text-sm text-[#0b1c30] hover:bg-[#f8fbff]'

  const handleSaveGoal = async (newGoal) => {
      try {
        const res = await addGoal(newGoal)
        if (res.success) {
          setGoals((prevGoals) => [...prevGoals, res.data])
          setIsDialogOpen(false)
        }
      } catch (error) {
        console.error('Error saving goal:', error)
      }
  }


  return (
    <div className={isDark ? 'min-h-screen bg-[#0b1326] text-[#f1f5f9]' : 'min-h-screen bg-[#f8f9ff] text-[#0b1c30]'}>
      <Sidebar theme={theme} />
      <MainHeader theme={theme} onToggleTheme={onToggleTheme} />

      <GoalFormDialog
        open={isDialogOpen}
        theme={theme}
        onClose={() => {
          setIsDialogOpen(false)
        }}
        onSave={handleSaveGoal}
      />

      

      <main className="pt-24 pb-24 lg:pb-12 lg:ml-[280px] px-4 lg:px-10">
        <section className="mb-12 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="text-sm uppercase tracking-[0.3em] text-[#94a3b8]">Goals</div>
            <h1 className={isDark ? 'text-4xl font-bold text-[#f8fafc]' : 'text-4xl font-bold text-[#0b1c30]'}>Savings Goals</h1>
            <p className={isDark ? 'max-w-2xl text-sm text-[#94a3b8]' : 'max-w-2xl text-sm text-[#64748b]'}>
              Intelligent tracking for your financial milestones with automated contribution forecasting and risk analysis.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={filterButtonClass(option)}
                  onClick={() => setFilterOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase tracking-[0.3em] text-[#94a3b8]">Sort by</span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className={isDark ? 'rounded-2xl border border-[#334155] bg-[#131b2e] px-4 py-3 text-sm text-[#f1f5f9] outline-none' : 'rounded-2xl border border-[#d3e4fe] bg-white px-4 py-3 text-sm text-[#0b1c30] outline-none'}
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className={isDark ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-white text-[#0b1c30]'}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="flex items-center gap-2 rounded-2xl bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_20px_50px_rgba(45,212,191,0.18)] hover:brightness-95"
                onClick={() => setIsDialogOpen(true)}
              >
                <span className="material-symbols-outlined">add</span>
                Create New Goal
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-12">
          <div className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-6 shadow-sm' : 'rounded-3xl border border-[#d3e4fe] bg-white p-6 shadow-sm'}>
            <p className="text-sm uppercase tracking-[0.28em] text-[#94a3b8] mb-3">Total Saved</p>
            <h2 className="text-3xl font-bold text-[#2dd4bf]">₹{summary.totalSaved?.toFixed(2) || '0.00'}</h2>
            
          </div>
          <div className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-6 shadow-sm' : 'rounded-3xl border border-[#d3e4fe] bg-white p-6 shadow-sm'}>
            <p className="text-sm uppercase tracking-[0.28em] text-[#94a3b8] mb-3">Target Remaining</p>
            <h2 className="text-3xl font-bold text-[#f97a76]">₹{summary.totalRemaining?.toFixed(2) || '0.00'}</h2>
            <div className="mt-4 h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
              <div className="h-full bg-[#f97a76] transition-all duration-700" style={{ width: `${progress || 0}%` }}/>
            </div>
          </div>
          <div className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-6 shadow-sm' : 'rounded-3xl border border-[#d3e4fe] bg-white p-6 shadow-sm'}>
            <p className="text-sm uppercase tracking-[0.28em] text-[#94a3b8] mb-3">Active Goals</p>
            <h2 className="text-3xl font-bold">{summary.activeGoals || '0'}</h2>
            <p className="mt-2 text-xs text-[#94a3b8]">{summary.activeGoals || '0'} on track • {summary.laggingGoals || '0'} lagging • {summary.completedGoals || '0'} completed</p>
          </div>
          <div className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-6 shadow-sm' : 'rounded-3xl border border-[#d3e4fe] bg-white p-6 shadow-sm'}>
            <p className="text-sm uppercase tracking-[0.28em] text-[#94a3b8] mb-3">Overall Completion</p>
            <h2 className="text-3xl font-bold text-[#2dd4bf]">{summary.overallCompletion?.toFixed(2) || '0.00'}%</h2>
            <div className="mt-4 h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
              <div className="h-full bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.24)] transition-all duration-700" style={{ width: `${summary.overallCompletion || 0}%` }}/>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3 mb-12">
          {displayGoals.length > 0 ? (
            displayGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                theme={theme}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal)}
                onAddSaving={() =>navigate(`/goals/${goal._id}`, { state: {goal,theme,openAddSavings: true}})}
                onViewHistory={() => navigate(`/goals/${goal._id}`,{state:{goal,theme}})}
              />
            ))
          ) : (
            <div className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-8 text-center text-[#cbd5e1]' : 'rounded-3xl border border-[#d3e4fe] bg-white p-8 text-center text-[#475569]'}>
              No goals match this filter yet.
            </div>
          )}
        </section>

        <section className={isDark ? 'rounded-3xl border border-[#475569]/20 bg-[#131b2e] p-8 shadow-sm' : 'rounded-3xl border border-[#d3e4fe] bg-white p-8 shadow-sm'}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94a3b8] mb-4">Saving Forecast</p>
              <h2 className={isDark ? 'text-4xl font-bold text-[#f8fafc] mb-3' : 'text-4xl font-bold text-[#0f172a] mb-3'}>
                'March 2025 Forecast unavailable'
              </h2>
              <p className={isDark ? 'text-sm text-[#94a3b8]' : 'text-sm text-[#64748b]'}>
                At your current saving rate, you'll reach your next goal earlier than expected.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div>
                  <p className={isDark ? 'text-3xl font-bold text-[#2dd4bf]' : 'text-3xl font-bold text-[#0f766e]'}>+₹420</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#94a3b8]">Monthly Avg</p>
                </div>
                <div>
                  <p className={isDark ? 'text-3xl font-bold text-[#f8fafc]' : 'text-3xl font-bold text-[#0f172a]'}>{ 0}%</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#94a3b8]">Efficiency</p>
                </div>
              </div>
            </div>
            <div className={isDark ? 'w-full lg:w-2/5 h-56 relative rounded-3xl border border-[#475569]/20 bg-[#0f172a]/70 p-4 overflow-hidden' : 'w-full lg:w-2/5 h-56 relative rounded-3xl border border-[#d3e4fe]/20 bg-[#f8fafc] p-4 overflow-hidden'}>
              <div className="absolute inset-0 grid grid-cols-10 gap-2 items-end px-2 pb-4">
                {[20, 35, 40, 55, 50, 70, 65, 80, 90, 100].map((height, idx) => (
                  <div key={idx} className="w-full rounded-t-2xl bg-[#2dd4bf] transition-all" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between pr-3 text-[10px] text-[#94a3b8]">
                <span>$20k</span>
                <span>$15k</span>
                <span>$10k</span>
                <span>$5k</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation theme={theme} activeItem="Finance" />
    </div>
  )
}
