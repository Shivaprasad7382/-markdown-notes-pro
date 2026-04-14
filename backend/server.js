const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// ✅ NEW DATABASE
const db = new Database("notes.db");

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`).run();

// GET
app.get("/notes", (req, res) => {
  try {
    const notes = db.prepare("SELECT * FROM notes").all();
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
app.post("/notes", (req, res) => {
  try {
    const { title, content } = req.body;
    const result = db
      .prepare("INSERT INTO notes (title, content) VALUES (?, ?)")
      .run(title, content);

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT
app.put("/notes/:id", (req, res) => {
  try {
    const { title, content } = req.body;
    const result = db
      .prepare("UPDATE notes SET title=?, content=? WHERE id=?")
      .run(title, content, req.params.id);

    res.json({ updated: result.changes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
app.delete("/notes/:id", (req, res) => {
  try {
    const result = db
      .prepare("DELETE FROM notes WHERE id=?")
      .run(req.params.id);

    res.json({ deleted: result.changes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});