const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const {
  initDb,
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  setTaskComplete,
  getBitsByTaskId,
  updateBit,
  setBitComplete,
  deleteBit,
  getUserName,
  setUserName,
  clearAppData,
  exportAllData,
  importAllData,
} = require('./db');

function registerIpcHandlers() {
  /* ----------------------------- TOPICS ----------------------------- */

  ipcMain.handle('topics:getAll', async () => {
    return getAllTopics();
  });

  ipcMain.handle('topics:create', async (_event, topic) => {
    return createTopic(topic);
  });

  ipcMain.handle('topics:update', async (_event, topic) => {
    return updateTopic(topic);
  });

  ipcMain.handle('topics:delete', async (_event, topicId) => {
    return deleteTopic(topicId);
  });

  /* ------------------------------ TASKS ----------------------------- */

  ipcMain.handle('tasks:getAll', async () => {
    return getAllTasks();
  });

  ipcMain.handle('tasks:getById', async (_event, taskId) => {
    return getTaskById(taskId);
  });

  ipcMain.handle('tasks:create', async (_event, task) => {
    return createTask(task);
  });

  ipcMain.handle('tasks:update', async (_event, task) => {
    return updateTask(task);
  });

  ipcMain.handle('tasks:delete', async (_event, taskId) => {
    return deleteTask(taskId);
  });

  ipcMain.handle('tasks:setComplete', async (_event, taskId, complete) => {
    return setTaskComplete(taskId, complete);
  });

  /* ------------------------------- BITS ----------------------------- */

  ipcMain.handle('bits:getByTaskId', async (_event, taskId) => {
    return getBitsByTaskId(taskId);
  });

  ipcMain.handle('bits:update', async (_event, bit) => {
    return updateBit(bit);
  });

  ipcMain.handle('bits:setComplete', async (_event, bitId, complete) => {
    return setBitComplete(bitId, complete);
  });

  ipcMain.handle('bits:delete', async (_event, bitId) => {
    return deleteBit(bitId);
  });

  ipcMain.handle('settings:getUserName', async () => {
    return getUserName();
  });

  ipcMain.handle('settings:setUserName', async (_event, name) => {
    return setUserName(name);
  });

  ipcMain.handle('settings:clearAppData', async () => {
    return clearAppData();
  });

  ipcMain.handle('settings:exportAllData', async () => {
    return exportAllData();
  });

  ipcMain.handle('settings:importAllData', async (_event, data) => {
    return importAllData(data);
  });
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'DueBit',
    width: 1000,
    height: 700,
    icon: path.join(__dirname, '../public/icon.png'),
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

   mainWindow.webContents.openDevTools();
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