import React, { useEffect, useMemo, useState } from 'react'

const goalIcons = ['💰', '🏠', '🚗', '✈️', '🎓', '💍', '📱', '🩺', '🛡️', '🎁']
const priorities = ['Low', 'Medium', 'High']

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FieldLabel({ children, htmlFor, isDark, optional = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-2 block text-sm font-semibold tracking-tight',
        isDark ? 'text-slate-200' : 'text-slate-800'
      )}
    >
      {children}
      {optional && (
        <span className={cn('ml-1 text-xs font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>
          (Optional)
        </span>
      )}
    </label>
  )
}

function InputShell({ children, isDark }) {
  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        '[&>*]:w-full [&>*]:rounded-2xl [&>*]:border [&>*]:px-4 [&>*]:py-3.5 [&>*]:text-sm [&>*]:outline-none [&>*]:transition-all [&>*]:duration-200',
        '[&>*]:focus:ring-4 [&>*]:disabled:cursor-not-allowed [&>*]:disabled:opacity-60',
        isDark
          ? '[&>*]:border-slate-700 [&>*]:bg-slate-900/90 [&>*]:text-slate-100 [&>*]:placeholder:text-slate-500 [&>*]:focus:border-teal-400 [&>*]:focus:ring-teal-400/15'
          : '[&>*]:border-slate-200 [&>*]:bg-white [&>*]:text-slate-900 [&>*]:placeholder:text-slate-400 [&>*]:focus:border-teal-500 [&>*]:focus:ring-teal-500/15'
      )}
    >
      {children}
    </div>
  )
}

function CurrencyInput({ id, value, onChange, isDark, label }) {
  return (
    <div>
      <FieldLabel htmlFor={id} isDark={isDark}>
        {label}
      </FieldLabel>
      <div className="relative">
        <span
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          ₹
        </span>
        <InputShell isDark={isDark}>
          <input
            id={id}
            type="number"
            min="0"
            step="100"
            inputMode="numeric"
            value={value}
            onChange={onChange}
            className="pl-8"
            required
            aria-label={label}
          />
        </InputShell>
      </div>
    </div>
  )
}

