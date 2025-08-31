# Finance Planner (Next.js + Firebase + Google Login)

## מה יש כאן
- התחברות עם Google (Firebase Auth)
- שמירת נתונים ב-Firestore (הוצאות/הכנסות + מטרה פיננסית)
- לוח בקרה עם גרפים (Recharts)
- בנוי לפריסה קלה ב-Vercel

## הרצה מקומית
```bash
npm install
npm run dev
```
פתחו http://localhost:3000

## פריסה ל-Vercel
1. צרו Repo ב-GitHub והעלו את התיקייה.
2. ב-Vercel: New Project → בחרו את הרפוזיטורי → Deploy.
3. מאחר והקונפיגורציה של Firebase מוטמעת בקוד (Public keys בלבד), אין צורך ב-ENV כדי להתחיל.
   מומלץ בעתיד להעביר ל-ENV.

## אבטחה
זכרו לעדכן Security Rules ב-Firestore לפני מעבר לייצור (production).
