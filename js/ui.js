/* ============================================================
   COMUNIK2 — Interacciones de interfaz
   Carrito, drawer móvil, popup ayuda, hero slider, countdown,
   añadir al carrito desde tarjetas.
   ============================================================ */
(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------------------- Overlay + paneles ---------------------- */
  var overlay = null;

  function openCart() { togglePanel($('#ck-cart'), true); }
  function closeCart() { togglePanel($('#ck-cart'), false); }
  function openNav() { togglePanel($('#ck-mobile-nav'), true); }
  function closeNav() { togglePanel($('#ck-mobile-nav'), false); }

  function togglePanel(panel, show) {
    if (!panel) return;
    overlay = overlay || $('#ck-overlay');
    if (show) {
      panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.classList.add('no-scroll');
    } else {
      panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  }

  function closeAll() {
    closeCart();
    closeNav();
  }

  /* ---------------------- Wiring del header ---------------------- */
  function wireHeader() {
    overlay = $('#ck-overlay');

    var cartBtn = $('#ck-cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    var cartClose = $('#ck-cart-close');
    if (cartClose) cartClose.addEventListener('click', closeCart);

    var burger = $('#ck-burger');
    if (burger) burger.addEventListener('click', openNav);

    var mobileClose = $('#ck-mobile-close');
    if (mobileClose) mobileClose.addEventListener('click', closeNav);

    if (overlay) overlay.addEventListener('click', closeAll);

    // Popup ayuda
    var helpBtn = $('#ck-help-btn');
    var helpPop = $('#ck-help-pop');
    if (helpBtn && helpPop) {
      helpBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        helpPop.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!helpPop.contains(e.target) && e.target !== helpBtn) helpPop.classList.remove('open');
      });
    }

    // Checkout
    var checkout = $('#ck-checkout');
    if (checkout) checkout.addEventListener('click', function () {
      if (window.CK2 && CK2.cart) CK2.cart.checkout();
    });

    // ESC cierra todo
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeAll(); if (helpPop) helpPop.classList.remove('open'); }
    });

    // Cerrar drawer al navegar
    $all('#ck-mobile-nav a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* ---------------------- Añadir al carrito (tarjetas) ---------------------- */
  function wireAddButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (!btn || btn.disabled) return;
      e.preventDefault();
      var id = btn.getAttribute('data-add');
      var qty = parseInt(btn.getAttribute('data-qty') || '1', 10);
      if (window.CK2 && CK2.cart) CK2.cart.add(id, qty);
    });

    // Selector de color en tarjetas de la home
    $all('.pcard__colors').forEach(function (group) {
      group.addEventListener('click', function (e) {
        var dot = e.target.closest('button');
        if (!dot) return;
        $all('button', group).forEach(function (b) { b.classList.remove('active'); });
        dot.classList.add('active');
        var target = dot.getAttribute('data-target');
        var addBtn = group.closest('.pcard').querySelector('[data-add]');
        if (target && addBtn) {
          addBtn.setAttribute('data-add', target);
          var link = group.closest('.pcard').querySelector('[data-link]');
          if (link && CK2.PRODUCTS[target]) link.href = CK2.PRODUCTS[target].url;
        }
      });
    });
  }

  /* ---------------------- Hero slider ---------------------- */
  function wireHero() {
    var hero = $('#hero');
    if (!hero) return;
    var slides = $all('.hero__slide', hero);
    var dotsWrap = $('.hero__dots', hero);
    if (!slides.length) return;

    var idx = 0;
    var timer;

    // crear dots
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = $all('button', dotsWrap);

    function go(n) {
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 4500); }

    var nextBtn = $('.hero__arrow--next', hero);
    var prevBtn = $('.hero__arrow--prev', hero);
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });

    go(0);
    restart();
  }

  /* ---------------------- Countdown a medianoche ---------------------- */
  function wireCountdown() {
    var box = $('#countdown');
    if (!box) return;
    var hEl = $('[data-h]', box), mEl = $('[data-m]', box), sEl = $('[data-s]', box);

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var now = new Date();
      var end = new Date(now);
      end.setHours(24, 0, 0, 0);
      var diff = Math.max(0, Math.floor((end - now) / 1000));
      var h = Math.floor(diff / 3600);
      var m = Math.floor((diff % 3600) / 60);
      var s = diff % 60;
      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) sEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------- Init ---------------------- */
  function initUI() {
    wireHeader();
    wireAddButtons();
    wireHero();
    wireCountdown();
  }

  window.CK2 = window.CK2 || {};
  CK2.openCart = openCart;
  CK2.closeCart = closeCart;
  CK2.initUI = initUI;
})();
