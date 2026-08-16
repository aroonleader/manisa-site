// ========== متغیرهای سراسری ==========
let cart = [];
let currentProduct = null;
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
const ITEMS_PER_PAGE = 5;
const FREE_SHIPPING_THRESHOLD = 2000000;

// ========== پری‌لودر ==========
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }

    loadCart();
    applyView();
    initScrollAnimations();
    initBackToTop();
});

// ========== فیلتر، جستجو و مرتب‌سازی ==========
function filterProducts(category, clickedButton) {
    currentCategory = category;
    currentPage = 1;

    const title = document.getElementById('products-title');
    const names = { all: 'همه محصولات', manto: 'مانتو', pirahan: 'پیراهن', shomiz: 'شومیز', set: 'کت و شلوار' };
    if (title) title.textContent = names[category];

    document.querySelectorAll('.cat-item').forEach(btn => btn.classList.remove('active'));
    if (clickedButton) clickedButton.classList.add('active');

    applyView();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

function searchProducts() {
    const input = document.getElementById('search-input');
    currentSearch = input ? input.value.trim().toLowerCase() : '';
    currentPage = 1;
    applyView();
}

function sortProducts() {
    const select = document.getElementById('sort-select');
    currentSort = select ? select.value : 'default';
    currentPage = 1;
    applyView();
}

document.querySelectorAll('.cat-item').forEach(btn => {
    btn.addEventListener('click', function() {
        filterProducts(this.dataset.category, this);
    });
});

// ========== صفحه‌بندی و نمایش ==========
function applyView() {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    const noResult = document.getElementById('no-result');

    // فیلتر بر اساس دسته‌بندی و جستجو
    let filtered = cards.filter(card => {
        const matchCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
        const matchSearch = !currentSearch || card.dataset.name.toLowerCase().includes(currentSearch);
        return matchCategory && matchSearch;
    });

    // مرتب‌سازی
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
    } else if (currentSort === 'name') {
        filtered.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, 'fa'));
    }

    // صفحه‌بندی
    let totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    cards.forEach(card => {
        card.style.display = 'none';
        card.classList.add('hide');
        card.classList.remove('visible');
    });

    filtered.forEach((card, index) => {
        if (index >= start && index < end) {
            card.style.display = '';
            card.classList.remove('hide');
            card.classList.add('visible');
        }
    });

    if (noResult) noResult.style.display = filtered.length === 0 ? 'block' : 'none';

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;

    container.innerHTML = '';

    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }
    container.style.display = 'flex';

    const prev = document.createElement('button');
    prev.className = 'page-btn nav';
    prev.textContent = 'قبلی';
    prev.disabled = (currentPage === 1);
    prev.onclick = function() { goToPage(currentPage - 1); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i.toLocaleString('fa-IR');
        btn.onclick = function() { goToPage(i); };
        container.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn nav';
    next.textContent = 'بعدی';
    next.disabled = (currentPage === totalPages);
    next.onclick = function() { goToPage(currentPage + 1); };
    container.appendChild(next);
}

function goToPage(page) {
    currentPage = page;
    applyView();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

// ========== سبد خرید ==========
function toggleCart() {
    document.getElementById('cart-sidebar')?.classList.toggle('open');
    document.getElementById('cart-overlay')?.classList.toggle('open');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu')?.classList.toggle('active');
}

function addToCartDirect(name, price, image) {
    const existing = cart.find(i => i.name === name && i.size === 'M');
    if (existing) existing.quantity++;
    else cart.push({ name, price, image, size: 'M', quantity: 1 });

    saveCart();
    updateCartUI();
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if (!countEl || !container || !totalEl) return;

    countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0).toLocaleString('fa-IR');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';
        totalEl.textContent = '۰ تومان';
        updateShippingProgress(0);
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-meta">سایز: ${item.size} | تعداد: ${item.quantity}</div>
                <div class="item-price">${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})">✕</button>
        `;
        container.appendChild(row);
    });

    totalEl.textContent = total.toLocaleString('fa-IR') + ' تومان';
    updateShippingProgress(total);
}

function updateShippingProgress(total) {
    const messageEl = document.getElementById('shipping-message');
    const fillEl = document.getElementById('progress-fill');
    if (!messageEl || !fillEl) return;

    if (total >= FREE_SHIPPING_THRESHOLD) {
        messageEl.textContent = '🎉 تبریک! ارسال سفارش شما رایگان است!';
        messageEl.style.color = '#4ade80';
        fillEl.style.width = '100%';
    } else {
        const remaining = FREE_SHIPPING_THRESHOLD - total;
        const percentage = (total / FREE_SHIPPING_THRESHOLD) * 100;
        messageEl.textContent = `${remaining.toLocaleString('fa-IR')} تومان دیگه خرید کن تا ارسال رایگان بشه!`;
        messageEl.style.color = 'var(--gold-color)';
        fillEl.style.width = percentage + '%';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('ab_cart', JSON.stringify(cart));
}

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem('ab_cart')) || [];
    } catch (e) {
        cart = [];
    }
    updateCartUI();
}

function checkoutToWhatsApp() {
    if (cart.length === 0) { alert('سبد خرید خالی است.'); return; }

    let msg = '🛍️ سفارش جدید از سایت A&B\n\n';
    let total = 0;
    cart.forEach((item, i) => {
        const t = item.price * item.quantity;
        total += t;
        msg += `${i + 1}. ${item.name}\nسایز: ${item.size} | تعداد: ${item.quantity}\nقیمت: ${t.toLocaleString('fa-IR')} تومان\n\n`;
    });
    msg += `━━━━━━━━━━━━━━━━\n💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان\n\nلطفاً راهنمایی کنید.`;

    window.location.href = 'https://wa.me/989385734170?text=' + encodeURIComponent(msg);
}

// ========== انیمیشن اسکرول ==========
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-section, .contact-section, .testimonials-section, .features-strip').forEach(el => {
        observer.observe(el);
    });
}

// ========== دکمه بازگشت به بالا ==========
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== هدر هنگام اسکرول ==========
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (modal && e.target === modal) modal.style.display = 'none';
});
