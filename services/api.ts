import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { ClientData } from '../types';

// ------------------------------------------------------------------
// تنظیمات فایربیس
// لطفاً مقادیر زیر را از کنسول فایربیس (Project Settings > General > Your apps) کپی کنید
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "API_KEY_را_اینجا_بگذارید",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
// جلوگیری از کرش کردن برنامه اگر کانفیگ هنوز ست نشده باشد
let db: any;
try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
} catch (error) {
    console.error("Firebase Config Error: لطفاً مقادیر firebaseConfig را در فایل services/api.ts وارد کنید.");
}

export const saveData = async (username: string, data: ClientData): Promise<{ success: boolean; message: string }> => {
  if (!db) return { success: false, message: 'تنظیمات فایربیس انجام نشده است.' };
  
  try {
    // ذخیره اطلاعات در مسیر users/username
    await set(ref(db, 'users/' + username), {
      lastUpdated: new Date().toISOString(),
      data: data
    });

    return { success: true, message: 'اطلاعات با موفقیت در فایربیس ذخیره شد.' };
  } catch (error: any) {
    console.error("Firebase Save Error:", error);
    return { 
      success: false, 
      message: `خطا در ذخیره‌سازی: ${error.message}` 
    };
  }
};

export const loadData = async (username: string): Promise<ClientData | null> => {
  if (!db) return null;

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${username}`));

    if (snapshot.exists()) {
      const val = snapshot.val();
      return val.data as ClientData;
    } else {
      console.log("No data available for user:", username);
      return null;
    }
  } catch (error) {
    console.error("Firebase Load Error:", error);
    return null;
  }
};

// بکاپ لوکال (فقط جهت احتیاط)
export const saveBackup = (username: string, data: ClientData) => {
  try {
    localStorage.setItem(`backup_${username}`, JSON.stringify(data));
  } catch (e) { /* Ignore */ }
};

export const loadBackup = (username: string): ClientData | null => {
  try {
    const saved = localStorage.getItem(`backup_${username}`);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};