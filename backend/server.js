const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./notes.db");

db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT
)`);

app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  db.run("INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/notes/:id", (req, res) => {
  const { title, content } = req.body;
  db.run("UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

app.delete("/notes/:id", (req, res) => {
  db.run("DELETE FROM notes WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));
