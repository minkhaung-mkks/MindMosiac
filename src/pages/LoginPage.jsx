import React, { useState } from 'react'
import { useUserStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure the CSS is imported


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
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginPage
