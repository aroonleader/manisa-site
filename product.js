let currentProduct = null;
let selectedSize = 'M';
let quantity = 1;
let cart = [];

/* لود اطلاعات محصول از URL */
window.addEventListener('DOMContentLoaded', function() {
    console.log('صفحه لود شد...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('Product ID from URL:', productId);

    if (!productId) {
        console.error('هیچ ID محصولی در URL یافت نشد!');
        alert('محصول یافت نشد!');
        window.location.href = 'index.html';
        return;
    }

    currentProduct = getProductById(productId);
    console.log('Product data:', currentProduct);

    if (!currentProduct) {
        console.error('داده‌های محصول پیدا نشد!');
        alert('محصول یافت نشد!');
        window.location.href = 'index.html';
        return;
    }

    loadProductDetail();
    loadRelatedProducts();
});

/* لود جزئیات محصول */
function loadProductDetail() {
    console.log('Loading product detail...');
    
    const mainImage = document.getElementById('detail-image');
    if (mainImage) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
        console.log('Image set to:', currentProduct.image);
    } else {
        console.error('عنصر detail-image یافت نشد!');
    }
    
    setTextContent('detail-category', getCategoryName(currentProduct.category));
    setTextContent('detail-title', currentProduct.name);
    setTextContent('detail-price', currentProduct.priceFormatted + ' تومان');
    setTextContent('detail-desc', currentProduct.description);
    setTextContent('detail-fabric', currentProduct.fabric);
    setTextContent('detail-color', currentProduct.color);
    setTextContent('detail-style', currentProduct.style);
    setTextContent('breadcrumb-product', currentProduct.name);
    
    document.title = currentProduct.name + ' | AYDIN & BAHMAN';
}

/* تابع کمکی برای تنظیم متن */
function setTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.error('عنصر یافت نشد:', elementId);
    }
}

/* لود محصولات مشابه */
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-grid');
    if (!relatedGrid) {
        console.error('عنصر related-grid یافت نشد!');
        return;
    }
    
    const relatedProducts = getRelatedProducts(currentProduct.category, currentProduct.id);
    console.log('Related products:', relatedProducts);

    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align: center; color: #888; padding: 50px;">محصول مشابهی یافت نشد.</p>';
        return;
    }

    relatedGrid.innerHTML = relatedProducts.map(product => `
        <article class="product-card visible">
            <div class="img-box" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='dress1.jpg'">
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
    if (!input) return;
    
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

/* توابع سبد خرید */
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
            <img src="${item.image}" alt="${item.name}" onerror="this.src='dress1.jpg'">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-meta">سایز: ${item.size} | تعداد: ${item.quantity}</div>
                <div class="item-price">${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})"></button>
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
