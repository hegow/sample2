import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const DIST_DIR = path.join(__dirname, 'dist');

console.log('--- Server Initialization ---');
console.log(`Database Path: ${DB_FILE}`);
console.log(`Frontend Asset Path: ${DIST_DIR}`);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// 1. API Routes (Must be defined before static files)
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
        console.log(`[SUCCESS] Data saved for user: ${username}`);
        res.json({ success: true, message: 'اطلاعات با موفقیت ذخیره شد' });
    } catch (error) {
        console.error('[ERROR] Save failed:', error);
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
            res.json({ success: false, message: 'کاربر یافت نشد (اطلاعاتی ثبت نشده است)' });
        }
    } catch (error) {
        console.error('[ERROR] Load failed:', error);
        res.status(500).json({ success: false, message: 'خطای سرور در بارگذاری' });
    }
});

// 2. Serve Static Files (Frontend)
if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
    
    // Handle SPA Routing (Return index.html for any unknown route)
    app.get('*', (req, res) => {
        res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
} else {
    console.warn('WARNING: "dist" directory not found. Please run "npm run build".');
    app.get('*', (req, res) => {
        res.status(500).send('Frontend build missing. Please run: npm run build');
    });
}

// Database Helpers
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        // Create file if not exists
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
            return {};
        } catch (err) {
            console.error('Error creating DB file:', err);
            return {};
        }
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error parsing DB file:', err);
        return {};
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Start Server
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n✅ Server is running on ${url}`);
    
    // Logic to open browser automatically based on OS
    const startCommand = process.platform === 'darwin' ? 'open' 
                       : process.platform === 'win32' ? 'start' 
                       : 'xdg-open';
    
    exec(`${startCommand} ${url}`, (error) => {
        if (error) {
            // If it fails (e.g. on a server without a screen), just log.
            // console.log('Could not open browser automatically.');
        }
    });
});