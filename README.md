
# DueBit

### Get things done, bit by bit!

**DueBit** is an offline-first desktop task manager built to make big tasks feel manageable. Organize projects into color-coded **topics**, break scheduled tasks into smaller **bits**, and keep ideas without deadlines in a separate **backlog**.

All your information is stored locally on your computer—no account or internet connection is needed after setup.

> **Work in progress:** DueBit is currently run from its source code. There isn't a one-click installer provided in this repository yet. You only need to complete the initial setup once; afterward, you can start it with a couple of commands.

## Features

- **Tasks and bits:** Break down a larger task into actionable steps, each with its own *do date*.
- **Date-based dashboard:** See incomplete bits grouped by Late, Today, Tomorrow, This Week, Next Week, and Later.
- **Backlog:** Keep undated tasks separate from your schedule. Complete them directly or convert them into regular tasks (and vice versa).
- **Task notes:** Add rich-text notes to regular and backlog tasks (up to 3,000 characters).
- **Topics:** Group tasks by subject or project and use colors to distinguish them.
- **Completion actions:** Mark individual bits or backlog tasks as done; a temporary undo notification is available for completed bits.
- **Time-Keeper:** A topic-focused progress area; time tracking and totals are still being developed.
- **Local-first storage:** Tasks, bits, topics, and settings live in an on-device SQLite database.

Some settings and portability features are unfinished: the app can save a display name and clear task data, but the **Export Data** and **Import Data** buttons are currently placeholders rather than working file export/import flows.

---

## Getting started — no programming experience needed

These instructions work on **macOS** and **Windows**. Linux may work too, but this beginner guide focuses on Mac and Windows.

### Before you begin: install two free tools

**1. Install Node.js**

