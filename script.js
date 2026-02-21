// spnvisualz 2.0 JavaScript
// Handles cart logic, contact form feedback and dynamic UI updates.

(function () {
  /**
   * Retrieve cart items from localStorage. Returns an array of objects
   * with id, name, price, image and quantity properties.
   */
  function getCart() {
    try {
      const data = localStorage.getItem('cartItems');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not parse cart data', e);
      return [];
    }
  }

  /**
   * Save cart items to localStorage.
   * @param {Array} cart
   */
  function saveCart(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  /**
   * Update the cart icon badge with the total quantity of items.
   */
  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
    }
  }

  /**
   * Add a product to the cart given its dataset attributes.
   * @param {HTMLElement} button
   */
  function addToCart(button) {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    let cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    // Provide a quick visual feedback by temporarily disabling the button
    button.textContent = 'Added';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }, 1000);
  }

  /**
   * Render cart items into the cart page. Builds DOM nodes on the fly.
   */
  function renderCartPage() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    const cart = getCart();
    container.innerHTML = '';
    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'section-intro';
      empty.textContent = 'Your cart is empty. Head back to the products page to add some futuristic gear!';
      container.appendChild(empty);
      return;
    }
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const row = document.createElement('div');
      row.className = 'cart-item';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;

      const details = document.createElement('div');
      details.className = 'cart-item-details';

      const nameEl = document.createElement('div');
      nameEl.className = 'cart-item-name';
      nameEl.textContent = item.name;

      const qtyEl = document.createElement('div');
      qtyEl.className = 'cart-item-quantity';
      qtyEl.textContent = `Quantity: ${item.quantity}`;

      const priceEl = document.createElement('div');
      priceEl.className = 'cart-item-price';
      priceEl.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

      details.appendChild(nameEl);
      details.appendChild(qtyEl);
      details.appendChild(priceEl);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
      });

      row.appendChild(img);
      row.appendChild(details);
      row.appendChild(removeBtn);
      container.appendChild(row);
    });

    // Display total price
    const totalEl = document.createElement('p');
    totalEl.className = 'cart-item-price';
    totalEl.style.textAlign = 'right';
    totalEl.style.marginTop = '1rem';
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
    container.appendChild(totalEl);
  }

  /**
   * Remove an item from the cart by id. If quantity >1, decrement; else remove.
   */
  function removeFromCart(id) {
    let cart = getCart();
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      updateCartCount();
      renderCartPage();
    }
  }

  /**
   * Initialize the site: attach events, update counts and handle page specific logic.
   */
  function init() {
    // Update year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // Update cart count on every page load
    updateCartCount();

    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', () => addToCart(button));
    });

    // Handle cart page rendering
    renderCartPage();

    // Contact form feedback
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      const feedback = document.getElementById('contact-feedback');
      contactForm.addEventListener('submit', () => {
        if (feedback) {
          feedback.hidden = false;
        }
        contactForm.reset();
      });
    }

    // Checkout button handler
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
          alert('Your cart is empty!');
          return;
        }
        alert('Thank you for shopping with us! Checkout is not implemented in this demo.');
        // Clear cart after acknowledging
        localStorage.removeItem('cartItems');
        updateCartCount();
        renderCartPage();
      });
    }
  }

  // Run init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
