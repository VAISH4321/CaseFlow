/* ============================================================
   CASEFLOW — SELF-HOSTED SERVER
   Serves the static frontend and holds your Anthropic API key
   server-side. The browser never sees the key: it calls this
   server's /api/analyze endpoint, and this server calls
   api.anthropic.com on its behalf.
   ============================================================ */

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';

app.use(express.json({ limit: '4mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- prompt construction (mirrors the client-side schema) ---------- */
function buildPrompt(documents, caseName) {
  const docsBlock = documents
    .filter(d => (d.text || '').trim())
    .map((d, i) => {
      const superOf = d.supersedesTitle ? ` — a newer version of "${d.supersedesTitle}"` : '';
      return `### Document ${i + 1}: "${d.title || 'Untitled document ' + (i + 1)}" (${d.type || 'Document'})${superOf}\n${d.text.trim()}`;
    })
    .join('\n\n');

  return `You are the document-intelligence engine behind CaseFlow, a legal operations platform. You are given the raw text of a set of case documents (contracts, emails, invoices, legal notices, correspondence). Analyze them the way a meticulous legal operations analyst would: reconstruct what happened and when, extract every obligation and deadline stated or reasonably implied, detect any contradictions between documents (e.g. two different payment windows for the same thing), identify evidence that is referenced or clearly needed but not included in what was given, assess operational risk, and propose the next concrete workflow steps. Ground every claim strictly in the text provided — never invent facts, names, or amounts that are not in the documents. If something is genuinely uncertain, reflect that with a lower confidence score rather than guessing.

${caseName ? `The matter is informally referred to as: "${caseName}".` : ''}

CASE DOCUMENTS:
${docsBlock}

Respond with ONLY a single JSON object (no markdown code fences, no commentary before or after) with exactly this shape:

{
  "caseName": "string — a short case caption, e.g. 'Party A v. Party B' or a descriptive matter name",
  "caseType": "string — e.g. 'Commercial — Payment Dispute'",
  "stage": "string — e.g. 'Pre-litigation — Demand & Response'",
  "readiness": 0,
  "readinessChecklist": [ { "label": "string", "status": "done | partial | attention", "detail": "string, empty if none" } ],
  "summary": "string — 2-3 plain-English sentences on what this matter is about",
  "parties": [ { "name": "string", "role": "string", "type": "org | person", "contact": "string, empty if unknown" } ],
  "documents": [ { "title": "string — must match a document title above", "type": "string", "summary": "string, one sentence", "confidence": 0 } ],
  "timeline": [ { "date": "YYYY-MM-DD if known else a short phrase like 'undated'", "title": "string", "detail": "string", "sourceDoc": "string — matching document title", "excerpt": "string — short exact or closely paraphrased quote from that document", "confidence": 0 } ],
  "obligations": [ { "title": "string", "sourceDoc": "string", "excerpt": "string", "confidence": 0, "computedFrom": "string — how the due date was derived", "dueDate": "YYYY-MM-DD or '—' if not applicable", "status": "upcoming | conflicted | monitoring | overdue", "party": "string — who owes this obligation" } ],
  "conflicts": [ { "title": "string", "description": "string explaining the contradiction and why it matters operationally", "sources": [ { "sourceDoc": "string", "excerpt": "string", "confidence": 0 } ] } ],
  "evidence": [ { "title": "string", "status": "have | missing", "reason": "string — why it matters / why it's flagged missing", "sourceDoc": "string, only if status is have" } ],
  "risks": [ { "severity": "high | medium | low", "title": "string", "detail": "string", "linked": "string — which obligation/conflict/evidence item this relates to" } ],
  "workflow": { "name": "string — name of the operational workflow this case needs next", "trigger": "string — what triggered this workflow", "steps": [ { "title": "string", "status": "done | active | blocked | pending", "owner": "string — 'System' for automatable steps or a person/role for human steps", "note": "string", "auto": true } ] },
  "drafts": [ { "title": "string", "type": "string — e.g. Client Request, Acknowledgment, Formal Response, Case Summary", "review": true, "status": "string — e.g. 'Ready to send' or 'Blocked — awaiting X'", "to": "string — recipient name/email", "body": "string — a full, professional draft, plain text, may include a Subject: line first" } ],
  "impactAnalysis": null
}

Rules:
- readiness is an integer 0-100 reflecting how operationally ready the case is to move to its next stage.
- readinessChecklist should have 4-7 items.
- timeline should have every material event you can find, in chronological order, 3-10 items.
- obligations: every deadline or payment/notice/response obligation you can find or compute, 2-8 items. Use status "conflicted" when two obligations you extracted contradict each other on the same underlying duty.
- conflicts: only include real contradictions between two or more of the documents provided. Omit entirely (empty array) if there are none — do not invent conflicts.
- evidence: include both what's clearly on file (status "have", cite the sourceDoc) and 1-5 things that are clearly referenced as needed, or obviously necessary next, but not present in the given documents (status "missing"). Do not list generic boilerplate evidence unless the documents themselves imply it's needed.
- risks: 2-6 items, ranked by real operational severity, tied to specific obligations/conflicts/evidence above via "linked".
- workflow.steps: 5-11 steps forming one coherent next workflow (e.g. responding to a notice, resolving a conflict, collecting missing evidence), ordered logically, mixing automated ("auto": true, owner "System") and human-judgment steps ("auto": false, owner a named person/role from the parties list — mark these "Human Review Required" in spirit).
- drafts: 2-4 realistic draft communications this workflow would produce (e.g. a request for missing documents, an acknowledgment, a substantive response). Mark "review": true for any draft that requires a legal judgment call or is blocked by an unresolved conflict — its body should clearly show it is a draft pending review, not a final communication. Mark "review": false only for administrative drafts (acknowledgments, internal summaries, evidence requests) that are safe to send once approved.
- impactAnalysis: only populate this (instead of null) if one of the documents above was explicitly marked as "a newer version of" another. If so, compare them and return { "from": {"label","version":"v1.0"}, "to": {"label","version":"v2.0"}, "changes": [ { "type": "added|removed|modified", "clause": "string", "severity": "high|medium|low", "before": "string or null", "after": "string or null", "impact": "string" } ], "affectedWorkflows": [ { "name": "string", "reason": "string" } ] }. Otherwise leave it as JSON null.
- Every excerpt must be something a reader could plausibly find in the source document text given above.
- Output valid JSON only. No trailing commas.`;
}

function extractJson(text) {
  // Strip markdown fences if the model added them despite instructions, then parse.
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

app.post('/api/analyze', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key, then restart the server.' });
  }
  const { documents, caseName } = req.body || {};
  if (!Array.isArray(documents) || documents.length === 0 || !documents.some(d => (d.text || '').trim())) {
    return res.status(400).json({ error: 'Add at least one document with some text before analyzing.' });
  }

  const prompt = buildPrompt(documents, caseName || '');

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error('Anthropic API error:', apiRes.status, errBody);
      return res.status(apiRes.status === 401 ? 401 : 502).json({
        error: apiRes.status === 401
          ? 'Anthropic rejected the API key. Check ANTHROPIC_API_KEY in your .env file.'
          : `Anthropic API error (${apiRes.status}). See server logs for details.`,
      });
    }

    const data = await apiRes.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(502).json({ error: 'The model did not return any text content.' });
    }

    let parsed;
    try {
      parsed = extractJson(textBlock.text);
    } catch (e) {
      console.error('JSON parse failure. Raw model output:\n', textBlock.text);
      return res.status(502).json({ error: 'The model\'s response was not valid JSON. Try analyzing again.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Request to Anthropic API failed:', err);
    res.status(500).json({ error: 'Could not reach the Anthropic API. Check your internet connection and try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasKey: Boolean(API_KEY) });
});

app.listen(PORT, () => {
  console.log(`\n  CaseFlow is running → http://localhost:${PORT}\n`);
  if (!API_KEY) {
    console.log('  ⚠  No ANTHROPIC_API_KEY found. Copy .env.example to .env and add your key.\n');
  }
});
