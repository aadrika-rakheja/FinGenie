import React, { useMemo, useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getGoalById, editGoal, deleteGoal, addGoalContribution } from '../../services/goalService';
import AddSavingsDialog from './AddSavingsDialog';
import GoalFormDialog from './GoalFormDialog';

const statusLabelClass = {
  Active: 'bg-emerald-500/10 text-emerald-400',
  'Behind Schedule': 'bg-orange-500/10 text-orange-400',
  Overdue: 'bg-red-500/10 text-red-400',
  Completed: 'bg-teal-500/10 text-teal-300',
};

const priorityLabelClass = {
  High: 'bg-red-500/10 text-red-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  Low: 'bg-emerald-500/10 text-emerald-400',
};

const fmtINR = (n) =>
  '₹' + Math.round(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const DAY_MS = 1000 * 60 * 60 * 24;

export default function GoalDetailPage({ theme = 'dark', onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isDark = theme === 'dark';

  const [goal, setGoal] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(goal);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);


  useEffect(() => {
    if (location.state?.openAddSavings) {
      setDialogOpen(true);
    }
  }, [location.state]);

  const fetchGoal = async () => {
    try {
      const res = await getGoalById(id);
      if (res.success) {
        setGoal(res.data);
        setContributions(res.data.contributions || []);
        setMonthlyData(res.data.monthlyContributions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Everything below is read straight off the backend-provided goal object.
  const progress = goal?.percentage || 0;
  const remaining = goal?.remaining || 0;
  const pace = goal?.monthlyPace || 0;
  const requiredMonthly = goal?.requiredMonthly || 0;
  const onTrack = !!goal?.onTrack;
  const projectedDate = goal?.projectedCompletion ? new Date(goal.projectedCompletion) : null;

  const isComplete = goal?.status === 'Completed';
  const isOverdue = goal?.status === 'Overdue';

  const daysDiff = useMemo(() => {
    if (!goal?.targetDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(goal.targetDate);
    return Math.round((target - today) / DAY_MS);
  }, [goal?.targetDate]);

  const isUrgent = !isOverdue && !isComplete && daysDiff <= 30 && daysDiff >= 0;

  const urgencyText = isComplete
    ? 'Goal complete'
    : isOverdue
    ? `${Math.abs(daysDiff)} days overdue`
    : `${daysDiff} days remaining`;

  const urgencyClass = isComplete
    ? 'bg-teal-500/10 text-teal-300'
    : isOverdue
    ? 'bg-red-500/10 text-red-400'
    : isUrgent
    ? 'bg-orange-500/10 text-orange-400'
    : isDark
    ? 'bg-[#112b2a] text-[#2dd4bf]'
    : 'bg-[#ecfdf5] text-[#047857]';

  const handleAddSavings = async (data) => {
    try {
      const res = await addGoalContribution(id,data);
      if (res.success) {
        await fetchGoal();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding savings:', error);
    }
  };

  const handleDeleteGoal = async (goal) => {
    try {
      const res = await deleteGoal(goal);
      if (res.success) {
        navigate('/goals'); // Navigate back to the goals list after deletion
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEditGoal = () => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleSaveGoal = async (updatedGoal) => {
    try {
      const res = await editGoal(updatedGoal);
      if (res.success) {
        await fetchGoal();
        setIsDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - progress / 100);

  const pageClass = isDark ? 'bg-[#0a0f1e] text-[#f1f5f9]' : 'bg-[#f6f7fc] text-[#0b1c30]';
  const cardClass = isDark
    ? 'rounded-3xl border border-[#1e293b] bg-[#131b2e]'
    : 'rounded-3xl border border-[#e4e8f5] bg-white';
  const surfaceAltClass = isDark ? 'bg-[#0f172a]' : 'bg-[#eff6ff]';
  const mutedText = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';
  const faintText = isDark ? 'text-[#5c6780]' : 'text-[#94a3b8]';

  return (
    <div className={`${pageClass} min-h-screen font-sans`}>

      <GoalFormDialog
        open={isDialogOpen}
        theme={theme}
        editingGoal={editingGoal}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveGoal}
      />

      {isLoading ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-current border-t-transparent text-[#2dd4bf]" />
            <p className={mutedText}>Loading goal details...</p>
          </div>
        </div>
      ) : !goal ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16 flex items-center justify-center min-h-[60vh]">
          <button
            onClick={() => navigate('/goals')}
            className="px-6 py-3 rounded-xl font-semibold bg-[#2dd4bf] text-[#0a0f1e]"
          >
            Go Back to Goals
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border ${isDark ? 'bg-[#131b2e] border-[#1e293b] text-[#94a3b8]' : 'bg-white border-[#e4e8f5] text-[#64748b]'}`}
            >
              ← Back to Goals
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? 'bg-[#131b2e] border-[#1e293b] text-[#94a3b8]' : 'bg-white border-[#e4e8f5] text-[#64748b]'}`}
            >
              {isDark ? <span className="material-symbols-outlined">light_mode</span> : <span className="material-symbols-outlined">dark_mode</span>}
            </button>
          </div>

          {/* Hero */}
          <section className={`${cardClass} p-6 sm:p-8 mb-6`}>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div className={isDark ? 'rounded-2xl bg-[#112b2a] p-4 text-3xl' : 'rounded-2xl bg-[#ecfdf5] p-4 text-3xl'}>
                  {goal.goalIcon || '💰'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold">{goal.goalName}</h1>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusLabelClass[goal.status] || statusLabelClass.Active}`}>
                      {goal.status}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityLabelClass[goal.priority] || priorityLabelClass.Medium}`}>
                      {goal.priority} priority
                    </span>
                  </div>
                  <p className={`text-sm max-w-md ${mutedText}`}>{goal.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 xl:shrink-0">
                <button
                  type="button"
                  onClick={handleEditGoal}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border ${isDark ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-[#f1f3fb] border-[#e4e8f5]'}`}
                >
                    <span className="material-symbols-outlined text-sm">edit</span> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-red-500/10 text-red-400"
                >
                   <span className="material-symbols-outlined text-sm">delete</span> Delete
                </button>
              </div>
            </div>

            {/* Insight strip */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${urgencyClass}`}>
                {isComplete ? '✨' : isOverdue || isUrgent ? '📉' : '📅'} {urgencyText}
              </div>
              {!isComplete && (
                <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ${onTrack ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {onTrack ? '📈' : '📉'} {onTrack ? 'On Track' : 'Behind Schedule'}
                </div>
              )}
              {projectedDate && !isComplete && (
                <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium border ${isDark ? 'bg-[#0f172a] border-[#1e293b] text-[#94a3b8]' : 'bg-[#f1f3fb] border-[#e4e8f5] text-[#64748b]'}`}>
                  ✨ Projected finish {fmtDate(projectedDate)}
                </div>
              )}
            </div>
          </section>

          {/* Progress + stats / contribution history */}
          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] mb-6">
            {/* Left: progress ring + stats */}
            <div className={`${cardClass} p-6 sm:p-8`}>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative h-32 w-32 shrink-0">
                  <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
                    <circle cx="64" cy="64" r={radius} fill="none" className={isDark ? 'stroke-[#0f172a]' : 'stroke-[#eff6ff]'} strokeWidth="10" />
                    <circle
                      cx="64" cy="64" r={radius} fill="none"
                      stroke={isComplete ? '#95f2b7' : '#2dd4bf'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dash}   
                      style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{progress.toFixed(0)}%</span>
                    <span className={`text-[11px] ${faintText}`}>funded</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-xs uppercase tracking-[0.2em] mb-2 ${faintText}`}>Goal Details</p>
                  <p className={`text-sm leading-6 ${mutedText}`}>
                    <span className="font-semibold">{fmtINR(goal.currentSavings)}</span> saved of{' '}
                    <span className="font-semibold">{fmtINR(goal.targetAmount)}</span> target
                  </p>
                  <div className={`mt-3 h-2 rounded-full overflow-hidden ${surfaceAltClass}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                      style={{ width: `${progress}%`, transition: 'width .9s cubic-bezier(.4,0,.2,1)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <StatBlock surfaceAltClass={surfaceAltClass} faintText={faintText} icon="🎯" label="Target Amount" value={fmtINR(goal.targetAmount)} />
                <StatBlock surfaceAltClass={surfaceAltClass} faintText={faintText} icon="💼" label="Saved" value={fmtINR(goal.currentSavings)} accent="text-[#2dd4bf]" />
                <StatBlock surfaceAltClass={surfaceAltClass} faintText={faintText} icon="📈" label="Remaining" value={fmtINR(remaining)} />
                <StatBlock surfaceAltClass={surfaceAltClass} faintText={faintText} icon="📅" label="Deadline" value={fmtDate(goal.targetDate)} />
              </div>

              <div className={`rounded-2xl p-4 flex items-center justify-between gap-4 ${onTrack ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${onTrack ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Required monthly to stay on track
                  </p>
                  <p className="text-lg font-bold">
                    {isComplete ? '—' : fmtINR(requiredMonthly)}
                    <span className={`text-xs font-medium ml-1 ${mutedText}`}>/mo</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium mb-1 ${mutedText}`}>Your recent pace</p>
                  <p className="text-lg font-bold">
                    {fmtINR(pace)}
                    <span className={`text-xs font-medium ml-1 ${mutedText}`}>/mo</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: contribution history */}
            <div className={`${cardClass} p-6 sm:p-8 flex flex-col`}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs uppercase tracking-[0.2em] mb-1 ${faintText}`}>Contribution History</p>
                  <h2 className="text-xl font-semibold">Recent Contributions</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#2dd4bf] text-[#0f172a] hover:bg-[#22c5ac] transition"
                >
                  + Add Savings
                </button>
              </div>

              <div className={`rounded-2xl overflow-hidden flex-1 border ${isDark ? 'border-[#1e293b]' : 'border-[#e4e8f5]'}`}>
                <div className={`grid grid-cols-[1.2fr_0.9fr_1fr] gap-3 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${surfaceAltClass} ${faintText}`}>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Merchant</span>
                </div>
                <div>
                  {contributions.slice(0, 6).map((item) => (
                    <div
                      key={item.id || item._id}
                      className={`grid grid-cols-[1.2fr_0.9fr_1fr] gap-3 px-5 py-3.5 text-sm items-center border-t ${isDark ? 'border-[#1e293b]' : 'border-[#e4e8f5]'}`}
                    >
                      <span className={mutedText}>{fmtDate(item.transactionDate)}</span>
                      <span className="font-semibold text-emerald-400">+{fmtINR(item.amount)}</span>
                      <span className={faintText}>{item.merchant}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Momentum chart */}
          <section className={`${cardClass} p-6 sm:p-8`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p className={`text-xs uppercase tracking-[0.2em] mb-1 ${faintText}`}>Monthly Momentum</p>
                <h2 className="text-xl font-semibold">Savings trend</h2>
              </div>
              <p className={`text-sm ${mutedText}`}>
                Required pace: <span className="font-semibold">{fmtINR(requiredMonthly)}/mo</span>
              </p>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={isDark ? '#1e293b' : '#e4e8f5'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#5c6780' : '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#182236' : '#ffffff',
                      border: `1px solid ${isDark ? '#1e293b' : '#e4e8f5'}`,
                      borderRadius: 12,
                      color: isDark ? '#f1f5f9' : '#0b1c30',
                      fontSize: 13,
                    }}
                    formatter={(v) => [fmtINR(v), 'Saved']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#2dd4bf" strokeWidth={2.5} fill="url(#momentumFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {dialogOpen && (
        <AddSavingsDialog
          open={dialogOpen}
          theme={theme}
          goal={goal}
          onClose={() => setDialogOpen(false)}
          onSave={handleAddSavings}
        />
      )}
    </div>
  );
}

function StatBlock({ surfaceAltClass, faintText, icon, label, value, accent }) {
  return (
    <div className={`rounded-2xl p-4 ${surfaceAltClass}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs">{icon}</span>
        <p className={`text-[11px] uppercase tracking-[0.16em] ${faintText}`}>{label}</p>
      </div>
      <p className={`text-base font-bold ${accent || ''}`}>{value}</p>
    </div>
  );
}
