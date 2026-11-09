'use strict';
/* ================= EDIT HERE ================= */
const CONFIG = {
  eventDate: '2026-11-28T09:00:00+05:30', // change year/time here (Sri Lanka time)
  mapLink: 'https://share.google/NZ39YDChDZYVg8Mxe', // replace with exact map link
  whatsappNumber: '94719249572',      // organizer number, international format, e.g. '94771234567' (blank = choose contact)
  siteUrl: 'https://chat.whatsapp.com/I5QVp4DfawE2aI7Ys5FlOG',             // blank = current page URL
  music: 'audio//assets/theme.mp3',               // e.g. 'audio/theme.mp3' (optional)
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
