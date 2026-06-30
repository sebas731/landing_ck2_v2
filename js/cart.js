/* ============================================================
   COMUNIK2 — Carrito (localStorage) + datos de producto
   Expone window.CK2 con la API del carrito.
   ============================================================ */
(function () {
  'use strict';

  // Prefijo de ruta: las páginas dentro de /pages/ necesitan "../"
  var ROOT = location.pathname.indexOf('/pages/') !== -1 ? '../' : '';

  var WA_NUMBER = '51999999999';
  var STORAGE_KEY = 'ck2_cart';

  // -------- Catálogo (fuente única de la verdad) --------
  var PRODUCTS = {
    gris: {
      id: 'gris',
      name: 'Silla Ergonómica ComuniK2 — Gris',
      price: 599.0,
      oldPrice: 899.0,
      image: ROOT + 'images/productos/gris/thumbnail.jpeg',
      url: ROOT + 'pages/producto-gris.html',
      color: 'Gris',
      soldOut: false
    },
    negro: {
      id: 'negro',
      name: 'Silla Ergonómica ComuniK2 — Negro',
      price: 649.0,
      oldPrice: 949.0,
      image: ROOT + 'images/productos/negro/thumbnail.jpeg',
      url: ROOT + 'pages/producto-negro.html',
      color: 'Negro',
      soldOut: false
    }
  };

  // -------- Estado --------
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  var cart = load();

  // -------- Helpers --------
  function money(n) {
    return 'S/. ' + Number(n).toFixed(2);
  }
  function count() {
    return cart.reduce(function (s, i) { return s + i.qty; }, 0);
  }
  function total() {
    return cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0);
  }
  function find(id) {
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i];
    return null;
  }

  // -------- Acciones --------
  function add(id, qty) {
    var p = PRODUCTS[id];
    if (!p || p.soldOut) return;
    qty = qty || 1;
    var existing = find(id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        url: p.url,
        color: p.color,
        qty: qty
      });
    }
    save(cart);
    render();
    open();
    bump();
  }

  function setQty(id, qty) {
    var item = find(id);
    if (!item) return;
    item.qty = qty;
    if (item.qty <= 0) remove(id);
    else { save(cart); render(); }
  }

  function remove(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    save(cart);
    render();
  }

  function clear() {
    cart = [];
    save(cart);
    render();
  }

  // -------- WhatsApp --------
  function whatsappMessage() {
    var lines = ['Hola, quiero hacer un pedido:'];
    cart.forEach(function (i) {
      lines.push('• ' + i.name + ' x' + i.qty + ' — ' + money(i.price * i.qty));
    });
    lines.push('Total: ' + money(total()));
    lines.push('Ver producto: ' + (cart.length ? absUrl(cart[0].url) : location.href));
    lines.push('¿Tienen stock disponible?');
    return lines.join('\n');
  }

  function absUrl(rel) {
    var a = document.createElement('a');
    a.href = rel;
    return a.href;
  }

  function checkout() {
    if (!cart.length) return;
    var msg = encodeURIComponent(whatsappMessage());
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
    clear();
    if (window.CK2 && CK2.closeCart) CK2.closeCart();
  }

  // -------- Render --------
  function bump() {
    var btn = document.querySelector('.cart-btn');
    if (!btn) return;
    btn.style.transform = 'scale(1.18)';
    setTimeout(function () { btn.style.transform = ''; }, 180);
  }

  function render() {
    // Contador
    var counters = document.querySelectorAll('.cart-count');
    var c = count();
    counters.forEach(function (el) {
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });

    // Lista
    var list = document.getElementById('cart-items');
    if (!list) return;

    if (!cart.length) {
      list.innerHTML =
        '<div class="cart__empty">' +
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>' +
        '<p>Tu carrito está vacío</p></div>';
    } else {
      list.innerHTML = cart.map(itemHTML).join('');
    }

    var foot = document.getElementById('cart-foot');
    if (foot) foot.style.display = cart.length ? 'block' : 'none';

    var totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = money(total());
  }

  function itemHTML(i) {
    return (
      '<div class="cart-item" data-id="' + i.id + '">' +
        '<img class="cart-item__img" src="' + i.image + '" alt="' + i.name + '" onerror="this.style.opacity=.3">' +
        '<div>' +
          '<div class="cart-item__name">' + i.name + '</div>' +
          '<div class="cart-item__color">Color: ' + i.color + '</div>' +
          '<div class="cart-item__price">' + money(i.price) + '</div>' +
          '<div class="cart-item__qty">' +
            '<button data-act="dec" aria-label="Quitar uno">−</button>' +
            '<span>' + i.qty + '</span>' +
            '<button data-act="inc" aria-label="Agregar uno">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item__remove" data-act="remove" aria-label="Eliminar">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>' +
        '</button>' +
      '</div>'
    );
  }

  // -------- Apertura sidebar (lo conecta ui.js) --------
  function open() { if (window.CK2 && CK2.openCart) CK2.openCart(); }

  // -------- Delegación de eventos en la lista --------
  document.addEventListener('click', function (e) {
    var itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var id = itemEl.getAttribute('data-id');
    var item = find(id);
    if (!item) return;
    var act = btn.getAttribute('data-act');
    if (act === 'inc') setQty(id, item.qty + 1);
    else if (act === 'dec') setQty(id, item.qty - 1);
    else if (act === 'remove') remove(id);
  });

  // -------- API pública --------
  window.CK2 = window.CK2 || {};
  CK2.ROOT = ROOT;
  CK2.WA_NUMBER = WA_NUMBER;
  CK2.PRODUCTS = PRODUCTS;
  CK2.money = money;
  CK2.cart = {
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    checkout: checkout,
    count: count,
    total: total,
    render: render
  };

  // Render inicial cuando el DOM (y el carrito inyectado) estén listos
  document.addEventListener('DOMContentLoaded', render);
  // Y de nuevo tras inyectar componentes
  CK2._renderCart = render;
})();
