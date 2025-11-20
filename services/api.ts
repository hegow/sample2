import { ClientData } from '../types';

// آدرس سرور - در حالت پروداکشن خالی است (نسبی)
// اگر روی پورت متفاوتی تست می‌کنید، آدرس کامل بدهید
const API_BASE = ''; 

export const saveData = async (username: string, data: ClientData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, data }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Save Error:", error);
    return { 
      success: false, 
      message: `خطا در اتصال به سرور: ${error.message}` 
    };
  }
};

export const loadData = async (username: string): Promise<ClientData | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/load/${username}`);
    const result = await response.json();

    if (result.success && result.data) {
      return result.data as ClientData;
    }
    return null;
  } catch (error) {
    console.error("Load Error:", error);
    return null;
  }
};

// بکاپ لوکال (جهت اطمینان)
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