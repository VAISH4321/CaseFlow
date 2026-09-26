/* ============================================================
   CASEFLOW — LIVE APP
   Intake -> real analysis via the `sample` capability -> dashboard.
   No document is hardcoded: everything the dashboard shows comes
   from whatever the person pastes in, analyzed at run time.
   ============================================================ */

const ICON = {
  mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H15l5 5v9.5c0 .83-.67 1.5-1.5 1.5h-14A1.5 1.5 0 0 1 4 18.5v-13Z"/><path d="M14 4v5h5"/><path d="M8 13h8M8 16.5h5"/></svg>`,
  overview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/></svg>`,
  timeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  docs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3.5h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M14 3.5v4h4"/></svg>`,
  evidence: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11.5l2 2 4-4.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="2"/></svg>`,
  deadline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>`,
  workflow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="12" r="2.2"/><circle cx="5" cy="18" r="2.2"/><path d="M7 6.7 17 11M17 13l-10 4.3"/></svg>`,
  risk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3 21 19H3L12 3Z"/><path d="M12 10v4M12 16.6v.1"/></svg>`,
  conflict: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4 4 12l4 8M16 4l4 8-4 8"/></svg>`,
  draft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20.5 5 16l11-11 3 3-11 11-4 1.5Z"/><path d="M14 6.5l3 3"/></svg>`,
  impact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 18V9M4 9l-2.5 2.5M4 9l2.5 2.5"/><path d="M20 6v9M20 15l2.5-2.5M20 15l-2.5-2.5"/><path d="M9 6h6M9 18h6"/></svg>`,
  audit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12.5 9.5 18 20 6"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 21 19H3L12 3Z"/><path d="M12 10v4M12 16.6v.1"/></svg>`,
  org: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20.5V5.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15"/><path d="M13 10.5h5a1 1 0 0 1 1 1v9"/><path d="M7 8.5h1M7 12h1M7 15.5h1"/></svg>`,
  person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.4"/><path d="M5 20.5c1.2-4 4-6 7-6s5.8 2 7 6"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h15M13 5l7 7-7 7"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 5 13h6l-1 8 7-10h-6l1-8Z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4.5l14 7.5-14 7.5v-15Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3.5v12M7 11l5 5 5-5"/><path d="M4.5 19.5h15"/></svg>`,
};

let DOCS = [];      // intake documents: {id, title, type, text, supersedes}
let CASE = null;    // analysis result from Claude
let AUDIT = [];      // dynamic action log
let docSeq = 0;

