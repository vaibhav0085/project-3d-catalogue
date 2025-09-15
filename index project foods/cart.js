// Cart functionality
let cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const subtotalElement = document.querySelector('.subtotal');
const taxElement = document.querySelector('.tax');
const totalElement = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const cartSummary = document.querySelector('.cart-summary');

// Modal logic for checkout
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal');
const deliveryForm = document.getElementById('deliveryForm');

// Modal logic for order confirmation
const orderConfirmationModal = document.getElementById('order-confirmation-modal');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');

// Initialize cart from localStorage
function initializeCart() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
        renderCart();
    }
}

// Render cart items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class='bx bx-cart'></i>
                <p>Your cart is empty</p>
                <a href="index.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    if (cartSummary) cartSummary.style.display = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <button class="remove-btn" data-index="${index}">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add remove button event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
        });
    });

    updateCartSummary();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Animate removal
    const cartItem = document.querySelectorAll('.cart-item')[index];
    cartItem.classList.add('removing');
    setTimeout(() => {
        renderCart();
    }, 300);
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.classList.add('bounce');
    setTimeout(() => {
        cartCount.classList.remove('bounce');
    }, 300);
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Animate price changes
    [subtotalElement, taxElement, totalElement].forEach(element => {
        element.classList.add('price-update');
        setTimeout(() => {
            element.classList.remove('price-update');
        }, 300);
    });
}

// Checkout button click handler
if (checkoutBtn && checkoutModal && closeModalBtn && deliveryForm) {
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        checkoutModal.style.display = 'block';
    });
    closeModalBtn.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });
    deliveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkoutModal.style.display = 'none';
        if (orderConfirmationModal) {
            orderConfirmationModal.style.display = 'block';
        }
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        renderCart();
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', initializeCart);

// Continue shopping button click handler
if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
} 