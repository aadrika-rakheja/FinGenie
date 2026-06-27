import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './signUp.module.scss'
import googleIcon from '../../assets/images/googleIcon.png'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../../services/userService'

function Feature({ icon, title, children }) {
  return (
    <div className={`p-4 rounded-xl ${styles["feature-card"]} border border-slate-700/40`}>
      <div className="h-10 w-10 rounded-md bg-teal-400/10 border border-teal-400/20 mr-3 inline-flex items-center justify-center align-top">
        <span className="material-symbols-outlined text-teal-500 text-[22px]">
          {icon}
        </span>
      </div>
      <div className="inline-block align-top max-w-xs">
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-slate-300 text-sm mt-1">{children}</p>
      </div>
    </div>
  );
}

export default function SignUp(){
  const navigate=useNavigate();
  const [user,setUser]=useState({name:"",email:"",password:""})
  const [isVisible,setVisible]=useState(false);

  const handleSignUp=async(e)=>{
    e.preventDefault();
    try{
      const data=await signUp(user);
      console.log(data);
      localStorage.setItem("token", data.token);
      if(data.success)
        navigate("/dashboard");
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className={`${styles['hero-bg']} min-h-screen text-slate-200 relative`}>
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <section className="md:col-span-7">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Elevate Your <span className="text-teal-400">Wealth</span>
            </h1>
            <p className="mt-6 text-slate-300 max-w-xl">
              Join 50,000+ smart investors using FinGenie to automate their financial growth with institutional-grade AI.
            </p>

            <div className="mt-10 space-y-4">
              <Feature icon="psychology" title="AI-Driven Insights">Real-time predictive modeling helps you spot opportunities before the market moves.</Feature>
              <Feature icon="robot_2" title="Automated Tracking">Sync all your assets. We handle the reconciliation and performance reporting automatically.</Feature>
              <Feature icon="shield_with_heart" title="Secure & Private">256-bit encryption and zero-knowledge architecture. Your financial data is yours alone.</Feature>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
              <div className="h-8 w-8 rounded-full bg-slate-800" />
              <div> Loved by <strong className="text-white">50k+</strong> users worldwide</div>
            </div>
          </section>

          <aside className="md:col-span-5">
            <div className={`rounded-3xl p-8 ${styles['glass-card']} shadow-2xl border border-slate-700/40` }>
              <h3 className="text-2xl font-semibold">Create Account</h3>
              <p className="text-slate-400 text-sm mt-1">Start your 14-day premium trial today.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
                <div>
                  <label className="text-xs text-slate-400">FULL NAME</label>
                  <input className="mt-2 w-full rounded-xl px-4 py-3 bg-white/5 placeholder-slate-500 text-white border border-slate-700" placeholder="John Doe"
                  value={user.name} onChange={(e)=>setUser({...user,name:e.target.value})}/>
                </div>

                <div>
                  <label className="text-xs text-slate-400">EMAIL ADDRESS</label>
                  <input className="mt-2 w-full rounded-xl px-4 py-3 bg-white/5 placeholder-slate-500 text-white border border-slate-700" placeholder="john@example.com" 
                  type="email" value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})}/>
                </div>

               <div>
                <label className="text-xs text-slate-400"> PASSWORD</label>
                <div className="relative mt-2">
                  <input
                     type={isVisible?"text":"password"}
                      placeholder="********"
                      value={user.password}
                      onChange={(e)=>{setUser({...user,password:e.target.value})}}
                    className="w-full rounded-xl px-4 py-3 pr-12 bg-white/5 placeholder-slate-500 text-white border border-slate-700"
                  />
                  <span onClick={()=>setVisible(!isVisible)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-teal-400 transition-colors">
                      {isVisible?"visibility_off":"visibility"}
                    </span>
                </div>
              </div>

                <div className="flex items-start gap-3">
                  <input id="agree" type="checkbox" required className="mt-1 w-4 h-4 text-emerald-400 bg-slate-800 border-slate-700 rounded" />
                  <label htmlFor="agree" className="text-sm text-slate-300">I agree to the <span className="text-teal-400">Terms of Service</span> and <span className="text-teal-400">Privacy Policy</span>.</label>
                </div>

                <div>
                  <button className="w-full bg-teal-400 text-slate-900 py-3 rounded-xl font-semibold hover:brightness-95">Create Free Account →</button>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-sm">
                   <div className="h-px flex-1 bg-slate-700" />
                   <span>OR</span>
                   <div className="h-px flex-1 bg-slate-700" />
                </div>
 
                <button type="button" className="w-full rounded-xl border border-slate-700/80 py-3 text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-3">
                  <span><img src={googleIcon} alt="google"  className="w-6 h-6" /></span>
                   Continue with Google
                </button>               
                                
                <div className="text-center text-sm text-slate-400">Already have an account? <button className="text-teal-400" type="button" onClick={()=>{navigate("/sign-in")}}>Log In</button></div>
              </form>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
