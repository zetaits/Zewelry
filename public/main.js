let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Drawer logic ---
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    renderCartDrawer();
  }
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}
function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartDrawerItems');
  const totalContainer = document.getElementById('cartDrawerTotal');
  if (!itemsContainer || !totalContainer) return;
  itemsContainer.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div style="color:#bbb;text-align:center;margin:40px 0 0 0;font-size:1.1rem;">Your cart is empty.</div>`;
    totalContainer.textContent = '0.00 €';
    return;
  }
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-drawer-item';
    // Truncar nombre y tooltip
    let displayName = item.name;
    let tooltip = '';
    if (item.name.length > 18) {
      displayName = item.name.slice(0, 18) + '…';
      tooltip = item.name;
    }
    let imgSrc = (item.images && item.images[0]) ? item.images[0] : '';
    div.innerHTML = `
      <img src="${imgSrc}" class="cart-drawer-img" alt="${item.name}" />
      <div class="cart-drawer-info">
        <span class="cart-drawer-name"${tooltip ? ` title="${tooltip}"` : ''}>${displayName}</span>
        <div class="cart-drawer-qty-price">
          <span class="cart-drawer-qty">x${item.quantity}</span>
          <span class="cart-drawer-price">${(item.price * item.quantity).toFixed(2)} €</span>
        </div>
      </div>
      <button class="cart-drawer-remove-btn" aria-label="Remove" data-id="${item.id}">&times;</button>
    `;
    // Imagen fade-in
    const img = div.querySelector('.cart-drawer-img');
    if (img) {
      img.onload = () => img.classList.add('loaded');
      if (img.complete) img.classList.add('loaded');
    }
    // Eliminar producto
    div.querySelector('.cart-drawer-remove-btn').onclick = () => {
      removeFromCart(item.id);
      renderCartDrawer();
    };
    itemsContainer.appendChild(div);
  });
  totalContainer.textContent = total.toFixed(2) + ' €';
}

// --- Drawer events ---
function setupCartDrawerEvents() {
  // Botón X
  const closeBtn = document.querySelector('.cart-drawer-close-btn');
  if (closeBtn) closeBtn.onclick = closeCartDrawer;
  // Overlay click
  const overlay = document.getElementById('cartDrawerOverlay');
  if (overlay) overlay.onclick = closeCartDrawer;
  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
  });
  // Checkout
  const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.onclick = async function() {
      const cartItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: (item.images && item.images[0]) || ''
      }));
      const res = await fetch('http://localhost:4242/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session');
      }
    };
  }
}

// --- Cart icon logic ---
function vibrateCartIcon() {
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.classList.remove('glow');
    void btn.offsetWidth;
    btn.classList.add('glow');
  });
}

// --- Cart badge ---
function updateCartCountBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-btn').forEach(btn => {
    let badge = btn.querySelector('.cart-count-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count-badge';
      btn.appendChild(badge);
    }
    const prev = badge.textContent;
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
    if (count > 0 && prev !== String(count)) {
      badge.classList.remove('pop');
      void badge.offsetWidth;
      badge.classList.add('pop');
    }
  });
}

// --- Add to cart ---
function addToCart(product, onAdd) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    const { id, name, price, images } = product;
    cart.push({ id, name, price, images, quantity: 1 });
  }
  saveCart();
  updateCartCountBadge();
  vibrateCartIcon();
  // UX: abrir drawer si está cerrado
  openCartDrawer();
  if (typeof onAdd === 'function') onAdd();
}

// --- Remove ---
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCountBadge();
  renderCartDrawer();
}

// --- Save/load ---
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// --- Inicialización ---
window.addEventListener('DOMContentLoaded', () => {
  updateCartCountBadge();
  setupCartDrawerEvents();
  renderCartDrawer();
  // Cart icon abre drawer
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      openCartDrawer();
    };
  });
});

/* Elimina/ignora funciones del modal antiguo:
function loadCartModal(callback) {...}
function attachCartBtnListeners() {...}
function toggleCart() {...}
function updateCartUI() {...}
*/