# bharathkumaraju.com

Personal profile website (static, single page) + an AI chat assistant.

- **Static site** → hosted on **AWS S3 + CloudFront** (as before).
- **Chat assistant backend** → a **Cloudflare Worker** that proxies to **OpenAI `gpt-4o-mini`**.
  The OpenAI key lives only as a Worker *secret* — it is never in the website.

```
index.html         Full single-page site
chat-widget.css    Chat widget styles
chat-widget.js     Chat widget logic (calls the Worker; set API_BASE here)
profile.png        Profile photo
resume.pdf         Downloadable CV
sync_website.sh    Push static files to S3 (apex + www)
cloudfront_clearcache.sh   Invalidate CloudFront cache
worker/            Cloudflare Worker (the chat backend)
  src/index.ts        Worker code (OpenAI proxy, rate limiting, sessions)
  src/profile-data.ts Your profile — the chatbot's knowledge base
  wrangler.toml       Worker config (account id set; add KV id)
  package.json
```

---

## ⚠️ FIRST: revoke the exposed OpenAI key

The OpenAI key you shared earlier is compromised. Delete it at
<https://platform.openai.com/api-keys> and create a **new** one. Use the new key
only in the `wrangler secret put` step below.

Also set a monthly spend limit at <https://platform.openai.com/settings/organization/limits>
so nothing can run away.

---

## Part 1 — Deploy the Cloudflare Worker (chat backend)

From the `worker/` folder:

```bash
cd worker
npm install
npx wrangler login          # opens browser, log in to your Cloudflare account

# 1. Create the KV namespace (stores sessions + rate-limit counters)
npx wrangler kv namespace create PROFILE_DATA
#   -> copy the printed id, paste it into wrangler.toml (replace REPLACE_WITH_KV_ID)

# 2. Store your NEW OpenAI key as a secret (never in a file)
npx wrangler secret put OPENAI_API_KEY
#   -> paste the new sk-... key when prompted

# 3. Deploy
npx wrangler deploy
```

Wrangler prints your Worker URL, e.g.
`https://profile-ai-assistant.<your-subdomain>.workers.dev`.

Test it:
```bash
curl https://profile-ai-assistant.<your-subdomain>.workers.dev/api/health
# {"status":"healthy","model":"gpt-4o-mini",...}
```

## Part 2 — Point the site at your Worker

Open `chat-widget.js`, find the `API_BASE` constant near the top, and replace
`CHANGE-ME` with your real Worker subdomain:

```js
: "https://profile-ai-assistant.<your-subdomain>.workers.dev";
```

The Worker's `ALLOWED_ORIGINS` (in `worker/src/index.ts`) already lists
`https://bharathkumaraju.com` and `https://www.bharathkumaraju.com`. If you use a
different domain, add it there and redeploy the Worker.

