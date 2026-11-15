'use strict';
/* ================= EDIT HERE ================= */
const CONFIG = {
  eventDate: '2026-11-28T09:00:00+05:30', // change year/time here (Sri Lanka time)
  mapLink: 'https://share.google/NZ39YDChDZYVg8Mxe', // replace with exact map link
  whatsappNumber: '94719249572',      // organizer number, international format, e.g. '94771234567' (blank = choose contact)
  siteUrl: 'https://chat.whatsapp.com/I5QVp4DfawE2aI7Ys5FlOG',             // blank = current page URL
  music: 'audio/theme.mp3',               // e.g. 'audio/theme.mp3' (optional)
  shareText: 'Countdown is on! Get ready for ECLIPSE 2K22. Join to the Whatsapp group using this link:',
  payMessage: 'Hello, I have completed my ECLIPSE 2K22 party payment. I will share my payment receipt for confirmation.',
  bank: {
    'Bank Name': 'Hatton National Bank PLC',
    'Branch': 'Bibile Branch(233)',
    'Account Holder': 'PESANJITH D T B R',
    'Account Number': '233020125518'
  },
  // Add your photos to /images and list them here
  gallery: []
};
/* ============================================= */

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const url = () => CONFIG.siteUrl || location.href;
let toastT;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}
async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); }
  catch { const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast(msg);
}
const wa = (text) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;

/* Countdown */
const target = new Date(CONFIG.eventDate).getTime();
const els = { d: $('d'), h: $('h'), m: $('m'), s: $('s') };
function setVal(el, v) { if (el.textContent !== v) { el.textContent = v; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); } }
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) { $('timer').hidden = true; $('done').hidden = false; $('readyBtn').hidden = true; confetti(); return false; }
  setVal(els.d, pad(Math.floor(diff / 864e5)));
  setVal(els.h, pad(Math.floor(diff / 36e5) % 24));
  setVal(els.m, pad(Math.floor(diff / 6e4) % 60));
  setVal(els.s, pad(Math.floor(diff / 1e3) % 60));
  return true;
}
if (tick()) { const iv = setInterval(() => { if (!tick()) clearInterval(iv); }, 1000); }

/* Event, map, share */
$('mapBtn').href = CONFIG.mapLink;
$('shWA').href = `https://wa.me/?text=${encodeURIComponent(CONFIG.shareText + ' ' + url())}`;
$('shFB').href = `https://www.facebook.com/share/g/1EFurXRKf4/?mibextid=wwXIfr{encodeURIComponent(url())}&quote=${encodeURIComponent(CONFIG.shareText)}`;
$('copyLink').onclick = () => copy(url(), 'Link copied successfully!');
$('readyBtn').onclick = () => { confetti(); $('details').scrollIntoView({ behavior: 'smooth' }); };

/* Bank */
const bankList = $('bankList');
Object.entries(CONFIG.bank).forEach(([k, v]) => {
  if (k === 'Account Number') return;
  const row = document.createElement('div');
  const dt = document.createElement('dt'), dd = document.createElement('dd');
  dt.textContent = k; dd.textContent = v; row.append(dt, dd); bankList.appendChild(row);
});
$('accNum').textContent = CONFIG.bank['Account Number'];
$('copyAcc').onclick = () => copy(CONFIG.bank['Account Number'], 'Account details copied successfully!');
$('copyAll').onclick = () => copy(Object.entries(CONFIG.bank).map(([k, v]) => `${k}: ${v}`).join('\n'), 'Account details copied successfully!');
$('payWA').href = wa(CONFIG.payMessage);

/* Gallery + lightbox */
const lb = $('lightbox'), lbImg = lb.querySelector('img');
CONFIG.gallery.forEach(g => {
  const b = document.createElement('button'); b.className = 'card'; b.setAttribute('aria-label', 'Open ' + g.caption);
  const img = new Image(); img.src = g.src; img.alt = g.caption; img.loading = 'lazy';
  img.onerror = () => { img.remove(); b.dataset.empty = 1; };
  const cap = document.createElement('span'); cap.textContent = g.caption;
  b.append(img, cap);
  b.onclick = () => { if (b.dataset.empty) return toast('Add this photo to the images folder'); lbImg.src = g.src; lbImg.alt = g.caption; lb.hidden = false; };
  $('gallery').appendChild(b);
});
lb.onclick = e => { if (e.target !== lbImg) lb.hidden = true; };
addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

