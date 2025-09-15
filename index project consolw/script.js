const imgSlider = document.querySelector('.img-slider');
const items = document.querySelectorAll('.item');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');

const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

let colors = ['#3674be','#d26181','#ceb13d','#c6414c','#171f2b','#50aa61'];

let indexSlider = 0;
let index = 0;

const slider = () => {
    imgSlider.style.transform = `rotate(${indexSlider * 60}deg)`;
    
    items.forEach(item => {
        item.style.transform = `rotate(${indexSlider * -60}deg)`;
    });
    
    document.querySelector('.img-item.active').classList.remove('active');
    imgItems[index].classList.add('active');
    
    document.querySelector('.info-item.active').classList.remove('active');
    infoItems[index].classList.add('active');
    
    document.body.style.background = colors[index];
}

nextBtn.addEventListener('click', () => {
    indexSlider++;
    index++;
    if(index > imgItems.length - 1) {
        index = 0;
    }
    slider();
});

prevBtn.addEventListener('click', () => {
    indexSlider--;
    index--;
    if(index < 0) {
        index = imgItems.length - 1;
    }
    slider();
});

// Cart functionality
let cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const subtotalElement = document.querySelector('.subtotal');
const taxElement = document.querySelector('.tax');
const totalElement = document.querySelector('.total');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize cart from localStorage
function initializeCart() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
        renderCart();
    }
}

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: parseFloat(price)
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.classList.add('bounce');
    setTimeout(() => {
        cartCount.classList.remove('bounce');
    }, 300);
}

function renderCart() {
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <span class="price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        updateCartSummary();
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

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

// Close cart dropdown when clicking outside
document.addEventListener('click', function(event) {
    const cartBtn = document.querySelector('.cart-btn');
    const cartDropdown = document.querySelector('.cart-dropdown');
    
    if (!cartBtn.contains(event.target) && cartDropdown) {
        cartDropdown.style.display = 'none';
    }
});

// Toggle cart dropdown
const cartBtn = document.querySelector('.cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        const cartDropdown = this.querySelector('.cart-dropdown');
        if (cartDropdown) {
            cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
        }
    });
}

// Handle checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        // Add your checkout logic here
        showNotification('Proceeding to checkout...');
    });
}

// Add event listeners to buy now buttons
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.dataset.product;
            const price = this.dataset.price;
            addToCart(productName, price);
        });
    });
});