const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

let db = null;

function getDbPath() {
  const userData = app.getPath('userData');
  const dataDir = path.join(userData, 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return path.join(dataDir, 'duebit.sqlite');
}

function runMigrations(database) {
  database.pragma('foreign_keys = ON');

  database.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      weekly_time_goal INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      topic_id INTEGER,
      due_datetime TEXT,
      due_on TEXT,
      repeats TEXT NOT NULL DEFAULT 'never',
      complete INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      description TEXT,
      do_date TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      complete INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Simple migration: older DBs may not have sort_order yet
  const bitColumns = database.prepare(`PRAGMA table_info(bits)`).all();
  const hasSortOrder = bitColumns.some((col) => col.name === 'sort_order');

  if (!hasSortOrder) {
    database.exec(`
      ALTER TABLE bits
      ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0
    `);
  }
}

function initDb() {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  db = new Database(dbPath);
  runMigrations(db);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

/* ----------------------------- HELPERS ---------------------------- */

function nowIso() {
  return new Date().toISOString();
}

/* ----------------------------- TOPICS ----------------------------- */

function getAllTopics() {
  const db = getDb();

  return db.prepare(`
    SELECT
      id,
      name,
      color,
      weekly_time_goal,
      created_at,
      updated_at
    FROM topics
    ORDER BY name COLLATE NOCASE ASC
  `).all();
}

function getTopicById(id) {
  const db = getDb();

  return db.prepare(`
    SELECT
      id,
      name,
      color,
      weekly_time_goal,
      created_at,
      updated_at
    FROM topics
    WHERE id = ?
  `).get(id);
}

function createTopic(topic) {
  const db = getDb();
  const now = nowIso();

  const result = db.prepare(`
    INSERT INTO topics (
      name,
      color,
      weekly_time_goal,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    topic.name,
    topic.color,
    topic.weeklyTimeGoal ?? 0,
    now,
    now
  );

  return getTopicById(result.lastInsertRowid);
}

function updateTopic(topic) {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE topics
    SET
      name = ?,
      color = ?,
      weekly_time_goal = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    topic.name,
    topic.color,
    topic.weeklyTimeGoal ?? 0,
    now,
    topic.id
  );

  return getTopicById(topic.id);
}

function deleteTopic(topicId) {
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare(`
      DELETE FROM tasks
      WHERE topic_id = ?
    `).run(topicId);

    db.prepare(`
      DELETE FROM topics
      WHERE id = ?
    `).run(topicId);
  });

  return transaction();
}

/* ------------------------------ TASKS ----------------------------- */

function getTaskById(id) {
  const db = getDb();

  return db.prepare(`
    SELECT
      t.id,
      t.name,
      t.topic_id,
      t.due_datetime,
      t.due_on,
      t.repeats,
      t.complete,
      t.completed_at,
      t.created_at,
      t.updated_at,
      tp.name AS topic_name,
      tp.color AS topic_color,
      (
        SELECT COUNT(*)
        FROM bits b
        WHERE b.task_id = t.id
      ) AS num_bits
    FROM tasks t
    LEFT JOIN topics tp ON t.topic_id = tp.id
    WHERE t.id = ?
  `).get(id);
}

function getAllTasks() {
  const db = getDb();

  return db.prepare(`
    SELECT
      t.id,
      t.name,
      t.topic_id,
      t.due_datetime,
      t.due_on,
      t.repeats,
      t.complete,
      t.completed_at,
      t.created_at,
      t.updated_at,
      tp.name AS topic_name,
      tp.color AS topic_color,
      (
        SELECT COUNT(*)
        FROM bits b
        WHERE b.task_id = t.id
      ) AS num_bits
    FROM tasks t
    LEFT JOIN topics tp ON t.topic_id = tp.id
    ORDER BY
      CASE
        WHEN (t.due_datetime IS NULL OR t.due_datetime = '')
         AND (t.due_on IS NULL OR t.due_on = '')
        THEN 1
        ELSE 0
      END,
      COALESCE(NULLIF(t.due_datetime, ''), NULLIF(t.due_on, '')) ASC,
      t.name COLLATE NOCASE ASC
  `).all();
}

function createTask(task) {
  const db = getDb();
  const now = nowIso();

  const transaction = db.transaction(() => {
    const taskResult = db.prepare(`
      INSERT INTO tasks (
        name,
        topic_id,
        due_datetime,
        due_on,
        repeats,
        complete,
        completed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)
    `).run(
      task.name,
      task.topicId ?? null,
      task.dueDateTime || null,
      task.dueOn || null,
      task.repeats || 'never',
      now,
      now
    );

    const taskId = taskResult.lastInsertRowid;

    const insertBit = db.prepare(`
      INSERT INTO bits (
        task_id,
        description,
        do_date,
        sort_order,
        complete,
        completed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, 0, NULL, ?, ?)
    `);

    if (Array.isArray(task.bits)) {
      task.bits.forEach((bit, index) => {
        insertBit.run(
          taskId,
          bit.description || '',
          bit.doDate || null,
          bit.sortOrder ?? index,
          now,
          now
        );
      });
    }

    return taskId;
  });

  const createdTaskId = transaction();
  return getTaskById(createdTaskId);
}

function updateTask(task) {
  const db = getDb();
  const now = nowIso();

  const transaction = db.transaction(() => {
    db.prepare(`
      UPDATE tasks
      SET
        name = ?,
        topic_id = ?,
        due_datetime = ?,
        due_on = ?,
        repeats = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      task.name,
      task.topicId ?? null,
      task.dueDateTime || null,
      task.dueOn || null,
      task.repeats || 'never',
      now,
      task.id
    );

    // Replace all bits for this task
    db.prepare(`
      DELETE FROM bits
      WHERE task_id = ?
    `).run(task.id);

    const insertBit = db.prepare(`
      INSERT INTO bits (
        task_id,
        description,
        do_date,
        sort_order,
        complete,
        completed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, 0, NULL, ?, ?)
    `);

    if (Array.isArray(task.bits)) {
      task.bits.forEach((bit, index) => {
        insertBit.run(
          task.id,
          bit.description || '',
          bit.doDate || null,
          bit.sortOrder ?? index,
          now,
          now
        );
      });
    }

    return task.id;
  });

  const updatedTaskId = transaction();
  return getTaskById(updatedTaskId);
}

