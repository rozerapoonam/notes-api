const Note = require("../models/note.model");
const { NotFoundError } = require("../utils/errors");

// In-memory store. Swap for a database-backed implementation later.
let notes = [];

function getAllNotes({ title } = {}) {
  if (title) {
    const term = title.toLowerCase();
    return notes.filter((note) => note.title.toLowerCase().includes(term));
  }
  return [...notes];
}

function searchNotes(term) {
  const needle = term.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(needle) ||
      note.content.toLowerCase().includes(needle)
  );
}

function getNoteById(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) {
    throw new NotFoundError(`Note with id "${id}" not found`);
  }
  return note;
}

function createNote(data) {
  const note = new Note(data);
  notes.push(note);
  return note;
}

function updateNote(id, updates) {
  const note = getNoteById(id);
  Object.assign(note, updates, { updatedAt: new Date().toISOString() });
  return note;
}

function deleteNote(id) {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    throw new NotFoundError(`Note with id "${id}" not found`);
  }
  const [deleted] = notes.splice(index, 1);
  return deleted;
}

// Exposed for test isolation only.
function _resetNotes() {
  notes = [];
}

module.exports = {
  getAllNotes,
  searchNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  _resetNotes,
};
