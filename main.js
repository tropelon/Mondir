// tropelon — shared scripts
const $ = (sel, root = document) => root.querySelector(sel);

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function getJSON(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed: ' + url);
  return res.json();
}

function cardHTML(it) {
  const img = it.image
    ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy" onerror="this.remove()">`
    : '';
  return `<article class="card">
    <div class="thumb">${img}<span>${esc(it.icon || '✦')}</span></div>
    <div class="body">
      <div class="tag">${esc(it.tag || '')}</div>
      <h3>${esc(it.name)}</h3>
      <p>${esc(it.caption || '')}</p>
    </div>
  </article>`;
}

function timelineHTML(it) {
  return `<div class="tl-item">
    <div class="tl-year">${esc(it.year)}</div>
    <h3>${esc(it.title)}</h3>
    <p>${esc(it.text)}</p>
    ${it.source ? `<div class="tl-src">সূত্র: ${esc(it.source)}</div>` : ''}
  </div>`;
}

async function renderData(el) {
  try {
    const items = await getJSON(el.dataset.src);
    const render = el.dataset.kind === 'timeline' ? timelineHTML : cardHTML;
    el.innerHTML = items.length
      ? items.map(render).join('')
      : '<p class="empty">এখনও কোনো তথ্য যুক্ত হয়নি।</p>';
  } catch (e) {
    el.innerHTML = '<p class="empty">তথ্য লোড করা যায়নি। GitHub Pages বা একটি লোকাল সার্ভারে খুলুন।</p>';
  }
}

function pdfHTML(p) {
  return `<div class="pdf-item">
    <div>
      <strong>${esc(p.title)}</strong>
      <div class="meta">${esc(p.author || '')}${p.category ? ' · ' + esc(p.category) : ''}</div>
      <div class="meta">${esc(p.description || '')}</div>
      ${p.source ? `<div class="meta">উৎস: <a href="${esc(p.source)}" target="_blank" rel="noopener">লিংক</a></div>` : ''}
    </div>
    <div class="pdf-actions">
      <a href="${esc(p.file)}" target="_blank" rel="noopener">দেখুন</a>
      <a class="primary" href="${esc(p.file)}" download>ডাউনলোড</a>
    </div>
  </div>`;
}

function initPdfLibrary() {
  const list = $('#pdf-list');
  if (!list) return;
  const q = $('#q'), cat = $('#cat');
  let data = [];

  const draw = () => {
    const term = q.value.trim().toLowerCase();
    const c = cat.value;
    const rows = data.filter(p =>
      (!c || p.category === c) &&
      [p.title, p.author, p.description].join(' ').toLowerCase().includes(term)
    );
    list.innerHTML = rows.length
      ? rows.map(pdfHTML).join('')
      : '<p class="empty">কোনো PDF পাওয়া যায়নি।</p>';
  };

  getJSON('data/pdfs.json')
    .then(d => {
      data = d;
      const cats = [...new Set(d.map(p => p.category).filter(Boolean))];
      cat.innerHTML = '<option value="">সব বিষয়</option>' +
        cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
      draw();
    })
    .catch(() => { list.innerHTML = '<p class="empty">তালিকা লোড করা যায়নি।</p>'; });

  q.addEventListener('input', draw);
  cat.addEventListener('change', draw);
}

document.querySelectorAll('[data-src]').forEach(renderData);
initPdfLibrary();
