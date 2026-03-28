# DueBit (IN PROGRESS)

## Get things done, bit by bit!
**DueBit** is a cross-platform desktop application built with **Electron.js** and **React** for managing tasks by breaking them down into smaller, actionable “bits.” Designed to be sleek, offline-first, and distraction-free, DueBit combines the flexibility of a web interface with the performance and persistence of a native desktop app.

---

## 🚀 Features

### 🧠 Core Productivity
- 🧩 **Task → Bit Breakdown** — Split tasks into smaller “bits” with individual do-dates.
- 📅 **Smart Time Sections** — Automatically organizes bits into:
  - Today  
  - Tomorrow  
  - Later (sorted by date)  
  - Late (only appears when needed)
- 🎯 **Topic-Based Organization** — Group tasks under topics with color-coding.

### 🎨 UI & UX
- 🎨 **Color-Coded Workflow** — Bits and tasks inherit their topic’s color.
- 🖱️ **Hover Actions (In Progress)** — Quick actions like:
  - Mark complete  
  - Edit bit  
- 🔔 **Snackbar Notifications** — Temporary notifications with undo support (in progress).

### 💾 Data & Persistence
- 💽 **Local SQLite Database** — Fully offline, no accounts required.
- 🔗 **Relational Data Model**
  - Topics → Tasks → Bits
- ⚡ **Fast Queries via Electron IPC**
- 🔄 **Undo Support for Deletes** (in progress)

### ⚙️ Settings & Portability (In Progress)
- 👤 Save user display name
- 🧹 Clear all app data
- 📤 Export data (JSON/CSV planned)
- 📥 Import data for migration between devices

### 🖥️ Platform
- ⚡ **Cross-Platform Desktop App** — macOS, Windows, Linux via Electron

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| UI | React.js, CSS |
| Desktop Runtime | Electron.js |
| Database | SQLite (better-sqlite3) |
| IPC Layer | Electron preload + ipcMain/ipcRenderer |
| Build Tools | Node.js, npm, Webpack |

---

## 🧩 Project Structure

duebit/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.js
├── electron/
│   ├── main.js
│   ├── preload.js
│   └── db.js
├── build/
├── package.json
└── README.md

---

## 🧠 Architecture Overview

DueBit uses a **three-layer architecture**:

### 1. React Frontend
- Handles UI, state, and user interactions
- Calls backend functions via `window.duebit`

### 2. Electron Preload Layer
- Exposes a secure API

### 3. Electron Main + Database
- Handles IPC requests (`ipcMain`)
- Executes SQLite queries via `better-sqlite3`
- Manages relational data integrity

---

## 🗃️ Database Model

### Topics
- id
- name
- color
- weekly_time_goal

### Tasks
- id
- name
- topic_id
- num_bits
- repeats
- due_datetime
- due_on

### Bits
- id
- task_id
- description
- do_date
- complete

### Relationships
- A Topic has many Tasks
- A Task has many Bits
- Bits inherit display color from their task’s topic

---

## 🔌 IPC API (Frontend → Backend)

### Topics
- topics.getAll()
- topics.create(topic)
- topics.update(topic)
- topics.delete(topicId)

### Tasks
- tasks.getAll()
- tasks.getById(id)
- tasks.create(task)
- tasks.update(task)
- tasks.delete(id)
- tasks.setComplete(id, complete)

### Bits
- bits.getByTaskId(taskId)
- bits.update(bit)
- bits.setComplete(id, complete)
- bits.delete(id)

### Settings (In Progress)
- settings.getUserName()
- settings.setUserName(name)
- settings.clearAppData()
- settings.exportAllData()
- settings.importAllData(data)

---

## 🧰 Setup & Development

### 1. Install dependencies
npm install

### 2. Build React frontend
npm run build

### 3. Run Electron
npm run electron

---

## ⚠️ Native Module Note (Important)

If you see:
NODE_MODULE_VERSION mismatch

Run:
npm rebuild better-sqlite3

(Optional)
"rebuild-native": "electron-rebuild -f -w better-sqlite3"

---

## 🐞 Debugging Tips

### Open DevTools in Electron
mainWindow.webContents.openDevTools();

### Common Issues
- window.duebit undefined → preload not loaded
- IPC crashes → missing import in main.js
- Data not rendering → missing relationships

---

## 🧠 Design Philosophy

- Offline-first
- Minimal friction
- Composable productivity
- Local ownership of data

---

## 🧑‍💻 Author

Kaylin Von Bergen

---

## 📄 License

MIT License
