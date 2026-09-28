const notesService = require("../services/notes.service");
const {
  validateCreateNote,
  validateUpdateNote,
  validateId,
  validateSearchQuery,
} = require("../utils/validators");

function listNotes(req, res, next) {
  try {
    const { title } = req.query;
    const notes = notesService.getAllNotes({ title });
    res.status(200).json({ data: notes, count: notes.length });
  } catch (err) {
    next(err);
  }
}

function searchNotes(req, res, next) {
  try {
    const query = validateSearchQuery(req.query.q);
    const notes = notesService.searchNotes(query);
    res.status(200).json({ data: notes, count: notes.length, query });
  } catch (err) {
    next(err);
  }
}

function getNote(req, res, next) {
  try {
    validateId(req.params.id);
    const note = notesService.getNoteById(req.params.id);
    res.status(200).json({ data: note });
  } catch (err) {
    next(err);
  }
}

function createNote(req, res, next) {
  try {
    const payload = validateCreateNote(req.body);
    const note = notesService.createNote(payload);
    res.status(201).json({ data: note });
  } catch (err) {
    next(err);
  }
}

function updateNote(req, res, next) {
  try {
    validateId(req.params.id);
    const updates = validateUpdateNote(req.body);
    const note = notesService.updateNote(req.params.id, updates);
    res.status(200).json({ data: note });
  } catch (err) {
    next(err);
  }
}

function deleteNote(req, res, next) {
  try {
    validateId(req.params.id);
    notesService.deleteNote(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listNotes,
  searchNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
