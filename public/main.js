let cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadCartModal(callback) {
  fetch('cart.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('cartContainer').innerHTML = html;
      updateCartUI();
      attachCartBtnListeners();
      const closeBtn = document.querySelector('#cartModal button[aria-label="Close cart"]');
      if (closeBtn) closeBtn.onclick = e => { e.preventDefault(); toggleCart(); };
      if (typeof callback === 'function') callback();
    })
    .catch(console.error);
}

function attachCartBtnListeners() {
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      const modal = document.getElementById('cartModal');
      if (!modal) {
        loadCartModal(() => {
          const modalNow = document.getElementById('cartModal');
          if (modalNow) {
            modalNow.classList.add('active');
            updateCartUI();
          }
        });
      } else {
        modal.classList.add('active');
        updateCartUI();
      }
    };
  });
  updateCartCountBadge();
}

window.addEventListener('DOMContentLoaded', () => {
  loadCartModal();
});

function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('active');
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    // Solo copia las propiedades necesarias
    const { id, name, price, images } = product;
    cart.push({ id, name, price, images, quantity: 1 });
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalContainer = document.getElementById('cartTotal');
  updateCartCountBadge();

  if (!cartItemsContainer || !cartTotalContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalContainer.textContent = '';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.style.flexWrap = 'nowrap';
    // Trunca solo el nombre, nunca la cantidad
    const maxLen = 16;
    let displayName = item.name;
    if (item.name.length > maxLen) {
      displayName = item.name.slice(0, maxLen) + '...';
    }
    // Busca la imagen principal si existe
    let imgSrc = '';
    if (item.images && item.images.length > 0) {
      imgSrc = item.images[0];
    }
    itemDiv.innerHTML = `
      ${imgSrc ? `<img src="${imgSrc}" class="cart-img" alt="${item.name}" />` : ''}
      <span class="cart-item-name" title="${item.name}">${displayName}</span>
      <span class="cart-item-qty">x${item.quantity}</span>
      <span style="white-space:nowrap;">${(item.price * item.quantity).toFixed(2)} €</span>
      <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove product">×</button>
    `;
    cartItemsContainer.appendChild(itemDiv);

    // Animación de fade-in para la imagen
    const img = itemDiv.querySelector('.cart-img');
    if (img) {
      img.onload = () => img.classList.add('loaded');
      // Si la imagen ya está cacheada
      if (img.complete) img.classList.add('loaded');
    }
  });

  cartItemsContainer.querySelectorAll('button[data-id]').forEach(btn => {
    btn.onclick = () => removeFromCart(Number(btn.dataset.id));
  });

  cartTotalContainer.textContent = 'Total: ' + total.toFixed(2) + ' €';
}

function updateCartCountBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-btn').forEach(btn => {
    let badge = btn.querySelector('.cart-count-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count-badge';
      btn.appendChild(badge);
    }
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}