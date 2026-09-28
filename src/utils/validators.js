const { ValidationError } = require("./errors");

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 5000;

function validateCreateNote(payload = {}) {
  const errors = [];
  const { title, content } = payload;

  if (title === undefined || title === null || String(title).trim() === "") {
    errors.push("title is required");
  } else if (typeof title !== "string") {
    errors.push("title must be a string");
  } else if (title.trim().length > MAX_TITLE_LENGTH) {
    errors.push(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }

  if (content !== undefined && content !== null) {
    if (typeof content !== "string") {
      errors.push("content must be a string");
    } else if (content.length > MAX_CONTENT_LENGTH) {
      errors.push(`content must be at most ${MAX_CONTENT_LENGTH} characters`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Invalid note payload", errors);
  }

  return {
    title: title.trim(),
    content: typeof content === "string" ? content.trim() : "",
  };
}

function validateUpdateNote(payload = {}) {
  const errors = [];
  const { title, content } = payload;
  const update = {};

  if (title === undefined && content === undefined) {
    errors.push("at least one of title or content must be provided");
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      errors.push("title must be a non-empty string");
    } else if (title.trim().length > MAX_TITLE_LENGTH) {
      errors.push(`title must be at most ${MAX_TITLE_LENGTH} characters`);
    } else {
      update.title = title.trim();
    }
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      errors.push("content must be a string");
    } else if (content.length > MAX_CONTENT_LENGTH) {
      errors.push(`content must be at most ${MAX_CONTENT_LENGTH} characters`);
    } else {
      update.content = content.trim();
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Invalid note payload", errors);
  }

  return update;
}

function validateId(id) {
  if (!id || typeof id !== "string") {
    throw new ValidationError("A valid note id is required");
  }
}

module.exports = { validateCreateNote, validateUpdateNote, validateId };
