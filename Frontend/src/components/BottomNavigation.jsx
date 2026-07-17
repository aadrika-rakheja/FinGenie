import React from 'react'

const navItems = [
  { label: 'Home', icon: 'home' },
  { label: 'Finance', icon: 'account_balance' },
  { label: 'Advisor', icon: 'psychology' },
  { label: 'Reports', icon: 'bar_chart' },
  { label: 'Settings', icon: 'settings' },
]

export default function BottomNavigation({ theme, activeItem = 'Home' }) {
  const isDark = theme === 'dark'

  return (
    <nav
      className={
        isDark
          ? 'lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0b1326] border-t border-[#475569]/20 shadow-lg px-4 py-2 flex justify-around items-center rounded-t-xl'
          : 'lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#d3e4fe] shadow-lg px-4 py-2 flex justify-around items-center rounded-t-xl'
      }
    >
      {navItems.map((item) => {
        const isActive = item.label === activeItem
        const baseClasses = 'flex flex-col items-center justify-center p-2 transition-transform active:scale-90'
        const activeClasses = isDark
          ? 'text-[#2dd4bf] bg-[#2dd4bf]/10 rounded-xl'
          : 'text-[#00685f] bg-[#e6f7f3] rounded-xl'
        const inactiveClasses = isDark
          ? 'text-[#94a3b8] hover:bg-[#1e293b] rounded-xl'
          : 'text-[#5c647a] hover:bg-[#eff4ff] rounded-xl'

        return (
          <a key={item.label} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} href="#">
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[13px]">{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
