# Contact Manager (Backend)

Minimal but working monolithic Node/Express backend for a contact manager. This version uses **in-memory storage** (data resets on restart).

## Quickstart

Requirements:
- Node.js 18+

Install dependencies:

```bash
npm install
```

Run in dev mode (auto-reload):

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

The server listens on `PORT` if set, otherwise defaults to **3001** (preview-friendly).

Health check:

- `GET /health`

Contacts API:

- `GET /api/contacts` (list all)
- `GET /api/contacts/:id` (get one)
- `POST /api/contacts` (create; requires `name` and `email`)
- `PUT /api/contacts/:id` (update; partial allowed; validates `email` if present)
- `DELETE /api/contacts/:id` (delete)
- `GET /api/contacts/seed` (seed sample contacts if store is empty)

## Example curl commands

Health:

```bash
curl -s http://localhost:3001/health | jq
```

List contacts (includes seeded contacts on startup):

```bash
curl -s http://localhost:3001/api/contacts | jq
```

Create a contact:

```bash
curl -s -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Linus Torvalds","email":"linus@example.com","phone":"+1-555-0110"}' | jq
```

Get a contact by id:

```bash
curl -s http://localhost:3001/api/contacts/1 | jq
```

Update a contact (partial):

```bash
curl -s -X PUT http://localhost:3001/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1-555-9999"}' | jq
```

Delete a contact:

```bash
curl -i -X DELETE http://localhost:3001/api/contacts/1
```

## Tooling

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```
