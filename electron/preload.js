const { contextBridge, ipcRenderer } = require('electron');

console.log('PRELOAD LOADED');

contextBridge.exposeInMainWorld('duebit', {
  topics: {
    getAll: () => ipcRenderer.invoke('topics:getAll'),
    create: (topic) => ipcRenderer.invoke('topics:create', topic),
    update: (topic) => ipcRenderer.invoke('topics:update', topic),
    delete: (topicId) => ipcRenderer.invoke('topics:delete', topicId),
  },

  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    getById: (taskId) => ipcRenderer.invoke('tasks:getById', taskId),
    create: (task) => ipcRenderer.invoke('tasks:create', task),
    update: (task) => ipcRenderer.invoke('tasks:update', task),
    delete: (taskId) => ipcRenderer.invoke('tasks:delete', taskId),
    setComplete: (taskId, complete) =>
      ipcRenderer.invoke('tasks:setComplete', taskId, complete),
  },

  bits: {
    getByTaskId: (taskId) => ipcRenderer.invoke('bits:getByTaskId', taskId),
    update: (bit) => ipcRenderer.invoke('bits:update', bit),
    delete: (bitId) => ipcRenderer.invoke('bits:delete', bitId),
    setComplete: (bitId, complete) =>
      ipcRenderer.invoke('bits:setComplete', bitId, complete),
  },
  settings: {
    getUserName: () => ipcRenderer.invoke('settings:getUserName'),
    setUserName: (name) => ipcRenderer.invoke('settings:setUserName', name),
    clearAppData: () => ipcRenderer.invoke('settings:clearAppData'),
    exportAllData: () => ipcRenderer.invoke('settings:exportAllData'),
    importAllData: (data) => ipcRenderer.invoke('settings:importAllData', data),
  },
});