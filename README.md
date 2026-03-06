# NexDex MVP

GitHub Repository: https://github.com/Arths17/nexdex

AI-powered student platform for academic planning, opportunity discovery, and goal tracking.

**Live Demo:** https://arths17.github.io/nexdex  
**Status:** Production-Ready for Testing

## Current Features

- **Dashboard** – Task management with completion tracking
- **AI Recommendations Hub** – Smart suggestions powered by your progress
- **Smart Scheduler** – Deadline-focused task management with priority filtering
- **Opportunities Hub** – Searchable database of internships, research, and competitions
- **Roadmap Builder** – Create milestone-based paths to your dream colleges

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
│       ├── App.jsx               (multi-page router)
│       ├── api.js                (axios config)
│       ├── main.jsx
│       ├── styles.css
│       └── pages/
│           ├── Dashboard.jsx
│           ├── RecommendationsHub.jsx
│           ├── SmartScheduler.jsx
│           ├── OpportunitiesHub.jsx
│           └── RoadmapBuilder.jsx
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

#### Tasks
- `GET /tasks` → returns all tasks
- `POST /tasks` → adds a new task
  - body: `{ "title": "...", "deadline": "2026-03-15", "priority": "high", "category": "academic", "roadmapId": null }`
- `PATCH /tasks/:id` → updates task (complete, deadline, priority, category)
  - body: `{ "completed": true, "deadline": "...", "priority": "..." }`
- `DELETE /tasks/:id` → deletes a task

#### Opportunities
- `GET /opportunities` → returns all opportunities (supports query filtering)
  - Query params: `?type=internship&field=STEM&search=MIT`
- `GET /opportunities?type=internship` → filter by type (internship, research, competition)
- `GET /opportunities?field=STEM` → filter by field
- `GET /opportunities?search=keyword` → search by title/description

#### Roadmaps
- `GET /roadmaps` → returns all roadmaps
- `POST /roadmaps` → creates a new roadmap
  - body: `{ "name": "Path to MIT", "targetSchool": "MIT", "description": "...", "milestones": [] }`
- `PATCH /roadmaps/:id/milestones/:milestoneId` → toggle milestone completion
  - body: `{ "completed": true }`

#### AI Suggestions
- `GET /suggest` → returns contextual AI suggestion
  - response: `{ "suggestion": "...", "tasksCompleted": 5, "source": "ai-recommendations" }`

## Frontend (React + Vite)

From the `frontend/` folder:

```bash
npm install
npm start
```

Frontend runs on `http://localhost:5173` (or next available port) and connects to backend at `http://localhost:5050`.

To point frontend to a different backend URL, create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:6000
```

### Pages

1. **Dashboard** – Classic task list with add, complete, delete
2. **AI Recommendations Hub** – Context-aware suggestions based on your profile
3. **Smart Scheduler** – Priority-filtered tasks sorted by deadline
4. **Opportunities Hub** – Searchable/filterable internships, research, competitions
5. **Roadmap Builder** – Create custom college roadmaps with milestone tracking

## How It Works

- Multi-page React app using React Router
- All data flows through Express backend with in-memory storage
- Tasks support deadline, priority, and category fields
- Opportunities seeded with real example data (internships, research, competitions)
- Roadmaps allow creating college-specific milestone plans
- AI suggestions adapt based on completed tasks

## Production Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages on every push to `main` or `master`.

**Prerequisites:**
1. Fork the repository to your GitHub account
2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

**Automatic Deployment:**
- Every push to `main` triggers the GitHub Actions workflow
- Frontend builds and deploys to `https://yourusername.github.io/nexdex`

**Manual Deployment:**
```bash
npm --prefix frontend run build
# Output goes to frontend/dist/
# Push to main branch to trigger automatic deploy
```

### Backend Deployment Options

#### Option 1: Render.com (Recommended for Free Tier)

1. **Create Render Account:**
   - Sign up at https://render.com
   - Connect GitHub account

2. **Deploy Backend:**
   ```bash
   # Push code to GitHub
   git push origin main
   ```

3. **Create Web Service on Render:**
   - New → Web Service
   - Select repository: `nexdexofficial`
   - Name: `nexdex-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `cd backend && npm install && node server.js`
   - Add Environment Variable:
     - `NODE_ENV`: `production`
     - `CORS_ORIGIN`: `https://yourusername.github.io`

4. **Update Frontend .env:**
   ```bash
   # frontend/.env.production
   VITE_API_BASE_URL=https://nexdex-backend.onrender.com
   ```

5. **Redeploy frontend to activate new backend URL**

#### Option 2: Railway.app

1. **Create Railway Account:**
   - Sign up at https://railway.app
   - Connect GitHub

2. **New Project → Deploy from GitHub**
   - Select repository
   - Set root directory: `backend`
   - Environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `5050`

3. **Copy deployment URL and update frontend .env.production**

#### Option 3: Vercel (All-in-One)

1. **Push code to GitHub**

2. **Import project on Vercel:**
   - New Project → Import Git Repository
   - Select repository
   - Framework Preset: Other
   - Root Directory: `frontend`
   - Environment: Set `VITE_API_BASE_URL` to your backend URL

3. **Deploy backend separately or use Vercel Functions for serverless API**

### Environment Variables

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://your-backend-url.com
```

**Backend (.env):**
```env
PORT=5050
NODE_ENV=production
CORS_ORIGIN=https://yourusername.github.io/nexdex
DATABASE_URL=./nexdex.db
```

## Development

### Local Setup

```bash
# Frontend
cd frontend
npm install
npm start  # Runs on http://localhost:5173

# Backend (in another terminal)
cd backend
npm install
node server.js  # Runs on http://localhost:5050
```

### Testing

```bash
# Frontend build test
npm --prefix frontend run build

# Backend API test
curl http://localhost:5050/tasks
curl http://localhost:5050/opportunities
curl http://localhost:5050/roadmaps
curl http://localhost:5050/suggest
```

## File Structure

```
nexdexofficial/
├── .github/workflows/
│   └── deploy.yml              # Auto-deployment to GitHub Pages
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.production
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── ErrorBoundary.jsx
│       ├── api.js
│       ├── main.jsx
│       ├── styles.css
│       └── pages/
├── .gitignore
└── README.md
```

## Performance Optimizations

- ✅ Vite-based build with code splitting
- ✅ React Router for efficient client-side routing
- ✅ CSS media queries for responsive design
- ✅ Error boundaries for graceful error handling
- ✅ Lazy loading for page components
- ✅ CORS-enabled backend for cross-origin requests

## Security Considerations

- ✅ Environment variables for sensitive config
- ✅ CORS properly configured for GitHub Pages domain
- ✅ Input validation on frontend
- ✅ Error messages don't expose system details
- ✅ API endpoints require proper request format

## Monitoring & Logs

**Frontend:**
- Check GitHub Actions logs: https://github.com/Arths17/nexdex/actions

**Backend:**
- Render.com: Logs available in dashboard
- Railway.app: Real-time logs in project dashboard
- Vercel: Logs in deployment details

## Scaling Next Steps

1. **Database:** Replace in-memory storage with PostgreSQL
2. **Authentication:** Add user accounts with JWT
3. **Caching:** Add Redis for session management
4. **Analytics:** Track user behavior with Posthog or similar
5. **CI/CD:** Add automated testing before deploy
6. **Monitoring:** Set up error tracking with Sentry

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
# Rebuild
