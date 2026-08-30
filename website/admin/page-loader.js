(function () {
  /* ── shared patch logic — used for both the initial GET and any live
     postMessage update from the kundenzugang admin panel ─────────────── */
  function applyData(D) {
    if (!D || !D.elit) return;
    const E = D.elit;

    /* ── patch data-fw elements (dotted path support) ────────── */
    function resolvePath(obj, path) {
      return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
    }
    document.querySelectorAll('[data-fw]').forEach(el => {
      const key = el.getAttribute('data-fw');
      const val = resolvePath(D, key);
      if (val == null) return;
      if (el.tagName === 'IMG') {
        el.src = val;
      } else {
        el.innerHTML = String(val).replace(/\n/g, '<br>');
      }
    });

    /* ── image focal point + zoom (admin-set, optional) — same convention
       as framework-berlin's page-loader.js: every photo field carries an
       {x,y,scale} alongside it, applied on top of the container's own
       responsive object-fit:cover sizing, so it only changes framing. Every
       Elit photo field is a real <img> tag (no background-image divs). ── */
    function applyImgFocalPoint(el, pos) {
      if (!el || !pos) return;
      const x = typeof pos.x === 'number' ? pos.x : 50;
      const y = typeof pos.y === 'number' ? pos.y : 50;
      const scale = typeof pos.scale === 'number' ? pos.scale : 100;
      el.style.objectPosition = `${x}% ${y}%`;
      el.style.transform = scale !== 100 ? `scale(${scale / 100})` : '';
    }

    const heroImg = document.querySelector('.hero-img-wrap img');
    applyImgFocalPoint(heroImg, E.hero && E.hero.image_position);

    const aboutImg = document.querySelector('.about-img-main');
    applyImgFocalPoint(aboutImg, E.about && E.about.image_position);

    const galleryItems = (E.gallery && E.gallery.items) || [];
    document.querySelectorAll('.gl-track .g-item img').forEach((img, i) => {
      const item = galleryItems[i];
      if (item) applyImgFocalPoint(img, item.image_position);
    });
  }

  (async function () {
    try {
      const res = await fetch('/admin/api/data');
      if (!res.ok) return;
      const D = await res.json();
      applyData(D);
    } catch (_) { /* silent — page renders fine with hardcoded content */ }
  })();

  /* ── live preview: patch instantly from postMessage while editing in
     the kundenzugang admin panel — this is a preview-only page, never
     writes anything; Supabase is only ever touched by /admin/api/data
     via the admin's explicit Save action. Click-to-select and
     highlight-on-select (which framework-berlin's page-loader.js has) are
     deliberately not implemented yet for Elit — editing works fully via the
     admin's left sidebar, this just skips the "click inside the preview to
     jump to that field" convenience for now. ─────────────────────────────── */
  const ADMIN_ORIGINS = [
    'https://www.afa-ai.com',
    'https://afa-ai.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  window.addEventListener('message', function (event) {
    if (ADMIN_ORIGINS.indexOf(event.origin) === -1) return;
    const msg = event.data;
    if (!msg || !msg.type) return;
    if (msg.type === 'FW_ADMIN_PREVIEW' && msg.data) {
      try { applyData(msg.data); } catch (_) { /* ignore malformed preview payloads */ }
    }
  });
})();
