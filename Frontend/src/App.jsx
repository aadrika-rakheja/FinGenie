import React, { useEffect, useState } from 'react'
import SignIn from './pages/auth/signIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signUp'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'
import Expenses from './pages/expenses/Expenses'

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Expenses theme={theme} onToggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
