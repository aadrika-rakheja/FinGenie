import React, { useEffect, useState } from 'react'
import SignIn from './pages/auth/signIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signUp'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'
import Expenses from './pages/expenses/Expenses'
import BudgetPage from './pages/budgets/BudgetPage'
import GoalsPage from './pages/goals/GoalsPage'
import GoalDetailPage from './pages/goals/GoalDetailPage'
import StatementAnalyzerPage from './pages/statementAnalyser/StatementAnalyzerPage'
import AnalyzedStatementPage from './pages/statementAnalyser/AnalyzedStatementPage'
import PageNotFound from './pages/PageNotFound'
import { applyTheme, resolveTheme } from './theme/theme'

function App() {
  const [theme, setTheme] = useState(() => resolveTheme('light'))

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Expenses theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/expenses" element={<Expenses theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/budgets" element={<BudgetPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/goals" element={<GoalsPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/goals/:id" element={<GoalDetailPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/statement-analyzer" element={<StatementAnalyzerPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/statement-analyzed" element={<AnalyzedStatementPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
