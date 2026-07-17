import React, { useEffect, useState } from 'react'

const categories = ['Food', 'Transport', 'Shopping', 'Bills & Utilities', 'Healthcare', 'Entertainment', 'Travel', 'Education', 'Rent', 'Insurance', 'Investments', 'Gifts & Donations', 'Personal Care', 'Others']
const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

export default function AddBudgetDialog({ open, theme, onClose, onSave,editingBudget }) {
  if (!open) return null

  const isDark = theme === 'dark'
  const panelClass = isDark ? 'bg-[#131b2e] border border-[#31394d] text-[#f1f5f9]' : 'bg-white border border-[#d3e4fe] text-[#0b1c30]'
  const headerClass = isDark ? 'border-[#31394d]' : 'border-[#d3e4fe]'
  const buttonPrimary = isDark ? 'bg-[#2dd4bf] text-[#0f172a] hover:bg-[#22b49d]' : 'bg-[#00685f] text-white hover:bg-[#005049]'
  const buttonSecondary = isDark ? 'border border-[#475569]/50 text-[#f1f5f9] hover:bg-[#1e293b]' : 'border border-[#d3e4fe] text-[#0b1c30] hover:bg-[#eff4ff]'
  const inputClass = isDark ? 'bg-[#0f172a] border border-[#31394d] text-[#f1f5f9] placeholder:text-slate-500' : 'bg-[#f8fbff] border border-[#d3e4fe] text-[#0b1c30] placeholder:text-slate-500'
  const labelClass = isDark ? 'text-[#94a3b8]' : 'text-[#5c647b]'

  const currDate=new Date();
  const [category, setCategory] = useState(categories[0])
  const [limit, setLimit] = useState('')
  const [month, setMonth] = useState(currDate.getMonth()+1);
  const [year,setyear]=useState(currDate.getFullYear());

  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ];

  useEffect(() => {
    if(editingBudget){
      setCategory(editingBudget.category);
      setLimit(editingBudget.monthlyLimit);
      setMonth(editingBudget.month);
      setyear(editingBudget.year);
    }
    else{
      setCategory(categories[0]);
      setLimit('');
      setMonth(currDate.getMonth() + 1);
      setyear(currDate.getFullYear());
    }
  }, [open,editingBudget]);

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({category, limit, month, year});
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-10 pb-8 bg-slate-950/20 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden ${panelClass}`} style={{ animation: 'dialogPop 220ms ease-out' }}>
        <div className={`p-6 border-b ${headerClass} flex items-center justify-between ${panelClass}`}>
          <h3 className={isDark ? 'text-xl font-bold text-[#f1f5f9]' : 'text-xl font-bold text-[#0b1c30]'}>Create Budget</h3>
          <button type="button" className={isDark ? 'text-[#94a3b8] hover:text-[#2dd4bf]' : 'text-[#5c647b] hover:text-[#00685f]'} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className={`p-6 space-y-5 ${panelClass}`} onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelClass}`}>Category</label>
            <div className="relative">
              <select
                className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] transition outline-none ${inputClass}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelClass}`}>Monthly Limit</label>
            <div className="relative">
              <span className={isDark ? 'absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' : 'absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]'}>₹</span>
              <input
                type="number"
                min="0"
                step="50"
                className={`w-full rounded-2xl px-4 py-3 pl-10 focus:ring-2 focus:ring-[#2dd4bf] transition outline-none ${inputClass}`}
                placeholder="Enter amount"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelClass}`}>Month</label>
            <div className="relative">
              <select
                className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] transition outline-none ${inputClass}`}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} 
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelClass}`}>Year</label>
            <div className="relative">
              <select
                className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] transition outline-none ${inputClass}`}
                value={year}
                onChange={(e) => setyear(e.target.value)}
              >
                 {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>
          </div>


          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#d3e4fe] dark:border-[#31394d]">
            <button type="button" onClick={onClose} className={`flex-1 rounded-2xl px-6 py-3 font-medium transition ${buttonSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`flex-1 rounded-2xl px-6 py-3 font-bold transition ${buttonPrimary}`}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
