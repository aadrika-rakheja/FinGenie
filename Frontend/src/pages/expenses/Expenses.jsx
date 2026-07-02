import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import MainHeader from '../../components/MainHeader'
import AddExpenseDialog from './AddExpenseDialog'
import { addExpense,deleteExpense, editExpense, getExpenses } from '../../services/expenseService'

export default function Expenses({ theme, onToggleTheme }) {
  const [transactions, setTransactions] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        if(res.success){
          setTransactions(res.data);
        }
      } catch (e) {
        console.error('Error fetching expenses:', e)
      }
    }

    fetchExpenses()
  }, [])

  const handleAddExpense = async (expense) => {
      try{
        const response = await addExpense(expense);
        if(response?.success){
          setTransactions(prev=>[ response.data,...prev])
          console.log("Expense added successfully:", response);
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error adding expense:", error) 
      }
    }

  const handleEditButton=(item)=>{
    setEditingExpense(item);
    setIsDialogOpen(true);
  }
  const handleEdit=async(id,expense)=>{
    try{
      const res=await editExpense(id,expense);
      if(res.success){
        setTransactions(prev=>prev.map(i=>i._id==id?res.data:i));
      }
      setEditingExpense(null);
      setIsDialogOpen(false);
    }catch(e){
       console.error('Error editing expenses:', e)
    }
  }

  const handleDelete=async(id)=>{
    try{
      const res=await deleteExpense(id);
      if(res.success){
         setTransactions((t)=>t.filter(item=>item._id!=id));
        }
    }catch(e){
      console.error('Error deleting expenses:', e)
    }
  }

  const isDark = theme === 'dark'
  const hasTransactions = Array.isArray(transactions) && transactions.length > 0

  const normalizeCategory = (value = '') => value.toString().trim().toLowerCase().replace(/\s+/g, ' ')

  const getCategoryMeta = (category = '') => {
    const normalized = normalizeCategory(category)
    const base = isDark
      ? 'border border-white/10 text-white/90'
      : 'border border-slate-200 text-slate-700'

    const map = {
      food: { icon: 'restaurant', badge: `${base} bg-amber-500/15` },
      transport: { icon: 'directions_car', badge: `${base} bg-sky-500/15` },
      shopping: { icon: 'shopping_bag', badge: `${base} bg-fuchsia-500/15` },
      'bills & utilities': { icon: 'receipt_long', badge: `${base} bg-violet-500/15` },
      healthcare: { icon: 'local_hospital', badge: `${base} bg-rose-500/15` },
      entertainment: { icon: 'movie', badge: `${base} bg-indigo-500/15` },
      travel: { icon: 'flight', badge: `${base} bg-cyan-500/15` },
      education: { icon: 'school', badge: `${base} bg-emerald-500/15` },
      rent: { icon: 'home', badge: `${base} bg-orange-500/15` },
      insurance: { icon: 'shield', badge: `${base} bg-teal-500/15` },
      investments: { icon: 'show_chart', badge: `${base} bg-lime-500/15` },
      'gifts & donations': { icon: 'card_giftcard', badge: `${base} bg-pink-500/15` },
      'personal care': { icon: 'spa', badge: `${base} bg-purple-500/15` },
      others: { icon: 'more_horiz', badge: `${base} bg-slate-500/15` },
      salary: { icon: 'payments', badge: `${base} bg-emerald-500/15` },
      freelance: { icon: 'work', badge: `${base} bg-blue-500/15` },
      business: { icon: 'store', badge: `${base} bg-yellow-500/15` },
      'investment returns': { icon: 'trending_up', badge: `${base} bg-lime-500/15` },
      'rental income': { icon: 'apartment', badge: `${base} bg-cyan-500/15` },
      bonus: { icon: 'emoji_events', badge: `${base} bg-amber-500/15` },
      gift: { icon: 'card_giftcard', badge: `${base} bg-pink-500/15` },
      refund: { icon: 'undo', badge: `${base} bg-slate-500/15` },
      interest: { icon: 'percent', badge: `${base} bg-violet-500/15` },
      'other income': { icon: 'attach_money', badge: `${base} bg-emerald-500/15` },
    }

    return map[normalized] || { icon: 'category', badge: `${base} bg-slate-500/15` }
  }

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={isDark ? 'min-h-screen bg-[#0b1326] text-[#f1f5f9]' : 'min-h-screen bg-[#f8f9ff] text-[#0b1c30]'}>
      <Sidebar theme={theme} />
      <MainHeader theme={theme} onToggleTheme={onToggleTheme} />
      <AddExpenseDialog open={isDialogOpen} theme={theme} onClose={() => setIsDialogOpen(false)} handleAddExpense={handleAddExpense}  editingExpense={editingExpense} handleEdit={handleEdit}/>

      <main className="pt-24 pb-20 lg:pb-10 lg:ml-[280px] px-4 lg:px-10 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className={isDark ? 'text-[32px] sm:text-[48px] leading-[40px] sm:leading-[56px] font-bold text-[#f1f5f9] mb-1' : 'text-[32px] sm:text-[48px] leading-[40px] sm:leading-[56px] font-bold text-[#0b1c30] mb-1'}>Expenses</h2>
            <p className={isDark ? 'text-[16px] text-[#94a3b8]' : 'text-[16px] text-[#5c647a]'}>Review and manage your latest financial movements.</p>
          </div>
          <button onClick={() => setIsDialogOpen(true)} className={isDark? "bg-[#23a997] text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#00685f]/15 hover:bg-[#1a8072] transition-all active:scale-95":"bg-[#00685f] text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#00685f]/15 hover:bg-[#005049] transition-all active:scale-95"}>
            <span className="material-symbols-outlined">add</span>
            Add Expense
          </button>
        </div>
      

        <div className={isDark ? 'bg-[#131b2e] border border-[#475569]/30 rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4' : 'bg-[#f1f5ff] border border-[#d3e4fe] rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4'}>
          <button className={isDark ? 'flex items-center gap-2 px-3 py-2 bg-[#0f172a] rounded-lg border border-[#475569]/30 text-[#94a3b8] hover:border-[#2dd4bf]/50 transition-colors cursor-pointer' : 'flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#d3e4fe] text-[#3d4947] hover:border-[#00685f] transition-colors cursor-pointer'}>
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>Last 30 Days</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className={isDark ? 'flex items-center gap-2 px-3 py-2 bg-[#0f172a] rounded-lg border border-[#475569]/30 text-[#94a3b8] hover:border-[#2dd4bf]/50 transition-colors cursor-pointer' : 'flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#d3e4fe] text-[#3d4947] hover:border-[#00685f] transition-colors cursor-pointer'}>
            <span className="material-symbols-outlined text-sm">category</span>
            <span>All Categories</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className={isDark ? 'flex items-center gap-2 px-3 py-2 bg-[#0f172a] rounded-lg border border-[#475569]/30 text-[#94a3b8] hover:border-[#2dd4bf]/50 transition-colors cursor-pointer' : 'flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#d3e4fe] text-[#3d4947] hover:border-[#00685f] transition-colors cursor-pointer'}>
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            <span>Amount: High to Low</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <div className={isDark ? 'ml-auto flex items-center gap-2 text-[#94a3b8] text-[13px]' : 'ml-auto flex items-center gap-2 text-[#5c647a] text-[13px]'}>
            <span>Showing 12 of 480 transactions</span>
          </div>
        </div>

        {hasTransactions ? (
          <div className={isDark ? 'bg-[#131b2e] border border-[#475569]/30 rounded-2xl overflow-hidden shadow-xl mb-8' : 'bg-white border border-[#d3e4fe] rounded-2xl overflow-hidden shadow-sm mb-8'}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={isDark ? 'bg-[#1e293b]/50 border-b border-[#475569]/30' : 'bg-[#eff4ff] border-b border-[#d3e4fe]'}>
                  <tr>
                    <th className={isDark ? 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#94a3b8]/60' : 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#5c647a]'}>Merchant</th>
                    <th className={isDark ? 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#94a3b8]/60' : 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#5c647a]'}>Category</th>
                    <th className={isDark ? 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#94a3b8]/60' : 'px-6 py-4 text-[13px] uppercase tracking-[0.16em] text-[#5c647a]'}>Date</th>
                    <th className={isDark ? 'px-6 py-4 text-right text-[13px] uppercase tracking-[0.16em] text-[#94a3b8]/60' : 'px-6 py-4 text-right text-[13px] uppercase tracking-[0.16em] text-[#5c647a]'}>Amount</th>
                    <th className={isDark ? 'px-6 py-4 text-center text-[13px] uppercase tracking-[0.16em] text-[#94a3b8]/60' : 'px-6 py-4 text-center text-[13px] uppercase tracking-[0.16em] text-[#5c647a]'}>Actions</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-[#475569]/20' : 'divide-y divide-slate-200'}>
                  {transactions.map((item) => {
                    const categoryMeta = getCategoryMeta(item.category)
                    const isIncome = String(item.type || '').toLowerCase() === 'income'
                    const currencySymbol = item.currency === 'USD' ? '$' : '₹'
                    const amountValue = Number(item.amount || 0)
                    const amountText = `${isIncome ? '+' : '-'}${currencySymbol}${amountValue.toLocaleString(item.currency === 'USD' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    const amountClass = isIncome
                      ? isDark
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                      : isDark
                      ? 'text-rose-400'
                      : 'text-rose-600'

                    return (
                      <tr key={item._id} className={isDark ? 'hover:bg-[#0f172a]/80 transition-all duration-200 group' : 'hover:bg-[#f8fbff] transition-all duration-200 group'}>
                        <td className=  "px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={isDark ? 'w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center' : 'w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center border border-[#d3e4fe]'}>
                              <span className={isDark ? 'material-symbols-outlined text-[#94a3b8]' : 'material-symbols-outlined text-[#00685f]'}>{categoryMeta.icon}</span>
                            </div>
                            <div>
                              <p className={isDark ? 'text-[16px] text-[#f1f5f9] font-medium' : 'text-[16px] text-[#0b1c30] font-medium'}>{item.merchant}</p>
                              <p className={isDark ? 'text-[12px] text-[#94a3b8]' : 'text-[12px] text-[#5c647a]'}>{item.type || 'Transaction'} • {item.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full border text-[12px] font-bold ${categoryMeta.badge}`}>{item.category}</span>
                        </td>
                        <td className={isDark ? 'px-6 py-4 text-[#94a3b8] text-[14px]' : 'px-6 py-4 text-[#5c647a] text-[14px]'}>{formatDate(item.transactionDate)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[14px] font-bold ${amountClass}`}>{amountText}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>handleEditButton(item)} className={isDark ? 'p-2 hover:bg-[#1e293b] rounded-lg text-[#94a3b8] hover:text-[#2dd4bf] transition-colors' : 'p-2 hover:bg-[#eff4ff] rounded-lg text-[#5c647a] hover:text-[#00685f] transition-colors'}>
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={()=>handleDelete(item._id)} className={isDark ? 'p-2 hover:bg-[#f87171]/10 rounded-lg text-[#94a3b8] hover:text-[#f87171] transition-colors' : 'p-2 hover:bg-[#fee2e2] rounded-lg text-[#f87171] hover:text-[#b91c1c] transition-colors'}>
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className={isDark ? 'px-6 py-4 bg-[#1e293b]/30 border-t border-[#475569]/30 flex items-center justify-between' : 'px-6 py-4 bg-[#eff4ff] border-t border-[#d3e4fe] flex items-center justify-between'}>
              <button className={isDark ? 'px-4 py-2 text-[#94a3b8] text-[13px] hover:text-[#2dd4bf] transition-colors flex items-center gap-1 disabled:opacity-30' : 'px-4 py-2 text-[#5c647a] text-[13px] hover:text-[#00685f] transition-colors flex items-center gap-1 disabled:opacity-30'} disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                Previous
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-[#0f172a] font-bold text-[12px]">1</button>
                <button className={isDark ? 'w-8 h-8 rounded-lg hover:bg-[#0f172a] text-[#94a3b8] text-[12px]' : 'w-8 h-8 rounded-lg hover:bg-[#d3e4fe] text-[#5c647a] text-[12px]'}>2</button>
                <button className={isDark ? 'w-8 h-8 rounded-lg hover:bg-[#0f172a] text-[#94a3b8] text-[12px]' : 'w-8 h-8 rounded-lg hover:bg-[#d3e4fe] text-[#5c647a] text-[12px]'}>3</button>
                <span className={isDark ? 'text-[#94a3b8] px-2' : 'text-[#5c647a] px-2'}>...</span>
                <button className={isDark ? 'w-8 h-8 rounded-lg hover:bg-[#0f172a] text-[#94a3b8] text-[12px]' : 'w-8 h-8 rounded-lg hover:bg-[#d3e4fe] text-[#5c647a] text-[12px]'}>12</button>
              </div>
              <button className={isDark ? 'px-4 py-2 text-[#94a3b8] text-[13px] hover:text-[#2dd4bf] transition-colors flex items-center gap-1' : 'px-4 py-2 text-[#5c647a] text-[13px] hover:text-[#00685f] transition-colors flex items-center gap-1'}>
                Next
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={isDark ? 'mb-8 rounded-[28px] border border-[#2dd4bf]/20 bg-gradient-to-br from-[#111827] via-[#131b2e] to-[#0f172a] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.45)]' : 'mb-8 rounded-[28px] border border-[#00685f]/15 bg-gradient-to-br from-[#f7fffd] via-[#f4fbff] to-[#eef7ff] p-8 shadow-[0_20px_60px_rgba(0,104,95,0.08)]'}>
            <div className={isDark ? 'mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2dd4bf]/10 text-[#2dd4bf]' : 'mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00685f]/10 text-[#00685f]'}>
              <span className="material-symbols-outlined text-[34px]">analytics</span>
            </div>
            <div className="text-center">
              <h3 className={isDark ? 'text-[24px] font-semibold text-[#f8fafc]' : 'text-[24px] font-semibold text-[#0b1c30]'}>No expenses yet</h3>
              <p className={isDark ? 'mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#94a3b8]' : 'mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#475569]'}>
                Start tracking your spending by adding your first expense and keep your finances beautifully organized.
              </p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className={isDark ? 'mt-6 inline-flex items-center gap-2 rounded-full bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#07111f] transition-transform hover:scale-[1.02]' : 'mt-6 inline-flex items-center gap-2 rounded-full bg-[#00685f] px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]'}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Expense
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={isDark ? 'bg-[#131b2e] border border-[#475569]/30 rounded-2xl p-6 relative overflow-hidden group' : 'bg-white border border-[#d3e4fe] rounded-2xl p-6 relative overflow-hidden group'}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-[#2dd4bf]">trending_up</span>
            </div>
            <p className={isDark ? 'text-[13px] text-[#94a3b8] mb-2' : 'text-[13px] text-[#5c647a] mb-2'}>Highest Spend Category</p>
            <h3 className={isDark ? 'text-[24px] font-bold text-[#f1f5f9] mb-4' : 'text-[24px] font-bold text-[#0b1c30] mb-4'}>Travel</h3>
            <div className={isDark ? 'w-full bg-[#0f172a] h-2 rounded-full overflow-hidden' : 'w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden'}>
              <div className="bg-[#2dd4bf] h-full" style={{ width: '65%' }} />
            </div>
            <p className={isDark ? 'text-[12px] text-[#94a3b8] mt-3' : 'text-[12px] text-[#5c647a] mt-3'}>65% of your monthly budget utilized</p>
          </div>
          <div className={isDark ? 'bg-[#131b2e] border border-[#475569]/30 rounded-2xl p-6 relative overflow-hidden group' : 'bg-white border border-[#d3e4fe] rounded-2xl p-6 relative overflow-hidden group'}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-amber-500">pie_chart</span>
            </div>
            <p className={isDark ? 'text-[13px] text-[#94a3b8] mb-2' : 'text-[13px] text-[#5c647a] mb-2'}>Daily Average</p>
            <h3 className={isDark ? 'text-[24px] font-bold text-[#f1f5f9] mb-4' : 'text-[24px] font-bold text-[#0b1c30] mb-4'}>$42.18</h3>
            <p className={isDark ? 'text-[12px] text-[#2dd4bf] mt-3 flex items-center gap-1' : 'text-[12px] text-[#00685f] mt-3 flex items-center gap-1'}>
              <span className="material-symbols-outlined text-xs">south</span>
              12% lower than last month
            </p>
          </div>
          <div className={isDark ? 'bg-gradient-to-br from-[#2dd4bf]/10 to-transparent border border-[#2dd4bf]/20 rounded-2xl p-6 relative overflow-hidden group' : 'bg-[#00685f]/10 border border-[#00685f]/20 rounded-2xl p-6 relative overflow-hidden group'}>
            <p className={isDark ? 'text-[13px] text-[#2dd4bf] mb-2' : 'text-[13px] text-[#00685f] mb-2'}>FinGenie AI Insight</p>
            <p className={isDark ? 'text-[16px] text-[#f1f5f9] italic' : 'text-[16px] text-[#0b1c30] italic'}>"You could save <span className="font-bold text-[#2dd4bf]">$120</span> this month by switching to a tiered electricity plan based on your current usage patterns."</p>
            <button className={isDark ? 'mt-4 text-[12px] font-bold text-[#2dd4bf] hover:underline underline-offset-4' : 'mt-4 text-[12px] font-bold text-[#00685f] hover:underline underline-offset-4'}>Learn How</button>
          </div>
        </div>
      </main>

      <nav className={isDark ? 'lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0f172a] border-t border-[#475569]/20 shadow-lg px-4 py-2 flex justify-around items-center rounded-t-xl' : 'lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#d3e4fe] shadow-lg px-4 py-2 flex justify-around items-center rounded-t-xl'}>
        <a className={isDark ? 'flex flex-col items-center justify-center text-[#94a3b8] p-2 hover:bg-[#1e293b] transition-transform active:scale-90' : 'flex flex-col items-center justify-center text-[#5c647a] p-2 hover:bg-[#eff4ff] transition-transform active:scale-90'} href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[13px]">Home</span>
        </a>
        <a className={isDark ? 'flex flex-col items-center justify-center text-[#2dd4bf] bg-[#2dd4bf]/10 rounded-xl p-2 active:scale-90 transition-transform' : 'flex flex-col items-center justify-center text-[#00685f] bg-[#e6f7f3] rounded-xl p-2 active:scale-90 transition-transform'} href="#">
          <span className="material-symbols-outlined">account_balance</span>
          <span className="text-[13px]">Finance</span>
        </a>
        <a className={isDark ? 'flex flex-col items-center justify-center text-[#94a3b8] p-2 hover:bg-[#1e293b] transition-transform active:scale-90' : 'flex flex-col items-center justify-center text-[#5c647a] p-2 hover:bg-[#eff4ff] transition-transform active:scale-90'} href="#">
          <span className="material-symbols-outlined">psychology</span>
          <span className="text-[13px]">Advisor</span>
        </a>
        <a className={isDark ? 'flex flex-col items-center justify-center text-[#94a3b8] p-2 hover:bg-[#1e293b] transition-transform active:scale-90' : 'flex flex-col items-center justify-center text-[#5c647a] p-2 hover:bg-[#eff4ff] transition-transform active:scale-90'} href="#">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-[13px]">Reports</span>
        </a>
        <a className={isDark ? 'flex flex-col items-center justify-center text-[#94a3b8] p-2 hover:bg-[#1e293b] transition-transform active:scale-90' : 'flex flex-col items-center justify-center text-[#5c647a] p-2 hover:bg-[#eff4ff] transition-transform active:scale-90'} href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[13px]">Settings</span>
        </a>
      </nav>
    </div>
  )
}
