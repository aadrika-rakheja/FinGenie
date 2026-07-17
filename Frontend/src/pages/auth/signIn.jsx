import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './signUp.module.scss'
import googleIcon from '../../assets/images/googleIcon.png'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../services/userService'

export default function SignIn() {
  const navigate=useNavigate();
  const [user,setuser]=useState({email:"",password:""});
  const [isVisible,setVisible]=useState(false);

  const handleSignIn=async(e)=>{
    e.preventDefault();
    try{
      const data=await signIn(user);
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      if(data.success)
        navigate("/dashboard");
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className={`${styles['hero-bg']} min-h-screen text-slate-200 relative`}>
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <section className="md:col-span-7">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Welcome Back to Your <span className="text-teal-400">Financial Future</span>
            </h1>
            <p className="mt-6 text-slate-300 max-w-xl">
              Access your portfolio, monitor performance, and unlock AI-powered insights that keep your investments moving forward.
            </p>

            <div className="mt-10 space-y-4">
              <div className={`p-4 rounded-xl ${styles['feature-card']} border border-slate-700/40`}>
                <div className="h-10 w-10 rounded-md bg-teal-400/10 border border-teal-400/20 mr-3 inline-flex items-center justify-center align-top">
                  <span className="material-symbols-outlined text-teal-500 text-[22px]">lock</span>
                </div>
                <div className="inline-block align-top max-w-xs">
                  <h4 className="text-white font-semibold">Secure Access</h4>
                  <p className="text-slate-300 text-sm mt-1">Fast sign in with enterprise-grade encryption and secure session handling.</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${styles['feature-card']} border border-slate-700/40`}>
                <div className="h-10 w-10 rounded-md bg-teal-400/10 border border-teal-400/20 mr-3 inline-flex items-center justify-center align-top">
                  <span className="material-symbols-outlined text-teal-500 text-[22px]">timeline</span>
                </div>
                <div className="inline-block align-top max-w-xs">
                  <h4 className="text-white font-semibold">Instant Portfolio View</h4>
                  <p className="text-slate-300 text-sm mt-1">Jump right into dashboard analytics and keep an eye on performance at a glance.</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${styles['feature-card']} border border-slate-700/40`}>
                <div className="h-10 w-10 rounded-md bg-teal-400/10 border border-teal-400/20 mr-3 inline-flex items-center justify-center align-top">
                  <span className="material-symbols-outlined text-teal-500 text-[22px]">support</span>
                </div>
                <div className="inline-block align-top max-w-xs">
                  <h4 className="text-white font-semibold">24/7 Support</h4>
                  <p className="text-slate-300 text-sm mt-1">Need help? Our team is ready to support your financial journey anytime.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
              <div className="h-8 w-8 rounded-full bg-slate-800" />
              <div> Trusted by <strong className="text-white">50k+</strong> investors globally</div>
            </div>
          </section>

          <aside className="md:col-span-5">
            <div className={`rounded-3xl p-8 ${styles['glass-card']} shadow-2xl border border-slate-700/40`}>
              <h3 className="text-2xl font-semibold">Sign In</h3>
              <p className="text-slate-400 text-sm mt-1">Enter your credentials to access your account.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label className="text-s text-slate-400">EMAIL ADDRESS</label>
                  <input className="mt-2 w-full rounded-xl px-4 py-3 bg-white/5 placeholder-slate-500 text-white border border-slate-700" placeholder="name@company.com" type="email"
                  value={user.email} onChange={(e)=>{setuser({...user,email:e.target.value})}}/>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-s text-slate-400">PASSWORD</label>
                    <button className="text-xs text-teal-400 hover:underline" type="button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                  </div>

                  <div className="relative mt-2">
                    <input
                      type={isVisible?"text":"password"}
                      placeholder="********"
                      value={user.password}
                      onChange={(e)=>{setuser({...user,password:e.target.value})}}
                      className="w-full rounded-xl px-4 py-3 pr-12 bg-white/5 placeholder-slate-500 text-white border border-slate-700"
                    />
                    <span onClick={()=>setVisible(!isVisible)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-teal-400 transition-colors">
                      {isVisible?"visibility_off":"visibility"}
                    </span>
                  </div>
                </div>

                <div>
                  <button className="w-full bg-teal-400 text-slate-900 py-3 rounded-xl font-semibold hover:brightness-95">Log In</button>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <div className="h-px flex-1 bg-slate-700" />
                  <span>OR</span>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>

                <button type="submit" className="w-full rounded-xl border border-slate-700/80 py-3 text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-3">
                 <span><img src={googleIcon} alt="google"  className="w-6 h-6" /></span>
                  Continue with Google
                </button>

                <div className="text-center text-sm text-slate-400">Don&apos;t have an account? <button className="text-teal-400" onClick={()=>{navigate("/sign-up")}}>Open Account</button></div>
              </form>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
