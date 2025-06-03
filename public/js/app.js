// app.js
import { addToCart as addToCartInternal, updateCartCountBadge, vibrateCartIcon } from './cart.js';
import { openCartDrawer, setupCartDrawerEventListeners, renderCartDrawer } from './ui/cartDrawer.js';

// Expose addToCart to global scope for HTML onclick attributes
window.addToCart = (productData) => {
    addToCartInternal(productData);
    vibrateCartIcon();
    openCartDrawer();
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartCountBadge();
  setupCartDrawerEventListeners();
  renderCartDrawer();

  // This makes sure that products.js is loaded and window.products is available
  // if product pages rely on it for addToCart calls.
  // The actual products.js script tag should ideally be present in HTML pages that need it.
  // Or, product data could be imported if products.js also becomes a module.
});
