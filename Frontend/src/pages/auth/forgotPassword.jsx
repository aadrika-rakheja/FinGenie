import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './signUp.module.scss'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../services/userService'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const result=forgotPassword(email);
    
    console.log('Password reset link sent to:', email)
    setIsSubmitted(true)
    setTimeout(() => {
      navigate('/sign-in')
    }, 5000)
  }

  return (
    <div className={`${styles['hero-bg']} min-h-screen text-slate-200 relative`}>
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className={`rounded-3xl p-8 ${styles['glass-card']} shadow-2xl border border-slate-700/40 w-full max-w-md`}>
          <h2 className="text-3xl font-semibold text-white">Forgot Password?</h2>
          <p className="text-slate-400 text-sm mt-3">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {isSubmitted ? (
            <div className="mt-8 text-center">
              <div className="text-teal-400 text-4xl mb-4">✓</div>
              <p className="text-slate-300 font-semibold">Check your email!</p>
              <p className="text-slate-400 text-sm mt-2">We've sent a password reset link to {email}</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-slate-400">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-3 w-full rounded-xl px-4 py-3 bg-white/5 placeholder-slate-500 text-white border border-slate-700 focus:border-teal-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-400 text-slate-900 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/sign-in')}
                  className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
                >
                  ← Back to Log In
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-slate-700/40 flex justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>0.025 EXECUTION SPEED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>256-BIT AES ENCRYPTION</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
