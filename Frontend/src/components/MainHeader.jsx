import React from 'react'

export default function MainHeader({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'
  const name=localStorage.getItem('name');

  return (
    <header className={isDark ? 'fixed top-0 right-0 left-0 lg:left-[280px] z-40 flex justify-between items-center px-4 lg:px-10 h-16 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#475569]/30 shadow-sm' : 'fixed top-0 right-0 left-0 lg:left-[280px] z-40 flex justify-between items-center px-4 lg:px-10 h-16 bg-white border-b border-[#d3e4fe] shadow-sm'}>
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <span className={isDark ? 'material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm' : 'material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm'}>search</span>
          <input
            className={isDark ? 'w-full bg-[#131b2e] border border-[#475569]/50 rounded-full py-2 pl-10 pr-4 text-[16px] outline-none text-[#f1f5f9] placeholder:text-slate-500 focus:ring-1 focus:ring-[#2dd4bf] focus:border-[#2dd4bf] transition-all' : 'w-full bg-[#f1f5ff] border border-[#d3e4fe] rounded-full py-2 pl-10 pr-4 text-[16px] outline-none text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#00685f] focus:border-[#00685f] transition-all'}
            placeholder="Search transactions, insights..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className={isDark ? 'p-2 rounded-full text-slate-400 hover:text-teal-300 transition' : 'p-2 rounded-full text-slate-500 hover:text-teal-700 transition'} type="button">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className={isDark ? 'p-2 rounded-full text-slate-400 hover:text-teal-300 transition' : 'p-2 rounded-full text-slate-500 hover:text-teal-700 transition'} type="button" onClick={onToggleTheme}>
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <div className={isDark ? 'h-8 w-px bg-[#475569]/30 mx-2' : 'h-8 w-px bg-[#d3e4fe] mx-2'} />
        <div className={isDark ? 'flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity' : 'flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity'}>
          <div className="text-right hidden sm:block">
            <p className={isDark ? 'text-sm text-slate-100' : 'text-sm text-slate-900'}>{name}</p>
            <p className={isDark ? 'text-[10px] uppercase tracking-[0.2em] font-bold text-teal-300' : 'text-[10px] uppercase tracking-[0.2em] font-bold text-teal-700'}>Premium User</p>
          </div>
          <img
            alt="User Profile"
            className={isDark ? 'w-10 h-10 rounded-full border border-[#2dd4bf]/20 bg-[#1e293b]' : 'w-10 h-10 rounded-full border border-[#d3e4fe] bg-white'}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaSV0jx_oLbK6JhXYeauCr2ShM9QdFUNUBNPgjbxgEm3xWVgBkaic2zbIXR6vBSv9TeEOJw47m8N5Si29MNVCKJHNoQIpV-iYgLT7XQVbWjF2xIRy9s0z1hRXuWTxVhuifT5gft5mr59D0NdoQFGgVm6OslbR4w13cU-tMakPdFArRc7Uk8VKaNjwKfMv-SIQfuDSkU0vcQKTutpuY_HwvMWYxhvko8qnspHijHZA6Z1XRakWuXcOGMw"
          />
        </div>
      </div>
    </header>
  )
}
