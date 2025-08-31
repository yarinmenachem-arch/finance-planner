import React, { useMemo, useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function currency(n){ return new Intl.NumberFormat('he-IL', { style:'currency', currency:'ILS', maximumFractionDigits:0 }).format(n||0) }

export default function GoalPlanner({ uid }){
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState(500000)
  const [currentSaved, setCurrentSaved] = useState(0)
  const [targetDate, setTargetDate] = useState(()=>{ const d=new Date(); d.setMonth(d.getMonth()+36); return d.toISOString().slice(0,10) })
  const [monthlyIncome, setMonthlyIncome] = useState(15000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(10000)

  useEffect(()=>{
    const run = async () => {
      const ref = doc(db, 'users', uid, 'meta', 'goal')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const v = snap.data()
        setGoalName(v.goalName||'')
        setTargetAmount(v.targetAmount||500000)
        setCurrentSaved(v.currentSaved||0)
        setTargetDate(v.targetDate||targetDate)
        setMonthlyIncome(v.monthlyIncome||15000)
        setMonthlyExpenses(v.monthlyExpenses||10000)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  const monthsRemaining = useMemo(()=>{
    const today = new Date()
    const deadline = new Date(targetDate)
    const a = new Date(today.getFullYear(), today.getMonth(), 1)
    const b = new Date(deadline.getFullYear(), deadline.getMonth(), 1)
    const years = b.getFullYear()-a.getFullYear()
    const months = b.getMonth()-a.getMonth()
    return Math.max(1, years*12+months)
  }, [targetDate])

  const currentMonthlySaving = useMemo(()=> (monthlyIncome - monthlyExpenses), [monthlyIncome, monthlyExpenses])
  const amountRemaining = useMemo(()=> Math.max(0, targetAmount - currentSaved), [targetAmount, currentSaved])
  const requiredMonthlySaving = useMemo(()=> amountRemaining / monthsRemaining, [amountRemaining, monthsRemaining])
  const onTrack = currentMonthlySaving >= requiredMonthlySaving && amountRemaining > 0
  const etaMonths = currentMonthlySaving <= 0 ? Infinity : Math.ceil(amountRemaining / Math.max(1,currentMonthlySaving))

  const projection = useMemo(()=>{
    const today = new Date()
    const points = Math.min(Math.max(monthsRemaining, 12), 120)
    const arr = []
    let cur1 = currentSaved
    let cur2 = currentSaved
    for (let i=0;i<=points;i++){
      const d = new Date(today.getFullYear(), today.getMonth()+i, 1)
      const label = `${d.getMonth()+1}/${String(d.getFullYear()).slice(2)}`
      if (i>0){ cur1 += currentMonthlySaving; cur2 += requiredMonthlySaving }
      arr.push({ name: label, current: Math.max(0, cur1), required: Math.max(0, cur2) })
    }
    return arr
  }, [monthsRemaining, currentSaved, currentMonthlySaving, requiredMonthlySaving])

  async function save(){
    const ref = doc(db, 'users', uid, 'meta', 'goal')
    await setDoc(ref, { goalName, targetAmount, currentSaved, targetDate, monthlyIncome, monthlyExpenses }, { merge: true })
    alert('המטרה נשמרה ✅')
  }

  const progressPct = Math.min(100, Math.max(0, (currentSaved/Math.max(1,targetAmount))*100))

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">מטרה פיננסית</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <input className="p-2 border rounded" placeholder="שם המטרה" value={goalName} onChange={e=>setGoalName(e.target.value)} />
        <input className="p-2 border rounded" type="number" value={targetAmount} onChange={e=>setTargetAmount(Number(e.target.value))} />
        <input className="p-2 border rounded" type="number" value={currentSaved} onChange={e=>setCurrentSaved(Number(e.target.value))} />
        <input className="p-2 border rounded" type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-3 border rounded">הכנסה חודשית: 
          <input className="ml-2 p-1 border rounded w-40" type="number" value={monthlyIncome} onChange={e=>setMonthlyIncome(Number(e.target.value))} /></div>
        <div className="p-3 border rounded">הוצאות חודשיות: 
          <input className="ml-2 p-1 border rounded w-40" type="number" value={monthlyExpenses} onChange={e=>setMonthlyExpenses(Number(e.target.value))} /></div>
        <div className="p-3 border rounded">חיסכון חודשי: <strong>{currency(currentMonthlySaving)}</strong></div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-3 border rounded">חודשים שנותרו: <strong>{monthsRemaining}</strong></div>
        <div className="p-3 border rounded">חיסכון נדרש: <strong>{currency(requiredMonthlySaving)}</strong></div>
        <div className="p-3 border rounded">סטטוס: <strong className={onTrack?'text-emerald-600':'text-amber-600'}>{onTrack?'במסלול':'לא במסלול'}</strong></div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="current" stroke="#2563eb" dot={false} />
            <Line type="monotone" dataKey="required" stroke="#f59e0b" strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-600">התקדמות: {progressPct.toFixed(0)}% — {currency(currentSaved)} מתוך {currency(targetAmount)}</div>

      <div className="flex gap-3">
        <button className="btn btn-primary" onClick={save}>שמור מטרה</button>
      </div>
    </div>
  )
}
