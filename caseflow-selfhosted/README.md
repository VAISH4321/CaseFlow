# CaseFlow — self-hosted

A small Node server + browser app that turns a set of pasted case documents
into a structured, source-linked legal workflow — using **your own**
Anthropic API key. No claude.ai account or extension needed to run it;
just Node and a key.

Your API key stays on the server. The browser talks to `localhost`, and
this server talks to `api.anthropic.com` — the key is never sent to, or
readable from, the browser.

## Setup

**1. Install Node.js 18 or later** if you don't have it: https://nodejs.org

**2. Install dependencies**

```bash
npm install
```

**3. Add your API key**

```bash
cp .env.example .env
```

Open `.env` and set:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

Get a key at https://console.anthropic.com/settings/keys (you'll need a
billing method on the account — this calls the paid API, not a free tier).

**4. Start the server**

```bash
npm start
```

**5. Open the app**

Go to **http://localhost:3000** in your browser.

## Using it

- Click **"Load an example case"** to try it immediately with a sample
  payment-dispute matter, or add your own documents (paste plain text —
  contracts, emails, notices, invoices, whatever you have).
- Click **Analyze case**. This sends your documents to `/api/analyze` on
  your local server, which calls the Claude API (model: `claude-sonnet-4-6`)
  and returns a structured case: timeline, obligations, conflicts, missing
  evidence, risk items, a proposed workflow, and draft communications.
- Mark a document as **"a newer version of"** another one to also get a
  semantic Impact Analysis between the two versions.
- Approving a draft, marking evidence received, or resolving a conflict
  updates the case state and the Audit Trail live, in your browser.
- Your last analyzed case is saved to `localStorage` in your browser, so
  reloading the page won't lose it. Nothing is stored server-side.

## Cost

Each analysis is one Claude API call (model `claude-sonnet-4-6`,
`max_tokens: 8000`). Cost depends on how much document text you paste in
plus the length of the response — typically a few cents per analysis at
current API pricing. Check https://docs.claude.com for current rates.

## What's real here vs. what's a shortcut

Real: the analysis. Every case you get back is actually produced by Claude
reading the text you provided — nothing about the extracted timeline,
obligations, conflicts, evidence gaps, risks, or drafts is hardcoded.

Shortcuts, for a hackathon/demo scope:
- **No OCR / file parsing.** You paste plain text; there's no PDF, DOCX, or
  image ingestion pipeline. Copy the text out of your documents first.
- **No database.** Case state lives in the browser (`localStorage`) and is
  lost if you clear site data. A real product would persist cases,
  documents, and audit history server-side, per user.
- **No auth / multi-user.** This is a single-user local tool. There's no
  login, and anyone with access to your machine and `localhost:3000` can
  use it (and spend your API credits).
- **One-shot analysis.** Each "Analyze case" is a single, fairly large
  prompt-and-response — not a multi-step agent, not RAG over a vector
  database, and it doesn't re-check its own conflict/evidence findings
  in a second pass.

## Project structure

```
server.js        — Express server; holds the API key; builds the prompt;
                    calls api.anthropic.com; serves the frontend
public/
  index.html      — app shell (intake screen + dashboard)
  style.css       — design system ("The Ledger")
  app.js          — intake logic, dashboard rendering, calls /api/analyze
.env.example      — copy to .env and add your key
package.json
```

## Troubleshooting

- **"No ANTHROPIC_API_KEY found"** — you haven't created `.env`, or the
  server needs restarting after you added the key.
- **"Anthropic rejected the API key"** — double check you copied the full
  key into `.env` with no extra spaces or quotes.
- **"The model's response was not valid JSON"** — rare; just click
  Analyze case again. Check the terminal running `npm start` for the raw
  output if it keeps happening.
- Port 3000 already in use — set `PORT=3001` (or any free port) in `.env`.
