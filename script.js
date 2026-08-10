// لودر
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }, 1200);
});

let cart = [];
let activeProductInModal = null;

// ===== فیلتر محصولات =====
function filterProducts(category, element) {
    const cards = document.querySelectorAll('.product-card');
    const title = document.getElementById('products-title');
    const noResult = document.getElementById('no-result');
    
    const names = {
        'all': 'همه محصولات',
        'manto': 'مانتو',
        'pirahan': 'پیراهن',
        'shomiz': 'شومیز',
        'set': 'کت و شلوار'
    };
    
    title.innerText = names[category] || 'محصولات';
    
    document.querySelectorAll('.cat-item').forEach(item => item.classList.remove('active'));
    if (element && element.classList.contains('cat-item')) {
        element.classList.add('active');
    } else {
        document.querySelectorAll('.cat-item').forEach(item => {
            if (item.innerText.trim() === names[category]) item.classList.add('active');
        });
    }
    
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
    
    noResult.style.display = count === 0 ? 'block' : 'none';
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ===== سبد خرید =====
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
}

function addToCartDirect(name, price, img) {
    const existing = cart.find(i => i.name === name && i.size === 'M');
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, img, size: 'M', quantity: 1 });
    updateCartUI();
    toggleCart();
}

function openProductModal(name, priceFormatted, imgPath) {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
    document.getElementById('modal-img').src = imgPath;
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = priceFormatted + ' تومان';
    
    let cleanPrice = priceFormatted.replace(/[^\d]/g, '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    
    activeProductInModal = { name, price: parseInt(cleanPrice), img: imgPath, size: 'M' };
    
    document.querySelectorAll('.size-opt').forEach(o => {
        o.classList.remove('active');
        if (o.innerText === 'M') o.classList.add('active');
    });
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function selectSize(el) {
    document.querySelectorAll('.size-opt').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    if (activeProductInModal) activeProductInModal.size = el.innerText;
}

function addToCartFromModal() {
    if (!activeProductInModal) return;
    const p = activeProductInModal;
    const existing = cart.find(i => i.name === p.name && i.size === p.size);
    if (existing) existing.quantity += 1;
    else cart.push({ ...p, quantity: 1 });
    closeProductModal();
    updateCartUI();
    toggleCart();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    countEl.innerText = cart.reduce((s, i) => s + i.quantity, 0);
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';
        totalEl.innerText = '۰ تومان';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-meta">سایز: ${item.size} | تعداد: ${item.quantity}</div>
                <div class="item-price">${(item.price * item.quantity).toLocaleString()} تومان</div>
            </div>
            <span class="remove-item-btn" onclick="removeFromCart(${index})">✕</span>
        `;
        container.appendChild(row);
    });
    
    totalEl.innerText = total.toLocaleString() + ' تومان';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ===== ارسال سفارش به واتساپ =====
function checkoutToWhatsApp() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است.');
        return;
    }
    
    let message = '🛍️ *سفارش جدید از سایت A&B*\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        message += `${index + 1}. ${item.name}\n`;
        message += `   سایز: ${item.size} | تعداد: ${item.quantity}\n`;
        message += `   ${itemTotal.toLocaleString()} تومان\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *جمع کل: ${total.toLocaleString()} تومان*\n\n`;
    message += 'لطفاً برای تکمیل سفارش راهنمایی کنید. 🙏';
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '989385734170';
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// هدر و انیمیشن
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
