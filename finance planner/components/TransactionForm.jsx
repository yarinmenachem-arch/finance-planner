import React, { useState, useEffect } from 'react'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { v4 as uuidv4 } from 'uuid'

function currency(n){ return new Intl.NumberFormat('he-IL', { style:'currency', currency:'ILS', maximumFractionDigits:0 }).format(n||0) }

export default function TransactionForm({ uid }){
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState('כללי')
  const [note, setNote] = useState('')
  const [items, setItems] = useState([])

  useEffect(()=>{
    const q = query(collection(db, 'users', uid, 'tx'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap)=>{
      const arr = []
      snap.forEach(doc=> arr.push({ id: doc.id, ...doc.data() }))
      setItems(arr)
    })
    return unsub
  }, [uid])

  async function add(){
    const value = Number(amount)
    if (!value) return
    await addDoc(collection(db, 'users', uid, 'tx'), {
      id: uuidv4(),
      uid,
      type, amount: value,
      category, note,
      createdAt: serverTimestamp()
    })
    setAmount(0); setNote('')
  }

  const totalIncome = items.filter(i=>i.type==='income').reduce((s,i)=>s+i.amount,0)
  const totalExpense = items.filter(i=>i.type==='expense').reduce((s,i)=>s+i.amount,0)
  const net = totalIncome - totalExpense

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">תנועות חודשיות</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <select className="p-2 border rounded" value={type} onChange={e=>setType(e.target.value)}>
          <option value="expense">הוצאה</option>
          <option value="income">הכנסה</option>
        </select>
        <input className="p-2 border rounded" type="number" placeholder="סכום" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="p-2 border rounded" placeholder="קטגוריה (למשל דיור)" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="p-2 border rounded" placeholder="הערה (לא חובה)" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={add}>הוסף</button>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-3 border rounded">סה"כ הכנסות: <strong>{currency(totalIncome)}</strong></div>
        <div className="p-3 border rounded">סה"כ הוצאות: <strong>{currency(totalExpense)}</strong></div>
        <div className="p-3 border rounded">נטו: <strong className={net>=0?'text-emerald-600':'text-rose-600'}>{currency(net)}</strong></div>
      </div>

      <div className="overflow-auto max-h-80">
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>סוג</th><th>סכום</th><th>קטגוריה</th><th>הערה</th><th>תאריך</th></tr></thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.id} className="border-t">
                <td>{it.type==='income'?'הכנסה':'הוצאה'}</td>
                <td>{currency(it.amount)}</td>
                <td>{it.category}</td>
                <td>{it.note||''}</td>
                <td>{it.createdAt?.toDate?.().toLocaleString?.('he-IL')||''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
