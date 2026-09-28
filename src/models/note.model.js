const { randomUUID } = require("crypto");

class Note {
  constructor({ title, content = "" }) {
    const now = new Date().toISOString();
    this.id = randomUUID();
    this.title = title;
    this.content = content;
    this.createdAt = now;
    this.updatedAt = now;
  }
}

module.exports = Note;