function SelectField({ id, label, value, onChange, options, isDark }) {
  return (
    <div>
      <FieldLabel htmlFor={id} isDark={isDark}>
        {label}
      </FieldLabel>
      <InputShell isDark={isDark}>
        <select id={id} value={value} onChange={onChange} aria-label={label}>
          {options.map((option) => {
            const item = typeof option === 'string' ? { label: option, value: option } : option
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </select>
      </InputShell>
    </div>
  )
}

export default function GoalFormDialog({
  open = true,
  theme = 'light',
  onClose,
  onSave,
  editingGoal = null
}) {
  const isDark = theme === 'dark'

  const today = useMemo(() => new Date(), [])
  const defaultTargetDate = useMemo(() => {
    const nextYear = new Date(today)
    nextYear.setFullYear(today.getFullYear() + 1)
    return nextYear.toISOString().split('T')[0]
  }, [today])

  const inititalState={
    goalName:'',
    goalIcon:goalIcons[0],
    targetAmount:'',
    currentSavings:'',
    targetDate:defaultTargetDate,
    priority:"Medium",
    description:'',
    status:'Active'
  };
  
  const [goal,setGoal]=useState(inititalState);

  useEffect(() => {
    if (!open) return

    if (editingGoal) {
      setGoal({
        ...editingGoal,
        targetDate: editingGoal.targetDate
          ? editingGoal.targetDate.split("T")[0]
          : defaultTargetDate
      })
    } else {
      setGoal(inititalState)
    }
  }, [open, editingGoal, defaultTargetDate])
      
  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
     onSave({
      ...goal,
      goalName: goal.goalName.trim(),
      targetAmount: Number(goal.targetAmount),
      currentSavings: Number(goal.currentSavings),
      description: goal.description.trim()
    });
  }

  const progress = goal.targetAmount && Number(goal.targetAmount) > 0
    ? Math.min((Number(goal.currentSavings || 0) / Number(goal.targetAmount)) * 100, 100)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div
        className={cn(
          'w-full max-w-2xl overflow-hidden rounded-[28px] border shadow-2xl transition-all duration-300',
          isDark
            ? 'border-slate-700/70 bg-slate-950 text-slate-100 shadow-black/30'
            : 'border-slate-200 bg-slate-50 text-slate-900 shadow-slate-200/80'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-form-title"
      >
        <div
          className={cn(
            'border-b px-6 py-5 sm:px-8',
            isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="goal-form-title" className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <p className={cn('mt-1 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                Set up a savings goal with a clear target, timeline, and priority.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4',
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800 focus:ring-teal-400/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 focus:ring-teal-500/20'
              )}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div>
                <FieldLabel htmlFor="goalName" isDark={isDark}>
                  Goal Name
                </FieldLabel>
                <InputShell isDark={isDark}>
                  <input
                    id="goalName"
                    type="text"
                    value={goal.goalName}
                    onChange={(event) => setGoal({ ...goal, goalName: event.target.value })}
                    placeholder="Emergency Fund"
                    required
                    maxLength={80}
                    aria-label="Goal Name"
                  />
                </InputShell>
              </div>

              <SelectField
                id="goalIcon"
                label="Goal Icon"
                value={goal.goalIcon}
                onChange={(event) => setGoal({ ...goal, goalIcon: event.target.value })}
                options={goalIcons.map((icon) => ({ label: `${icon} `, value: icon }))}
                isDark={isDark}
              />

              <CurrencyInput
                id="targetAmount"
                label="Target Amount"
                value={goal.targetAmount}
                onChange={(event) => setGoal({ ...goal, targetAmount: event.target.value }  )}
                isDark={isDark}
              />

              <CurrencyInput
                id="currentSavings"
                label="Current Savings"
                value={goal.currentSavings}
                onChange={(event) => setGoal({ ...goal, currentSavings: event.target.value })}
                isDark={isDark}
              />
            </div>

            <div
              className={cn(
                'rounded-3xl border p-5',
                isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'
              )}
            >
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl text-2xl',
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  )}
                >
                  {goal.goalIcon}
                </div>
                <div className="min-w-0">
                  <p className={cn('truncate text-sm font-semibold', isDark ? 'text-slate-200' : 'text-slate-800')}>
                    {goal.goalName || 'Your goal preview'}
                  </p>
                  <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Track progress toward your target
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{Math.round(progress)}%</span>
                  </div>
                  <div className={cn('h-2.5 overflow-hidden rounded-full', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={cn('rounded-2xl p-4', isDark ? 'bg-slate-800/80' : 'bg-slate-50')}>
                    <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>Target</p>
                    <p className="mt-1 text-base font-bold">₹{goal.targetAmount || '0'}</p>
                  </div>
                  <div className={cn('rounded-2xl p-4', isDark ? 'bg-slate-800/80' : 'bg-slate-50')}>
                    <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>Saved</p>
                    <p className="mt-1 text-base font-bold">₹{goal.currentSavings || '0'}</p>
                  </div>
                </div>

                <div className={cn('rounded-2xl p-4', isDark ? 'bg-slate-800/80' : 'bg-slate-50')}>
                  <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>Priority</p>
                  <p className="mt-1 text-sm font-semibold">{goal.priority}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="targetDate" isDark={isDark}>
                Target Date
              </FieldLabel>
              <InputShell isDark={isDark}>
                <input
                  id="targetDate"
                  type="date"
                  value={goal.targetDate}
                  min={today.toISOString().split('T')[0]}
                  onChange={(event) => setGoal({ ...goal, targetDate: event.target.value })}
                  required
                  aria-label="Target Date"
                />
              </InputShell>
            </div>

            <SelectField
              id="priority"
              label="Priority"
              value={goal.priority}
              onChange={(event) => setGoal({ ...goal, priority: event.target.value })}
              options={priorities}
              isDark={isDark}
            />
          </div>

          <div>
            <FieldLabel htmlFor="description" isDark={isDark} optional>
              Description
            </FieldLabel>
            <InputShell isDark={isDark}>
              <textarea
                id="description"
                rows={4}
                value={goal.description}
                onChange={(event) => setGoal({ ...goal, description: event.target.value })}
                placeholder="Add notes about this goal, contribution plan, or why it matters."
                aria-label="Description"
                className="resize-none"
              />
            </InputShell>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4',
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus:ring-slate-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300/30'
              )}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
