const path = require("path");
const express = require("express");
const notesRouter = require("./routes/notes.routes");
const { AppError } = require("./utils/errors");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/notes", notesRouter);

// Unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && err.details.length ? { details: err.details } : {}),
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
