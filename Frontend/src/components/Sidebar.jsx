import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Transactions', icon: 'payments', path: '/expenses' },
  { label: 'Budgets', icon: 'account_balance_wallet', path: '/budgets' },
  { label: 'Goals', icon: 'ads_click', path: '/goals' },
  { label: 'Statement Analyzer', icon: 'analytics', path: '/statement-analyzer' },
  { label: 'AI Advisor', icon: 'psychology', path: '/ai-advisor' },
  { label: 'Reports', icon: 'assessment', path: '/reports' },
]

export default function Sidebar({ theme }) {
  const isDark = theme === 'dark'
  const location = useLocation()
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name"); // if you store user info
    navigate("/sign-in");
  };

  return (
    <aside className={isDark ? 'fixed left-0 top-0 h-full w-[280px] border-r border-[#475569]/30 bg-[#0b1326] hidden lg:flex flex-col py-10 px-6 shadow-sm z-50' : 'fixed left-0 top-0 h-full w-[280px] border-r border-[#bcc9c6] bg-[#f8f9ff] hidden lg:flex flex-col py-10 px-6 shadow-sm z-50'}>
      <div className="flex items-center gap-3 mb-10">
        <div className={isDark ? 'w-10 h-10 bg-[#2dd4bf] rounded-xl flex items-center justify-center ambient-glow' : 'w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center'}>
          <span className={isDark ? 'material-symbols-outlined text-[#0f172a] font-bold' : 'material-symbols-outlined text-white font-bold'}>
            payments
          </span>
        </div>

        <div>
          <h1 className={isDark ? 'text-[24px] leading-[32px] font-bold text-[#2dd4bf]' : 'text-[24px] leading-[32px] font-bold text-[#0D9488]'}>
            FinGenie
          </h1>
          <p className={isDark ? 'text-[13px] text-[#94a3b8]' : 'text-[13px] text-[#3d4947]'}>
            AI Wealth Management
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path

          const activeClasses = isDark
            ? 'font-semibold flex items-center gap-3 px-4 py-2 text-[#2dd4bf] bg-[#2dd4bf]/10 rounded-lg border-l-4 border-[#2dd4bf] hover:bg-[#1e293b] transition-colors'
            : 'font-semibold flex items-center gap-3 px-4 py-2 text-[#00685f] bg-[#d3e4fe] rounded-lg border-r-4 border-[#00685f] hover:bg-[#e5eeff] transition-colors'

          const inactiveClasses = isDark
            ? 'font-medium flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:bg-[#1e293b] transition-colors rounded-lg'
            : 'font-medium flex items-center gap-3 px-4 py-2 text-[#3d4947] hover:bg-[#eff4ff] transition-colors rounded-lg'

          return (
            <Link
              key={item.label}
              to={item.path}
              className={isActive ? activeClasses : inactiveClasses}
            >
              <span className={isDark ? 'material-symbols-outlined' : 'material-symbols-outlined text-[#3d4947]'}>
                {item.icon}
              </span>

              <span className="text-[13px]">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className={isDark ? 'mt-auto pt-2 border-t border-[#475569]/30' : 'mt-auto pt-2 border-t border-[#bcc9c6]'}>
        <button
          type="button"
          onClick={handleLogout}
          className={isDark ? 'flex w-full items-center gap-3 px-4 py-2 text-[#94a3b8] hover:bg-[#1e293b] transition-colors rounded-lg' : 'flex w-full items-center gap-3 px-4 py-2 text-[#3d4947] hover:bg-[#eff4ff] transition-colors rounded-lg'}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[13px]">Log Out</span>
        </button>
      </div>
    </aside>
  )
}