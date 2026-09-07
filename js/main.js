/* ============================================================
   Salah Eddine Ghannouch — Portfolio interactions
   Vanilla JS · no dependencies · respects prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const I18N = window.I18N || { en: {}, fr: {} };

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Dynamic years of experience ---------- */
  // Any element with data-years-since="YYYY" gets (currentYear - YYYY).
  const updateYears = () => {
    $$('[data-years-since]').forEach((el) => {
      const start = parseInt(el.getAttribute('data-years-since'), 10);
      if (!Number.isNaN(start)) {
        el.textContent = String(Math.max(1, new Date().getFullYear() - start));
      }
    });
  };

  /* ============================================================
     LANGUAGE (i18n) — EN / FR, persisted, static-host friendly
     ============================================================ */
  const SUPPORTED = ['en', 'fr'];
  const pickInitialLang = () => {
    const saved = localStorage.getItem('lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'en';
  };
  let currentLang = pickInitialLang();

  const langLabel = $('#langLabel');
  const langToggle = $('#langToggle');

  const applyI18n = (lang) => {
    const dict = I18N[lang] || I18N.en || {};
    document.documentElement.lang = lang;

    // Plain text nodes.
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    // Rich text nodes (may contain <strong>, the years span, etc.).
    $$('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    // The toggle shows the OTHER language (what you'll switch to).
    if (langLabel) langLabel.textContent = (lang === 'en' ? 'FR' : 'EN');
    if (langToggle) langToggle.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');

    // Numbers injected via innerHTML must be re-filled afterwards.
    updateYears();
    // Refresh rotator words for the active language.
    updateRotatorWords(lang);
  };

  /* ---------- Rotating tagline (language-aware) ---------- */
  const rotator = $('#rotator');
  let rotWords = (I18N[currentLang] && I18N[currentLang].rotator) || ['Full-Stack Developer'];
  let rotIndex = 0;
  const wordEl = () => (rotator ? rotator.querySelector('.rotator-word') : null);

  function updateRotatorWords(lang) {
    const next = (I18N[lang] && I18N[lang].rotator) || rotWords;
    rotWords = next;
    if (rotIndex >= rotWords.length) rotIndex = 0;
    const el = wordEl();
    if (el) el.textContent = rotWords[rotIndex]; // swap current word immediately
  }

  if (rotator) {
    if (prefersReduced) {
      setInterval(() => {
        rotIndex = (rotIndex + 1) % rotWords.length;
        const el = wordEl();
        if (el) el.textContent = rotWords[rotIndex];
      }, 3500);
    } else {
      setInterval(() => {
        const current = wordEl();
        if (!current) return;
        current.classList.remove('rot-in');
        current.classList.add('rot-out');
        setTimeout(() => {
          rotIndex = (rotIndex + 1) % rotWords.length;
          const fresh = document.createElement('span');
          fresh.className = 'rotator-word rot-in';
          fresh.textContent = rotWords[rotIndex];
          rotator.innerHTML = '';
          rotator.appendChild(fresh);
        }, 380);
      }, 2600);
    }
  }

  // Language toggle button.
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'fr' : 'en';
      localStorage.setItem('lang', currentLang);
      applyI18n(currentLang);
    });
  }

  // Apply saved/detected language on load.
  applyI18n(currentLang);

  /* ---------- Sticky navbar frosted on scroll ---------- */
  const navbar = $('#navbar');
  const onScroll = () => {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  };
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('a', mobileMenu).forEach((a) => a.addEventListener('click', closeMenu));
  }

  /* ---------- Scroll reveal (staggered) ---------- */
  const revealEls = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement ? el.parentElement.children : []).filter((c) => c.classList && c.classList.contains('reveal'));
        const idx = siblings.indexOf(el);
        const delay = Math.min(idx, 6) * 90;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('in');
        obs.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Scroll to top ---------- */
  const toTop = $('#toTop');
  if (toTop) {
    const toggleTop = () => toTop.classList.toggle('show', window.scrollY > 600);
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Button ripple ---------- */
  if (!prefersReduced) {
    $$('.ripple').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ink = document.createElement('span');
        ink.className = 'ripple-ink';
        ink.style.width = ink.style.height = size + 'px';
        ink.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ink.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ink);
        setTimeout(() => ink.remove(), 620);
      });
    });
  }

  /* ---------- Active nav link on scroll (desktop + mobile) ---------- */
  const sections = $$('main section[id]');
  const navAnchors = $$('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const setActive = (id) => {
    navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };
  // Scroll-position approach: reliable for all section heights (no threshold issues).
  const updateActive = () => {
    // Consider a section "active" once its top edge passes 30 % from the top of the viewport.
    const trigger = window.scrollY + window.innerHeight * 0.30;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= trigger) current = s.id;
    });
    if (current) setActive(current);
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive(); // run once on load
  // Immediate feedback on click (esp. mobile, before scroll settles).
  navAnchors.forEach((a) => a.addEventListener('click', () => {
    setActive(a.getAttribute('href').slice(1));
  }));
})();
