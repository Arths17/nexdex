# NexDex MVP

GitHub Repository: https://github.com/Arths17/nexdex

Basic student-focused MVP with:

- React frontend (`frontend/`)
- Node.js + Express backend (`backend/`)
- In-memory tasks storage
- AI/ML stub endpoint (`GET /suggest`)

## Project Structure

```
nexdexofficial/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
└── README.md
```

## Backend (Express)

From the `backend/` folder:

```bash
npm install
node server.js
```

Backend runs on `http://localhost:5050` by default.

To use a custom backend port:

```bash
PORT=6000 node server.js
```

### API Endpoints

- `GET /tasks` → returns current tasks
- `POST /tasks` → adds a new task
  - body: `{ "title": "Your task" }`
- `PATCH /tasks/:id` → marks task complete/incomplete
  - body: `{ "completed": true }` or `{ "completed": false }`
- `DELETE /tasks/:id` → deletes a task
- `GET /suggest` → returns dummy AI suggestion

## Frontend (React + Vite)

From the `frontend/` folder:

```bash
npm install
npm start
```

Frontend runs on `http://localhost:5173` by default and calls backend at `http://localhost:5050`.

To point frontend to a different backend URL, create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:6000
```

## How It Works

- Dashboard fetches tasks from backend using Axios.
- Input box allows adding new tasks.
- New tasks are posted to backend and shown in UI immediately.
- Tasks can be marked complete/incomplete and deleted from the dashboard.
- Suggest button calls `GET /suggest` for the AI/ML stub response.

## Extension Ideas for Interns

- Add groups and milestones to tasks.
- Persist data in a database.
- Replace `/suggest` stub with OpenAI API or an ML model.

## Next Features to Add

### Task Management

- Mark tasks as complete / incomplete.
- Delete tasks.
- Sort tasks by deadline or priority.

### AI/ML Suggestions

- Make dynamic suggestions based on completed tasks.
- Allow students to request multiple suggestions.
- Eventually integrate OpenAI API for smarter suggestions.
- Optional study groups or shared tasks.

### Frontend Improvements

- Highlight completed tasks visually.
- Simple responsive UI.
- Add notifications for AI suggestions.

### Backend Improvements

- Persist tasks to a database instead of memory.
- Support `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id` (mark complete).
- Improve AI suggestion endpoint `/suggest` with multiple options.# nexdex
