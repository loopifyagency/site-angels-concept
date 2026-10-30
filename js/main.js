/* ═══════════════════════════════════════════════════════════
   Angel’s Concept — interactions & mouvement
   GSAP + ScrollTrigger + SplitText + Lenis (embarqués dans /vendor)
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = doc.classList.contains('reduce');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ── Repli total si GSAP n’a pas chargé : le site reste lisible ── */
  if (!window.gsap || !window.ScrollTrigger) {
    doc.classList.add('no-anim');
    const l = $('#loader');
    if (l) l.remove();
    body.classList.remove('is-loading');
    initStatus();
    initTabs();
    initMenu();
    initReviews();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, window.SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  let lenis = null;
  let menuOpen = false;

  /* ═════════ 1. Statut d’ouverture (heure de Paris) ═════════ */
  function initStatus() {
    // minutes depuis minuit ; 0 = dimanche
    const H = {
      0: null,
      1: [14 * 60, 19 * 60 + 30],
      2: [9 * 60 + 30, 19 * 60 + 30],
      3: [9 * 60 + 30, 19 * 60 + 30],
      4: [9 * 60 + 30, 19 * 60 + 30],
      5: [9 * 60 + 30, 19 * 60 + 30],
      6: [10 * 60, 17 * 60],
    };
    const NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const fmt = (m) => {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return mm ? `${h} h ${String(mm).padStart(2, '0')}` : `${h} h`;
    };
    const paris = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));

    const update = () => {
      const now = paris();
      const day = now.getDay();
      const min = now.getHours() * 60 + now.getMinutes();
      const today = H[day];
      let text;
      let open = false;
      if (today && min >= today[0] && min < today[1]) {
        open = true;
        text = `Ouvert maintenant · jusqu’à ${fmt(today[1])}`;
      } else if (today && min < today[0]) {
        text = `Fermé · ouvre à ${fmt(today[0])}`;
      } else {
        let found = null;
        for (let i = 1; i <= 7 && !found; i++) {
          const d = (day + i) % 7;
          if (H[d]) found = { d, i };
        }
        const when = found.i === 1 ? 'demain' : NAMES[found.d];
        text = `Fermé · ouvre ${when} à ${fmt(H[found.d][0])}`;
      }
      $$('[data-status]').forEach((el) => {
        el.dataset.open = String(open);
        const t = $('[data-status-text]', el);
        if (t) t.textContent = text;
      });
      $$('.hours tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === day));
    };
    update();
    setInterval(update, 60000);
  }

  /* ═════════ 2. Menu plein écran ═════════ */
  function initMenu() {
    const menu = $('#menu');
    const burger = $('.burger');
    const header = $('#header');
    if (!menu || !burger) return;
    const icon = $('use', burger);
    const links = $$('.menu__link span');
    const foot = $('.menu__foot');
    const inertTargets = [$('#main'), $('.footer'), $('.fab')];

    const origin = () => {
      const r = burger.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rad = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 24;
      return { cx, cy, rad };
    };

    const open = () => {
      if (menuOpen) return;
      menuOpen = true;
      body.classList.add('menu-lock');
      header.classList.remove('is-hidden');
      menu.style.visibility = 'visible';
      menu.classList.add('menu--open');
      menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fermer le menu');
      icon.setAttribute('href', '#i-close');
      inertTargets.forEach((el) => el && (el.inert = true));
      lenis && lenis.stop();
      const { cx, cy, rad } = origin();
      if (reduce) {
        menu.style.clipPath = 'none';
        return;
      }
      gsap.fromTo(menu, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${rad}px at ${cx}px ${cy}px)`, duration: 0.95, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.3 });
      gsap.fromTo(foot, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.65 });
    };

    const close = (instant) => {
      if (!menuOpen) return;
      menuOpen = false;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      icon.setAttribute('href', '#i-menu');
      inertTargets.forEach((el) => el && (el.inert = false));
      const done = () => {
        menu.style.visibility = 'hidden';
        menu.classList.remove('menu--open');
        menu.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-lock');
        lenis && lenis.start();
      };
      if (reduce || instant) {
        done();
        return;
      }
      const { cx, cy } = origin();
      gsap.to(menu, { clipPath: `circle(0px at ${cx}px ${cy}px)`, duration: 0.75, ease: 'expo.inOut', onComplete: done });
    };

    burger.addEventListener('click', () => (menuOpen ? close() : open()));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        close();
        burger.focus();
      }
    });
    matchMedia('(min-width: 1100px)').addEventListener('change', (e) => e.matches && close(true));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });
    // utilisé par la navigation par ancres
    initMenu.close = close;
  }

  /* ═════════ 3. Onglets de la carte ═════════ */
  function initTabs() {
    const tabs = $$('.tab');
    const panels = $$('.panel');
    if (!tabs.length) return;

    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => {
        const on = p.id === tab.getAttribute('aria-controls');
        p.hidden = !on;
        if (on && !reduce) {
          gsap.fromTo($$('.group__title, .row, .panel__intro', p), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.025, clearProps: 'transform,opacity' });
        }
      });
      if (focus) tab.focus();
      ScrollTrigger.refresh();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
  }

  /* ═════════ 4. Carrousel d’avis (défilement natif + glisser) ═════════ */
  function initReviews() {
    const track = $('[data-track]');
    if (!track) return;
    const prev = $('[data-prev]');
    const next = $('[data-next]');
    const bar = $('.avis__prog-bar');
    const behavior = reduce ? 'auto' : 'smooth';

    const stepSize = () => {
      const c = $('.rev', track);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return c.getBoundingClientRect().width + gap;
    };
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = `scaleX(${0.1 + 0.9 * p})`;
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft > max - 4;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -stepSize(), behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: stepSize(), behavior }));
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: stepSize(), behavior });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -stepSize(), behavior });
    });

    // glisser à la souris
    let down = false;
    let sx = 0;
    let sl = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      sx = e.clientX;
      sl = track.scrollLeft;
      track.classList.add('is-drag');
    });
    window.addEventListener('pointermove', (e) => {
      if (down) track.scrollLeft = sl - (e.clientX - sx);
    });
    const end = () => {
      if (!down) return;
      down = false;
      track.classList.remove('is-drag');
      const cards = $$('.rev', track);
      const x = track.scrollLeft + parseFloat(getComputedStyle(track).paddingLeft || 0);
      let best = cards[0];
      cards.forEach((c) => {
        if (Math.abs(c.offsetLeft - x) < Math.abs(best.offsetLeft - x)) best = c;
      });
      track.scrollTo({ left: best.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0), behavior });
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    sync();
  }

  /* ═════════ 5. Navigation par ancres ═════════ */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = id === '#top' ? 0 : $(id);
        if (target === null) return;
        e.preventDefault();
        const go = () => {
          if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.7, force: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
          else if (target === 0) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
          else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
          if (target !== 0) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }
        };
        if (menuOpen && initMenu.close) {
          initMenu.close();
          setTimeout(go, 420);
        } else go();
      });
    });
  }

  /* ═════════ 6. Micro-interactions : magnétique, tilt, ticket ═════════ */
  function initPointerFx() {
    // origine du remplissage des tickets et pastilles
    $$('.ticket, .pill').forEach((el) => {
      const setO = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('pointerenter', setO);
      el.addEventListener('pointerleave', setO);
    });
    if (!finePointer || reduce) return;

    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.55)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.55)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.34);
      });
      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });

    $$('.tilt').forEach((el) => {
      if (!$('.tech__glare, .glare', el)) {
        const g = document.createElement('span');
        g.className = 'glare';
        g.setAttribute('aria-hidden', 'true');
        el.appendChild(g);
      }
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        gsap.to(el, { rotationY: (px - 0.5) * 16, rotationX: -(py - 0.5) * 16, transformPerspective: 900, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        el.style.setProperty('--gx', `${px * 100}%`);
        el.style.setProperty('--gy', `${py * 100}%`);
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', () => {
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'expo.out', overwrite: 'auto' });
        el.classList.remove('is-tilting');
      });
    });
  }

  /* ═════════ 7. Curseur-halo ═════════ */
  function initCursor() {
    const cur = $('.cursor');
    if (!cur || !finePointer || reduce) return;
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      cur.classList.add('is-on');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    document.addEventListener('pointerover', (e) => {
      cur.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .tab, .avis__track, [data-cursor]'));
    });
    window.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    window.addEventListener('pointerup', () => cur.classList.remove('is-down'));
    $$('[data-theme="dark"], .footer').forEach((s) => {
      ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => cur.classList.toggle('is-light', self.isActive) });
    });
  }

  /* ═════════ 8. Smooth scroll + en-tête + progression ═════════ */
  function initScroll() {
    const header = $('#header');
    let lastY = 0;
    const fab = $('.fab');
    const onScroll = (y, dir) => {
      header.classList.toggle('is-stuck', y > 60);
      if (fab && dir) fab.classList.toggle('is-away', dir > 0 && y > 240); // « Appeler » s’efface en descendant, revient en remontant
      if (menuOpen) return;
      if (y > 240 && dir > 0) header.classList.add('is-hidden');
      else if (dir < 0 || y <= 240) header.classList.remove('is-hidden');
    };

    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        onScroll(e.scroll, e.direction);
      });
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    } else {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        onScroll(y, y > lastY ? 1 : -1);
        lastY = y;
      }, { passive: true });
    }

    // barre de progression de lecture
    gsap.to('.progress__bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

    // le bouton « Appeler » s’efface quand l’appel à l’action est déjà à l’écran
    ScrollTrigger.create({ trigger: '#rdv', start: 'top 85%', endTrigger: '.footer', end: 'bottom bottom', toggleClass: { targets: '.fab', className: 'is-hidden' } });
  }

  /* ═════════ 9. Préchargeur : on arrache la page ═════════ */
  function runLoader() {
    const loader = $('#loader');
    if (!loader) return Promise.resolve();
    if (reduce) {
      loader.remove();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const num = $('.loader__num');
      const c = { v: 0 };
      const paint = () => (num.textContent = String(Math.round(c.v)));
      gsap.set('.loader__w > span', { yPercent: 115 });
      gsap.set('.loader__sub', { opacity: 0, y: 12 });

      const intro = gsap.timeline();
      intro
        .to('.loader__halo-line', { strokeDashoffset: 0, duration: 1.2, ease: 'power3.inOut' }, 0.05)
        .to('.loader__w > span', { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.13 }, 0.3)
        .to('.loader__sub', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.8);
      gsap.to(c, { v: 90, duration: 1.8, ease: 'power2.out', onUpdate: paint });

      const imgs = $$('.hero img').map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()));
      Promise.all([document.fonts.ready, Promise.race([Promise.all(imgs), wait(3500)]), wait(2100)]).then(() => {
        gsap.to(c, {
          v: 100,
          duration: 0.35,
          ease: 'power1.out',
          onUpdate: paint,
          onComplete: () => {
            const out = gsap.timeline({
              onComplete: () => {
                loader.remove();
                window.__angelsReady = true;
              },
            });
            out
              .to('.loader__center, .loader__count', { opacity: 0, y: -26, duration: 0.5, ease: 'power2.in' }, 0)
              .to('.loader__sheet', { yPercent: -108, duration: 1.25, ease: 'expo.inOut' }, 0.25)
              .add(resolve, 0.55);
          },
        });
      });
    });
  }

  /* ═════════ 10. Hero : titre, parallax multicouche ═════════ */
  let heroSplits = [];
  function prepHero() {
    heroSplits = $$('.hero__word').map((w) => SplitText.create(w, { type: 'chars', charsClass: 'ch' }));
    const chars = heroSplits.flatMap((s) => s.chars);
    gsap.set(chars, { yPercent: 118, rotate: 7 });
    gsap.set('.hero .ph__frame', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.hero .ph__img', { scale: 1.35 });
    gsap.set(['.hero__lead', '.hero__actions', '.hero__status'], { y: 30, opacity: 0 });
    gsap.set('.hero__stamp', { opacity: 0, scale: 0.4, rotate: -80 });
    gsap.set('.hero .tape, .hero .ph__cap, .spark', { opacity: 0, scale: 0.4 });
    gsap.set('.hero__scroll', { opacity: 0 });
  }

  function playHero() {
    const chars = heroSplits.flatMap((s) => s.chars);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.05 }, 0)
      .to('[data-swipe]', { scaleX: 1, duration: 1.15, ease: 'power3.inOut' }, 0.5)
      .to('.hero__stamp', { opacity: 1, scale: 1, rotate: -10, duration: 1.5, ease: 'back.out(1.5)' }, 0.25)
      .to('.hero .ph__frame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: 0.16 }, 0.1)
      .to('.hero .ph__img', { scale: 1, duration: 2, stagger: 0.16 }, 0.1)
      .to('.hero .tape', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2.4)', stagger: 0.12 }, 1.0)
      .to('.hero .ph__cap', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2.4)' }, 1.15)
      .to('.spark', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(3)', stagger: 0.12 }, 1.25)
      .to(['.hero__lead', '.hero__actions', '.hero__status'], { y: 0, opacity: 1, duration: 1.1, stagger: 0.13 }, 0.65)
      .to('.hero__scroll', { opacity: 1, duration: 0.9 }, 1.6)
      .add(() => heroSplits.forEach((s) => s.revert()), 1.9); // rend le crénage naturel du titre
    return tl;
  }

  function initHeroParallax() {
    // couches à vitesses différentes au scroll
    $$('[data-speed]', $('.hero')).forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.to(el, { y: -speed * 700, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
    });
    gsap.to('.hero__copy', { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });

    // profondeur à la souris
    if (!finePointer) return;
    const layers = $$('.hero .ph').map((p) => ({ f: $('.ph__frame', p), d: parseFloat(p.dataset.depth) || 20 }));
    const tos = layers.map((l) => ({ x: gsap.quickTo(l.f, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(l.f, 'y', { duration: 1.2, ease: 'power3' }), d: l.d }));
    const hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tos.forEach((t) => {
        t.x(nx * t.d * -1.2);
        t.y(ny * t.d * -1.2);
      });
    });
  }

  /* ═════════ 11. Bandeaux défilants réactifs au scroll ═════════ */
  function initMarquee() {
    const tweens = $$('.marquee').map((m) => {
      const dir = Number(m.dataset.dir) || -1;
      if (dir < 0) return gsap.to(m, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
      gsap.set(m, { xPercent: -50 });
      return gsap.to(m, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 });
    });
    let ts = 1;
    let target = 1;
    gsap.ticker.add(() => {
      ts += (target - ts) * 0.07;
      // retour progressif à la vitesse de croisière, dans le dernier sens de scroll
      target = Math.sign(target || 1) * (1 + (Math.abs(target) - 1) * 0.94);
      tweens.forEach((t) => t.timeScale(ts));
    });
    const react = (vel, dir) => {
      const boost = Math.min(Math.abs(vel) * 0.4, 7);
      target = (dir || 1) * (1 + boost);
    };
    if (lenis) lenis.on('scroll', (e) => react(e.velocity, e.direction));
    else ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => react(s.getVelocity() / 200, s.direction) });
  }

  /* ═════════ 12. Titres : lignes masquées + surligneur ═════════ */
  function initHeadings() {
    $$('[data-split]').forEach((h) => {
      ScrollTrigger.create({ trigger: h, start: 'top 86%', once: true, onEnter: () => h.classList.add('is-in') });
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'ln',
        autoSplit: true,
        onSplit(self) {
          if (h.dataset.done) return;
          return gsap.from(self.lines, {
            yPercent: 118,
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: h, start: 'top 86%', once: true, onEnter: () => (h.dataset.done = '1') },
          });
        },
      });
    });

    // nom géant du pied de page : lettre par lettre
    const foot = $('[data-split-foot]');
    if (foot) {
      const sp = SplitText.create(foot, { type: 'chars', charsClass: 'ch', mask: 'chars' });
      gsap.from(sp.chars, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: foot, start: 'top 95%', once: true } });
    }
  }

  /* ═════════ 13. Apparitions & compteurs ═════════ */
  function initReveals() {
    const rise = (targets, trigger, vars = {}) => {
      $$(targets).forEach((el, i, all) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', delay: vars.stagger ? (i % (vars.group || all.length)) * vars.stagger : 0, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    };
    rise('.lead');
    rise('.carte__foot');
    rise('.addr p', null, { stagger: 0.1, group: 3 });
    rise('.faq__item', null, { stagger: 0.07, group: 6 });
    rise('.hours-wrap');
    rise('.bloomea__cols > div', null, { stagger: 0.1, group: 2 });
    rise('.bloomea__price');

    gsap.from('.tech', { y: 70, opacity: 0, rotate: (i) => (i - 1) * 8, duration: 1.2, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: '.techs', start: 'top 85%', once: true } });
    gsap.from('.carte__tabs .tab', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.carte__tabs', start: 'top 92%', once: true } });
    gsap.from('.rev', { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.13, scrollTrigger: { trigger: '.avis__track', start: 'top 88%', once: true } });

    // tampon « −10 % » : il s’abat sur la page
    gsap.from('.etu__stamp', { scale: 1.9, rotate: -50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.etu__stamp-wrap', start: 'top 82%', once: true } });
    gsap.from('.etu .lead', { x: -30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.etu', start: 'top 60%', once: true } });

    // compteurs
    const rows = $$('.row').length;
    $$('[data-count-rows]').forEach((el) => (el.dataset.count = String(rows)));
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, {
        v: end,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = String(Math.round(o.v))),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // halo de l’appel à l’action qui suit le curseur
    const rdv = $('.rdv');
    if (rdv && finePointer) {
      rdv.addEventListener('pointermove', (e) => {
        const r = rdv.getBoundingClientRect();
        rdv.style.setProperty('--mx', `${e.clientX - r.left}px`);
        rdv.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    }

    // le tampon d’appel tourne plus vite quand on défile
    gsap.to('.rdv__stamp', { rotate: 190, ease: 'none', scrollTrigger: { trigger: '.rdv', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  }

  /* ═════════ 14. Orbite des points Bloomea ═════════ */
  function initOrbit() {
    const orbit = $('.bloomea__orbit');
    if (!orbit) return;
    const dots = $$('.orbit__dot', orbit);
    const defs = [
      { rx: 170, ry: 52, speed: 15, phase: 0 },
      { rx: 130, ry: 38, speed: -12, phase: 0.35 },
      { rx: 170, ry: 52, speed: 15, phase: 0.5 },
    ];
    const rot = (-18 * Math.PI) / 180;
    let W = orbit.clientWidth;
    let active = false;
    window.addEventListener('resize', () => (W = orbit.clientWidth));
    ScrollTrigger.create({ trigger: orbit, start: 'top bottom', end: 'bottom top', onToggle: (s) => (active = s.isActive) });
    gsap.ticker.add((time) => {
      if (!active) return;
      dots.forEach((d, i) => {
        const o = defs[i];
        const a = Math.PI * 2 * (time / o.speed + o.phase);
        const x = o.rx * Math.cos(a);
        const y = o.ry * Math.sin(a);
        const X = x * Math.cos(rot) - y * Math.sin(rot);
        const Y = x * Math.sin(rot) + y * Math.cos(rot);
        gsap.set(d, { x: ((200 + X) / 400) * W, y: ((200 + Y) / 400) * W });
      });
    });
  }

  /* ═════════ 15. Sections pinnées & horizontales (bureau) ═════════ */
  function initPinned() {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      doc.classList.add('pin-on');

      /* — Histoire : storytelling étape par étape — */
      const pin = $('.histoire__pin');
      const steps = $$('.step', pin);
      const imgs = $$('.stage__img', pin);
      const ring = $('.stage__ring-fill', pin);
      const bodies = steps.map((s) => $('.step__body', s));
      gsap.set(bodies, { height: 0, autoAlpha: 0 });
      gsap.set(bodies[0], { height: 'auto', autoAlpha: 1 });
      steps[0].classList.add('is-active');

      const setActive = (idx) => steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      const n = steps.length;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${Math.round(innerHeight * n * 0.85)}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 0.12))),
        },
      });
      tl.to(ring, { strokeDashoffset: 0, duration: n }, 0);
      imgs.forEach((im, i) => tl.fromTo(im, { scale: 1.16 }, { scale: 1.02, duration: 1.4 }, Math.max(0, i - 0.4)));
      for (let i = 1; i < n; i++) {
        const t = i - 0.4;
        tl.to(bodies[i - 1], { height: 0, autoAlpha: 0, duration: 0.35, ease: 'power2.inOut' }, t)
          .to(bodies[i], { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, t + 0.2)
          .to(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, t);
      }

      /* — Univers : défilement horizontal piloté par le scroll vertical — */
      const hPin = $('.univers__pin');
      const track = $('.univers__track');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const move = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: hPin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
      });
      $$('.chap').forEach((chap) => {
        const st = { trigger: chap, containerAnimation: move, start: 'left right', end: 'right left', scrub: true };
        gsap.fromTo($('.chap__ghost', chap), { x: 90, rotate: -6 }, { x: -90, rotate: 6, ease: 'none', scrollTrigger: st });
        const ph = $('.chap__ph', chap);
        if (ph) gsap.fromTo(ph, { y: 34, rotate: -5 }, { y: -18, rotate: 4, ease: 'none', scrollTrigger: st });
      });
      gsap.from('.univers__intro > *', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: hPin, start: 'top 70%', once: true } });

      return () => doc.classList.remove('pin-on');
    });

    /* — Mobile / tablette : simples apparitions — */
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      $$('.step, .chap, .univers__outro').forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    });
  }

  /* ═════════ 16. Images qui voyagent dans leur cadre + colonnes de la galerie ═════════ */
  function initMedia() {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      $$('.pin__frame img, .step__fig img, .bloomea__ph img').forEach((el) => {
        gsap.fromTo(el, { scale: 1.16, yPercent: -6 }, { scale: 1.16, yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      // révélation « cercle qui s’agrandit » pour la photo de l’équipe et le cadre du soin
      $$('.pin').forEach((p, i) => {
        const frame = $('.pin__frame', p);
        if (!frame) return;
        gsap.fromTo(frame, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.4, ease: 'expo.out', delay: (i % 2) * 0.12, scrollTrigger: { trigger: p, start: 'top 88%', once: true } });
      });
      gsap.from('.pin--insta', { y: 60, opacity: 0, rotate: 6, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.pin--insta', start: 'top 90%', once: true } });
      gsap.from('.map', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.map', start: 'top 90%', once: true } });
      gsap.fromTo('.map iframe', { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.map', start: 'top 90%', once: true } });
    });

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      $$('.board__col').forEach((col) => {
        const s = parseFloat(col.dataset.speed) || 0;
        gsap.fromTo(col, { y: s * 1.6 }, { y: -s * 1.6, ease: 'none', scrollTrigger: { trigger: '.board', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      });
    });
  }

  /* ═════════ Démarrage ═════════ */
  async function start() {
    initStatus();
    initTabs();
    initMenu();
    initReviews();
    initAnchors();

    if (reduce) {
      await runLoader();
      body.classList.remove('is-loading');
      initPointerFx();
      return;
    }

    initScroll();
    await document.fonts.ready; // les titres sont découpés une fois la police en place
    initPinned(); // fixe les classes de mise en page avant de découper les titres
    prepHero();
    initHeadings();
    initReveals();
    initMedia();
    initMarquee();
    initOrbit();
    initPointerFx();
    initCursor();
    initHeroParallax();
    ScrollTrigger.refresh();

    await runLoader();
    body.classList.remove('is-loading');
    playHero();
    lenis && lenis.start();
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.readyState === 'complete') ScrollTrigger.refresh();
  }

  start();
})();