function uid(){ return 'd' + (++docSeq) + '-' + Math.random().toString(36).slice(2,7); }
function nowStamp(){ return new Date().toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
function logAudit(actor, action){ AUDIT.unshift({time: nowStamp(), actor, action}); }
function confClass(c){ c = Number(c)||0; return c>=90?'conf-high':c>=75?'conf-mid':'conf-low'; }
function fmtDate(d){
  if(!d || d==='—') return d || '—';
  const dt = new Date(d+'T00:00:00');
  if(isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

/* ============================================================
   INTAKE SCREEN
   ============================================================ */
const EXAMPLE_DOCS = [
  { title:"Master Services Agreement", type:"Contract", text:
`MASTER SERVICES AGREEMENT
Between Whitmore Retail Group, Inc. ("Client") and Sterling Logistics LLC ("Provider")
Executed: November 1, 2025

Section 4.1 (Delivery): Provider shall deliver within five (5) business days of order confirmation.
Section 7.2 (Payment): Payment shall be made within thirty (30) days of invoice date.
Section 11.2 (Cure): Either party shall have fifteen (15) days to cure any breach after written notice.
Section 11.4 (Suspension): Provider shall give not less than fifteen (15) days' notice before suspending Services.`},
  { title:"Invoice INV-88213", type:"Invoice", text:
`INVOICE INV-88213
From: Sterling Logistics LLC   To: Whitmore Retail Group, Inc.
Invoice date: June 1, 2026
Amount: $184,500.00 for Q2 fulfillment services.
Payment terms: per Master Services Agreement.`},
  { title:"Email — Reyes to Whitmore, Jun 18", type:"Email", text:
`From: Marcus Reyes (Sterling Logistics) 
To: Dana Whitmore (Whitmore Retail Group)
Date: June 18, 2026

Hi Dana — following up on INV-88213. Just a reminder that payment is due within 15 days of invoice under our current arrangement. Let us know if there's an issue.
— Marcus`},
  { title:"Email — Whitmore to Reyes, Jun 20", type:"Email", text:
`From: Dana Whitmore (Whitmore Retail Group)
To: Marcus Reyes (Sterling Logistics)
Date: June 20, 2026

Marcus — our MSA states a 30-day payment window (Section 7.2), not 15. Can you confirm which term governs before we proceed? We want to avoid any confusion.
— Dana`},
  { title:"Late Delivery Notice — Sterling", type:"Legal Notice", text:
`NOTICE OF LATE PAYMENT
From: Sterling Logistics LLC
To: Whitmore Retail Group, Inc.
Date: July 3, 2026

This letter serves as formal notice that payment on Invoice INV-88213 remains outstanding. A written response is required within 10 business days of this notice. Sterling Logistics reserves the right to suspend Services if payment is not received.`},
];

function newDoc(title, type, text, supersedes){
  return { id: uid(), title: title||'', type: type||'Contract', text: text||'', supersedes: supersedes||'' };
}

function addDoc(prefill){
  DOCS.push(prefill || newDoc('', 'Contract', ''));
  renderDocCards();
}
function removeDoc(id){
  DOCS = DOCS.filter(d=>d.id!==id);
  if(DOCS.length===0) addDoc();
  else renderDocCards();
}
function updateDoc(id, field, value){
  const d = DOCS.find(x=>x.id===id);
  if(d) d[field] = value;
  if(field==='title') renderDocCards(true); // refresh supersedes dropdowns without losing focus on text areas typically fine since title edits are less frequent mid-typing
}

function docTypeOptions(sel){
  return ['Contract','Email','Invoice','Legal Notice','Correspondence','Amendment','Other'].map(t=>`<option value="${t}" ${t===sel?'selected':''}>${t}</option>`).join('');
}
function supersedesOptions(currentId, sel){
  const others = DOCS.filter(d=>d.id!==currentId && d.title.trim());
  return `<option value="">— not a newer version of another document —</option>` +
    others.map(d=>`<option value="${d.id}" ${d.id===sel?'selected':''}>${d.title}</option>`).join('');
}

function renderDocCards(){
  const wrap = document.getElementById('doc-cards');
  wrap.innerHTML = DOCS.map((d,i)=>`
    <div class="doc-card">
      <div class="doc-card-head">
        <input class="field" placeholder="Document title (e.g. Master Services Agreement)" value="${escapeAttr(d.title)}"
          oninput="updateDoc('${d.id}','title',this.value)">
        <select class="field" onchange="updateDoc('${d.id}','type',this.value)">${docTypeOptions(d.type)}</select>
        <button class="doc-remove" onclick="removeDoc('${d.id}')" title="Remove document">${ICON.x}</button>
      </div>
      <div class="doc-card-body">
        <textarea placeholder="Paste the document's text here…" oninput="updateDoc('${d.id}','text',this.value)">${escapeHtml(d.text)}</textarea>
        <div class="doc-super-row">
          ${ICON.impact}
          <span>Newer version of:</span>
          <select onchange="updateDoc('${d.id}','supersedes',this.value)">${supersedesOptions(d.id, d.supersedes)}</select>
        </div>
      </div>
    </div>
  `).join('');
}
function escapeHtml(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function escapeAttr(s){ return (s||'').replace(/"/g,'&quot;'); }

function loadExample(){
  DOCS = EXAMPLE_DOCS.map(d=>newDoc(d.title, d.type, d.text));
  document.getElementById('case-name-input').value = 'Whitmore Retail Group v. Sterling Logistics LLC';
  renderDocCards();
}

/* ============================================================
   ANALYSIS — calls the `sample` capability
   ============================================================ */
async function analyzeCase(){
  const errBox = document.getElementById('analyze-error');
  const statusBox = document.getElementById('analyze-status');
  const statusText = document.getElementById('analyze-status-text');
  errBox.classList.remove('show');

  const validDocs = DOCS.filter(d=>d.text.trim().length>0);
  if(validDocs.length===0){
    errBox.textContent = 'Add at least one document with some text before analyzing.';
    errBox.classList.add('show');
    return;
  }

  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn.disabled = true;
  statusBox.classList.add('show');
  const phases = ['Reading documents…','Reconstructing the timeline…','Extracting obligations & deadlines…','Checking for conflicts…','Assessing missing evidence…','Drafting the workflow…'];
  let phaseIdx = 0;
  statusText.textContent = phases[0];
  const phaseTimer = setInterval(()=>{ phaseIdx = Math.min(phaseIdx+1, phases.length-1); statusText.textContent = phases[phaseIdx]; }, 2600);

  const caseName = document.getElementById('case-name-input').value.trim();
  try{
    const payloadDocs = validDocs.map(d=>({
      title: d.title, type: d.type, text: d.text,
      supersedesTitle: d.supersedes ? (DOCS.find(x=>x.id===d.supersedes)||{}).title || '' : '',
    }));
    const res = await fetch('/api/analyze', {
      method:'POST',
      headers:{ 'content-type':'application/json' },
      body: JSON.stringify({ documents: payloadDocs, caseName }),
    });
    const result = await res.json();
    if(!res.ok){
      throw new Error(result && result.error ? result.error : `Server error (${res.status})`);
    }
    normalizeAndLoadCase(result, caseName);
    persist();
    logAudit('System', `Case created from ${validDocs.length} uploaded document${validDocs.length>1?'s':''}.`);
    logAudit('System', 'AI analysis completed: parties, timeline, obligations, conflicts and workflow extracted.');
    renderAll();
    enterDashboard();
  }catch(err){
    console.error(err);
    errBox.textContent = (err && err.message) ? err.message : 'Something went wrong during analysis. Check that the server is running and your API key is set.';
    errBox.classList.add('show');
  }finally{
    clearInterval(phaseTimer);
    statusBox.classList.remove('show');
    analyzeBtn.disabled = false;
  }
}

function normalizeAndLoadCase(r, caseNameHint){
  r = r || {};
  CASE = {
    id: 'LIVE-' + new Date().toISOString().slice(0,10).replace(/-/g,''),
    name: r.caseName || caseNameHint || 'Untitled matter',
    type: r.caseType || 'General matter',
    stage: r.stage || 'Intake',
    readiness: clampInt(r.readiness, 0, 100, 50),
    readinessChecklist: Array.isArray(r.readinessChecklist) ? r.readinessChecklist : [],
    summary: r.summary || '',
    parties: Array.isArray(r.parties) ? r.parties : [],
    documents: Array.isArray(r.documents) ? r.documents : DOCS.map(d=>({title:d.title,type:d.type,summary:'',confidence:70})),
    timeline: Array.isArray(r.timeline) ? r.timeline : [],
    obligations: Array.isArray(r.obligations) ? r.obligations : [],
    conflicts: Array.isArray(r.conflicts) ? r.conflicts : [],
    evidence: Array.isArray(r.evidence) ? r.evidence : [],
    risks: Array.isArray(r.risks) ? r.risks : [],
    workflow: r.workflow && Array.isArray(r.workflow.steps) ? r.workflow : { name:'Case workflow', trigger:'', steps:[] },
    drafts: Array.isArray(r.drafts) ? r.drafts : [],
    impactAnalysis: r.impactAnalysis || null,
  };
  activeDraft = CASE.drafts.length ? 0 : null;
}
function clampInt(v,min,max,dflt){ v = parseInt(v,10); if(isNaN(v)) return dflt; return Math.max(min,Math.min(max,v)); }

/* ============================================================
   PERSISTENCE (per-viewer, this browser only)
   ============================================================ */
function persist(){
  try{
    localStorage.setItem('caseflow_live_v1', JSON.stringify({ docs:DOCS, case:CASE, audit:AUDIT }));
  }catch(e){ /* storage unavailable — silently skip */ }
}
function tryResume(){
  try{
    const raw = localStorage.getItem('caseflow_live_v1');
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
function resumeSaved(){
  const saved = tryResume();
  if(!saved) return;
  DOCS = saved.docs || [];
  CASE = saved.case || null;
  AUDIT = saved.audit || [];
  if(CASE){ activeDraft = CASE.drafts && CASE.drafts.length ? 0 : null; renderAll(); enterDashboard(); }
}
function clearSaved(){
  try{ localStorage.removeItem('caseflow_live_v1'); }catch(e){}
}

/* ============================================================
   SOURCE MODAL
   ============================================================ */
function openSource(sourceDoc, excerpt, confidence){
  const doc = (DOCS.find(d=> (d.title||'').toLowerCase() === (sourceDoc||'').toLowerCase())) || null;
  const c = Number(confidence)||0;
  document.getElementById('modal-title').textContent = 'Source & confidence';
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-row">
      <div class="modal-label">Document</div>
      <div style="font-weight:600;font-size:13.5px;">${escapeHtml(sourceDoc||'Unknown document')}</div>
    </div>
    <div class="modal-row">
      <div class="modal-label">Extracted excerpt</div>
      <div class="modal-excerpt">${escapeHtml(excerpt||'—')}</div>
    </div>
    <div class="modal-row">
      <div class="modal-label">Confidence</div>
      <div class="conf-bar-track"><div class="conf-bar-fill" style="width:${c}%; background:${c>=90?'var(--moss)':c>=75?'var(--brass)':'var(--burgundy)'}"></div></div>
      <div style="margin-top:6px;font-size:12px;color:var(--slate);">${c}% — ${c>=90?'high confidence, closely matches the source text':c>=75?'moderate confidence, worth verifying against the original':'low confidence — human review recommended'}</div>
    </div>
    ${doc ? `<div class="modal-row">
      <div class="modal-label">Full document text</div>
      <div class="modal-excerpt" style="max-height:220px;overflow-y:auto;font-style:normal;white-space:pre-wrap;">${escapeHtml(doc.text)}</div>
    </div>` : ''}
    <div class="modal-row"><button class="btn btn-sm" onclick="closeModal()">Close</button></div>`;
  document.getElementById('modal-backdrop').classList.add('show');
}
function closeModal(){ document.getElementById('modal-backdrop').classList.remove('show'); }

function sourceChip(sourceDoc, excerpt, confidence){
  const c = Number(confidence)||0;
  return `<button class="src-chip" onclick='openSource(${JSON.stringify(sourceDoc||'')}, ${JSON.stringify(excerpt||'')}, ${c})'>
    <span class="conf-dot ${confClass(c)}"></span>
    ${escapeHtml((sourceDoc||'source').slice(0,34))} · ${c}%
  </button>`;
}

/* ============================================================
   NAV / DASHBOARD SHELL
   ============================================================ */
const NAV = [
  { group:"Case", items:[
    {id:'overview', label:'Case overview', icon:'overview'},
    {id:'timeline', label:'Case timeline', icon:'timeline'},
    {id:'documents', label:'Document explorer', icon:'docs'},
  ]},
  { group:"Operations", items:[
    {id:'evidence', label:'Evidence tracker', icon:'evidence', badge:()=>(CASE.evidence||[]).filter(e=>e.status!=='have').length},
    {id:'deadlines', label:'Deadline monitor', icon:'deadline', badge:()=>(CASE.obligations||[]).filter(o=>o.status==='conflicted').length, badgeClass:'amber'},
    {id:'workflow', label:'Workflow builder', icon:'workflow'},
    {id:'risk', label:'Risk engine', icon:'risk', badge:()=>(CASE.risks||[]).filter(r=>r.severity==='high').length},
    {id:'conflicts', label:'Conflict detection', icon:'conflict', badge:()=>(CASE.conflicts||[]).filter(c=>c.status!=='resolved').length},
  ]},
  { group:"Output", items:[
    {id:'drafting', label:'AI drafting', icon:'draft', badge:()=>(CASE.drafts||[]).filter(d=>d.review).length, badgeClass:'amber'},
    {id:'impact', label:'Impact analysis', icon:'impact'},
    {id:'audit', label:'Audit trail', icon:'audit'},
  ]},
];
const VIEW_TITLES = {
  overview: ["Case overview", "A single, source-linked picture of the matter"],
  timeline: ["Case timeline", "Reconstructed chronology — every event traces to a document"],
  documents: ["Document explorer", "Documents processed for this case"],
  evidence: ["Evidence tracker", "What's on file, what's outstanding"],
  deadlines: ["Deadline monitor", "Obligations extracted and converted to dates"],
  workflow: ["Workflow builder", "The proposed next operational workflow"],
  risk: ["Risk engine", "Workflow failures worth acting on"],
  conflicts: ["Conflict detection", "Contradictory facts across documents"],
  drafting: ["AI-assisted drafting", "Generated communications — nothing sends without approval"],
  impact: ["Impact analysis", "What changed between document versions"],
  audit: ["Audit trail", "Every automated and human action on this case"],
};

function renderNav(){
  document.getElementById('nav').innerHTML = NAV.map(g=>`
    <div class="nav-group-label">${g.group}</div>
    ${g.items.map(it=>{
      const badge = it.badge ? it.badge() : 0;
      return `<div class="nav-item" data-view="${it.id}" onclick="showView('${it.id}')">
        ${ICON[it.icon]}<span>${it.label}</span>
        ${badge>0?`<span class="nav-badge ${it.badgeClass||''}">${badge}</span>`:''}
      </div>`;
    }).join('')}
  `).join('');
}
function showView(id){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===id));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id==='view-'+id));
  const [t,s] = VIEW_TITLES[id];
  document.getElementById('view-title').textContent = t;
  document.getElementById('view-sub').textContent = s;
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo(0,0);
}
function enterDashboard(){
  document.getElementById('intake').style.display = 'none';
  document.getElementById('app').classList.add('show');
  document.getElementById('sidebar-case-num').textContent = CASE.id;
  document.getElementById('sidebar-case-name').textContent = CASE.name;
  renderNav();
  showView('overview');
}
function backToIntake(){
  document.getElementById('app').classList.remove('show');
  document.getElementById('intake').style.display = 'block';
  renderDocCards();
  window.scrollTo(0,0);
}
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }

/* ============================================================
   OVERVIEW
   ============================================================ */
function ringSVG(pct){
  const r=56, c=2*Math.PI*r, off = c*(1-pct/100);
  return `<svg width="132" height="132" viewBox="0 0 132 132">
    <circle cx="66" cy="66" r="${r}" fill="none" stroke="var(--line-soft)" stroke-width="10"/>
    <circle cx="66" cy="66" r="${r}" fill="none" stroke="var(--brass)" stroke-width="10" stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/>
  </svg>`;
}
function statusIcon(status){
  if(status==='done') return `<span class="ic" style="color:var(--moss)">${ICON.check}</span>`;
  if(status==='partial') return `<span class="ic" style="color:var(--amber)">${ICON.alert}</span>`;
  return `<span class="ic" style="color:var(--burgundy)">${ICON.alert}</span>`;
}

function renderOverview(){
  const c = CASE;
  const nextObligation = (c.obligations||[]).find(o=>o.status==='upcoming') || (c.obligations||[])[0];
  document.getElementById('view-overview').innerHTML = `
    ${c.summary ? `<div class="panel reveal" style="margin-bottom:20px;"><div class="panel-body" style="font-size:14px;line-height:1.6;color:var(--ink-soft);">${escapeHtml(c.summary)}</div></div>` : ''}
    <div class="grid g-12-8" style="align-items:start;">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="panel reveal">
          <div class="panel-head"><h3>Case readiness</h3></div>
          <div class="panel-body">
            <div class="readiness-wrap">
              <div class="ring">${ringSVG(c.readiness)}<div class="ring-num"><b>${c.readiness}%</b><span>READY</span></div></div>
              <div class="check-list">
                ${(c.readinessChecklist||[]).map(r=>`<div class="check-row">${statusIcon(r.status)}<span class="lbl">${escapeHtml(r.label)}</span>${r.detail?`<span class="det">${escapeHtml(r.detail)}</span>`:''}</div>`).join('') || `<div class="check-row"><span class="det">No checklist returned.</span></div>`}
              </div>
            </div>
          </div>
        </div>
        <div class="panel reveal" style="animation-delay:.05s">
          <div class="panel-head"><h3>Case graph — parties</h3><span class="meta">${(c.parties||[]).length} identified</span></div>
          <div class="panel-body">
            ${(c.parties||[]).map(p=>`
              <div class="party-row"><div class="party-ic">${p.type==='org'?ICON.org:ICON.person}</div>
              <div style="flex:1"><div class="party-name">${escapeHtml(p.name)}</div><div class="party-role">${escapeHtml(p.role||'')}${p.contact?' · '+escapeHtml(p.contact):''}</div></div></div>
            `).join('') || `<div class="empty">${ICON.person}<div>No parties extracted.</div></div>`}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="grid g-3">
          <div class="panel reveal" style="animation-delay:.08s"><div class="panel-body"><div class="stat"><div class="n">${(c.documents||[]).length}</div><div class="l">Documents processed</div></div></div></div>
          <div class="panel reveal" style="animation-delay:.11s"><div class="panel-body"><div class="stat"><div class="n">${(c.obligations||[]).length}</div><div class="l">Obligations detected</div></div></div></div>
          <div class="panel reveal" style="animation-delay:.14s"><div class="panel-body"><div class="stat"><div class="n">${(c.evidence||[]).filter(e=>e.status!=='have').length}</div><div class="l">Evidence items missing</div></div></div></div>
        </div>
        <div class="panel reveal" style="animation-delay:.16s">
          <div class="panel-head"><h3>Needs attention</h3><span class="meta">${(c.risks||[]).length} risk items</span></div>
          <div class="panel-body">
            ${(c.risks||[]).slice(0,3).map(r=>`
              <div class="risk-row sev-${r.severity}" style="margin-bottom:10px;cursor:pointer;" onclick="showView('risk')">
                <div style="flex:1;"><div class="risk-title"><span class="dot dot-${r.severity}"></span>${escapeHtml(r.title)}</div><div class="risk-detail">${escapeHtml(r.detail)}</div></div>
              </div>`).join('') || `<div class="empty">${ICON.check}<div>No risk items flagged.</div></div>`}
            ${(c.risks||[]).length>0?`<button class="btn btn-sm" style="margin-top:4px;" onclick="showView('risk')">View all risk items ${ICON.arrowRight}</button>`:''}
          </div>
        </div>
        ${nextObligation ? `<div class="panel reveal" style="animation-delay:.2s">
          <div class="panel-head"><h3>Next deadline</h3></div>
          <div class="panel-body">
            <div class="dl-row" style="border:none;padding:0;">
              <div class="dl-date">${nextObligation.dueDate && nextObligation.dueDate!=='—' ? `<span class="day">${(new Date(nextObligation.dueDate+'T00:00:00')).getDate()||''}</span>${fmtDate(nextObligation.dueDate).split(' ')[0]}` : '—'}</div>
              <div><div class="dl-title">${escapeHtml(nextObligation.title)}</div><div class="dl-sub">Owner: ${escapeHtml(nextObligation.party||'—')}</div></div>
              <button class="btn btn-sm" onclick="showView('deadlines')">Details</button>
            </div>
          </div>
        </div>` : ''}
      </div>
    </div>
  `;
}

/* ============================================================
   TIMELINE / DOCUMENTS
   ============================================================ */
function renderTimeline(){
  const items = CASE.timeline||[];
  document.getElementById('view-timeline').innerHTML = `<div class="panel reveal"><div class="panel-body">
    <div class="tl">${items.map(t=>`
      <div class="tl-item">
        <div class="tl-date">${fmtDate(t.date)}</div>
        <div class="tl-title">${escapeHtml(t.title)}</div>
        <div class="tl-detail">${escapeHtml(t.detail)}</div>
        ${sourceChip(t.sourceDoc, t.excerpt, t.confidence)}
      </div>`).join('') || `<div class="empty">${ICON.timeline}<div>No timeline events extracted.</div></div>`}
    </div></div></div>`;
}
function renderDocuments(){
  const docs = CASE.documents||[];
  document.getElementById('view-documents').innerHTML = `<div class="panel reveal"><div class="panel-body flush">
    <table class="doc-table"><thead><tr><th style="width:34%">Document</th><th>Type</th><th>Confidence</th></tr></thead><tbody>
    ${docs.map(d=>`<tr onclick='openSource(${JSON.stringify(d.title||'')}, ${JSON.stringify(d.summary||'')}, ${Number(d.confidence)||0})'>
      <td><div class="doc-name">${ICON.docs}${escapeHtml(d.title)}</div><div class="doc-summary">${escapeHtml(d.summary||'')}</div></td>
      <td><span class="pill pill-neutral">${escapeHtml(d.type||'Document')}</span></td>
      <td><span class="src-chip"><span class="conf-dot ${confClass(d.confidence)}"></span>${Number(d.confidence)||0}%</span></td>
    </tr>`).join('') || `<tr><td colspan="3"><div class="empty">${ICON.docs}<div>No documents.</div></div></td></tr>`}
    </tbody></table></div></div>`;
}

/* ============================================================
   EVIDENCE
   ============================================================ */
function evMark(status){
  if(status==='have') return `<span class="ev-mark" style="color:var(--moss)">${ICON.check}</span>`;
  if(status==='requested') return `<span class="ev-mark" style="color:var(--amber)">${ICON.deadline}</span>`;
  return `<span class="ev-mark" style="color:var(--burgundy)">${ICON.alert}</span>`;
}
function renderEvidence(){
  const ev = CASE.evidence||[];
  const have = ev.filter(e=>e.status==='have'), missing = ev.filter(e=>e.status!=='have');
  document.getElementById('view-evidence').innerHTML = `
    <div class="grid g-2" style="align-items:start;">
      <div class="panel reveal"><div class="panel-head"><h3>On file</h3><span class="meta">${have.length} items</span></div>
        <div class="panel-body">${have.map(e=>`<div class="ev-row">${evMark(e.status)}<div><div class="ev-title">${escapeHtml(e.title)}</div>${e.sourceDoc?sourceChip(e.sourceDoc, e.reason||'', 90):''}</div></div>`).join('') || `<div class="empty">${ICON.evidence}<div>Nothing marked on file yet.</div></div>`}</div>
      </div>
      <div class="panel reveal" style="animation-delay:.06s"><div class="panel-head"><h3>Outstanding</h3><span class="meta">${missing.length} items</span></div>
        <div class="panel-body">${missing.map((e,i)=>`
          <div class="ev-row" id="ev-${i}">
            ${evMark(e.status)}
            <div style="flex:1">
              <div class="ev-title">${escapeHtml(e.title)} ${e.status==='requested'?'<span class="pill pill-partial" style="margin-left:6px;">requested</span>':'<span class="pill pill-attention" style="margin-left:6px;">missing</span>'}</div>
              <div class="ev-reason">${escapeHtml(e.reason||'')}</div>
              ${e.status!=='requested'?`<button class="btn btn-sm btn-outline-brass" style="margin-top:10px;" onclick="markRequested(${i})">Generate & send request</button>`:`<button class="btn btn-sm" style="margin-top:10px;" onclick="markReceived(${i})">Mark received</button>`}
            </div>
          </div>`).join('') || `<div class="empty">${ICON.check}<div>No outstanding evidence.</div></div>`}
        </div>
      </div>
    </div>`;
}
function markRequested(i){
  const missing = (CASE.evidence||[]).filter(e=>e.status!=='have');
  const item = missing[i]; if(!item) return;
  item.status='requested';
  logAudit('System', `Generated and sent a request for "${item.title}".`);
  persist(); renderEvidence(); renderNav(); renderAudit();
}
function markReceived(i){
  const missing = (CASE.evidence||[]).filter(e=>e.status!=='have');
  const item = missing[i]; if(!item) return;
  item.status='have';
  logAudit('You', `Marked "${item.title}" as received.`);
  persist(); renderEvidence(); renderNav(); renderOverview(); renderAudit();
}

/* ============================================================
   DEADLINES
   ============================================================ */
function renderDeadlines(){
  const obs = CASE.obligations||[];
  document.getElementById('view-deadlines').innerHTML = `<div class="panel reveal">
    <div class="panel-head"><h3>Extracted obligations</h3><span class="meta">${obs.length} detected</span></div>
    <div class="panel-body">${obs.map(o=>`
      <div class="dl-row">
        <div class="dl-date">${o.dueDate && o.dueDate!=='—' ? `<span class="day">${fmtDate(o.dueDate).split(' ')[1]?.replace(',','')||''}</span>${fmtDate(o.dueDate).split(' ')[0]}` : '—'}</div>
        <div>
          <div class="dl-title">${escapeHtml(o.title)} ${o.status==='conflicted'?'<span class="pill pill-attention" style="margin-left:6px;">conflict</span>':o.status==='upcoming'?'<span class="pill pill-partial" style="margin-left:6px;">upcoming</span>':o.status==='overdue'?'<span class="pill pill-attention" style="margin-left:6px;">overdue</span>':'<span class="pill pill-neutral" style="margin-left:6px;">monitoring</span>'}</div>
          <div class="dl-sub">${escapeHtml(o.computedFrom||'')} · owner: ${escapeHtml(o.party||'—')}</div>
          <div style="margin-top:8px;">${sourceChip(o.sourceDoc, o.excerpt, o.confidence)}</div>
        </div>
        <button class="btn btn-sm" onclick="showView('${o.status==='conflicted'?'conflicts':'workflow'}')">${o.status==='conflicted'?'Review conflict':'Details'}</button>
      </div>`).join('') || `<div class="empty">${ICON.deadline}<div>No obligations extracted.</div></div>`}
    </div></div>`;
}

/* ============================================================
   WORKFLOW
   ============================================================ */
let simMode = false;
function toggleSim(){
  simMode = !simMode;
  document.getElementById('sim-switch').classList.toggle('on', simMode);
  document.getElementById('sim-banner').classList.toggle('show', simMode);
}
function wfDotIcon(status){ if(status==='done') return ICON.check; if(status==='blocked') return ICON.x; if(status==='active') return ICON.bolt; return ''; }
function renderWorkflow(){
  const wf = CASE.workflow || {steps:[]};
  document.getElementById('view-workflow').innerHTML = `
    <div class="wf-toolbar">
      <div><div class="eyebrow-line" style="margin:0;"><span class="mono">TRIGGER</span></div><div style="font-size:13.5px;margin-top:6px;">${escapeHtml(wf.trigger||'—')}</div></div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div class="sim-toggle"><span>Simulation mode</span><div class="switch" id="sim-switch" onclick="toggleSim()"></div></div>
        <button class="btn btn-primary">${ICON.play} Activate workflow</button>
      </div>
    </div>
    <div class="sim-banner" id="sim-banner">${ICON.bolt}<span><b>Simulating</b> — no tasks will be created, no emails will be sent. This preview shows exactly what activating the workflow would do.</span></div>
    <div class="panel reveal">
      <div class="panel-head"><h3>${escapeHtml(wf.name||'Workflow')}</h3><span class="meta">${(wf.steps||[]).length} steps · ${(wf.steps||[]).filter(s=>s.status==='done').length} complete</span></div>
      <div class="panel-body"><div class="wf-flow">
        ${(wf.steps||[]).map(s=>`
          <div class="wf-node">
            <div class="rail"><div class="wf-dot ${s.status}">${wfDotIcon(s.status)}</div></div>
            <div>
              <div class="wf-step-title">${escapeHtml(s.title)} ${s.auto?`<span class="wf-badge-auto">AUTOMATED</span>`:`<span class="wf-badge-human">HUMAN REVIEW</span>`}</div>
              <div class="wf-step-note">${escapeHtml(s.note||'')}</div>
              <div class="wf-step-owner">${(s.owner||'').includes('System')?ICON.bolt:ICON.person} ${escapeHtml(s.owner||'—')}</div>
            </div>
            <span class="pill ${s.status==='done'?'pill-done':s.status==='blocked'?'pill-attention':s.status==='active'?'pill-brass':'pill-neutral'}">${s.status}</span>
          </div>`).join('') || `<div class="empty">${ICON.workflow}<div>No workflow generated.</div></div>`}
      </div></div>
    </div>`;
}

/* ============================================================
   RISK
   ============================================================ */
function renderRisk(){
  const order = {high:0,medium:1,low:2};
  const risks = [...(CASE.risks||[])].sort((a,b)=>(order[a.severity]??3)-(order[b.severity]??3));
  document.getElementById('view-risk').innerHTML = `
    <div class="grid g-3" style="margin-bottom:22px;">
      ${['high','medium','low'].map(sev=>`<div class="panel reveal"><div class="panel-body"><div class="stat"><div class="n" style="color:${sev==='high'?'var(--burgundy)':sev==='medium'?'var(--amber)':'var(--moss)'}">${(CASE.risks||[]).filter(r=>r.severity===sev).length}</div><div class="l">${sev} severity</div></div></div></div>`).join('')}
    </div>
    <div class="panel reveal"><div class="panel-head"><h3>Active risk items</h3><span class="meta">sorted by severity</span></div>
      <div class="panel-body">${risks.map(r=>`
        <div class="risk-row sev-${r.severity}"><div style="flex:1;">
          <div class="risk-title"><span class="dot dot-${r.severity}"></span>${escapeHtml(r.title)}<span class="pill pill-${r.severity}" style="margin-left:auto;">${r.severity}</span></div>
          <div class="risk-detail">${escapeHtml(r.detail)}</div>
          ${r.linked?`<div class="risk-link">↳ ${escapeHtml(r.linked)}</div>`:''}
        </div></div>`).join('') || `<div class="empty">${ICON.check}<div>No risk items.</div></div>`}
      </div></div>`;
}

/* ============================================================
   CONFLICTS
   ============================================================ */
function renderConflicts(){
  const conflicts = (CASE.conflicts||[]).filter(c=>c.status!=='resolved');
  document.getElementById('view-conflicts').innerHTML = conflicts.map((c,i)=>`
    <div class="conflict-card reveal">
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:var(--burgundy)">${ICON.conflict}</span><h3 style="color:var(--burgundy)">${escapeHtml(c.title)}</h3></div>
      <p style="margin-top:10px;color:var(--ink-soft);font-size:13.5px;line-height:1.6;">${escapeHtml(c.description)}</p>
      <div class="conflict-sources">${(c.sources||[]).map(s=>`
        <div class="conflict-src"><div class="lbl">${escapeHtml(s.sourceDoc)}</div><div class="txt">“${escapeHtml(s.excerpt)}”</div>
        <div style="margin-top:10px;">${sourceChip(s.sourceDoc, s.excerpt, s.confidence)}</div></div>`).join('')}</div>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">
        ${(c.sources||[]).map((s,si)=>`<button class="btn ${si===0?'btn-primary':''} btn-sm" onclick="resolveConflict(${i})">Adopt: ${escapeHtml((s.excerpt||'').slice(0,26))}…</button>`).join('')}
        <button class="btn btn-sm btn-danger" onclick="resolveConflict(${i})">Escalate to partner</button>
      </div>
    </div>`).join('') || `<div class="empty">${ICON.check}<div>No open conflicts.</div></div>`;
}
function resolveConflict(i){
  const open = (CASE.conflicts||[]).filter(c=>c.status!=='resolved');
  const target = open[i]; if(!target) return;
  target.status = 'resolved';
  logAudit('You', `Resolved conflict: "${target.title}".`);
  persist(); renderConflicts(); renderNav(); renderAudit();
}

/* ============================================================
   DRAFTING
   ============================================================ */
let activeDraft = 0;
function renderDrafting(){
  const drafts = CASE.drafts||[];
  const d = drafts[activeDraft] || drafts[0];
  document.getElementById('view-drafting').innerHTML = `
    <div class="grid" style="grid-template-columns:300px 1fr;align-items:start;">
      <div class="draft-list">${drafts.map((x,i)=>`
        <div class="draft-item ${i===activeDraft?'active':''}" onclick="selectDraft(${i})">
          <div class="draft-ic">${ICON.draft}</div><div><div class="draft-title">${escapeHtml(x.title)}</div><div class="draft-meta">${escapeHtml(x.type||'')} · ${escapeHtml(x.status||'')}</div></div>
        </div>`).join('') || `<div class="empty">${ICON.draft}<div>No drafts generated.</div></div>`}
      </div>
      <div class="panel reveal" style="min-height:480px;">
        ${d ? `<div class="panel-body draft-view">
          ${d.review?`<div class="human-flag">${ICON.alert} Human Review Required — this draft will not send until reviewed and approved.</div>`:''}
          <div class="draft-field"><b>To:</b> ${escapeHtml(d.to||'—')}</div>
          <div class="draft-field"><b>Type:</b> ${escapeHtml(d.type||'')} &nbsp;·&nbsp; <b>Status:</b> ${escapeHtml(d.status||'')}</div>
          <div class="draft-body">${escapeHtml(d.body||'')}</div>
          <div class="draft-actions">
            ${d.review
              ? `<button class="btn btn-primary" disabled>Approve & send (blocked)</button><button class="btn" onclick="showView('conflicts')">Resolve blocking conflict</button>`
              : (d.status||'').toLowerCase().startsWith('sent') ? `<button class="btn" disabled>Already sent</button>`
              : `<button class="btn btn-primary" onclick="approveDraft()">Approve & send</button>`}
            <button class="btn" onclick="downloadDraft()">${ICON.download} Download .txt</button>
          </div>
        </div>` : `<div class="panel-body"><div class="empty">${ICON.draft}<div>No draft selected.</div></div></div>`}
      </div>
    </div>`;
}
function selectDraft(i){ activeDraft = i; renderDrafting(); }
function approveDraft(){
  const d = CASE.drafts[activeDraft]; if(!d) return;
  d.status = 'Sent — ' + new Date().toISOString().slice(0,10);
  logAudit('You', `Approved and sent draft: "${d.title}".`);
  persist(); renderDrafting(); renderAudit();
}
function downloadDraft(){
  const d = CASE.drafts[activeDraft]; if(!d) return;
  const blob = new Blob([d.body||''], { type:'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (d.title||'draft').replace(/[^a-z0-9]+/gi,'_') + '.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ============================================================
   IMPACT ANALYSIS
   ============================================================ */
function renderImpact(){
  const ia = CASE.impactAnalysis;
  if(!ia){
    document.getElementById('view-impact').innerHTML = `<div class="empty">${ICON.impact}<div>No version comparison available for this case.<br><span style="font-size:12px;">Mark a document as "a newer version of" another one during intake to enable this.</span></div></div>`;
    return;
  }
  document.getElementById('view-impact').innerHTML = `
    <div class="impact-header reveal">
      <div class="impact-doc"><div class="v">${escapeHtml(ia.from.version||'v1')}</div><div class="n">${escapeHtml(ia.from.label||'')}</div></div>
      <span class="impact-arrow">${ICON.arrowRight}</span>
      <div class="impact-doc"><div class="v">${escapeHtml(ia.to.version||'v2')}</div><div class="n">${escapeHtml(ia.to.label||'')}</div></div>
      <span class="pill pill-brass">semantic comparison</span>
    </div>
    <div class="eyebrow-line"><span class="mono">CLAUSE CHANGES — ${(ia.changes||[]).length}</span></div>
    ${(ia.changes||[]).map(c=>`
      <div class="change-row reveal">
        <div class="change-head"><span class="pill pill-${c.severity}">${c.type}</span><span style="font-weight:600;font-size:13.5px;">${escapeHtml(c.clause)}</span></div>
        <div class="change-diff"><div class="diff-before">${c.before ? escapeHtml(c.before) : '— clause did not exist —'}</div><div class="diff-after">${c.after ? escapeHtml(c.after) : '— clause removed —'}</div></div>
        <div class="change-impact">${escapeHtml(c.impact||'')}</div>
      </div>`).join('')}
    <div class="panel reveal" style="margin-top:8px;"><div class="panel-head"><h3>Affected workflows</h3><span class="meta">${(ia.affectedWorkflows||[]).length} flagged</span></div>
      <div class="panel-body">${(ia.affectedWorkflows||[]).map(w=>`<div class="risk-row sev-medium"><div><div class="risk-title">${escapeHtml(w.name)}</div><div class="risk-detail">${escapeHtml(w.reason)}</div></div></div>`).join('') || `<div class="empty">${ICON.check}<div>No workflows flagged.</div></div>`}</div>
    </div>`;
}

/* ============================================================
   AUDIT TRAIL
   ============================================================ */
function renderAudit(){
  document.getElementById('view-audit').innerHTML = `<div class="panel reveal"><div class="panel-body">
    ${AUDIT.map(a=>`<div class="audit-row"><div class="audit-time">${a.time}</div><div class="audit-actor">${escapeHtml(a.actor)}</div><div class="audit-action">${escapeHtml(a.action)}</div></div>`).join('') || `<div class="empty">${ICON.audit}<div>No actions yet.</div></div>`}
  </div></div>`;
}

/* ============================================================
   INIT
   ============================================================ */
function buildViewShell(){
  document.getElementById('views').innerHTML = Object.keys(VIEW_TITLES).map(id=>`<section class="view" id="view-${id}"></section>`).join('');
}
function renderAll(){
  renderOverview(); renderTimeline(); renderDocuments(); renderEvidence(); renderDeadlines();
  renderWorkflow(); renderRisk(); renderConflicts(); renderDrafting(); renderImpact(); renderAudit();
}

async function checkHealth(){
  try{
    const res = await fetch('/api/health');
    const data = await res.json();
    if(!data.hasKey){
      const errBox = document.getElementById('analyze-error');
      errBox.textContent = 'No ANTHROPIC_API_KEY found on the server. Copy .env.example to .env, add your key, and restart the server (npm start).';
      errBox.classList.add('show');
    }
  }catch(e){ /* server not reachable yet — ignore */ }
}

function init(){
  buildViewShell();
  if(DOCS.length===0) addDoc();
  renderDocCards();
  checkHealth();

  const saved = tryResume();
  if(saved && saved.case){
    document.getElementById('resume-strip').style.display = 'flex';
    document.getElementById('resume-strip-text').textContent = `Resume "${saved.case.name}" — last analyzed in this browser.`;
  }

  document.getElementById('add-doc-btn').addEventListener('click', ()=>addDoc());
  document.getElementById('example-btn').addEventListener('click', loadExample);
  document.getElementById('analyze-btn').addEventListener('click', analyzeCase);
  document.getElementById('resume-btn').addEventListener('click', resumeSaved);
  document.getElementById('back-to-intake-btn').addEventListener('click', backToIntake);
  document.getElementById('modal-backdrop').addEventListener('click', (e)=>{ if(e.target.id==='modal-backdrop') closeModal(); });
  document.getElementById('mobile-menu-btn').addEventListener('click', toggleSidebar);
}
document.addEventListener('DOMContentLoaded', init);
