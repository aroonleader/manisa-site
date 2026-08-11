let cart = [];

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
});

function filterProducts(category, clickedButton) {
    const cards = document.querySelectorAll('.product-card');
    const title = document.getElementById('products-title');
    const noResult = document.getElementById('no-result');

    const names = { all: 'همه محصولات', manto: 'مانتو', pirahan: 'پیراهن', shomiz: 'شومیز', set: 'کت و شلوار' };
    if (title) title.textContent = names[category];

    document.querySelectorAll('.cat-item').forEach(btn => btn.classList.remove('active'));
    if (clickedButton) clickedButton.classList.add('active');

    let count = 0;
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hide');
            card.classList.add('visible');
            count++;
        } else {
            card.classList.add('hide');
        }
    });

    if (noResult) noResult.style.display = count === 0 ? 'block' : 'none';
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('.cat-item').forEach(btn => {
    btn.addEventListener('click', function() {
        filterProducts(this.dataset.category, this);
    });
});

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
    updateCartUI();
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('open')) toggleCart();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if (!countEl || !container || !totalEl) return;

    countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';
        totalEl.textContent = '۰ تومان';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `<img src="${item.image}" alt="${item.name}"><div class="cart-item-details"><h4>${item.name}</h4><div class="item-meta">سایز: ${item.size} | تعداد: ${item.quantity}</div><div class="item-price">${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</div></div><button class="remove-item-btn" onclick="removeFromCart(${index})">✕</button>`;
        container.appendChild(row);
    });
    totalEl.textContent = total.toLocaleString('fa-IR') + ' تومان';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkoutToWhatsApp() {
    if (cart.length === 0) { alert('سبد خرید خالی است.'); return; }
    let msg = '🛍️ سفارش جدید از سایت A&B\n\n';
    let total = 0;
    cart.forEach((item, i) => {
        const t = item.price * item.quantity;
        total += t;
        msg += `${i+1}. ${item.name}\nسایز: ${item.size} | تعداد: ${item.quantity}\nقیمت: ${t.toLocaleString('fa-IR')} تومان\n\n`;
    });
    msg += `━━━━━━━━━━━━━━━━\n💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان\n\nلطفاً راهنمایی کنید. `;
    window.location.href = 'https://web.whatsapp.com/send?phone=989385734170&text=' + encodeURIComponent(msg);
}

const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (modal && e.target === modal) modal.style.display = 'none';
});
