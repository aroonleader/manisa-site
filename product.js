let currentProduct = null;
let selectedSize = 'M';
let quantity = 1;

/* لود اطلاعات محصول از URL */
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    currentProduct = getProductById(productId);

    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }

    loadProductDetail();
    loadRelatedProducts();
});

/* لود جزئیات محصول */
function loadProductDetail() {
    document.getElementById('detail-image').src = currentProduct.image;
    document.getElementById('detail-category').textContent = getCategoryName(currentProduct.category);
    document.getElementById('detail-title').textContent = currentProduct.name;
    document.getElementById('detail-price').textContent = currentProduct.priceFormatted + ' تومان';
    document.getElementById('detail-desc').textContent = currentProduct.description;
    document.getElementById('detail-fabric').textContent = currentProduct.fabric;
    document.getElementById('detail-color').textContent = currentProduct.color;
    document.getElementById('detail-style').textContent = currentProduct.style;
    document.getElementById('breadcrumb-product').textContent = currentProduct.name;
    
    // آپدیت تایتل صفحه
    document.title = currentProduct.name + ' | AYDIN & BAHMAN';
}

/* لود محصولات مشابه */
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-grid');
    const relatedProducts = getRelatedProducts(currentProduct.category, currentProduct.id);

    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align: center; color: #888;">محصول مشابهی یافت نشد.</p>';
        return;
    }

    relatedGrid.innerHTML = relatedProducts.map(product => `
        <article class="product-card visible">
            <div class="img-box" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}">
                <div class="hover-view">مشاهده سریع</div>
            </div>
            <div class="product-info">
                <span class="cat-tag">${getCategoryName(product.category)}</span>
                <h3>${product.name}</h3>
                <p class="price">${product.priceFormatted} تومان</p>
            </div>
            <button class="add-btn" onclick="addToCartDirect('${product.name}', ${product.price}, '${product.image}')">افزودن به سبد</button>
        </article>
    `).join('');
}

/* دریافت نام دسته‌بندی */
function getCategoryName(category) {
    const names = {
        manto: 'مانتو',
        pirahan: 'پیراهن',
        shomiz: 'شومیز',
        set: 'کت و شلوار'
    };
    return names[category] || category;
}

/* انتخاب سایز */
function selectSize(element) {
    document.querySelectorAll('.size-opt').forEach(size => {
        size.classList.remove('active');
    });
    element.classList.add('active');
    selectedSize = element.textContent.trim();
}

/* تغییر تعداد */
function changeQuantity(delta) {
    const input = document.getElementById('quantity-input');
    let newValue = parseInt(input.value) + delta;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    input.value = newValue;
    quantity = newValue;
}

/* افزودن به سبد از صفحه محصول */
function addToCartFromDetail() {
    if (!currentProduct) return;

    const existingItem = cart.find(item => 
        item.name === currentProduct.name && item.size === selectedSize
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            size: selectedSize,
            quantity: quantity
        });
    }

    updateCartUI();
    toggleCart();
    
    alert('محصول به سبد خرید اضافه شد! ✅');
}

/* خرید سریع */
function buyNowFromDetail() {
    addToCartFromDetail();
    setTimeout(() => {
        checkoutToWhatsApp();
    }, 500);
}

/* لودر */
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 900);
    }
});

/* هدر اسکرول */
const header = document.getElementById('main-header');
window.addEventListener('scroll', function() {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

/* منوی موبایل */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

/* سبد خرید */
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

/* توابع سبد خرید از script.js اصلی */
function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-price');

    if (!countElement || !itemsContainer || !totalElement) return;

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = count;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';
        totalElement.textContent = '۰ تومان';
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
        itemsContainer.appendChild(row);
    });

    totalElement.textContent = total.toLocaleString('fa-IR') + ' تومان';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkoutToWhatsApp() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است.');
        return;
    }

    let message = '🛍️ سفارش جدید از سایت A&B\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name}\n`;
        message += `سایز: ${item.size}\n`;
        message += `تعداد: ${item.quantity}\n`;
        message += `قیمت: ${itemTotal.toLocaleString('fa-IR')} تومان\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان\n\n`;
    message += 'لطفاً برای تکمیل سفارش راهنمایی کنید. 🙏';

    const whatsappLink = 'https://web.whatsapp.com/send?phone=989385734170&text=' + encodeURIComponent(message);
    window.location.href = whatsappLink;
}

function addToCartDirect(name, price, image) {
    const existingItem = cart.find(item => item.name === name && item.size === 'M');
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, size: 'M', quantity: 1 });
    }
    updateCartUI();
    toggleCart();
}
