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
const DIST_DIR = path.join(__dirname, 'dist');

console.log('Initializing Server...');
console.log('Database File:', DB_FILE);
console.log('Static Files Dir:', DIST_DIR);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Serve static files if directory exists
if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
} else {
    console.warn('WARNING: "dist" directory not found. Run "npm run build" to generate frontend assets.');
}

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
        console.log('Created new database.json');
    } catch (err) {
        console.error('Error creating database.json:', err);
    }
}

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return {};
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading DB:', err);
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
    const indexFile = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
    } else {
        res.status(500).send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white;">
                <h1>⚠️ Frontend Build Missing</h1>
                <p>The server is running, but the frontend files could not be found.</p>
                <p>Please run the following command in your terminal:</p>
                <code style="background: #333; padding: 10px; display: block; margin: 20px auto; max-width: 300px; border-radius: 5px;">npm run build</code>
                <p>Then refresh this page.</p>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});