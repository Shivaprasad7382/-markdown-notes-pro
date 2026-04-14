import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API = "https://notes-backend-k48z.onrender.com/notes";
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get(API);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const selectNote = (note) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const createNote = async () => {
    const res = await axios.post(API, { title, content });
    fetchNotes();
    setSelectedId(res.data.id);
  };

  const updateNote = async () => {
    if (!selectedId) return;
    await axios.put(`${API}/${selectedId}`, { title, content });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchNotes();
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedId) updateNote();
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <div className="container">
      <div className="sidebar">
        <button onClick={createNote}>+ New Note</button>
        {notes.map((note) => (
          <div key={note.id} onClick={() => selectNote(note)}>
            {note.title || "Untitled"}
            <button onClick={() => deleteNote(note.id)}>❌</button>
          </div>
        ))}
      </div>

      <div className="editor">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="preview">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;