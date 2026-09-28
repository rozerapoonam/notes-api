const request = require("supertest");
const app = require("../src/app");
const notesService = require("../src/services/notes.service");

beforeEach(() => {
  notesService._resetNotes();
});

describe("Notes CRUD API", () => {
  test("GET /api/notes returns an empty list initially", async () => {
    const res = await request(app).get("/api/notes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [], count: 0 });
  });

  test("POST /api/notes creates a note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ title: "Groceries", content: "Milk, eggs, bread" });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      title: "Groceries",
      content: "Milk, eggs, bread",
    });
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
    expect(res.body.data.updatedAt).toBeDefined();
  });

  test("POST /api/notes rejects a missing title", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ content: "No title here" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid note payload");
    expect(res.body.details).toContain("title is required");
  });

  test("GET /api/notes/:id returns a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Read a book" });

    const res = await request(app).get(`/api/notes/${created.body.data.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Read a book");
  });

  test("GET /api/notes/:id returns 404 for an unknown id", async () => {
    const res = await request(app).get("/api/notes/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test("GET /api/notes?title= searches notes by (partial, case-insensitive) title", async () => {
    await request(app).post("/api/notes").send({ title: "Buy milk" });
    await request(app).post("/api/notes").send({ title: "Walk the dog" });

    const res = await request(app).get("/api/notes").query({ title: "MILK" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe("Buy milk");
  });

  test("GET /api/notes/search?q= finds notes by title", async () => {
    await request(app).post("/api/notes").send({ title: "Buy milk" });
    await request(app).post("/api/notes").send({ title: "Walk the dog" });

    const res = await request(app)
      .get("/api/notes/search")
      .query({ q: "MILK" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe("Buy milk");
  });

  test("GET /api/notes/search?q= finds notes by content", async () => {
    await request(app)
      .post("/api/notes")
      .send({ title: "Groceries", content: "Pick up oat milk" });
    await request(app).post("/api/notes").send({ title: "Walk the dog" });

    const res = await request(app)
      .get("/api/notes/search")
      .query({ q: "oat milk" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe("Groceries");
  });

  test("GET /api/notes/search?q= returns an empty list when nothing matches", async () => {
    await request(app).post("/api/notes").send({ title: "Buy milk" });

    const res = await request(app)
      .get("/api/notes/search")
      .query({ q: "nonexistent" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  test("GET /api/notes/search rejects a missing q param", async () => {
    const res = await request(app).get("/api/notes/search");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test("PUT /api/notes/:id updates a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Old title" });

    const res = await request(app)
      .put(`/api/notes/${created.body.data.id}`)
      .send({ title: "New title" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("New title");
    expect(res.body.data.updatedAt).not.toBe(created.body.data.updatedAt);
  });

  test("PUT /api/notes/:id rejects an empty payload", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Something" });

    const res = await request(app)
      .put(`/api/notes/${created.body.data.id}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test("DELETE /api/notes/:id deletes a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Temporary" });

    const deleteRes = await request(app).delete(
      `/api/notes/${created.body.data.id}`
    );
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(
      `/api/notes/${created.body.data.id}`
    );
    expect(getRes.status).toBe(404);
  });

  test("DELETE /api/notes/:id returns 404 for an unknown id", async () => {
    const res = await request(app).delete("/api/notes/does-not-exist");

    expect(res.status).toBe(404);
  });
});
