/* ============================================================
   COMUNIK2 — Lógica de página de producto
   Galería con thumbnails, lightbox imagen/video, stepper cantidad.
   Se carga solo en producto-gris.html / producto-negro.html.
   ============================================================ */
(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function init() {
    var gallery = $('#gallery');
    if (!gallery) return;

    var mainImg = $('#gallery-main-img', gallery);
    var mainWrap = $('#gallery-main', gallery);
    var thumbs = $all('.gallery__thumb', gallery);

    var lightbox = $('#lightbox');
    var lbContent = $('#lightbox-content', lightbox);
    var lbClose = $('#lightbox-close', lightbox);

    // ---------- Cambiar imagen principal al click en thumb ----------
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');

        var isVideo = thumb.getAttribute('data-video');
        if (isVideo) {
          // Abrir lightbox con video directamente
          openVideo(isVideo);
          return;
        }
        var full = thumb.getAttribute('data-full');
        // Transición fade
        mainImg.style.opacity = '0';
        setTimeout(function () {
          mainImg.src = full;
          mainImg.style.opacity = '1';
        }, 200);
      });
    });

    // ---------- Click en imagen principal -> lightbox ----------
    if (mainWrap) {
      mainWrap.addEventListener('click', function () {
        openImage(mainImg.src);
      });
    }

    // ---------- Lightbox ----------
    function openImage(src) {
      lbContent.innerHTML = '<img src="' + src + '" alt="Vista ampliada">';
      lightbox.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function openVideo(src) {
      lbContent.innerHTML =
        '<video src="' + src + '" controls autoplay playsinline></video>';
      lightbox.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function closeLightbox() {
      // pausar video si existe
      var vid = $('video', lbContent);
      if (vid) { vid.pause(); }
      lightbox.classList.remove('open');
      lbContent.innerHTML = '';
      document.body.classList.remove('no-scroll');
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });

    // ---------- API global: usada por la galería de contenido (onclick) ----------
    // abrirLightbox('ruta.jpg')            -> imagen
    // abrirLightbox('ruta.mp4', 'video')   -> video
    window.abrirLightbox = function (src, tipo) {
      if (tipo === 'video') openVideo(src);
      else openImage(src);
    };

    // ---------- Stepper de cantidad ----------
    var stepper = $('#qty-stepper');
    if (stepper) {
      var valEl = $('span', stepper);
      var addBtn = $('[data-add]');
      var qty = 1;
      function sync() {
        valEl.textContent = qty;
        if (addBtn) addBtn.setAttribute('data-qty', qty);
      }
      stepper.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'inc') qty++;
        else if (act === 'dec' && qty > 1) qty--;
        sync();
      });
      sync();
    }

    // ---------- Acordeón FAQ (misma lógica que un acordeón de specs) ----------
    $all('.faq-item').forEach(function (item) {
      var q = $('.faq-q', item);
      if (!q) return;
      q.addEventListener('click', function () {
        item.classList.toggle('open');
      });
    });

    // ---------- Libro de reclamaciones inline (validación) ----------
    var rForm = $('#reclamo-inline-form');
    if (rForm) {
      var rSuccess = $('#reclamo-inline-success');

      // Limpia el estado de error al escribir / cambiar un campo
      rForm.addEventListener('input', function (e) {
        var field = e.target.closest('.form-field');
        if (field) field.classList.remove('field-error');
      });

      rForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;

        // Campos requeridos (texto, email, select, textarea, checkbox)
        $all('[required]', rForm).forEach(function (f) {
          if (f.type === 'radio') return; // los radios se validan como grupo
          var valid = f.type === 'checkbox' ? f.checked : String(f.value).trim() !== '';
          var field = f.closest('.form-field') || f.closest('.check-row');
          if (field) field.classList.toggle('field-error', !valid);
          if (!valid) ok = false;
        });

        // Grupo de radios reclamo / queja
        var radios = $all('input[name="rec-tipo"]', rForm);
        if (radios.length) {
          var anyChecked = radios.some(function (r) { return r.checked; });
          var rgWrap = radios[0].closest('.form-field');
          if (rgWrap) rgWrap.classList.toggle('field-error', !anyChecked);
          if (!anyChecked) ok = false;
        }

        if (!ok) {
          var firstErr = $('.field-error', rForm);
          if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // Éxito
        rForm.reset();
        rForm.style.display = 'none';
        if (rSuccess) {
          rSuccess.classList.add('show');
          rSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
