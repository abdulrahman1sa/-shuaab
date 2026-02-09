# 🔥 إعداد Firebase للمشروع

## الخطوات:

### 1️⃣ إنشاء مشروع Firebase
1. اذهب إلى https://console.firebase.google.com
2. اضغط "Add project" أو "إضافة مشروع"
3. أدخل اسم المشروع (مثلاً: `shuaab-db`)
4. أكمل الإعداد

### 2️⃣ تفعيل Firestore Database
1. من القائمة الجانبية، اختر **Firestore Database**
2. اضغط **Create database**
3. اختر **Start in production mode**
4. اختر المنطقة (مثلاً: `europe-west`)

### 3️⃣ الحصول على مفاتيح Firebase (Client)
1. اذهب لـ **Project Settings** (أيقونة الترس)
2. في تبويب **General**، انزل لـ **Your apps**
3. اضغط على أيقونة **Web** (`</>`)
4. سجل التطبيق باسم (مثلاً: `shuaab-web`)
5. انسخ الـ `firebaseConfig`

### 4️⃣ الحصول على مفاتيح Admin (Server)
1. في **Project Settings**
2. اختر تبويب **Service accounts**
3. اضغط **Generate new private key**
4. احفظ ملف JSON

### 5️⃣ إضافة المتغيرات في CranL/Vercel

#### متغيرات Client (من firebaseConfig):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

#### متغيرات Admin (من ملف JSON):
```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=... (انسخ كامل المفتاح مع -----BEGIN PRIVATE KEY-----)
```

### 6️⃣ إعداد قواعد Firestore
في Firebase Console → Firestore Database → Rules، ضع:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for all groups
    match /groups/{groupId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow anyone to submit
    match /groupSubmissions/{submissionId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
    
    // Allow voting
    match /votes/{voteId} {
      allow read, create: if true;
      allow update, delete: if false;
    }
  }
}
```

### 7️⃣ Redeploy
بعد إضافة جميع المتغيرات، أعد نشر المشروع!

---

## 📝 ملاحظات:
- احفظ ملف JSON في مكان آمن
- لا تشارك المفاتيح علناً
- `FIREBASE_PRIVATE_KEY` يجب أن يحتوي على `\n` للأسطر الجديدة
