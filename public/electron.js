const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');




function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'DueBit',
        width: 1000,
        height: 700,
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'), //connect to react app
        protocol: 'file:',
        slashes: true,
    });

    mainWindow.loadURL(startUrl); // load app in electron window
}

app.whenReady().then(createMainWindow)