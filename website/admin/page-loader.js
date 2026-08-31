(function () {
  /* ── admin-managed photos start hidden (opacity:0, set in index.html's own
     <head> so nothing can paint before it) — real visitors never see whatever
     is baked into this HTML, only the confirmed-current value from Supabase.
     Every code path that resolves what an image should show (unchanged,
     changed, or missing) must end by revealing it; the timers below are a
     safety net so a slow/failed/malformed fetch can never leave a photo
     invisible forever. ───────────────────────────────────────────────── */
  function revealImage(el) {
    if (el.style.opacity !== '1') el.style.opacity = '1';
  }
  function revealAllImages() {
    document.querySelectorAll('img[data-fw]').forEach(revealImage);
  }
  setTimeout(revealAllImages, 3000); // absolute backstop

  function patchImage(el, val) {
    if (val == null || el.getAttribute('src') === val) {
      revealImage(el);
      return;
    }
    const next = new Image();
    next.onload = () => { el.src = val; requestAnimationFrame(() => revealImage(el)); };
    next.onerror = () => { el.src = val; revealImage(el); };
    next.src = val;
  }

  /* ── shared patch logic — used for both the initial GET and any live
     postMessage update from the kundenzugang admin panel ─────────────── */
  function applyData(D) {
    if (!D || !D.elit) { revealAllImages(); return; }
    const E = D.elit;

    /* ── patch data-fw elements (dotted path support) ────────── */
    function resolvePath(obj, path) {
      return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
    }
    document.querySelectorAll('[data-fw]').forEach(el => {
      const key = el.getAttribute('data-fw');
      const val = resolvePath(D, key);
      if (el.tagName === 'IMG') {
        patchImage(el, val);
        return;
      }
      if (val == null) return;
      el.innerHTML = String(val).replace(/\n/g, '<br>');
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
      if (!res.ok) { revealAllImages(); return; }
      const D = await res.json();
      applyData(D);
    } catch (_) {
      // Offline or the endpoint is down — fall back to whatever is baked
      // into this HTML rather than leaving photos invisible forever.
      revealAllImages();
    }
  })();

  /* ── live preview: patch instantly from postMessage while editing in
     the kundenzugang admin panel — this is a preview-only page, never
     writes anything; Supabase is only ever touched by /admin/api/data
     via the admin's explicit Save action. Same protocol as
     framework-berlin's page-loader.js: FW_ADMIN_PREVIEW patches content,
     FW_ADMIN_HIGHLIGHT outlines the selected field, and a click inside the
     iframe posts FW_ADMIN_SELECT back so the sidebar can jump to it. ──── */
  const ADMIN_ORIGINS = [
    'https://www.afa-ai.com',
    'https://afa-ai.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  let highlighted = [];
  function applyHighlight(paths, section) {
    highlighted.forEach(el => el.classList.remove('fw-admin-hl'));
    highlighted = [];
    let targets = [];
    if (paths && paths.length) {
      targets = paths.flatMap(p => Array.from(document.querySelectorAll(`[data-fw="${p}"]`)));
    } else if (section) {
      targets = Array.from(document.querySelectorAll(`[data-fw-section="${section}"]`));
    }
    targets.forEach(el => el.classList.add('fw-admin-hl'));
    highlighted = targets;
    if (targets[0]) targets[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.addEventListener('message', function (event) {
    if (ADMIN_ORIGINS.indexOf(event.origin) === -1) return;
    const msg = event.data;
    if (!msg || !msg.type) return;
    if (msg.type === 'FW_ADMIN_PREVIEW' && msg.data) {
      try { applyData(msg.data); } catch (_) { /* ignore malformed preview payloads */ }
    } else if (msg.type === 'FW_ADMIN_HIGHLIGHT') {
      applyHighlight(msg.paths || null, msg.section || null);
    }
  });

  /* ── click-to-edit — only active when actually embedded in the admin
     panel (never for a normal visitor loading the page directly), and only
     ever posts a field path string back — no data leaves the page, nothing
     is written anywhere from here. ──────────────────────────────────────── */
  if (window.self !== window.top) {
    const hlStyle = document.createElement('style');
    hlStyle.textContent = '.fw-admin-hl{outline:2px solid #00D4FF !important;outline-offset:2px;border-radius:2px;}';
    document.head.appendChild(hlStyle);

    // Single click selects the field for editing (default). A second click on
    // the same element within DBL_CLICK_MS is treated as an intentional
    // double-click and is let through untouched, so real page buttons (cookie
    // banner accept, etc.) can still be tested inside the preview.
    let lastClickEl = null;
    let lastClickTime = 0;
    const DBL_CLICK_MS = 400;

    document.addEventListener('click', function (e) {
      const fwEl = e.target.closest('[data-fw]');
      const sectionEl = e.target.closest('[data-fw-section]');
      const path = fwEl ? fwEl.getAttribute('data-fw') : null;
      if (!path && !sectionEl) return;

      const matchEl = fwEl || sectionEl;
      const now = Date.now();
      if (lastClickEl === matchEl && now - lastClickTime < DBL_CLICK_MS) {
        lastClickEl = null;
        lastClickTime = 0;
        return;
      }
      lastClickEl = matchEl;
      lastClickTime = now;

      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        {
          type: 'FW_ADMIN_SELECT',
          path: path,
          section: sectionEl ? sectionEl.getAttribute('data-fw-section') : null,
        },
        '*',
      );
    }, true);
  }
})();
