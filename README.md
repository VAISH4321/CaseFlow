# CaseFlow

**The AI operating system for legal workflows — give us the case, we'll give you the workflow.**

---

## Project Summary

CaseFlow turns a folder of messy case documents — emails, contracts, notices, invoices, correspondence — into a structured, source-linked, **executable legal workflow**. Instead of asking an AI "what does this document mean?", a legal team hands CaseFlow the whole case and gets back the operational answer: what happened, what still needs to happen, what evidence is missing, what deadlines are approaching, who needs to act, and what can safely be automated.

It is explicitly **not** an AI lawyer and not another document summarizer. Every extracted fact is traceable to its source, every contradiction is surfaced for human review instead of silently resolved, and every draft that requires legal judgment is flagged **Human Review Required** before it can be approved and sent.

## Problem & Solution

**The problem.** Legal operations teams lose enormous time doing the same manual work on every matter: reading through scattered documents to reconstruct what happened, hunting for every deadline and obligation buried in contract clauses and email threads, catching contradictions between what a contract says and what a counterparty claims, chasing down evidence that was referenced but never delivered, and drafting the same categories of follow-up communications over and over. A single missed date or overlooked clause can delay or damage an entire case — and none of this is a document-understanding problem so much as a *workflow* problem.

**The solution.** CaseFlow treats a case as a graph, not a pile of files. Given a set of documents, it:

- Reconstructs a **chronological case timeline**, every event linked back to the document and excerpt it came from
- Extracts **obligations and deadlines** (payment terms, response windows, notice periods) and computes concrete due dates
- Runs **conflict detection** across documents — e.g. a contract says 30 days, a later email says 15 — and routes contradictions to a human instead of guessing
- Runs a **Missing Evidence Engine** that flags what's referenced but not on file, and can generate the client request to go get it
- Produces a **Case Readiness Score** and a **Risk Engine** view of what's likely to cause a missed deadline or procedural failure
- Generates the **next operational workflow** as an editable process map, mixing automated steps with steps explicitly marked for human approval
- Drafts the routine communications (requests, acknowledgments, responses) that workflow implies — nothing sends without approval

Every one of these is produced by a live call to Claude analyzing the actual text provided, grounded in a strict "cite your source, lower your confidence if unsure, never invent facts" instruction set — not hardcoded or templated per case.

## How It Works

```
Documents (pasted text)
      │
      ▼
Prompted extraction (Claude, structured JSON output)
      │
      ▼
Case graph: parties · documents · timeline · obligations
      │
      ├──▶ Conflict Detection ──▶ held for human review
      ├──▶ Missing Evidence Engine ──▶ client request drafts
      ├──▶ Risk Engine ──▶ ranked by severity
      │
      ▼
Workflow Generator ──▶ editable process map
      │
      ▼
AI-Assisted Drafting ──▶ Human Review Required gate ──▶ Approve & send
```

## Tech Stack

- **Frontend:** vanilla HTML/CSS/JS (no framework) — a custom design system ("The Ledger": forest green, brass, ivory paper, Fraunces + IBM Plex typography)
- **AI:** Claude (`claude-sonnet-4-6`) via the Anthropic Messages API, prompted for strict structured JSON output covering parties, timeline, obligations, conflicts, evidence, risk, workflow steps, and drafts
- **Self-hosted backend:** Node.js + Express — holds the API key server-side, builds the extraction prompt, and proxies requests to `api.anthropic.com` so the key is never exposed to the browser
- **Persistence (demo scope):** browser `localStorage` for the last analyzed case; no database in this build
- **Design/testing tooling:** Playwright (headless Chromium) used during development to catch rendering bugs before shipping

## What's Real vs. What's a Hackathon Shortcut

**Real:** the analysis itself. Nothing in the dashboard — timeline, obligations, conflicts, evidence gaps, risk items, workflow steps, or drafts — is hardcoded. It's produced by Claude reading whatever text is pasted in, for whatever case is given to it.

**Shortcuts, scoped for the hackathon:**
- No OCR/file parsing — plain text in, not PDFs/DOCX/images directly
- No database or multi-user auth — single-session, browser-local state
- One-shot analysis per case, not a multi-step agent or RAG pipeline
- No e-signature/e-filing integration for actually executing approved actions

## Setup (self-hosted version)

```bash
cd caseflow-selfhosted
npm install
cp .env.example .env        # then add your ANTHROPIC_API_KEY
npm start                   # → http://localhost:3000
```
