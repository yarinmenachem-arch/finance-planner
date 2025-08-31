import '@/styles/globals.css'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function App({ Component, pageProps }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=>{ setUser(u); setLoading(false) })
    return unsub
  },[])
  if (loading) return <div className="container mt-10">טוען...</div>
  return <Component {...pageProps} user={user} />
}
