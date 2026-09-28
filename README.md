# Personal Notes API

A small REST API for managing personal notes.

## Planned features

- Create a note
- Get all notes
- Get a note by ID
- Update a note
- Delete a note
- Search notes by title
- Basic validation

## Project structure

```
personal-notes-api/
├── src/
│   ├── controllers/   Request handlers
│   ├── routes/        Route definitions
│   ├── models/        Note data shape
│   ├── services/      Business logic
│   ├── utils/         Shared helpers
│   ├── app.js         Express app setup
│   └── index.js       Server entry point
├── tests/
├── README.md
├── package.json
└── .gitignore
```

## Getting started

```bash
npm install
npm run dev
```

The server listens on port `3000` by default. Open [http://localhost:3000](http://localhost:3000) for the notes page.

## API

Base path: `/api/notes`

| Method | Endpoint            | Description                                    |
| ------ | -------------------- | ----------------------------------------------- |
| GET    | `/api/notes`          | Get all notes                                   |
| GET    | `/api/notes?title=x`  | Filter notes by title (partial, case-insensitive) |
| GET    | `/api/notes/search?q=x` | Search notes by title or content (partial, case-insensitive) |
| GET    | `/api/notes/:id`      | Get a note by ID                                |
| POST   | `/api/notes`          | Create a note                                   |
| PUT    | `/api/notes/:id`      | Update a note                                   |
| DELETE | `/api/notes/:id`      | Delete a note                                   |

### Note shape

```json
{
  "id": "b3b8b6e0-1a2b-4c3d-9e0f-123456789abc",
  "title": "Buy milk",
  "content": "2% milk from the store",
  "createdAt": "2026-09-28T06:00:00.000Z",
  "updatedAt": "2026-09-28T06:00:00.000Z"
}
```

### Create a note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk", "content": "2% milk from the store"}'
```

### Search a note

```bash
curl "http://localhost:3000/api/notes/search?q=milk"
```

Matches are case-insensitive and checked against both `title` and `content`.

### Validation rules

- `title` is required, must be a non-empty string, max 200 characters.
- `content` is optional, must be a string if provided, max 5000 characters.
- Update requests must include at least one of `title` or `content`.
- Search requires a non-empty `q` query param, max 200 characters.

### Error format

```json
{
  "error": "Invalid note payload",
  "details": ["title is required"]
}
```

## Testing

```bash
npm test
```
