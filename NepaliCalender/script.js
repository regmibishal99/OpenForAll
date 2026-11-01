/* ---------- Province data (edit freely) ---------- */
const PROVINCES = {
  1: { name: 'Koshi',         np: 'कोशी प्रदेश',          capital: 'Biratnagar',   capitalNp: 'विराटनगर' },
  2: { name: 'Madhesh',       np: 'मधेश प्रदेश',          capital: 'Janakpur',     capitalNp: 'जनकपुरधाम' },
  3: { name: 'Bagmati',       np: 'बागमती प्रदेश',        capital: 'Hetauda',      capitalNp: 'हेटौंडा' },
  4: { name: 'Gandaki',       np: 'गण्डकी प्रदेश',        capital: 'Pokhara',      capitalNp: 'पोखरा' },
  5: { name: 'Lumbini',       np: 'लुम्बिनी प्रदेश',      capital: 'Deukhuri',     capitalNp: 'देउखुरी' },
  6: { name: 'Karnali',       np: 'कर्णाली प्रदेश',       capital: 'Birendranagar',capitalNp: 'वीरेन्द्रनगर' },
  7: { name: 'Sudurpashchim', np: 'सुदूरपश्चिम प्रदेश',   capital: 'Godawari',     capitalNp: 'गोदावरी' }
};

const toNepali = n => String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]);

const svg = document.getElementById('nepal-map');
const paths = [...svg.querySelectorAll('.province')];
const outlineHover = document.getElementById('outline-hover');
const outlineSelected = document.getElementById('outline-selected');
const tooltip = document.getElementById('tooltip');
const legend = document.getElementById('legend');
const details = document.getElementById('province-details');

let selectedId = null;

/* Badges and accessible names */
svg.querySelectorAll('.badge-num').forEach(t => { t.textContent = toNepali(t.dataset.n); });
paths.forEach(p => {
  const d = PROVINCES[p.dataset.id];
  p.setAttribute('aria-label', `${d.name} Province, ${d.np}`);
  p.setAttribute('aria-pressed', 'false');
});

/* Legend buttons */
legend.innerHTML = Object.entries(PROVINCES).map(([id, d]) => `
  <li><button type="button" data-id="${id}">
    <span class="swatch" style="background:var(--c${id})"></span>
    <span>${d.name}<small>${d.np}</small></span>
  </button></li>`).join('');
const legendButtons = [...legend.querySelectorAll('button')];

/* Hover outline */
function setHover(id) {
  if (id) { outlineHover.setAttribute('d', document.getElementById(`province-${id}`).getAttribute('d')); outlineHover.classList.add('show'); }
  else outlineHover.classList.remove('show');
}

/* ---------- What happens when a province is clicked ---------- */
function selectProvince(id) {
  selectedId = id;
  const d = PROVINCES[id];

  paths.forEach(p => p.setAttribute('aria-pressed', String(p.dataset.id === String(id))));
  legendButtons.forEach(b => b.classList.toggle('active', b.dataset.id === String(id)));
  outlineSelected.setAttribute('d', document.getElementById(`province-${id}`).getAttribute('d'));
  outlineSelected.classList.add('show');

  // Fill the details section (replace or extend this when you add your content)
  document.getElementById('d-number').textContent = `Province ${id} · प्रदेश ${toNepali(id)}`;
  document.getElementById('d-name').textContent = d.name;
  document.getElementById('d-np').textContent = d.np;
  document.getElementById('d-capital').textContent = `${d.capital} (${d.capitalNp})`;
  details.hidden = false;
  details.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Hook for your own code: document.addEventListener('province:select', e => e.detail.id)
  document.dispatchEvent(new CustomEvent('province:select', { detail: { id, ...d } }));
}

/* ---------- Events ---------- */
paths.forEach(p => {
  const id = p.dataset.id;
  p.addEventListener('click', () => selectProvince(id));
  p.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectProvince(id); }
  });
  p.addEventListener('mouseenter', () => setHover(id));
  p.addEventListener('mouseleave', () => { setHover(null); tooltip.hidden = true; });
  p.addEventListener('focus', () => setHover(id));
  p.addEventListener('blur', () => setHover(null));
  p.addEventListener('mousemove', e => {
    const r = svg.parentElement.getBoundingClientRect();
    tooltip.textContent = `${PROVINCES[id].name} · ${PROVINCES[id].np}`;
    tooltip.style.left = `${e.clientX - r.left}px`;
    tooltip.style.top = `${e.clientY - r.top}px`;
    tooltip.hidden = false;
  });
});

legendButtons.forEach(b => {
  const id = b.dataset.id;
  b.addEventListener('click', () => selectProvince(id));
  b.addEventListener('mouseenter', () => setHover(id));
  b.addEventListener('mouseleave', () => setHover(null));
});
