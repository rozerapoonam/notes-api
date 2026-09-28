const express = require("express");
const controller = require("../controllers/notes.controller");

const router = express.Router();

// GET /api/notes            -> list all notes
// GET /api/notes?title=foo  -> search notes by (partial, case-insensitive) title
router.get("/", controller.listNotes);
router.get("/:id", controller.getNote);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;
