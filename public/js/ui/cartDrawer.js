// ui/cartDrawer.js
import { getCart, removeFromCart as removeFromCartData, getCartTotal } from '../cart.js';
import { createStripeCheckoutSession } from '../services/stripeService.js';

const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('cartDrawerOverlay');
const itemsContainer = document.getElementById('cartDrawerItems');
const totalContainer = document.getElementById('cartDrawerTotal');
const closeBtn = document.querySelector('.cart-drawer-close-btn');
const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');

export function openCartDrawer() {
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    renderCartDrawer();
  }
}

export function closeCartDrawer() {
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

export function renderCartDrawer() {
  if (!itemsContainer || !totalContainer) return;

  const currentCart = getCart();
  itemsContainer.innerHTML = '';
  // let total = 0; // Total is now calculated by getCartTotal

  if (currentCart.length === 0) {
    itemsContainer.innerHTML = `<div style="color:#bbb;text-align:center;margin:40px 0 0 0;font-size:1.1rem;">Your cart is empty.</div>`;
    totalContainer.textContent = '0.00 €';
    return;
  }

  currentCart.forEach(item => {
    // total += item.price * item.quantity; // Total is now calculated by getCartTotal
    const div = document.createElement('div');
    div.className = 'cart-drawer-item';

    let displayName = item.name;
    let tooltip = '';
    if (item.name.length > 18) {
      displayName = item.name.slice(0, 18) + '…';
      tooltip = item.name;
    }

    let imgSrc = item.images && item.images[0] ? item.images[0] : '';
    // Adjust path if necessary, assuming assets are relative to root.
    // Modules in js/ui/ need to go up two levels for root assets.
    if (imgSrc && !imgSrc.startsWith('/')) { // If not already root relative
        if (imgSrc.startsWith('assets/')) {
             imgSrc = '../../' + imgSrc; // from public/js/ui/ to public/ then assets/
        } else {
            // Fallback for unknown relative paths, may need adjustment
             imgSrc = '../../assets/' + imgSrc;
        }
    }


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

    const img = div.querySelector('.cart-drawer-img');
    if (img) {
      img.onload = () => img.classList.add('loaded');
      if (img.complete) img.classList.add('loaded');
    }

    div.querySelector('.cart-drawer-remove-btn').onclick = () => {
      removeFromCartData(item.id);
      renderCartDrawer();
    };
    itemsContainer.appendChild(div);
  });
  totalContainer.textContent = getCartTotal().toFixed(2) + ' €';
}

function handleCheckout() {
  const cartItems = getCart().map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: (item.images && item.images[0]) ? item.images[0] : ''
  }));
  createStripeCheckoutSession(cartItems);
}

export function setupCartDrawerEventListeners() {
  if (closeBtn) closeBtn.onclick = closeCartDrawer;
  if (overlay) overlay.onclick = closeCartDrawer;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeCartDrawer();
    }
  });
  if (checkoutBtn) checkoutBtn.onclick = handleCheckout;

  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openCartDrawer();
    };
  });
}