/* Music */
const mb = $('musicBtn'); let audio;
mb.onclick = () => {
  if (!CONFIG.music) return toast('Set CONFIG.music to add a song');
  audio = audio || Object.assign(new Audio(CONFIG.music), { loop: true });
  if (audio.paused) { audio.play(); mb.classList.add('on'); } else { audio.pause(); mb.classList.remove('on'); }
};

/* Scroll reveal */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Particles + confetti (one canvas) */
const cv = $('fx'), cx = cv.getContext('2d'); let W, H;
const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
resize(); addEventListener('resize', resize);
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const N = innerWidth < 700 ? 35 : 70;
const dust = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .5, v: Math.random() * .5 + .15, a: Math.random() }));
let bits = [];
function confetti() {
  if (still) return;
  const cols = ['#D6A84B', '#FFB347', '#FFE29A', '#C9C9D0'];
  for (let i = 0; i < 120; i++) bits.push({ x: Math.random() * W, y: -20 - Math.random() * H * .4, w: 5 + Math.random() * 6, h: 8 + Math.random() * 8, c: cols[i % 4], vy: 2 + Math.random() * 3, vx: Math.random() * 2 - 1, rot: Math.random() * 6, vr: Math.random() * .2 - .1 });
}
function frame() {
  cx.clearRect(0, 0, W, H);
  dust.forEach(p => {
    p.y -= p.v; p.a += .02; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    cx.globalAlpha = .3 + Math.sin(p.a) * .3; cx.fillStyle = '#FFB347'; cx.shadowBlur = 8; cx.shadowColor = '#FFB347';
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
  });
  cx.shadowBlur = 0; cx.globalAlpha = 1;
  bits = bits.filter(b => b.y < H + 20);
  bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.rot += b.vr; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.rot); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); cx.restore(); });
  requestAnimationFrame(frame);
}
if (!still) frame();
setTimeout(confetti, 1800);

/* ================= FINANCIAL DASHBOARD =================
   DAILY UPDATE GUIDE (10:00 PM reconciliation):
   1. Add / edit expense records in FINANCE.records below.
   2. Mark approved / released and fill in the date & time fields.
   3. Update FINANCE.bankBalance with the real bank statement balance.
   The cards, totals and Balanced / Unbalanced status all
   recalculate automatically — nothing else needs editing. */
