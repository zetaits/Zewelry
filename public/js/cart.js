// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCart() {
  return [...cart]; // Return a copy to prevent direct modification
}

export function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const { id, name, price, images } = product; // Ensure images are correctly passed
    cart.push({ id, name, price, images, quantity: 1 });
  }
  saveCart();
  updateCartCountBadge();
  // vibrateCartIcon(); // Called from app.js after this
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCountBadge();
}

export function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function updateCartCountBadge() {
  const count = getCartItemCount();
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
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('pop');
    }
  });
}

export function vibrateCartIcon() {
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.classList.remove('glow');
    void btn.offsetWidth; // Trigger reflow
    btn.classList.add('glow');
  });
}
