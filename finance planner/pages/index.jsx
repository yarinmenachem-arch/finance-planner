import React from 'react'
import NavBar from '../components/NavBar'
import AuthGate from '../components/AuthGate'
import GoalPlanner from '../components/GoalPlanner'
import TransactionForm from '../components/TransactionForm'
import Dashboard from '../components/Dashboard'

export default function Home({ user }){
  return (
    <div dir="rtl">
      <NavBar user={user} />
      {!user ? (
        <AuthGate />
      ) : (
        <div className="container my-6 space-y-6">
          <GoalPlanner uid={user.uid} />
          <TransactionForm uid={user.uid} />
          <Dashboard uid={user.uid} />
          <footer className="text-xs text-gray-500 text-center pt-4 pb-6">
            © {new Date().getFullYear()} Finance Planner — כלי מידע כללי בלבד; לא ייעוץ השקעות.
          </footer>
        </div>
      )}
    </div>
  )
}
