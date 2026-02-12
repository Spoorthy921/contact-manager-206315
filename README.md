# Project Repository

This repository now contains a minimal **Contact Manager frontend** scaffold.

## Frontend (React + Vite)

Location: `frontend/`

### Features
- Contacts list (Name, Email, Phone)
- Search/filter box
- Add contact form with basic client-side validation
- Edit and delete actions
- In-memory async data service (`frontend/src/services/contactsService.js`) returning Promises to mimic real API calls

### Ports
- Frontend dev server: **3000**
- Backend (planned / per system description): **3001**  
  (The frontend currently does **not** call the backend.)

### Run in development
```bash
cd frontend
npm install
npm run dev
```

### Production build + preview
```bash
cd frontend
npm install
npm run build
npm run preview
```

Notes:
- Data is stored in-memory in the browser; refreshing the page resets the data.
- The service layer is intentionally separated so it can be swapped to real HTTP calls later.