function deleteTask(id) {
  const db = getDb();

  return db.prepare(`
    DELETE FROM tasks
    WHERE id = ?
  `).run(id);
}

function setTaskComplete(taskId, complete) {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE tasks
    SET
      complete = ?,
      completed_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    complete ? 1 : 0,
    complete ? now : null,
    now,
    taskId
  );

  return getTaskById(taskId);
}

/* ------------------------------- BITS ----------------------------- */

function getBitsByTaskId(taskId) {
  const db = getDb();

  return db.prepare(`
    SELECT
      id,
      task_id,
      description,
      do_date,
      sort_order,
      complete,
      completed_at,
      created_at,
      updated_at
    FROM bits
    WHERE task_id = ?
    ORDER BY sort_order ASC, id ASC
  `).all(taskId);
}

function getBitById(id) {
  const db = getDb();

  return db.prepare(`
    SELECT
      id,
      task_id,
      description,
      do_date,
      sort_order,
      complete,
      completed_at,
      created_at,
      updated_at
    FROM bits
    WHERE id = ?
  `).get(id);
}

function updateBit(bit) {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE bits
    SET
      description = ?,
      do_date = ?,
      sort_order = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    bit.description || '',
    bit.doDate || null,
    bit.sortOrder ?? 0,
    now,
    bit.id
  );

  return getBitById(bit.id);
}

function setBitComplete(bitId, complete) {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE bits
    SET
      complete = ?,
      completed_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    complete ? 1 : 0,
    complete ? now : null,
    now,
    bitId
  );

  return getBitById(bitId);
}

