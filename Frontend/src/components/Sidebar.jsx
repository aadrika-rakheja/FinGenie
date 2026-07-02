import React from 'react'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Expenses', icon: 'payments', active: true },
  { label: 'Budgets', icon: 'account_balance_wallet' },
  { label: 'Goals', icon: 'ads_click' },
  { label: 'Statement Analyzer', icon: 'analytics' },
  { label: 'AI Advisor', icon: 'psychology' },
  { label: 'Reports', icon: 'assessment' },
]

export default function Sidebar({ theme }) {
  const isDark = theme === 'dark'

  return (
    <aside className={isDark ? 'fixed left-0 top-0 h-full w-[280px] border-r border-[#475569]/30 bg-[#0b1326] hidden lg:flex flex-col py-10 px-6 shadow-sm z-50' : 'fixed left-0 top-0 h-full w-[280px] border-r border-[#bcc9c6] bg-[#f8f9ff] hidden lg:flex flex-col py-10 px-6 shadow-sm z-50'}>
      <div className="flex items-center gap-3 mb-10">
        <div className={isDark ? 'w-10 h-10 bg-[#2dd4bf] rounded-xl flex items-center justify-center ambient-glow' : 'w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center'}>
          <span className={isDark ? 'material-symbols-outlined text-[#0f172a] font-bold' : 'material-symbols-outlined text-white font-bold'}>payments</span>
        </div>
        <div>
          <h1 className={isDark?"text-[24px] leading-[32px] font-bold text-[#2dd4bf]":"text-[24px] leading-[32px] font-bold text-[#0D9488]"}>FinGenie</h1>
          <p className={isDark ? 'text-[13px] text-[#94a3b8]' : 'text-[13px] text-[#3d4947]'}>AI Wealth Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={
              item.active
                ? isDark
                  ? 'font-semibold flex items-center gap-3 px-4 py-2 text-[#2dd4bf] bg-[#2dd4bf]/10 rounded-lg border-l-4 border-[#2dd4bf] hover:bg-[#1e293b] transition-colors cursor-pointer'
                  : 'font-semibold flex items-center gap-3 px-4 py-2 text-[#00685f] bg-[#d3e4fe] rounded-lg border-r-4 border-[#00685f] hover:bg-[#e5eeff] transition-colors cursor-pointer'
                : isDark
                ? 'font-medium flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:bg-[#1e293b] transition-colors cursor-pointer rounded-lg'
                : 'font-medium flex items-center gap-3 px-4 py-2 text-[#3d4947] hover:bg-[#eff4ff] transition-colors cursor-pointer rounded-lg'
            }
            href="#"
          >
        
            <span className={isDark ? 'material-symbols-outlined' : 'material-symbols-outlined text-[#3d4947]'}>{item.icon}</span>
            <span className={isDark ? 'text-[13px]' : 'text-[13px]'}>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={isDark ? 'mt-auto pt-2 border-t border-[#475569]/30' : 'mt-auto pt-2 border-t border-[#bcc9c6]'}>
        <a className={isDark ? 'flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:bg-[#1e293b] transition-colors rounded-lg' : 'flex items-center gap-3 px-4 py-2 text-[#3d4947] hover:bg-[#eff4ff] transition-colors rounded-lg'} href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[13px]">Settings</span>
        </a>
      </div>
    </aside>
  )
}
