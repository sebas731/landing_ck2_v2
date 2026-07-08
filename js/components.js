/* ============================================================
   COMUNIK2 — Componentes inyectables (header / footer / carrito)
   Punto de entrada: cada página solo carga este archivo.
   Inyecta el markup y luego carga cart.js + ui.js.
   ============================================================ */
(function () {
  'use strict';

  var ROOT = location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
  var WA = '51955372605';

  function p(path) { return ROOT + path; }

  /* ---------------------- HEADER + overlays ---------------------- */
  function headerHTML() {
    return (
      // Ticker
      '<div class="ticker"><div class="ticker__track">' +
        tickerItems() + tickerItems() +
      '</div></div>' +

      // Barra principal
      '<div class="site-header">' +
        '<div class="container header__bar">' +
          '<button class="hamburger" id="ck-burger" aria-label="Abrir menú">' +
            svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>') +
          '</button>' +

          '<a href="' + p('index.html') + '" class="logo">Comuni<b>K2</b></a>' +

          '<nav class="main-nav"><ul>' +
            '<li><a href="' + p('index.html') + '">Inicio</a></li>' +
            '<li><a href="' + p('index.html') + '#productos">Ofertas <span class="badge-hot">Hot</span></a></li>' +
            '<li><a href="' + p('pages/nosotros.html') + '">Nosotros</a></li>' +
            '<li><a href="' + p('pages/contacto.html') + '">Contacto</a></li>' +
          '</ul></nav>' +

          '<div class="header__actions">' +
            '<div class="help">' +
              '<button class="help__btn" id="ck-help-btn">' +
                svg('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>', 18) +
                '¿Necesitas ayuda?' +
              '</button>' +
              '<div class="help__pop" id="ck-help-pop">' +
                '<h4>Estamos para ayudarte</h4>' +
                helpRow(waIcon(16, 'var(--green-wa)'), 'WhatsApp', '+51 955 372 605') +
                helpRow(svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>', 16, 'var(--red)'), 'Email', 'contacto@comunik2peru.com') +
                helpRow(svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 16, 'var(--gray-900)'), 'Horario', 'Lun - Sab') +
              '</div>' +
            '</div>' +

            '<button class="cart-btn" id="ck-cart-btn" aria-label="Abrir carrito">' +
              svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>', 20) +
              '<span class="cart-count">0</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Drawer móvil
      '<nav class="mobile-nav" id="ck-mobile-nav">' +
        '<div class="mobile-nav__head">' +
          '<span class="logo">Comuni<b>K2</b></span>' +
          '<button class="cart__close" id="ck-mobile-close" aria-label="Cerrar menú">' + closeIcon() + '</button>' +
        '</div>' +
        '<a href="' + p('index.html') + '">Inicio ' + chev() + '</a>' +
        '<a href="' + p('index.html') + '#productos">Productos ' + chev() + '</a>' +
        '<a href="' + p('index.html') + '#productos">Ofertas <span class="badge-hot">Hot</span></a>' +
        '<a href="' + p('pages/nosotros.html') + '">Nosotros ' + chev() + '</a>' +
        '<a href="' + p('pages/contacto.html') + '">Contacto ' + chev() + '</a>' +
        '<a href="' + p('pages/blog.html') + '">Blog ' + chev() + '</a>' +
        '<div class="mobile-nav__foot">' + svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>', 15) + ' +51 999 999 999<br>Lun-Sab 9am-6pm</div>' +
      '</nav>' +

      // Carrito sidebar
      '<aside class="cart" id="ck-cart" aria-label="Carrito de compras">' +
        '<div class="cart__head">' +
          '<h3>' + svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>', 20) + ' Tu carrito</h3>' +
          '<button class="cart__close" id="ck-cart-close" aria-label="Cerrar carrito">' + closeIcon() + '</button>' +
        '</div>' +
        '<div class="cart__items" id="cart-items"></div>' +
        '<div class="cart__foot" id="cart-foot" style="display:none">' +
          '<div class="cart__total"><span>Total</span><b id="cart-total">S/. 0.00</b></div>' +
          '<button class="btn btn-wa btn-block" id="ck-checkout">' +
            waIcon(20, '#fff') + ' Pedir por WhatsApp' +
          '</button>' +
          '<p class="cart__note">Te responderemos para confirmar stock y coordinar el envío.</p>' +
        '</div>' +
      '</aside>' +

      // Overlay
      '<div class="overlay" id="ck-overlay"></div>'
    );
  }

function tickerItems() {
  return (
    '<span>' + svg('<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>', 15, '#fff') + ' ENVIOS A TODO EL PERU </span>' +

    '<span>' + waIcon(15, '#25D366') + ' COMPRA RAPIDA POR WHATSAPP</span>' +
    '<span>' + svg('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>', 15, '#fff') + ' HASTA UN AÑO DE GARANTIA</span>' +
    '<span>' + svg('<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', 15, '#fff') + ' PEDIDOS LISTOS PARA ENTREGAR</span>'
  );
}

  /* ---------------------- FOOTER ---------------------- */
  function footerHTML() {
    return (
      '<footer class="site-footer">' +
        '<div class="container footer__grid">' +

          '<div class="footer__brand">' +
            '<a href="' + p('index.html') + '" class="logo">Comuni<b>K2</b></a>' +
            '<div class="footer__contact">' +
              helpRow(waIcon(16, 'var(--green-wa)'), 'WhatsApp', '+51 955 372 605') +
              helpRow(svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>', 16, 'var(--red)'), 'Teléfono', '+51 +51 955 372 605') +
              helpRow(svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 16, 'var(--gray-900)'), 'Horario', 'Lun - Sab') +
              helpRow(svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>', 16, 'var(--gray-900)'), 'Email', 'contacto@comunik2peru.com') +
            '</div>' +
            '<a href="' + p('pages/reclamaciones.html') + '" class="footer__libro" aria-label="Libro de reclamaciones">' +
              '<img src="' + p('images/libro.jpg') + '" alt="Libro de Reclamaciones" onerror="this.src=\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%2270%22><rect width=%22180%22 height=%2270%22 fill=%22%23fff%22/><text x=%2290%22 y=%2240%22 font-family=%22Inter,sans-serif%22 font-size=%2213%22 font-weight=%22700%22 fill=%22%23CC0000%22 text-anchor=%22middle%22>LIBRO DE RECLAMACIONES</text></svg>\'">' +
            '</a>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4>Compañía</h4>' +
            '<ul>' +
              '<li><a href="' + p('pages/nosotros.html') + '">Nosotros</a></li>' +
              '<li><a href="' + p('pages/contacto.html') + '">Contacto</a></li>' +
              '<li><a href="' + p('pages/blog.html') + '">Blog</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4>Ayuda</h4>' +
            '<ul>' +
              '<li><a href="' + p('pages/politica.html') + '">Política de privacidad</a></li>' +
              '<li><a href="' + p('pages/envios.html') + '">Política de envíos</a></li>' +
              '<li><a href="' + p('pages/terminos.html') + '">Términos y condiciones</a></li>' +
              '<li><a href="' + p('pages/reclamaciones.html') + '">Libro de reclamaciones</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4>Síguenos</h4>' +
            '<div class="socials">' +
              '<a href="https://facebook.com" target="_blank" rel="noopener" class="s-fb" aria-label="Facebook">' +
                svg('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', 20, '#fff') + '</a>' +
              '<a href="https://instagram.com" target="_blank" rel="noopener" class="s-ig" aria-label="Instagram">' +
                svg('<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>', 20, '#fff') + '</a>' +
              '<a href="https://youtube.com" target="_blank" rel="noopener" class="s-yt" aria-label="YouTube">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M23 12s0-3.4-.4-5a2.6 2.6 0 0 0-1.8-1.8C19 4.8 12 4.8 12 4.8s-7 0-8.8.4A2.6 2.6 0 0 0 1.4 7C1 8.6 1 12 1 12s0 3.4.4 5a2.6 2.6 0 0 0 1.8 1.8c1.8.4 8.8.4 8.8.4s7 0 8.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-5 .4-5zM9.8 15.3V8.7l5.7 3.3z"/></svg></a>' +
              '<a href="https://tiktok.com" target="_blank" rel="noopener" class="s-tk" aria-label="TikTok">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M16 2c.3 2.3 1.6 3.9 3.8 4.2v3c-1.4.1-2.7-.3-3.8-1v6.7c0 4-3.5 6.6-7 5.3-2.4-.9-3.4-3.6-2.6-6 .7-2 2.6-3.2 4.7-3v3.1c-.4-.1-.8-.1-1.2 0-1 .3-1.6 1.3-1.3 2.3.3 1.2 1.9 1.6 2.9.7.5-.4.7-1 .7-1.7V2z"/></svg></a>' +
            '</div>' +
          '</div>' +

        '</div>' +
        '<div class="footer__bottom">© ' + new Date().getFullYear() + ' ComuniK2 Perú. Todos los derechos reservados.</div>' +
      '</footer>'
    );
  }

  /* ---------------------- WhatsApp flotante ---------------------- */
  function waFloatHTML() {
    return (
      '<a class="wa-float" href="https://wa.me/' + WA + '" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">' +
        waIcon(30, '#fff') +
      '</a>'
    );
  }

  /* ---------------------- Helpers SVG ---------------------- */
  function svg(inner, size, color) {
    size = size || 22;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  function waIcon(size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + (color || 'currentColor') + '"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.255l-.999 3.648 3.978-1.602zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.695.247-1.29.173-1.414z"/></svg>';
  }
  function helpRow(icon, label, value) {
    return '<div class="help__row">' + icon + '<div><strong>' + label + '</strong>' + value + '</div></div>';
  }
  function closeIcon() { return svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 22); }
  function chev() { return svg('<polyline points="9 18 15 12 9 6"/>', 16, 'var(--gray-500)'); }

  /* ---------------------- Inyección ---------------------- */
  function injectHeader() {
    var host = document.getElementById('site-header');
    if (host) host.innerHTML = headerHTML();
  }
  function injectFooter() {
    var host = document.getElementById('site-footer');
    if (host) host.innerHTML = footerHTML();
    // Botón flotante (una sola vez)
    if (!document.querySelector('.wa-float')) {
      var wrap = document.createElement('div');
      wrap.innerHTML = waFloatHTML();
      document.body.appendChild(wrap.firstChild);
    }
  }
  

  /* ---------------------- Carga de scripts dependientes ---------------------- */
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb || function () {};
    document.body.appendChild(s);
  }

  function boot() {
    injectHeader();
    injectFooter();
    // Acordeón footer en móvil
    document.querySelectorAll('.footer__col h4').forEach(function(h4) {
      h4.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          h4.parentElement.classList.toggle('open');
        }
      });
    });
    // Cargar cart.js -> ui.js en orden; luego inicializar
    loadScript(p('js/cart.js'), function () {
      loadScript(p('js/ui.js'), function () {
        if (window.CK2 && CK2.cart) CK2.cart.render();
        if (window.CK2 && CK2.initUI) CK2.initUI();
      });
    });
  }

  // Exponer por si se quieren llamar manualmente
  window.injectHeader = injectHeader;
  window.injectFooter = injectFooter;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
