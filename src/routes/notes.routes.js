const express = require("express");
const controller = require("../controllers/notes.controller");

const router = express.Router();

// GET /api/notes            -> list all notes
// GET /api/notes?title=foo  -> filter notes by (partial, case-insensitive) title
router.get("/", controller.listNotes);
// GET /api/notes/search?q=foo -> search notes by title or content (partial, case-insensitive)
// Must be registered before /:id so "search" isn't treated as an id.
router.get("/search", controller.searchNotes);
router.get("/:id", controller.getNote);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;