function deleteBit(id) {
  const db = getDb();

  return db.prepare(`
    DELETE FROM bits
    WHERE id = ?
  `).run(id);
}

function getSetting(key) {
  const db = getDb();

  const row = db.prepare(`
    SELECT value
    FROM settings
    WHERE key = ?
  `).get(key);

  return row ? row.value : null;
}

function setSetting(key, value) {
  const db = getDb();

  db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);

  return getSetting(key);
}

function getUserName() {
  return getSetting('display_name');
}

function setUserName(name) {
  return setSetting('display_name', name);
}

function clearAppData() {
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare(`DELETE FROM bits`).run();
    db.prepare(`DELETE FROM tasks`).run();
    db.prepare(`DELETE FROM topics`).run();
  });

  transaction();
}

function clearAllIncludingSettings() {
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare(`DELETE FROM bits`).run();
    db.prepare(`DELETE FROM tasks`).run();
    db.prepare(`DELETE FROM topics`).run();
    db.prepare(`DELETE FROM settings`).run();
  });

  transaction();
}

function exportAllData() {
  const db = getDb();

  const settingsRows = db.prepare(`
    SELECT key, value
    FROM settings
  `).all();

  const topics = db.prepare(`
    SELECT *
    FROM topics
    ORDER BY id
  `).all();

  const tasks = db.prepare(`
    SELECT *
    FROM tasks
    ORDER BY id
  `).all();

  const bits = db.prepare(`
    SELECT *
    FROM bits
    ORDER BY id
  `).all();

  const settings = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  return {
    settings,
    topics,
    tasks,
    bits,
  };
}

function importAllData(data) {
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare(`DELETE FROM bits`).run();
    db.prepare(`DELETE FROM tasks`).run();
    db.prepare(`DELETE FROM topics`).run();
    db.prepare(`DELETE FROM settings`).run();

    if (data.settings) {
      const insertSetting = db.prepare(`
        INSERT INTO settings (key, value)
        VALUES (?, ?)
      `);

      for (const [key, value] of Object.entries(data.settings)) {
        insertSetting.run(key, value);
      }
    }

    if (Array.isArray(data.topics)) {
      const insertTopic = db.prepare(`
        INSERT INTO topics (
          id,
          name,
          color,
          weekly_time_goal,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const topic of data.topics) {
        insertTopic.run(
          topic.id,
          topic.name,
          topic.color,
          topic.weekly_time_goal ?? 0,
          topic.created_at,
          topic.updated_at
        );
      }
    }

    if (Array.isArray(data.tasks)) {
      const insertTask = db.prepare(`
        INSERT INTO tasks (
          id,
          name,
          topic_id,
          due_datetime,
          due_on,
          repeats,
          complete,
          completed_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const task of data.tasks) {
        insertTask.run(
          task.id,
          task.name,
          task.topic_id ?? null,
          task.due_datetime ?? null,
          task.due_on ?? null,
          task.repeats ?? 'never',
          task.complete ?? 0,
          task.completed_at ?? null,
          task.created_at,
          task.updated_at
        );
      }
    }

    if (Array.isArray(data.bits)) {
      const insertBit = db.prepare(`
        INSERT INTO bits (
          id,
          task_id,
          description,
          do_date,
          sort_order,
          complete,
          completed_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const bit of data.bits) {
        insertBit.run(
          bit.id,
          bit.task_id,
          bit.description ?? '',
          bit.do_date ?? null,
          bit.sort_order ?? 0,
          bit.complete ?? 0,
          bit.completed_at ?? null,
          bit.created_at,
          bit.updated_at
        );
      }
    }
  });

  transaction();
}

module.exports = {
  initDb,
  getDb,
  getDbPath,

  getAllTopics,
  getTopicById,
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
  getBitById,
  updateBit,
  setBitComplete,
  deleteBit,

  getSetting,
  setSetting,
  getUserName,
  setUserName,
  clearAppData,
  exportAllData,
  importAllData,
};