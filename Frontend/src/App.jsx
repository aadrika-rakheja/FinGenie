import React from 'react'
import SignIn from './pages/auth/signIn'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './pages/auth/signUp'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/dashboard" element={()=>{res.json("hi")}} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
