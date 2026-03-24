const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('duebit', {
  topics: {
    getAll: () => ipcRenderer.invoke('topics:getAll'),
    create: (topic) => ipcRenderer.invoke('topics:create', topic),
  },
  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    create: (task) => ipcRenderer.invoke('tasks:create', task),
  },
  bits: {
    getByTaskId: (taskId) => ipcRenderer.invoke('bits:getByTaskId', taskId),
  },
});