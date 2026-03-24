const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const { initDb, getDb } = require('./db');

function registerIpcHandlers() {
    ipcMain.handle('topics:getAll', async () => {
        const db = getDb();

        return db.prepare(`
            SELECT id, name, color, weekly_time_goal
            FROM topics
            ORDER BY name ASC
        `).all();
    });

    ipcMain.handle('topics:create', async (_event, topic) => {
        const db = getDb();
        const now = new Date().toISOString();

        const result = db.prepare(`
            INSERT INTO topics (name, color, weekly_time_goal, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            topic.name,
            topic.color,
            topic.weeklyTimeGoal ?? 0,
            now,
            now
        );

        return { id: result.lastInsertRowid };
    });

    ipcMain.handle('tasks:getAll', async () => {
        const db = getDb();

        return db.prepare(`
            SELECT
                t.id,
                t.name,
                t.due_datetime,
                t.complete,
                t.topic_id,
                tp.name AS topic_name,
                tp.color AS topic_color
            FROM tasks t
            LEFT JOIN topics tp ON t.topic_id = tp.id
            ORDER BY t.due_datetime ASC
        `).all();
    });

    ipcMain.handle('tasks:create', async (_event, task) => {
        const db = getDb();
        const now = new Date().toISOString();

        const transaction = db.transaction(() => {
            const taskResult = db.prepare(`
                INSERT INTO tasks (name, topic_id, due_datetime, complete, created_at, updated_at)
                VALUES (?, ?, ?, 0, ?, ?)
            `).run(
                task.name,
                task.topicId ?? null,
                task.dueDateTime,
                now,
                now
            );

            const taskId = taskResult.lastInsertRowid;

            if (Array.isArray(task.bits) && task.bits.length > 0) {
                const insertBit = db.prepare(`
                    INSERT INTO bits (task_id, description, do_date, sort_order, complete, created_at, updated_at)
                    VALUES (?, ?, ?, ?, 0, ?, ?)
                `);

                task.bits.forEach((bit, index) => {
                    insertBit.run(
                        taskId,
                        bit.description,
                        bit.doDate,
                        index,
                        now,
                        now
                    );
                });
            }

            return { id: taskId };
        });

        return transaction();
    });

    ipcMain.handle('bits:getByTaskId', async (_event, taskId) => {
        const db = getDb();

        return db.prepare(`
            SELECT id, task_id, description, do_date, sort_order, complete
            FROM bits
            WHERE task_id = ?
            ORDER BY sort_order ASC, do_date ASC
        `).all(taskId);
    });
}

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'DueBit',
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

const startUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
});

    mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
    initDb();
    registerIpcHandlers();
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});