Open [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** version for your operating system. Run the installer and accept the defaults.

Node.js installs **npm**, which downloads the packages DueBit needs.

**2. Install Git**

Git is what downloads the project from GitHub using the `git clone` command.

- **Windows:** Download and install [Git for Windows](https://git-scm.com/downloads/win). You can use the default settings.
- **Mac:** Open the **Terminal** app (press `Command + Space`, type `Terminal`, and press Enter) and enter `git --version`. If macOS offers to install the Command Line Developer Tools, follow the prompts. You can also download Git from [git-scm.com](https://git-scm.com/downloads/mac).

After installing these tools, **close and reopen Terminal / PowerShell** so it can recognize the new commands.

### Step 1: Open a terminal

A *terminal* is a window where you type commands instead of clicking buttons. You can copy and paste each command below; press **Enter** after each one.

**On Mac:**
1. Press `Command + Space` to open Spotlight Search.
2. Type `Terminal`.
3. Press **Enter**.

**On Windows:**
1. Open the Start menu.
2. Type `PowerShell`.
3. Open **Windows PowerShell** (regular PowerShell is fine; you don't need administrator privileges).

### Step 2: Verify Node.js and Git

Run these three commands **one at a time**:

```bash
node --version
npm --version
git --version
```

Each should print a version number.

If you see an error such as **command not found** or **not recognized**, return to the installation steps above and reopen the terminal.

**Windows PowerShell note:** If PowerShell says that `npm.ps1` cannot be loaded because script execution is disabled, use `npm.cmd` instead of `npm` in the steps below (for example, `npm.cmd install`). No security-setting changes are necessary.

### Step 3: Choose where to save DueBit

For simplicity, we'll put DueBit inside your **Documents** folder.

**Mac — enter:**

```bash
cd ~/Documents
```

**Windows PowerShell — enter:**

```powershell
cd "$HOME\Documents"
```

If your Windows Documents folder is synced with OneDrive or lives somewhere else, use File Explorer to locate it and then use the path to that folder, or choose a different folder such as your home directory (`cd $HOME`).

**What does `cd` mean?** It stands for *change directory*, which just means "go to this folder." It does not delete or change files.

### Step 4: Download DueBit (clone the repository)

On **either Mac or Windows**, run:

```bash
git clone https://github.com/kaylinvonbergen/DueBit.git
```

This downloads a new folder named `DueBit`.

Then enter that folder:

```bash
cd DueBit
```

If you see **destination path 'DueBit' already exists**, you've probably downloaded it previously. Skip cloning and use `cd DueBit` instead.

### Step 5: Install DueBit's packages

Make sure your terminal is inside the `DueBit` folder. Then run:

```bash
npm install
```

On Windows, use `npm.cmd install` if you encountered the PowerShell script restriction above.

This downloads React, Electron, SQLite support, and the other packages DueBit needs.

It may take a little while and print lots of messages. Some warnings do not necessarily mean failure, but errors that stop the command need attention.

### Step 6: Build the app

Run:

```bash
npm run build
```

This creates a `build` folder containing the desktop app's user interface.

DueBit currently loads this folder when Electron starts, so **you must build before launching**, including after you download changes to the frontend.

### Step 7: Launch DueBit!

Run:

```bash
npm run electron
```

DueBit should open in its own desktop window.

A **Developer Tools** window or panel may also appear; this is currently enabled in the app for debugging and is normal.

**To quit:** Close the DueBit window. On a Mac, you can also select **DueBit → Quit** from the menu or press `Command + Q`.

Back in Terminal / PowerShell, press `Ctrl + C` if a process is still running.

### Quick command reference

These are the commands you'll normally use after installing Node.js and Git:

| What you want to do | Mac Terminal | Windows PowerShell |
|---|---|---|
| Go to your copy of DueBit | `cd ~/Documents/DueBit` | `cd "$HOME\Documents\DueBit"` |
| Install packages (first time, or after dependencies change) | `npm install` | `npm install` |
| Build the current interface | `npm run build` | `npm run build` |
| Open the desktop app | `npm run electron` | `npm run electron` |

If PowerShell blocks `npm.ps1`, substitute `npm.cmd` for `npm` in every Windows command.

If you saved the project somewhere other than Documents, change the folder path accordingly.

### Next time you want to open DueBit

You do **not** need to clone or install everything again.

Open Terminal / PowerShell and run:

**Mac:**

```bash
cd ~/Documents/DueBit
npm run electron
```

**Windows PowerShell:**

```powershell
cd "$HOME\Documents\DueBit"
npm run electron
```

You only need to run `npm run build` again when the frontend has changed or the `build` folder is missing.

### Getting the latest updates

DueBit is still under development.

If you'd like to pull the latest version, first close the app, then open Terminal / PowerShell, go into the DueBit folder, and run:

```bash
git pull
npm install
npm run build
npm run electron
```

Running `npm install` again ensures any newly added dependencies are installed.

**If you've modified the code yourself**, `git pull` may report conflicting changes; ask for help resolving them rather than deleting your files.

---

## Using DueBit

### Topics

Open **Topics** from the sidebar to create subjects or projects, choose their colors, and set a weekly time goal.

Tasks can be associated with a topic, which determines their card color.

### Regular tasks and bits

Open **Tasks** from the sidebar to add or edit a task.

Give it a name and, optionally, a topic, notes, due date, and repeat setting.

Set the number of **bits**—the smaller steps needed to get it done—and give individual bits do dates.

Dated, incomplete bits appear in the dashboard's relevant date sections.

Use **Edit** to revise the parent task or **✓** to mark a bit complete.

### Backlog

The **Backlog** panel is for tasks you want to remember but aren't ready to schedule.

1. Select **add task +** in the Backlog panel.
2. Enter a task name and any notes.
3. Leave **Backlog Task** enabled.
4. Save your task.

Backlog tasks don't require dates or bits.

To schedule one later, edit it, turn off **Backlog Task**, add dates/bits, and save.

You can also mark a backlog task complete directly from its card.

### Notes

Both regular and backlog tasks include an always-visible rich-text notes editor.

Use it for details, reminders, or planning, with a 3,000-character limit.

### Where your information is saved

DueBit stores your information **locally on your computer**, not in GitHub or an online account.

The database file is named `duebit.sqlite` and lives under Electron's app-data location in a `data` subfolder.

Removing your downloaded source-code folder does not necessarily remove this database.

There is currently no cloud sync, and the in-app file export/import interface isn't finished. Make your own backup of the database before changing computers or reinstalling your operating system.

---

## Troubleshooting

### `node`, `npm`, or `git` isn't recognized

Make sure the tool was installed successfully, then close and reopen Terminal / PowerShell.

Check the version commands in Step 2.

### Windows: `npm.ps1 cannot be loaded`

Use:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run electron
```

Instead of the corresponding `npm` commands.

### `git clone` says the folder already exists

Don't clone again.

Navigate into the existing folder with:

```bash
cd DueBit
```

If you already changed into it, continue with `npm install`.

### `Missing script: electron` or `package.json` can't be found

You may be in the wrong folder.

Use `pwd` on Mac or `Get-Location` on Windows to see your current folder, then navigate to the downloaded `DueBit` directory.

### App opens to a blank window / can't find `build/index.html`

Close the app and run:

```bash
npm run build
npm run electron
```

Make sure you're inside the DueBit folder.

### SQLite or native module version mismatch

If you see an error mentioning `NODE_MODULE_VERSION` or `better-sqlite3`, Electron may need the native SQLite package rebuilt for its own Node.js runtime.

From inside DueBit, run:

```bash
npx electron-rebuild -f -w better-sqlite3
npm run electron
```

On Windows PowerShell, use `npx.cmd` if `.ps1` execution is blocked.

If rebuilding fails, you may need platform-specific build tools. Please report the complete error message in a GitHub issue.

### Windows: Build tools errors while installing `better-sqlite3`

Native packages sometimes require the appropriate Microsoft C++ build tools and Python, especially if no prebuilt binary is available for your Node version.

Check the error output and consider using a current Node.js LTS version.

### An unexpected error occurs

Take a screenshot or copy the error text, then open an issue at:

[DueBit GitHub Issues](https://github.com/kaylinvonbergen/DueBit/issues)

Please include:

- Whether you're using Mac or Windows.
- What step failed.
- What the error message says.
- A screenshot, if helpful.

Avoid posting personal notes or task contents.

---

## For developers

### Technology

| Layer | Technology |
|---|---|
| Interface | React 19, CSS |
| Desktop shell | Electron 33 |
| Persistence | SQLite via `better-sqlite3` |
| Rich text | Tiptap |
| Bridge | Electron preload / IPC |
| Build | Create React App (`react-scripts`) |

### Project structure

```text
DueBit/
├── electron/
│   ├── db.js             # SQLite schema, migrations, and queries
│   ├── main.js           # Electron application and IPC handlers
│   └── preload.js        # Safe frontend-to-Electron API
├── public/               # Static assets
├── src/
│   ├── assets/           # UI images and icons
│   ├── components/       # Cards, rich-text editor, etc.
│   ├── App.js            # Main application UI and state
│   ├── App.css           # Application styling
│   └── index.js          # React entry point
├── package.json
├── package-lock.json
└── README.md
```

The `build/` output and `node_modules/` dependencies are created locally as needed.

### Architecture

DueBit uses three main layers:

**1. React frontend**

- Manages the dashboard, task forms, and application state.
- Handles user interactions and updates the interface.
- Communicates with Electron through `window.duebit`.

**2. Electron preload**

- Exposes a limited API using `contextBridge`.
- Provides controlled communication between the frontend and Electron's main process.

**3. Electron main process and SQLite**

- Registers IPC handlers for frontend requests.
- Performs database operations through `better-sqlite3`.
- Persists topics, tasks, bits, and settings locally.

### Data model

**Topics**
- Name
- Color
- Weekly time goal

**Tasks**
- Name
- Topic association
- Backlog flag
- Rich-text notes
- Due date/day
- Recurrence
- Completion status
- Creation and update timestamps

**Bits**
- Parent task
- Description
- Do date
- Ordering
- Completion status
- Creation and update timestamps

**Settings**
- Key-value entries, including display name

Backlog tasks are regular task records with `is_backlog = 1`, but without dates or bits.

Existing databases are upgraded through migrations in `electron/db.js`.

### Useful commands

```bash
npm install          # Install project dependencies
npm run build        # Create the production React build
npm run electron     # Launch the Electron desktop app
npm test             # Run the React test runner
npm start            # Start the React development server only
```

**Developer note:** `npm start` by itself launches the React development server, not the full Electron + SQLite experience.

The Electron main process currently loads the local `build/index.html` file. Run `npm run build` before `npm run electron` when testing application changes.

The Electron main process currently opens DevTools automatically. For a quieter friend-facing experience, that debugging line can be disabled in `electron/main.js` once the app is ready.

---

## Project principles

- **Offline-first:** Data stays on your machine.
- **Manageable steps:** Big tasks become smaller, doable actions.
- **Flexible planning:** Not every task needs a deadline.
- **Simple interface:** Focus on the work, not on configuring the tool.

## Author

Kaylin Von Bergen

## License

The repository's previous README identifies MIT as the intended license. Check for a committed `LICENSE` file before relying on a formal grant of license permissions.
