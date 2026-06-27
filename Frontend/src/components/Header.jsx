import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate=useNavigate();
  const location =useLocation();

  const hideNav = ["/sign-in", "/sign-up", "/forgot-password"].includes(location.pathname)  || location.pathname.startsWith("/reset-password/");

  return (
    <header className="w-full py-6 px-8 bg-transparent absolute top-0 left-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-extrabold text-teal-400">FinGenie</div>
        </div>

        {!hideNav ? (
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a className="hover:text-white" href="#">Features</a>
            <a className="hover:text-white" href="#">Solutions</a>
            <a className="hover:text-white" href="#">Pricing</a>
            <a className="hover:text-white" href="#">Company</a>
          </nav>
        ) : null}

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-slate-300 hover:text-teal-400 active:text-teal-300 transition-colors duration-200" onClick={()=>{navigate("/sign-in")}}>Log In</button>
        <button className=" ml-2px-4 py-2 px-5 rounded-md font-medium text-teal-400 bg-[rgba(45,212,191,0.06)] border border-[rgba(45,212,191,0.12)] shadow-[0_0_20px_rgba(45,212,191,0.05)] backdrop-blur-md transition-all duration-300 hover:bg-teal-400 hover:text-slate-950 hover:shadow-[0_0_25px_rgba(45,212,191,0.25)]"
          onClick={()=>{navigate("/sign-up")}}>
            Open Account
        </button>
        </div>
      </div>
    </header>
  )
}
