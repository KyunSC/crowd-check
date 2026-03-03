# Deploying CrowdCheck

Free-tier stack: **Cloudflare Pages** (frontend) + **Render** (API) + **Neon** (PostgreSQL).

---

## 1. Database — Neon PostgreSQL

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project (region: US East or closest to your users)
3. Copy the connection string — it looks like:
   ```
   Host=ep-cool-name-123456.us-east-2.aws.neon.tech;Port=5432;Database=neondb;Username=neondb_owner;Password=xxxx;SslMode=Require
   ```
4. **Important:** Neon requires `SslMode=Require` in the connection string

Free tier: 0.5 GB storage, auto-suspends after 5 min of inactivity (wakes instantly on next query).

---

## 2. API — Render

1. Create an account at [render.com](https://render.com)
2. New → **Web Service** → connect your GitHub/GitLab repo
3. Configure:
   - **Root Directory:** `api`
   - **Runtime:** Docker
   - **Plan:** Free
   - **Health Check Path:** `/health`
4. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `ConnectionStrings__Default` | Your Neon connection string from step 1 |
   | `FrontendOrigin` | Your Cloudflare Pages URL (set after step 3) |
   | `IpHashSecret` | Generate with `openssl rand -hex 32` |
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
5. Deploy — Render builds the Docker image and starts the API
6. Verify: visit `https://your-api.onrender.com/health`

Free tier: auto-sleeps after 15 min of no requests. First request after sleep takes ~30 seconds.

---

## 3. Frontend — Cloudflare Pages

1. Create an account at [cloudflare.com](https://cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages** → connect your repo
3. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/crowd-check/browser`
   - **Node version:** 22 (set `NODE_VERSION=22` in environment variables)
4. Deploy
5. Your site is live at `https://your-project.pages.dev`

Free tier: unlimited requests, global CDN, auto-SSL.

---

## 4. Connect the pieces

1. **Update `FrontendOrigin` in Render** to your Cloudflare Pages URL (e.g. `https://crowdcheck.pages.dev`)
2. **Update `src/environments/environment.prod.ts`** with your Render API URL:
   ```typescript
   apiBase: 'https://your-api.onrender.com/api',
   ```
3. Push to main — both platforms auto-deploy

---

## 5. Verify

- [ ] Visit your Cloudflare Pages URL — the app loads
- [ ] Check API health: `curl https://your-api.onrender.com/health`
- [ ] Submit a vote from the app — should succeed
- [ ] Submit again within 30 min — should get rate-limited (429)
- [ ] Check browser console — no CORS errors

---

## Custom domain (optional)

Both Cloudflare Pages and Render support custom domains:

- **Cloudflare Pages:** Settings → Custom domains → add your domain
- **Render:** Settings → Custom domains → add your domain + update DNS

If using the same parent domain (e.g. `crowdcheck.ca` for frontend, `api.crowdcheck.ca` for API), update:
- `FrontendOrigin` in Render to `https://crowdcheck.ca`
- `apiBase` in `environment.prod.ts` to `https://api.crowdcheck.ca/api`
- CSP `connect-src` in `index.html` to include your API domain

---

## Useful commands

```bash
# Generate a strong secret
openssl rand -hex 32

# Test API locally with Docker
docker compose up

# Build Angular for production locally
ng build --configuration production

# Check what the production build looks like
npx serve dist/crowd-check/browser
```
