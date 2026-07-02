import React, { useEffect, useState } from 'react'


export default function AddExpenseDialog({ open, theme, onClose ,handleAddExpense, editingExpense, handleEdit}) {
  if (!open) return null

  const isDark = theme === 'dark'
  const [selectedType, setSelectedType] = useState('Expense')

  const expenseCategories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Entertainment',
    'Travel',
    'Education',
    'Rent',
    'Insurance',
    'Investments',
    'Gifts & Donations',
    'Personal Care',
    'Others',
  ]

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investment Returns',
    'Rental Income',
    'Bonus',
    'Gift',
    'Refund',
    'Interest',
    'Other Income',
  ]

  const selectedCategories = selectedType === 'Income' ? incomeCategories : expenseCategories

  const panelClass = isDark
    ? 'bg-[#131b2e] border border-[#31394d] text-[#f1f5f9]'
    : 'bg-white border border-[#d3e4fe] text-[#0b1c30]'
  const headerClass = isDark ? 'border-[#31394d]' : 'border-[#d3e4fe]'
  const buttonPrimary = isDark
    ? 'bg-[#2dd4bf] text-[#0f172a] hover:bg-[#22b49d]'
    : 'bg-[#00685f] text-white hover:bg-[#005049]'
  const buttonSecondary = isDark
    ? 'border border-[#475569]/50 text-[#f1f5f9] hover:bg-[#1e293b]'
    : 'border border-[#d3e4fe] text-[#0b1c30] hover:bg-[#eff4ff]'
  const inputClass = isDark
    ? 'bg-[#0f172a] border border-[#31394d] text-[#f1f5f9] placeholder:text-slate-500'
    : 'bg-[#f8fbff] border border-[#d3e4fe] text-[#0b1c30] placeholder:text-slate-500'
  const labelClass = isDark ? 'text-[#94a3b8]' : 'text-[#5c647a]'
  const typeButton = (type) =>
    selectedType === type
      ? isDark
        ? 'bg-[#2dd4bf] text-[#0f172a]'
        : 'bg-[#00685f] text-white'
      : isDark
      ? 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#1e293b]'
      : 'bg-[#f1f5ff] text-[#5c647a] hover:bg-[#eff4ff]'



  const initialState={
    merchant: '',
    amount: '',
    type: 'Expense',
    category: expenseCategories[0],
    currency: 'INR',
    paymentMethod: 'Cash',
    transactionDate: '',
  };

  const  [expense, setExpense] = useState(initialState);

  useEffect(()=>{
    if(editingExpense){
       setExpense({
            ...editingExpense,
            transactionDate: editingExpense.transactionDate
                ? editingExpense.transactionDate.slice(0, 10)
                : ""
        });
      setSelectedType(editingExpense.type);
    } else {
        setExpense(initialExpense);
        setSelectedType("Expense");
    }
  },[editingExpense,open])

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value })
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setExpense((prev) => ({
      ...prev,
      type,
      category: type === 'Income' ? incomeCategories[0] : expenseCategories[0],
    }))
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(editingExpense)
      handleEdit(editingExpense._id,expense);
    else
      handleAddExpense(expense);
  }
  

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-5 pb-[20px] bg-slate-950/20 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col mb-[35px]" style={{ animation: 'dialogPop 220ms ease-out' }}>
        <div className={`p-6 border-b ${headerClass} flex items-center justify-between bg-opacity-90 ${panelClass}`}>
          <h3 className={isDark ? 'text-[20px] font-bold text-[#f1f5f9]' : 'text-[20px] font-bold text-[#0b1c30]'}>Add New Expense</h3>
          <button className={isDark ? 'text-[#94a3b8] hover:text-[#2dd4bf]' : 'text-[#5c647a] hover:text-[#00685f]'} type="button" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className={`p-6 space-y-5 ${panelClass}`} onSubmit={handleSubmit}>
          <div className={`flex gap-2 rounded-3xl border ${isDark ? 'border-[#31394d] bg-[#0f172a]' : 'border-[#d3e4fe] bg-[#f8fbff]'}`}>
            <button
              type="button"
              onClick={() => handleTypeSelect('Expense')}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${typeButton('Expense')}`}>
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeSelect('Income')}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${typeButton('Income')}`}>
              Income
            </button>
          </div>

          <div className="space-y-1">
            <label className={`text-sm font-medium ${labelClass}`}>Merchant Name</label>
            <input className={`w-full rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} placeholder="Enter merchant name" type="text" 
              onChange={handleChange}  name="merchant" value={expense.merchant} required/>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${labelClass}`}>Currency</label>
              <div className="relative">
                <select className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} onChange={handleChange} name="currency" value={expense.currency}>
                  <option>INR</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
            <div className="col-span-2 space-y-1">
              <label className={`text-sm font-medium ${labelClass}`}>Amount</label>
              <input required className={`w-full rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} placeholder="0.00" type="number" min="0" onChange={handleChange} name="amount" value={expense.amount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${labelClass}`}>Date</label>
              <input required className={`w-full rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} type="date" onChange={handleChange} name="transactionDate" value={expense.transactionDate} />
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ${labelClass}`}>Category</label>
              <div className="relative">
                <select required className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} onChange={handleChange} name="category" value={expense.category}>
                  {selectedCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-sm font-medium ${labelClass}`}>Payment Method</label>
            <div className="relative">
              <select required className={`w-full rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent transition-all outline-none ${inputClass}`} onChange={handleChange} name="paymentMethod" value={expense.paymentMethod} >
                <option>Cash</option>
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelClass}`}>Receipt (Optional)</label>
            <div className={`rounded-2xl border-2 border-dashed ${isDark ? 'border-[#475569]/40 bg-[#0f172a]' : 'border-[#d3e4fe] bg-[#f8fbff]'} p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors hover:border-[#2dd4bf]/50`}>
              <span className="material-symbols-outlined text-2xl text-[#94a3b8]">cloud_upload</span>
              <p className={`text-[12px] ${isDark ? 'text-[#94a3b8]' : 'text-[#5c647a]'}`}>
                Drag & drop or <span className="font-bold text-primary">browse</span>
              </p>
              <p className={`text-[10px] ${isDark ? 'text-[#94a3b8]/70' : 'text-[#5c647a]/70'}`}>JPG, PNG, PDF (Max 5MB)</p>
            </div>
          </div>
        

          <div className={`p-6 border-t ${headerClass} bg-opacity-90 ${panelClass} flex gap-3`}>
            <button type="button" onClick={onClose} className={`flex-1 rounded-2xl px-6 py-3 font-medium transition ${buttonSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`flex-1 rounded-2xl px-6 py-3 font-bold transition ${buttonPrimary}`}>
              {editingExpense? "Edit Expense" : "Add Expense"}
            </button>
          </div>
          </form>
      </div>
    </div>

  )
}
