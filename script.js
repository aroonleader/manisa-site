// ۱. مدیریت لودر (Preloader)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500); // زمان نمایش لودر
});

// دیتابیس سبد خرید
let cart = [];
let activeProductInModal = null;

// . سبد خرید کشویی
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// . منوی موبایل
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

// ۴. اضافه کردن مستقیم به سبد
function addToCartDirect(name, price, img) {
    const defaultSize = "M";
    const existingItem = cart.find(item => item.name === name && item.size === defaultSize);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, size: defaultSize, quantity: 1 });
    }
    
    updateCartUI();
    toggleCart();
}

// ۵. باز کردن مودال محصول
function openProductModal(id, name, priceFormatted, imgPath) {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
    
    document.getElementById('modal-img').src = imgPath;
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = priceFormatted + ' تومان';
    
    const priceRaw = parseInt(priceFormatted.replace(/,/g, ''));
    activeProductInModal = { name, price: priceRaw, img: imgPath, size: 'M' };

    document.querySelectorAll('.size-opt').forEach(opt => {
        opt.classList.remove('active');
        if(opt.innerText === 'M') opt.classList.add('active');
    });
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function selectSize(element) {
    document.querySelectorAll('.size-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    if (activeProductInModal) {
        activeProductInModal.size = element.innerText;
    }
}

function addToCartFromModal() {
    if (!activeProductInModal) return;
    
    const existingItem = cart.find(item => item.name === activeProductInModal.name && item.size === activeProductInModal.size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...activeProductInModal, quantity: 1 });
    }
    
    closeProductModal();
    updateCartUI();
    toggleCart();
}

// ۶. به‌روزرسانی ظاهر سبد خرید
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';
        totalPriceElement.innerText = '۰ تومان';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        
        const row = document.createElement('div');
        row.classList.add('cart-item-row');
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
    
    totalPriceElement.innerText = totalPrice.toLocaleString() + ' تومان';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkoutAlert() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است.');
        return;
    }
    alert('سفارش شما با موفقیت ثبت شد! به زودی جهت هماهنگی با شما تماس می‌گیریم. ');
    cart = [];
    updateCartUI();
    toggleCart();
}

// . افکت‌های اسکرول هدر و انیمیشن‌ها
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});