import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../lib/firebase'

export default function AuthGate(){
  const onLogin = async () => {
    await signInWithPopup(auth, provider)
  }
  return (
    <div className="container mt-10">
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-3">התחברות עם Google</h1>
        <p className="text-gray-600 mb-6">כדי לשמור נתונים בענן ולהציג דוחות מותאמים.</p>
        <button className="btn btn-primary" onClick={onLogin}>התחבר עם Google</button>
      </div>
    </div>
  )
}
