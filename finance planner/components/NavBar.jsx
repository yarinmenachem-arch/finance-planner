import React from 'react'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function NavBar({ user }){
  return (
    <nav className="bg-white shadow">
      <div className="container py-3 flex justify-between items-center">
        <div className="font-bold text-lg">מתכנן פיננסי</div>
        <div className="flex items-center gap-3">
          {user && (<>
            <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
            <span className="text-sm">{user.displayName}</span>
            <button className="btn btn-secondary" onClick={()=>signOut(auth)}>התנתק</button>
          </>)}
        </div>
      </div>
    </nav>
  )
}
