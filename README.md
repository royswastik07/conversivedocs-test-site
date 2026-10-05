# ConversiveDocs Test Site

A static site hosted on Vercel for testing the **URL Update** feature in the AI Agent Configurator Knowledge tab.

## Deploy

```bash
npm i -g vercel
cd test-website
vercel --prod
```

Copy the deployed URL (e.g. `https://ConversiveDocs-test.vercel.app`) and add it to the Knowledge tab with **crawl depth 2**.

---

## Site structure (depth map)

```
/ (depth 0)
├── /about          (depth 1)
├── /features       (depth 1)  ← main change-detection target
├── /pricing        (depth 1)  ← good for price-change test
├── /docs           (depth 1)
│   ├── /docs/getting-started   (depth 2)
│   └── /docs/api-reference     (depth 2)
└── /blog           (depth 1)
    ├── /blog/post-1             (depth 2)
    └── /blog/post-2             (depth 2)

/api/error          → always returns HTTP 503 (failure simulation)
```

---

## Test scenarios

### 1. Content change detection
1. Add the site URL to the Knowledge tab and wait for the first crawl to finish.
2. Ask the agent: *"What is the Pro plan price?"* — it should answer **$12**.
3. Open `pricing.html` and change `$12` to `$15`. Also update the `Content version` line to `2.0`.
4. Push/redeploy.
5. Click **Update** on the URL row in the Knowledge tab.
6. Wait for the update to finish, then ask the same question. The agent should now answer **$15**.

### 2. Page added
1. Create `blog/post-3.html` (copy any existing post and change the title/content).
2. Add a link to it in `blog/index.html`.
3. Redeploy and click **Update**.
4. Ask the agent about content from the new post — it should find it.

### 3. Page removed
1. Delete `blog/post-2.html` and remove its link from `blog/index.html`.
2. Redeploy and click **Update**.
3. Ask the agent about content that was only in post-2 — it should no longer find it.

### 4. Failure simulation
1. Add `<your-site>/api/error` as a **separate URL** in the Knowledge tab.
   - It always returns HTTP 503, so the first crawl will fail.
   - The row should show **Last update failed** with an error message and a **Retry** button.
2. Alternatively: temporarily replace `index.html` content with a redirect to `/api/error` and redeploy, then click Update on the main URL.

### 5. Depth crawl
- Add the URL with **depth 1**: only root + immediate children are crawled (`/about`, `/features`, `/pricing`, `/docs`, `/blog`). Sub-pages like `/docs/getting-started` are NOT indexed.
- Add with **depth 2**: everything in the structure above is crawled.
- Verify by asking about content that only appears in a depth-2 page (e.g. the API rate limit).
