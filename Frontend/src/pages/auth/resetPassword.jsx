import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './signUp.module.scss'
import { useState } from 'react';
import { resetPassword } from '../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const navigate=useNavigate();
  const {token}=useParams();
  const [isVisible,setVisible]=useState(false);
  const [isVisible2,setVisible2]=useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSubmit=async(e)=>{
    e.preventDefault();
    if(password!==confirmPassword){
      alert("Passwords do not match");
      return;
    }else{
      const res=await resetPassword(token,password);
      console.log(res);
      if(res.success){
        alert("Password reset successfully");
        setTimeout(() => {
          navigate('/sign-in')
        }, 2000)
      }
    }
 }

  return (
    <div className={`${styles['hero-bg']} min-h-screen text-slate-200 relative`}>
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className={`rounded-3xl p-8 ${styles['glass-card']} shadow-2xl border border-slate-700/40 w-full max-w-md`}>
          <h2 className="text-3xl font-semibold text-white text-center">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-3 text-center">
            Create a new secure password for your institutional account.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-slate-400 tracking-[0.2em]">NEW PASSWORD</label>
              <div className="relative mt-3">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input
                  value={password}
                  type={isVisible?"text":"password"}
                  placeholder="********"
                  onChange={(e)=>{setPassword(e.target.value)}}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/40 px-12 py-3 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                />
                 <span onClick={()=>setVisible(!isVisible)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-teal-400 transition-colors">
                      {isVisible?"visibility_off":"visibility"}
                  </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 tracking-[0.2em]">CONFIRM NEW PASSWORD</label>
              <div className="relative mt-3">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">shield</span>
                <input
                  value={confirmPassword}
                  onChange={(e)=>{setConfirmPassword(e.target.value)}}
                  type={isVisible2?"text":"password"}
                  placeholder="********"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/40 px-12 py-3 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                />
                  <span onClick={()=>setVisible2(!isVisible2)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-teal-400 transition-colors">
                      {isVisible2?"visibility_off":"visibility"}
                  </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400">bolt</span>
                <span>0.02s Execution</span>
              </div>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400">shield</span>
                <span>256-bit AES</span>
              </div>
            </div>

            <button type='submit' className="w-full bg-teal-400 text-slate-950 py-3 rounded-xl font-semibold hover:brightness-95 transition-all">
              Reset Password
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
              >
                ← Back to Log In
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
