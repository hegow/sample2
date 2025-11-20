import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API Routes
app.post('/api/save', (req, res) => {
    const { username, data } = req.body;
    if (!username || !data) {
        return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }

    try {
        const db = readDB();
        db[username] = {
            lastUpdated: new Date().toISOString(),
            data: data
        };
        writeDB(db);
        console.log(`Data saved for user: ${username}`);
        res.json({ success: true, message: 'اطلاعات با موفقیت ذخیره شد' });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, message: 'خطای سرور در ذخیره‌سازی' });
    }
});

app.get('/api/load/:username', (req, res) => {
    const { username } = req.params;
    try {
        const db = readDB();
        if (db[username]) {
            res.json({ success: true, data: db[username].data });
        } else {
            res.json({ success: false, message: 'کاربر یافت نشد' });
        }
    } catch (error) {
        console.error('Load Error:', error);
        res.status(500).json({ success: false, message: 'خطای سرور در بارگذاری' });
    }
});

// Catch-all handler to serve React app for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});