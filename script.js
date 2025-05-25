// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto slide change every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide when hovering over slider
const slider = document.querySelector('.slider');
slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

slider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Shopping Cart Functionality
let cartCount = 0;
const cartButtons = document.querySelectorAll('.add-to-cart');
const cartDisplay = document.querySelector('.cart-count');

cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.getAttribute('data-product');
        const price = button.getAttribute('data-price');
        
        cartCount++;
        cartDisplay.textContent = cartCount;
        
        // Animation for feedback
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1000);
        
        // In a real app, you would add to a cart array
        console.log(`Added ${product} for $${price} to cart`);
    });
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email && email.includes('@')) {
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        } else {
            alert('Please enter a valid email address');
        }
    });
}

// Form Validation (for contact.html)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields!');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email!');
            return;
        }

        alert('Thank you! We will contact you soon.');
        contactForm.reset();
    });
}

// Add animation to elements when scrolling
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.featured, .testimonial, .newsletter');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.featured, .testimonial, .newsletter');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger first check
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Shopping Cart
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.deliveryFee = 5.00;
        this.init();
    }

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
            this.calculateTotal();
        }

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Cart icon click
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');

        if (cartIcon && cartSidebar) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.add('active');
                this.renderCart();
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const product = {
                    name: e.target.dataset.product,
                    price: parseFloat(e.target.dataset.price),
                    quantity: 1
                };
                this.addItem(product);
            }
        });

        // Clear cart button
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(product);
        }
        this.updateCart();
        this.showNotification(`${product.name} added to cart`);
    }

    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.updateCart();
    }

    updateQuantity(productName, quantity) {
        const item = this.items.find(item => item.name === productName);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productName);
            }
            this.updateCart();
        }
    }

    clearCart() {
        this.items = [];
        this.updateCart();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    updateCart() {
        this.calculateTotal();
        this.updateCartCount();
        this.renderCart();
        this.saveCart();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = itemCount;
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');

        if (cartItems) {
            cartItems.innerHTML = '';
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="0" 
                            onchange="cart.updateQuantity('${item.name}', this.value)">
                        <button onclick="cart.removeItem('${item.name}')">&times;</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            if (cartSubtotal) cartSubtotal.textContent = `$${this.total.toFixed(2)}`;
            if (cartTotal) cartTotal.textContent = `$${(this.total + this.deliveryFee).toFixed(2)}`;
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty');
            return;
        }

        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.style.display = 'block';
            this.renderCheckoutItems();
        }
    }

    renderCheckoutItems() {
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');
        
        if (checkoutItems) {
            checkoutItems.innerHTML = this.items.map(item => `
                <div class="checkout-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = `$${(this.total + this.deliveryFee).toFixed(2)}`;
        }
    }
}

// Product Filters
const initializeFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter products
            products.forEach(product => {
                if (filter === 'all' || product.dataset.category === filter) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
};

// Form Handling
const initializeForms = () => {
    // Custom Order Form
    const customOrderForm = document.getElementById('custom-order-form');
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('Thank you for your inquiry. We will contact you shortly!');
            customOrderForm.reset();
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically process the payment and send the order to your server
            alert('Thank you for your order! We will process it shortly.');
            cart.clearCart();
            checkoutForm.reset();
            document.getElementById('checkout-modal').style.display = 'none';
        });
    }
};

// Modal Handling
const initializeModals = () => {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
};

// Payment Integration
const initializePayment = () => {
    if (typeof Stripe !== 'undefined') {
        const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key
        const elements = stripe.elements();
        const card = elements.create('card');
        
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
            card.mount('#card-element');
            
            card.addEventListener('change', ({error}) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
    }
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    window.cart = new ShoppingCart();
    initializeFilters();
    initializeForms();
    initializeModals();
    initializePayment();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});