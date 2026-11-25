// VECTOR Closet · outfit set — zero dependencies.
// <section class="vc" data-assets="assets/"></section> becomes the whole app: home and the outfit board.
// Drag the shirt onto the trousers: it lifts with a tilt, the trousers sink to take it, the coat and loafers step back;
// let go and the shirt, the trousers and the loafers fold into one outfit card saved to Thursday.
;(() => {
  'use strict';

  const svg = (d, o = {}) => `<svg width="${o.s || 18}" height="${o.s || 18}" viewBox="0 0 24 24" fill="none" stroke="${o.c || 'currentColor'}" stroke-width="${o.w || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const P = {
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    closet: '<path d="M12 6a2 2 0 1 1 2 2l-2 1.5L3 16h18l-9-6.5"/><path d="M3 16v3h18v-3"/>',
    outfits: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
    planner: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    laundry: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><path d="M7 6.5h2"/>',
    wishlist: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    trips: '<rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V4h6v3M9 20v1M15 20v1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    rain: '<path d="M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 17.6 9 3.5 3.5 0 0 1 17 15z"/><path d="m9 18-1 2M13 18l-1 2M17 18l-1 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
    hand: '<path d="M9 11V5a1.5 1.5 0 0 1 3 0v5-1.5a1.5 1.5 0 0 1 3 0V11a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 15a1.6 1.6 0 0 1 2.5-2L9 15"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
  };
  const NAV = [['home', 'Home'], ['closet', 'Closet', 124], ['outfits', 'Outfits', 23], ['planner', 'Planner'], ['laundry', 'Laundry', 3], ['wishlist', 'Wishlist'], ['trips', 'Trips']];
  const WEEK = [   // home: day, looks (two photos) or a free day, caption
    ['Mon 23', ['knit', 'trousers'], 'Office'], ['Tue 24', ['tee', 'loafers'], 'Gallery'], ['Wed 25', ['coat', 'loafers'], 'Office', 'today'],
    ['Thu 26'], ['Fri 27', ['shirt', 'trousers'], 'Office'], ['Sat 28', null, 'Free'], ['Sun 29', null, 'Brunch'],
  ];
  const ALT = { shirt: 'Ecru cotton oxford shirt', trousers: 'Grey wool wide-leg trousers', knit: 'Rust merino jumper', coat: 'Camel wool coat', tee: 'Navy and white striped long-sleeve top', loafers: 'Brown leather loafers' };
  const RECENT = [['shirt', 'Oxford shirt', 'Ecru cotton'], ['trousers', 'Wool trousers', 'Grey · wide leg'], ['knit', 'Merino jumper', 'Rust · knit'], ['coat', 'Camel coat', 'Wool blend'], ['tee', 'Breton top', 'Navy stripe'], ['loafers', 'Loafers', 'Brown leather']];
  const SAVED = [[['knit', 'trousers'], 'Office, rainy day', '3 items · worn 4×'], [['tee', 'loafers'], 'Gallery Tuesday', '3 items · worn 2×'], [['coat', 'knit'], 'Weekend walk', '4 items · worn 6×']];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  class ClosetApp {
    constructor(root) {
      this.root = root;
      const A = root.dataset.assets || 'assets/';
      const img = (n, alt = '', cls = '', st = '') => `<img src="${A}${n}.jpg" alt="${alt}"${cls ? ` class="${cls}"` : ''}${st ? ` style="${st}"` : ''} draggable="false">`;
      const row = (n, t, sub, r) => `<div class="vc-row">${img(n, '', 'vc-thumb', 'width:36px;height:44px')}<div>${sub ? `<div>${t}</div><div class="vc-sub">${sub}</div>` : t}</div>${r ? `<span class="vc-sub">${r}</span>` : ''}</div>`;
      const people = `<div class="vc-people"><span>${img('theo', 'Theo', 'vc-av', 'width:30px;height:30px')}${img('ada', 'Ada', 'vc-av', 'width:30px;height:30px')}</span>with Theo and Ada</div>`;
      root.innerHTML = `
<nav class="vc-side" aria-label="Main">
  <div class="vc-logo"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M13 4a3 3 0 1 1 3 3l-3 2.2L3 16.5h20L13 9.2" fill="none" stroke="#D6A15E" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M3 16.5v3h20v-3" fill="none" stroke="#EDEAE3" stroke-width="2"/></svg><b>VECTOR</b><span>Closet</span></div>
  ${NAV.map(([k, t, n]) => `<a class="vc-nav" href="#" data-nav="${k}">${svg(P[k])}${t}${n ? `<span class="vc-cnt"${k === 'outfits' ? ' data-outfits' : ''}>${n}</span>` : ''}</a>`).join('')}
  <div class="vc-side-foot">
    <div class="vc-worn"><div style="font-size:12.5px;color:var(--vc-muted)">Worn this month</div><div style="font-size:14px;font-weight:600;margin-top:2px">61 of 124 items</div><div class="vc-bar"><span></span></div></div>
    <div class="vc-me">${img('nora', 'Nora Lind', 'vc-av', 'width:34px;height:34px')}<div><div style="font-size:13.5px;font-weight:600">Nora Lind</div><div class="vc-sub">Stockholm</div></div></div>
  </div>
</nav>
<div class="vc-col">
  <header class="vc-top">
    <label class="vc-search">${svg(P.search, { s: 16, w: 2 })}<span class="vc-sr">Search</span><input type="search" placeholder="Search items, colours, fabrics"></label>
    <div class="vc-top-r">
      <span class="vc-weather">${svg(P.rain, { s: 17 })}6° · rain</span>
      <button class="vc-ghost" type="button">${svg(P.plus, { s: 16, w: 2 })}Add item</button>
      <button class="vc-ib" type="button" aria-label="Notifications">${svg(P.bell, { s: 19 })}</button>
      ${img('nora', 'Nora Lind', 'vc-av', 'width:34px;height:34px')}
    </div>
  </header>
  <div class="vc-views">
    <div class="vc-view" data-view="home">
      <main class="vc-main">
        <div><h1 class="vc-h1">Good evening, Nora</h1><p class="vc-lede">Thursday’s dinner has no outfit yet · 6° and rain</p></div>
        <section class="vc-card vc-week" aria-label="This week">
          <div class="vc-sec-h"><h2>This week</h2><span class="vc-sub">Nov 23–29 · 3 outfits planned</span></div>
          <div class="vc-days">${WEEK.map(([d, look, cap, today]) => d === 'Thu 26' ? `
            <div class="vc-day is-thu"><div class="vc-day-d"><b>${d}</b></div>
              <div class="vc-thu-plan"><div style="font-size:12.5px;font-weight:600">Dinner at Lumi</div><div class="vc-sub">19:30 · smart casual</div><button class="vc-plan" type="button" data-plan>${svg(P.plus, { s: 11, w: 2.6 })}Plan outfit</button></div>
              <div class="vc-look vc-thu-look">${img('shirt', ALT.shirt)}${img('trousers', ALT.trousers)}</div>
              <div class="vc-sub" style="color:var(--vc-camel-text)"><span class="vc-if-idle">No outfit</span><span class="vc-if-saved">Dinner at Lumi</span></div>
            </div>` : `
            <div class="vc-day${today ? ' is-today' : ''}"><div class="vc-day-d"><b>${d}</b>${today ? `<span>${today}</span>` : ''}</div>
              ${look ? `<div class="vc-look">${look.map(n => img(n, ALT[n])).join('')}</div>` : '<div class="vc-free"></div>'}
              <div class="vc-sub">${cap}</div>
            </div>`).join('')}
          </div>
        </section>
        <section aria-label="Recently added">
          <div class="vc-sec-h"><h2>Recently added</h2><a class="vc-link" href="#">All 124 items</a></div>
          <div class="vc-items">${RECENT.map(([n, t, s]) => `<div class="vc-it">${img(n, ALT[n])}<div><div class="vc-lbl">${t}</div><div class="vc-sub">${s}</div></div></div>`).join('')}</div>
        </section>
        <section aria-label="Saved outfits">
          <div class="vc-sec-h"><h2>Saved outfits</h2><a class="vc-link" href="#">All <span data-outfits-all>23</span></a></div>
          <div class="vc-outfits">${SAVED.map(([pair, t, s]) => `<a class="vc-card vc-outfit" href="#"><span>${pair.map(n => img(n, '', 'vc-thumb', 'width:44px;height:56px')).join('')}</span><span><span style="display:block;font-size:13.5px;font-weight:600">${t}</span><span class="vc-sub" style="display:block;margin-top:2px">${s}</span></span></a>`).join('')}</div>
        </section>
      </main>
      <aside class="vc-aside" aria-label="Tomorrow and laundry">
        <section class="vc-card vc-box"><div class="vc-box-h"><h2>Tomorrow</h2><span class="vc-sub">19:30</span></div><div style="font-weight:500">Dinner at Lumi</div><div class="vc-sub">Kanalgatan 14 · smart casual</div>${people}</section>
        <section class="vc-card vc-box"><div class="vc-box-h"><h2>Laundry</h2><span class="vc-sub">3 items</span></div>${row('knit', 'Merino jumper', 'Hand wash · drying', 'Thu')}${row('tee', 'Breton top', '40° cotton · washing', 'Wed')}${row('loafers', 'Brown loafers', 'Cobbler · new heels, ready', 'Today')}</section>
        <section class="vc-card vc-box"><h2>Most worn in November</h2>${row('trousers', 'Grey wool trousers', '', '6 times')}${row('loafers', 'Brown loafers', '', '5 times')}${row('coat', 'Camel coat', '', '4 times')}</section>
      </aside>
    </div>

    <div class="vc-view vc-board-view" data-view="board">
      <main class="vc-main">
        <div class="vc-head">
          <div><div class="vc-crumbs"><a href="#" data-back>Planner</a> <span aria-hidden="true">/</span> Thu, Nov 26</div><h1>Outfit for dinner at Lumi</h1></div>
          <div class="vc-head-r"><span class="vc-chip">Smart casual</span><span class="vc-chip">Warm enough for 6°</span>
            <button class="vc-save" type="button" disabled data-save><span class="vc-if-idle">Save outfit</span><span class="vc-if-saved">${svg(P.check, { s: 16, w: 2.4 })}Saved to Thursday</span></button></div>
        </div>
        <section class="vc-card vc-board" aria-label="Outfit board">
          <div class="vc-layer vc-pick">
            <div class="vc-slot" aria-hidden="true"></div>
            <div class="vc-zone" aria-hidden="true">Top goes here</div>
            <div class="vc-item vc-trousers" data-trousers><div class="vc-cloth" style="height:400px">${img('trousers', ALT.trousers)}</div><div><div class="vc-lbl">Grey wool trousers</div><div class="vc-sub">Wide leg · worn 6 times</div></div></div>
            <div class="vc-item vc-coat" data-coat><div class="vc-cloth" style="height:230px">${img('coat', 'Camel wool coat on a hanger')}</div><div><div class="vc-lbl">Camel coat</div><div class="vc-sub">Outer layer · for rain</div></div></div>
            <div class="vc-item vc-loafers" data-loafers><div class="vc-cloth" style="height:130px">${img('loafers', ALT.loafers)}</div><div><div class="vc-lbl">Brown loafers</div><div class="vc-sub">Leather · size 38</div></div></div>
            <div class="vc-item vc-shirt" data-shirt tabindex="0" role="button" aria-label="Oxford shirt. Drag it onto the trousers, or press Enter to pair them">
              <div class="vc-lift"><div class="vc-cloth">${img('shirt', ALT.shirt)}<span class="vc-badge">Best match</span></div>
                <div class="vc-shirt-meta"><div><div class="vc-lbl">Oxford shirt</div><div class="vc-sub">Ecru cotton · goes with grey</div></div><div class="vc-tags"><span class="vc-chip s">Ironed, on hanger 4</span><span class="vc-chip s">Pairs with 4 bottoms</span></div></div></div>
            </div>
            <div class="vc-hint" aria-live="polite">${svg(P.hand, { s: 15 })}<span class="vc-hint-idle">Drag a top onto the trousers to build the outfit</span><span class="vc-hint-over">Release to pair the shirt with the trousers</span></div>
          </div>
          <div class="vc-layer vc-done" aria-live="polite">
            <section class="vc-in" aria-label="In this outfit">
              <h3>In this outfit</h3>
              <div class="vc-row">${img('shirt', '', 'vc-thumb', 'width:40px;height:50px')}<div><div>Oxford shirt</div><div class="vc-sub">Ecru cotton</div></div></div>
              <div class="vc-row">${img('trousers', '', 'vc-thumb', 'width:40px;height:50px')}<div><div>Grey wool trousers</div><div class="vc-sub">Wide leg</div></div></div>
              <div class="vc-row">${img('loafers', '', 'vc-thumb', 'width:40px;height:50px')}<div><div>Brown loafers</div><div class="vc-sub">Leather</div></div></div>
              <div class="vc-facts"><div><span>Worn together</span><span>first time</span></div><div><span>Warmth</span><span>good for 6°</span></div><div><span>Dress code</span><span>smart casual</span></div></div>
            </section>
            <article class="vc-set" aria-label="Thursday outfit, dinner at Lumi">
              <div class="vc-set-face"></div><div class="vc-set-well"></div>
              ${img('shirt', ALT.shirt, 'vc-set-shirt')}${img('trousers', 'Grey wool trousers', 'vc-set-trousers')}${img('loafers', 'Brown loafers', 'vc-set-loafers')}
              <div class="vc-set-foot"><div><b>Thu · Dinner at Lumi</b><div class="vc-sub" style="margin-top:2px">Shirt, trousers, loafers · outfit 24</div></div><span class="vc-tick">${svg(P.check, { s: 16, w: 2.6 })}</span></div>
            </article>
            <div class="vc-item vc-layer-coat"><div class="vc-cloth">${img('coat', 'Camel wool coat on a hanger')}</div><div><div class="vc-lbl">Add the camel coat?</div><div class="vc-sub">Rain after 18:00</div></div><button class="vc-chip" type="button">Add layer</button></div>
            <div class="vc-stamp">Saved Nov 25, 21:14 · shown in Planner on Thursday</div>
          </div>
        </section>
        <section class="vc-more" aria-label="More from your closet">
          <div class="vc-more-t"><b>Other tops</b><div class="vc-sub">14 go with grey wool</div><a class="vc-link" href="#">Open closet</a></div>
          <div class="vc-card vc-tops">
            <div class="vc-top-it">${img('knit', ALT.knit)}<div><div class="vc-lbl">Merino jumper</div><div class="vc-sub">Rust · worn with grey 3×</div></div></div>
            <div class="vc-top-it">${img('tee', ALT.tee)}<div><div class="vc-lbl">Breton top</div><div class="vc-sub">Navy stripe · in laundry</div></div></div>
            <div class="vc-plus">+12</div>
          </div>
        </section>
      </main>
      <aside class="vc-aside" aria-label="Thursday">
        <section class="vc-card vc-box"><div class="vc-box-h"><h2>Thursday, Nov 26</h2><span class="vc-sub">19:30</span></div><div style="font-weight:500">Dinner at Lumi</div><div class="vc-sub">Kanalgatan 14 · smart casual</div>${people}</section>
        <section class="vc-card vc-box" style="gap:14px"><div class="vc-box-h"><h2>This week</h2><a class="vc-link" href="#" style="font-size:12.5px">Planner</a></div>
          <div class="vc-strip">${[['Mon', 'knit'], ['Tue', 'tee'], ['Wed', 'coat'], ['Thu', 'shirt'], ['Fri'], ['Sat'], ['Sun']].map(([d, n]) => `<div class="vc-wd${d === 'Thu' ? ' is-thu' : ''}">${d}<i>${n ? img(n) : ''}</i></div>`).join('')}</div>
        </section>
        <section class="vc-card vc-box"><div class="vc-rain"><span>${svg(P.rain, { s: 20 })}</span><div><div style="font-weight:600">6° · light rain after 18:00</div><div class="vc-sub" style="margin-top:2px">Wool and leather are fine tonight</div></div></div></section>
        <section class="vc-card vc-box"><h2>Last worn</h2>${row('trousers', 'Grey wool trousers', '', 'Nov 12')}${row('shirt', 'Oxford shirt', '', 'Oct 30')}${row('loafers', 'Brown loafers', '', 'Nov 20')}</section>
      </aside>
    </div>
  </div>
</div>`;
      this.$ = s => root.querySelector(s);
      this.views = [...root.querySelectorAll('.vc-view')];
      this.navs = [...root.querySelectorAll('.vc-nav')];
      this.shirt = this.$('[data-shirt]');
      this.lift = this.$('.vc-lift');
      this.drag = null;
      this.timer = 0;
      this.$('[data-plan]').addEventListener('click', () => this.go('board'));
      this.$('[data-back]').addEventListener('click', e => { e.preventDefault(); this.go('home'); });
      this.$('[data-nav="home"]').addEventListener('click', e => { e.preventDefault(); this.go('home'); });
      this.$('[data-nav="outfits"]').addEventListener('click', e => { e.preventDefault(); this.go('board'); });
      this.shirt.addEventListener('pointerdown', e => this.grab(e));
      this.shirt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.save(); } });
      this.onMove = e => this.pull(e);
      this.onUp = () => this.release();
      this.reset();
    }

    go(view, quiet = false) {
      if (quiet) this.root.classList.add('is-instant');
      this.root.dataset.view = view;
      this.views.forEach(v => v.classList.toggle('is-on', v.dataset.view === view));
      this.navs.forEach(n => n.classList.toggle('is-on', n.dataset.nav === (view === 'board' ? 'outfits' : 'home')));
      if (quiet) requestAnimationFrame(() => requestAnimationFrame(() => this.root.classList.remove('is-instant')));
    }

    // stage px per client px: the screen may be scaled to fit the window
    k() { return this.root.getBoundingClientRect().width / 1440; }

    grab(e) {
      if (e.button !== 0 || this.drag || this.root.dataset.saved === 'true') return;
      e.preventDefault();
      try { this.shirt.setPointerCapture(e.pointerId); } catch (_) { /* a synthetic pointer has nothing to capture */ }
      this.drag = { x: e.clientX, y: e.clientY, k: this.k(), dx: 0, dy: 0, t: e.timeStamp, tilt: -3 };
      this.shirt.classList.remove('is-back');
      this.lift.style.rotate = '-3deg';
      this.root.dataset.drag = 'true';
      addEventListener('pointermove', this.onMove);
      addEventListener('pointerup', this.onUp);
      addEventListener('pointercancel', this.onUp);
    }

    // the shirt follows the hand and leans into the pull; over the trousers they sink to take it
    pull(e) {
      const d = this.drag;
      if (!d) return;
      const dx = (e.clientX - d.x) / d.k, dy = (e.clientY - d.y) / d.k;
      const vx = (dx - d.dx) / Math.max(8, e.timeStamp - d.t);
      Object.assign(d, { dx, dy, t: e.timeStamp });
      d.tilt += (-3 + clamp(vx * 20, -8, 8) - d.tilt) * .35;
      this.shirt.style.translate = `${dx}px ${dy}px`;
      this.lift.style.rotate = `${d.tilt.toFixed(2)}deg`;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { if (this.drag) { this.drag.tilt = -3; this.lift.style.rotate = '-3deg'; } }, 90);
      const cx = 154 + dx, cy = 174 + dy;   // the shirt photo's centre on the board
      this.root.dataset.over = Math.abs(cx - 446) < 170 && cy < 330;
    }

    release() {
      if (!this.drag) return;
      removeEventListener('pointermove', this.onMove);
      removeEventListener('pointerup', this.onUp);
      removeEventListener('pointercancel', this.onUp);
      clearTimeout(this.timer);
      this.drag = null;
      if (this.root.dataset.over === 'true') {   // set down on the trousers, then fold
        this.root.dataset.drop = 'true';
        this.lift.style.rotate = '0deg';
        this.timer = setTimeout(() => this.save(), 180);
        return;
      }
      this.root.dataset.drag = 'false';
      this.shirt.classList.add('is-back');
      this.shirt.style.translate = this.lift.style.rotate = '';
    }

    // FLIP: the same shirt, trousers, loafers and coat fly from the board into the outfit card
    save() {
      if (this.root.dataset.saved === 'true') return;
      const from = ['[data-shirt] .vc-cloth', '[data-trousers] .vc-cloth', '[data-loafers] .vc-cloth', '[data-coat] .vc-cloth'].map(s => this.$(s).getBoundingClientRect());
      this.root.dataset.saved = 'true';
      this.root.dataset.drag = this.root.dataset.over = this.root.dataset.drop = 'false';
      const k = this.k();
      ['.vc-set-shirt', '.vc-set-trousers', '.vc-set-loafers', '.vc-layer-coat .vc-cloth'].forEach((s, i) => {
        const el = this.$(s), to = el.getBoundingClientRect(), f = from[i];
        const start = `translate(${(f.left - to.left) / k}px, ${(f.top - to.top) / k}px) scale(${f.width / to.width}, ${f.height / to.height})${i === 0 ? ' rotate(-2deg)' : ''}`;
        el.animate([{ transform: start }, { transform: 'none' }], { duration: i === 3 ? 450 : 620, delay: [40, 0, 110, 60][i], easing: 'cubic-bezier(.77,0,.175,1)', fill: 'backwards' });
      });
      this.$('[data-outfits]').textContent = this.$('[data-outfits-all]').textContent = 24;
      this.$('[data-save]').setAttribute('aria-label', 'Saved to Thursday');
    }

    reset() {
      this.root.classList.add('is-instant');
      Object.assign(this.root.dataset, { saved: 'false', drag: 'false', over: 'false', drop: 'false' });
      if (this.drag) this.release();
      clearTimeout(this.timer);
      this.root.getAnimations({ subtree: true }).forEach(a => a.cancel());
      this.shirt.classList.remove('is-back');
      this.shirt.style.translate = this.lift.style.rotate = '';
      this.$('[data-outfits]').textContent = this.$('[data-outfits-all]').textContent = 23;
      this.$('[data-save]').removeAttribute('aria-label');
      this.go('home', true);
    }
  }

  document.querySelectorAll('.vc').forEach(el => { el.closetApp = new ClosetApp(el); });
})();
