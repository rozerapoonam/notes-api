const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const formError = document.getElementById("form-error");
const formTitle = document.getElementById("form-title");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const searchInput = document.getElementById("search");
const notesList = document.getElementById("notes");
const emptyState = document.getElementById("empty");
const status = document.getElementById("status");

let editingId = null;
let searchDebounceTimer = null;

function setStatus(message) {
  status.textContent = message;
}

function showError(message) {
  formError.hidden = !message;
  formError.textContent = message || "";
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json();
  if (!response.ok) {
    const details = Array.isArray(body.details) ? `: ${body.details.join(", ")}` : "";
    throw new Error(`${body.error || "Request failed"}${details}`);
  }
  return body;
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "New note";
  saveButton.textContent = "Save note";
  cancelButton.hidden = true;
  showError("");
}

function startEdit(note) {
  editingId = note.id;
  titleInput.value = note.title;
  contentInput.value = note.content;
  formTitle.textContent = "Edit note";
  saveButton.textContent = "Update note";
  cancelButton.hidden = false;
  titleInput.focus();
}

function renderNotes(notes, searchTerm) {
  notesList.innerHTML = "";
  emptyState.hidden = notes.length > 0;
  emptyState.textContent = searchTerm
    ? `No notes match "${searchTerm}".`
    : "No notes yet.";

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.className = "note";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content || "No content";

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `Updated ${new Date(note.updatedAt).toLocaleString()}`;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEdit(note));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeNote(note.id));

    actions.append(editButton, deleteButton);
    item.append(title, content, meta, actions);
    notesList.append(item);
  });
}

async function loadNotes() {
  const term = searchInput.value.trim();
  const path = term
    ? `/api/notes/search?q=${encodeURIComponent(term)}`
    : "/api/notes";
  const result = await request(path);
  renderNotes(result.data, term);
  const label = term ? `${result.count} result${result.count === 1 ? "" : "s"}` : `${result.count} note${result.count === 1 ? "" : "s"}`;
  setStatus(label);
}

async function removeNote(id) {
  await request(`/api/notes/${id}`, { method: "DELETE" });
  if (editingId === id) {
    resetForm();
  }
  await loadNotes();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showError("");

  const payload = {
    title: titleInput.value,
    content: contentInput.value,
  };

  try {
    if (editingId) {
      await request(`/api/notes/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await request("/api/notes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    await loadNotes();
  } catch (error) {
    showError(error.message);
  }
});

cancelButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    loadNotes().catch((error) => setStatus(error.message));
  }, 300);
});

loadNotes().catch((error) => setStatus(error.message));