const FINANCE = {
  lastUpdated: '2026-11-15T22:00:00+05:30', // daily 10:00 PM reconciliation timestamp
  openingBalance: 0,        // bank balance before party collections
  collections: 68185.00,    // total party payments collected (LKR)
  bankBalance: 60185.00,    // balance per bank statement (LKR)
  records: [
    { id: 'EXP-001', desc: 'Breakfast & Lunch',                    amount: 82000.00, approved: false, approvedAt: null,                 
released: false, releasedAt: null },
    { id: 'EXP-002', desc: 'Function Hall',                        amount: 20000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-003', desc: 'Musics Stuff',                         amount: 19000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-004', desc: 'Photography & videography',            amount: 20000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-005', desc: 'Decorations',                          amount: 15000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-006', desc: 'Key Tag',                              amount:  5000.00, approved: false, approvedAt: null, 
released: false,  releasedAt: null },
    { id: 'EXP-007', desc: 'Bite',                                 amount: 12000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-008', desc: 'Special Cake',                         amount: 8000.00, approved: false, approvedAt: null,                 released: false, releasedAt: null },
    { id: 'EXP-009', desc: 'Hotel venue advance – Liyanado Hotel', amount:  4000.00, approved: true,  approvedAt: '2026-11-10 14:30', released: true,  releasedAt: '2026-11-10 15:15' },
    { id: 'EXP-010', desc: 'DJ & Sound System advance',            amount:  4000.00, approved: true,  approvedAt: '2026-11-12 10:00', released: true,  releasedAt: '2026-11-12 11:20' }

  ]
};

/* LKR currency formatter: 189000 -> "LKR 189,000.00" */
const lkr = n => 'LKR ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* --- Automatic reconciliation calculations --- */
const finTotals = {
  expenses: FINANCE.records.reduce((t, r) => t + r.amount, 0),
  approved:   FINANCE.records.reduce((t, r) => t + (r.approved ? r.amount : 0), 0),
  released:   FINANCE.records.reduce((t, r) => t + (r.released ? r.amount : 0), 0)
};
finTotals.ledger = FINANCE.openingBalance + FINANCE.collections - finTotals.released; // committee ledger balance
finTotals.difference = finTotals.ledger - FINANCE.bankBalance;                        // must be 0 to be Balanced
finTotals.balanced = Math.abs(finTotals.difference) < 0.01;

/* --- A. Overview cards --- */
const finCards = [
  { label: 'Total Expenses',          value: finTotals.expenses,    cap: FINANCE.records.length + ' recorded expenses' },
  { label: 'Approved Payments',       value: finTotals.approved,    cap: FINANCE.records.filter(r => r.approved).length + ' of ' + FINANCE.records.length + ' approved' },
  { label: 'Released Payments',       value: finTotals.released,    cap: FINANCE.records.filter(r => r.released).length + ' of ' + FINANCE.records.length + ' released' },
  { label: 'Current Account Balance', value: FINANCE.bankBalance,   cap: (finTotals.balanced ? 'Reconciled daily at 10:00 PM' : 'Ledger differs by ' + lkr(Math.abs(finTotals.difference))) }
];
$('finCards').innerHTML = finCards.map(c => `
  <div class="fin-card">
    <span class="fin-label">${c.label}</span>
    <span class="fin-value" data-target="${c.value}">${lkr(0)}</span>
    <span class="fin-cap">${c.cap}</span>
  </div>`).join('');

/* --- B. Expense tracker rows --- */
const badge = (done, yes, no) => `<span class="fin-badge ${done ? 'ok' : 'pending'}">${done ? '✔ ' + yes : '◌ ' + no}</span>`;
$('finBody').innerHTML = FINANCE.records.map(r => `
  <tr>
    <td>${r.id}</td>
    <td>${r.desc}</td>
    <td class="amt">${lkr(r.amount)}</td>
    <td>${badge(r.approved, 'Yes', 'Pending')}</td>
    <td>${r.approvedAt || '—'}</td>
    <td>${badge(r.released, 'Yes', 'Pending')}</td>
    <td>${r.releasedAt || '—'}</td>
  </tr>`).join('');

/* --- Table footer: totals + reconciliation status --- */
$('finFoot').innerHTML = `
  <tr>
    <td colspan="2">TOTALS</td>
    <td class="amt">${lkr(finTotals.expenses)}</td>
    <td>${FINANCE.records.filter(r => r.approved).length} / ${FINANCE.records.length}</td>
    <td>—</td>
    <td>${FINANCE.records.filter(r => r.released).length} / ${FINANCE.records.length}</td>
    <td>—</td>
  </tr>
  <tr class="fin-recon">
    <td colspan="7">
      Reconciliation difference:
      <span class="fin-diff">${lkr(Math.abs(finTotals.difference))}</span>
      (ledger ${lkr(finTotals.ledger)} vs bank ${lkr(FINANCE.bankBalance)})
      <span class="fin-status ${finTotals.balanced ? 'balanced' : 'unbalanced'}">
        ${finTotals.balanced ? 'BALANCED' : 'UNBALANCED'}
      </span>
    </td>
  </tr>`;

/* --- Last-updated stamp --- */
$('finUpdated').textContent = new Date(FINANCE.lastUpdated).toLocaleString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) + ' (daily 10:00 PM)';

/* --- Animated count-up for the summary cards --- */
function countUp(el, target) {
  if (still) { el.textContent = lkr(target); return; }
  const t0 = performance.now(), dur = 1300;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = lkr(target * eased);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
const finIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  document.querySelectorAll('#finCards .fin-value').forEach(el => countUp(el, parseFloat(el.dataset.target)));
  finIO.disconnect();
}), { threshold: .25 });
finIO.observe($('finance'));
