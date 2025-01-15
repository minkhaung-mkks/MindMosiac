import React, { useState } from 'react'
import { useUserStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure the CSS is imported
import '../styles/login.css'

const LoginPage = () => {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleLogin = () => {
    if (nickname) {
      const user = { id: '12345', nickname }  // This is a mock user, normally fetched from an API
      setUser(user)  // Save user in Zustand store
      localStorage.setItem('user-storage', JSON.stringify(user))  // Optionally store in localStorage for persistence
      toast.success(`Welcome, ${nickname}!`, { position: toast.POSITION.TOP_RIGHT })  // Show success toast
      navigate('/')  // Redirect to the main notes page
    } else {
      setError('Please enter a nickname.')
      toast.error('Nickname is required.', { position: toast.POSITION.TOP_RIGHT })  // Show error toast
    }
  }

  return (
    <div className='login_page'>
      <h1 className='titleLogoTxt'>MindMosiac</h1>
      <div className="line"></div>
      <h3>Enter your demo nickname</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
      className='login_nn'
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="line"></div>
      <button className='login_btn' onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginPage
