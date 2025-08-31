import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function Dashboard({ uid }){
  const [items, setItems] = useState([])

  useEffect(()=>{
    const q = query(collection(db, 'users', uid, 'tx'), where('uid','==',uid))
    const unsub = onSnapshot(q, (snap)=>{
      const arr = []
      snap.forEach(doc=> arr.push({ id: doc.id, ...doc.data() }))
      setItems(arr)
    })
    return unsub
  }, [uid])

  const byCat = items.reduce((acc, it)=>{
    if (it.type!=='expense') return acc
    acc[it.category] = (acc[it.category]||0) + it.amount
    return acc
  }, {})
  const data = Object.entries(byCat).map(([name, value])=>({ name, value }))

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3">התפלגות הוצאות לפי קטגוריה</h2>
      <div style={{height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
              {data.map((_,i)=>(<Cell key={i}/>))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
