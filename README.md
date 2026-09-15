# Merkisys Website — AI Agent Setup

The site now has a chat "agent" button (using the Merkisys logo) in place
of the old back-to-top button, bottom-right of the screen. It talks to
Groq's LLM API through a small local backend, so your API key stays on
the server and is never exposed in the browser.

## 1. Get a Groq API key
1. Go to https://console.groq.com/keys
2. Sign in / create an account
3. Create a new API key and copy it

## 2. Add the key to .env
Open the `.env` file in the project root and replace the placeholder:

```
GROQ_API_KEY=your_groq_api_key_here
```

with your real key, e.g.:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

(`.env` is already listed in `.gitignore`, so it won't be committed to git.)

## 3. Install dependencies
You need Node.js 18+ installed. Then, from the project folder, run:

```
npm install
```

## 4. Start the server
```
npm start
```

This starts the site (with the agent working) at:

```
http://localhost:3000
```

Open that URL in your browser — the agent button is bottom-right of the page.

## Notes
- If you just open `index.html` directly as a file (double-click), the
  agent will show a connection error, because there's no server to talk
  to Groq. You must run `npm start` and visit `http://localhost:3000`.
- You can change the model used via the `GROQ_MODEL` value in `.env`
  (defaults to `llama-3.3-70b-versatile`).
- If you deploy this online, deploy `server.js` (Node) somewhere that can
  keep `.env` private — e.g. Render, Railway, Fly.io, or a VPS — and set
  the same environment variables there instead of shipping the `.env` file.