```

bharathkumardasaraju@worker$ npx wrangler login

 ⛅️ wrangler 4.106.0
────────────────────
Attempting to login via OAuth...
Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=54d11594-84e4-41aa-b438-e81b8fa78ee7&redirect_uri=http%3A%2F%2Flocalhost%3A8976%2Foauth%2Fcallback&scope=account%3Aread%20user%3Aread%20workers%3Awrite%20workers_kv%3Awrite%20workers_routes%3Awrite%20workers_scripts%3Awrite%20workers_tail%3Aread%20d1%3Awrite%20pages%3Awrite%20zone%3Aread%20ssl_certs%3Awrite%20ai%3Awrite%20ai-search%3Awrite%20ai-search%3Arun%20websearch.run%20agent-memory%3Awrite%20queues%3Awrite%20pipelines%3Awrite%20secrets_store%3Awrite%20artifacts%3Awrite%20flagship%3Awrite%20containers%3Awrite%20cloudchamber%3Awrite%20connectivity%3Aadmin%20email_routing%3Awrite%20email_sending%3Awrite%20browser%3Awrite%20offline_access&state=mFY7iGGO8cMF53-N_~~u.-fz0quzBli.&code_challenge=XHdIvzV9Xupl1gF0DWa8xt9PZP9G-dnIbu4fBmBl_4Y&code_challenge_method=S256
Successfully logged in.

✔ Before you go, Wrangler detected AI coding agents that may not be best configured to work with Cloudflare: Claude Code, Cline, GitHub Copilot. Would you like Wrangler to automatically install Cloudflare skills for the best experience? … yes

🚀 Successfully installed Cloudflare skills for: Claude Code, Cline, GitHub Copilot.

bharathkumardasaraju@worker$ npx wrangler kv namespace create PROFILE_DATA

 ⛅️ wrangler 4.106.0
────────────────────
Resource location: remote

🌀 Creating namespace with title "PROFILE_DATA"
✨ Success!
To access your new KV Namespace in your Worker, add the following snippet to your configuration file:
[[kv_namespaces]]
binding = "PROFILE_DATA"
id = "2f73c5b9e7584a3daf592bb72a1a857a"

bharathkumardasaraju@worker$ sed -i '' 's/REPLACE_WITH_KV_ID/2f73c5b9e7584a3daf592bb72a1a857a/' wrangler.toml
bharathkumardasaraju@worker$ cat wrangler.toml
name = "profile-ai-assistant"
main = "src/index.ts"
compatibility_date = "2026-02-20"

account_id = "e1ac5beffe2eea29a0d51d4e90a71e19"

# KV namespace for rate limiting + session storage.
# Create it with:   wrangler kv namespace create PROFILE_DATA
# then paste the returned id below (replace 2f73c5b9e7584a3daf592bb72a1a857a).
[[kv_namespaces]]
binding = "PROFILE_DATA"
id = "2f73c5b9e7584a3daf592bb72a1a857a"

# Secrets are NOT stored here. Set your OpenAI key with:
#   wrangler secret put OPENAI_API_KEY
# (paste the NEW key when prompted — never commit it to git)

[vars]
# Non-sensitive config can go here if needed.
bharathkumardasaraju@worker$

bharathkumardasaraju@worker$ npx wrangler secret put OPENAI_API_KEY

 ⛅️ wrangler 4.106.0
────────────────────
✔ Enter a secret value: … ********************************************************************************************************************************************************************
🌀 Creating the secret for the Worker "profile-ai-assistant"
✔ There doesn't seem to be a Worker called "profile-ai-assistant". Do you want to create a new Worker with that name and add secrets to it? … yes
🌀 Creating new Worker "profile-ai-assistant"...
✨ Success! Uploaded secret OPENAI_API_KEY
bharathkumardasaraju@worker$

bharathkumardasaraju@worker$npx wrangler deploy

 ⛅️ wrangler 4.106.0
────────────────────

Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
Total Upload: 27.42 KiB / gzip: 9.47 KiB
Your Worker has access to the following bindings:
Binding                                                  Resource
env.PROFILE_DATA (2f73c5b9e7584a3daf592bb72a1a857a)      KV Namespace

Uploaded profile-ai-assistant (10.18 sec)
▲ [WARNING] You need to register a workers.dev subdomain before publishing to workers.dev


✔ Would you like to register a workers.dev subdomain now? … yes
✔ What would you like your workers.dev subdomain to be? It will be accessible at https://<subdomain>.workers.dev …

✔ What would you like your workers.dev subdomain to be? It will be accessible at https://<subdomain>.workers.dev … bhrthdsra1
✔ Creating a workers.dev subdomain for your account at https://bhrthdsra1.workers.dev. Ok to proceed? … yes
Success! It may take a few minutes for DNS records to update.
Visit https://dash.cloudflare.com/e1ac5beffe2eea29a0d51d4e90a71e19/workers/subdomain to edit your workers.dev subdomain
▲ [WARNING] Because 'workers_dev' is not in your Wrangler file, it will be enabled for this deployment by default.

  To override this setting, you can disable workers.dev by explicitly setting 'workers_dev = false'
  in your Wrangler file.


▲ [WARNING] Because your 'workers.dev' route is enabled and your 'preview_urls' setting is not in your Wrangler file, Preview URLs will be enabled for this deployment by default.

  To override this setting, you can disable Preview URLs by explicitly setting 'preview_urls =
  false' in your Wrangler file.


Deployed profile-ai-assistant triggers (117.99 sec)
  https://profile-ai-assistant.bhrthdsra1.workers.dev
Current Version ID: 10a6d9f4-18b3-44f7-affe-57ca6583b623
🪵  Logs were written to "/Users/bharathkumardasaraju/Library/Preferences/.wrangler/logs/wrangler-2026-07-02_15-43-04_543.log"
bharathkumardasaraju@worker$


bharathkumardasaraju@worker$ curl -ks https://profile-ai-assistant.bhrthdsra1.workers.dev/api/health | jq .
{
  "status": "healthy",
  "model": "gpt-4o-mini",
  "timestamp": "2026-07-02T21:02:43.869Z"
}
bharathkumardasaraju@worker$

bharathkumardasaraju@worker$ curl -ks -X POST https://profile-ai-assistant.bhrthdsra1.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://bharathkumaraju.com" \
  -d '{"message":"What are his Kubernetes certifications?"}'
data: {"type":"session","sessionId":"c34b75ce-b7d7-4164-9d06-78a9fac0cb07"}

data: {"type":"chunk","content":"B"}

data: {"type":"chunk","content":"har"}

data: {"type":"chunk","content":"ath"}

data: {"type":"chunk","content":"k"}

data: {"type":"chunk","content":"umar"}

data: {"type":"chunk","content":" Das"}

data: {"type":"chunk","content":"ar"}

data: {"type":"chunk","content":"aju"}

data: {"type":"chunk","content":" holds"}

data: {"type":"chunk","content":" all"}

data: {"type":"chunk","content":" five"}

data: {"type":"chunk","content":" CNC"}

data: {"type":"chunk","content":"F"}

data: {"type":"chunk","content":" Kubernetes"}

data: {"type":"chunk","content":" certifications"}
bharathkumardasaraju@worker$

```

## Part 3 — Deploy the static site to S3 + CloudFront

```bash
./sync_website.sh          # uploads to s3://bharathkumaraju.com and www.*
./cloudfront_clearcache.sh # invalidate cache so changes show immediately
```

> Both scripts use the `bharathraju` AWS profile and the CloudFront distribution
> `E1YYMBUH8BLLGN` — the same ones your previous site used. Adjust if they changed.

## Local preview

```bash
# terminal 1 — run the worker locally
cd worker && npx wrangler dev        # serves http://localhost:8787

# terminal 2 — serve the static site
python3 -m http.server 8000          # open http://localhost:8000
```

The widget auto-detects `localhost` and talks to `http://localhost:8787`.

---

## Cost

- **Cloudflare Worker:** free tier (100,000 requests/day). A portfolio won't come close.
- **OpenAI (`gpt-4o-mini`):** a few cents to a couple of dollars/month at portfolio
  traffic. Protected by the Worker's 10 req/min per-IP rate limit and your OpenAI
  spend cap.

## Updating the chatbot's knowledge

Edit `worker/src/profile-data.ts`, then `cd worker && npx wrangler deploy`.
No need to touch the website for chatbot content changes.
