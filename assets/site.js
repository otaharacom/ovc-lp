/* ============================================================
   おおたはら動物診療所 サイト共通スクリプト
   index.html の末尾 <script> から切り出し。全ページで <script src> 読み込み。
   - .reveal のスクロール表示アニメ
   - 旧フロートCTA（#fw / #cta）: 要素が無ければ何もしない
   - target="_blank" のフォールバック（サンドボックス対策）
   - ハンバーガーメニュー開閉
   - FAQ アコーディオン（window.toggleFq）
   ============================================================ */
// reveal observer
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// float CTA toggle
const fw = document.getElementById('fw');
const ctaEl = document.getElementById('cta');
if (fw && ctaEl) {
  new IntersectionObserver((entries) => {
    fw.classList.toggle('hide', entries[0].isIntersecting);
  }, { threshold: 0.1 }).observe(ctaEl);
}

// External link fallback — some preview/iframe sandboxes block target="_blank"
document.querySelectorAll('a[target="_blank"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    e.preventDefault();
    const w = window.open(href, '_blank', 'noopener,noreferrer');
    if (!w) { (window.top || window).location.href = href; }
  });
});

// Hamburger menu toggle
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu){
  const setOpen = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  };
  burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  const closeBtn = document.getElementById('menuClose');
  if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('.menu-link').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setOpen(false);
  });
}

// FAQ toggle（HTML の onclick="toggleFq(this)" から呼ばれるためグローバル公開）
function toggleFq(el){
  const item = el.closest('.fq');
  const a = item.querySelector('.fq-a');
  const open = item.classList.contains('open');
  document.querySelectorAll('.fq.open').forEach(f => {
    f.classList.remove('open');
    f.querySelector('.fq-a').style.maxHeight = '0';
  });
  if (!open){
    item.classList.add('open');
    a.style.maxHeight = a.scrollHeight + 'px';
  }
}
window.toggleFq = toggleFq;
