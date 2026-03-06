# NexDex Deployment Guide 🐍

## Quick Start

### 1. Deploy Frontend to GitHub Pages (Automatic)

1. Push code to `main` or `master` branch
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Access at: `https://yourusername.github.io/nexdex`

### 2. Deploy Python Backend to Render.com (Recommended - FREE)

**Cost:** $0 (Free tier - no credit card required)

**Note:** Free tier services spin down after 15 min of inactivity (first request takes 10-15 sec to wake). Perfect for testing!

#### Step-by-Step:

1. **Create Render Account**
   - Visit https://render.com
   - Sign up with GitHub account (no credit card needed)

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Choose your `nexdexofficial` repository
   - Connect to Render

3. **Configure Service**
   - **Name:** `nexdex-backend`
   - **Environment:** Python
   - **Root Directory:** `backend` (important!)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
   - **Plan:** Free tier (perfect for testing)

4. **Set Environment Variables**
   - Click "Environment"
   - Add variable:
     ```
     PORT = 5050
     CORS_ORIGIN = https://yourusername.github.io/nexdex
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the service URL (e.g., `https://nexdex-backend.onrender.com`)

6. **Update Frontend Environment**
   ```bash
   # Edit frontend/.env.production
   VITE_API_BASE_URL=https://nexdex-backend.onrender.com
   ```

7. **Redeploy Frontend**
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL for production"
   git push origin main
   ```
   - GitHub Actions will automatically redeploy frontend with new backend URL

---

## Alternative Backend Deployments (All FREE)

### Railway.app (FREE - $5 credit/month)

1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Select `nexdexofficial` repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy and copy URL

### Fly.io (FREE - with limitations)

1. Sign up at https://fly.io
2. Install `flyctl`: `brew install flyctl`
3. `flyctl auth login` and authenticate
4. In `backend` directory: `flyctl launch`
5. Follow prompts, deploy, copy app URL

### Vercel (FREE - Serverless)

1. Sign up at https://vercel.com
2. Import GitHub project
3. Framework: Other
4. Root directory: `frontend`
5. Env vars: `VITE_API_BASE_URL`
6. Deploy

---

## Testing After Deployment

### Test Frontend
```bash
# Visit in browser
https://yourusername.github.io/nexdex
```

### Test Backend APIs
```bash
# Get tasks
curl https://nexdex-backend.onrender.com/tasks

# Get opportunities
curl https://nexdex-backend.onrender.com/opportunities

# Get roadmaps
curl https://nexdex-backend.onrender.com/roadmaps

# Get AI suggestion
curl https://nexdex-backend.onrender.com/suggest
```

### Test Integration
1. Open frontend URL in browser
2. Test Dashboard (add, complete, delete tasks)
3. Test Opportunities Hub (search, filter)
4. Test Roadmap Builder (create roadmap)
5. Test AI Suggestions (get recommendations)
6. Check browser console for errors (F12)

---

## Troubleshooting

### Frontend shows "404" on page refresh
- This is normal for GitHub Pages without a backend router
- Solution: All routes are handled client-side, refreshing should work
- If not working, check `.github/workflows/deploy.yml` is correct

### Frontend can't reach backend
- Check `VITE_API_BASE_URL` in `frontend/.env.production`
- Verify backend is running and accessible
- Check CORS headers by opening browser DevTools Network tab
- Ensure backend URL doesn't have trailing slash

### Backend returns CORS error
- Update `CORS_ORIGIN` environment variable to match frontend URL
- Verify backend is using correct CORS middleware
- Check: `echo "CORS_ORIGIN=$CORS_ORIGIN"` in backend logs

### Render backend goes to sleep
- Free tier sleeps after 15 min of inactivity
- First request takes 10-15 seconds to wake up
- No data loss—in-memory data persists while service is running
- Upgrade plan to keep service always on

---

## Production Checklist

- [ ] Frontend builds without errors
- [ ] Backend API endpoints respond correctly
- [ ] Frontend can communicate with backend
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Error messages display properly
- [ ] Mobile responsive design works
- [ ] No console errors in browser
- [ ] Backend logs show requests coming through
- [ ] Environment variables are set correctly
- [ ] GitHub Actions workflow is successful

---

## Monitoring

### GitHub Pages
- Check deployment status: https://github.com/Arths17/nexdex/actions
- View build logs for any errors

### Render.com Backend
- Dashboard shows service status
- Logs tab shows real-time server output
- Metrics tab shows CPU/memory usage

---

## Next Steps After Deployment

1. **Add Database:** Move from in-memory to PostgreSQL
2. **User Auth:** Add login/signup with JWT
3. **Custom Domain:** Point nexdex.com to GitHub Pages
4. **Email Notifications:** Send alerts for upcoming deadlines
5. **Mobile App:** Build React Native version
6. **Analytics:** Track user engagement
7. **Premium Features:** Subscription tier for advanced features
