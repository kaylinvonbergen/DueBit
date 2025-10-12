# Duebit

**Duebit** is a cross-platform desktop application built with **Electron.js** and **React** for managing due dates, reminders, and lightweight productivity tasks. Designed to be sleek, offline-ready, and distraction-free, Duebit combines the flexibility of a web interface with the performance of a native desktop app.

---

## 🚀 Features

- 🧭 **Task & Due Date Tracking** — Add, edit, and remove tasks with intuitive due-date assignment.  
- 🔔 **Local Notifications** — Get reminders before deadlines using your system’s native notifications (in progress).
- 💾 **Offline Storage** — Automatically saves data locally; no sign-in required (in progress). 
- ⚡ **Cross-Platform** — Runs on macOS, Windows, and Linux via Electron.  
- 🧱 **React Frontend + Electron Backend** — Modern UI with local system integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| UI | React.js, CSS Modules |
| Backend | Electron.js |
| Build Tools | Node.js, npm, Webpack |

---

## 🧩 Project Structure

```
duebit/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.js
├── electron.js
├── package.json
└── README.md
```

---

## 🧰 Setup & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development mode
This starts both React and Electron with live reload:
```bash
npm run dev
```

*(If your setup doesn’t use a combined dev command, run these separately:)*
```bash
npm run build     # rebuild React frontend
npm run electron  # launch Electron app
```

### 3. Build for production
```bash
npm run build
```
Then package the desktop app with your preferred Electron packager.

---

## 🧠 How It Works

The React frontend is bundled into a static `build/` directory, which Electron loads as its main window.  
The Electron process handles system-level APIs — notifications, file access, and local persistence — while the React app manages user interactions.

---

## 📦 Scripts

| Command | Description |
|----------|-------------|
| `npm start` | Runs the React development server |
| `npm run build` | Builds the production-ready frontend |
| `npm run electron` | Launches Electron with the built frontend |
| `npm run dev` | (Optional) Runs both concurrently for live development |

---

## 🧑‍💻 Author

**Kaylin Von Bergen**  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
