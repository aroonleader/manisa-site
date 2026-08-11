let cart = [];
let activeProductInModal = null;

const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

function toEnglishNumber(value) {
    return String(value).replace(/[۰-۹]/g, digit => {
        return persianDigits.indexOf(digit);
    });
}

function formatPrice(price) {
    return Number(price).toLocaleString('fa-IR') + ' تومان';
}

/* لودر - اصلاح شده */
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // حتماً بعد از ۲ ثانیه لودر حذف بشه
        setTimeout(function () {
            preloader.style.opacity = '0';
            
            setTimeout(function () {
                preloader.style.display = 'none';
                console.log('لودر حذف شد');
            }, 500);
        }, 2000);
    }
});

/* فیلتر دسته‌بندی محصولات */
function filterProducts(category, clickedButton) {
    const cards = document.querySelectorAll('.product-card');
    const title = document.getElementById('products-title');
    const noResult = document.getElementById('no-result');

    const categoryNames = {
        all: 'همه محصولات',
        manto: 'مانتو',
        pirahan: 'پیراهن',
        shomiz: 'شومیز',
        set: 'کت و شلوار'
    };

    if (title) {
        title.textContent = categoryNames[category];
    }

    document.querySelectorAll('.cat-item').forEach(function (button) {
        button.classList.remove('active');
    });

    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    let visibleCount = 0;

    cards.forEach(function (card) {
        const cardCategory = card.dataset.category;

        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hide');
            card.classList.add('visible');
            visibleCount++;
        } else {
            card.classList.add('hide');
        }
    });

    if (noResult) {
        noResult.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    const productsSection = document.getElementById('products');

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* اتصال کلیک به دکمه‌های دسته‌بندی */
document.querySelectorAll('.cat-item').forEach(function (button) {
    button.addEventListener('click', function () {
        filterProducts(this.dataset.category, this);
    });
});

/* سبد خرید */
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

function addToCartDirect(name, price, image) {
    const existingItem = cart.find(function (item) {
        return item.name === name && item.size === 'M';
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            image: image,
            size: 'M',
            quantity: 1
        });
    }

    updateCartUI();

    const sidebar = document.getElementById('cart-sidebar');

    if (sidebar && !sidebar.classList.contains('open')) {
        toggleCart();
    }
}

/* مودال محصول */
function openProductModal(name, price, image) {
    const modal = document.getElementById('product-modal');

    if (!modal) return;

    modal.style.display = 'flex';

    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-price').textContent = formatPrice(price);
    document.getElementById('modal-img').src = image;

    activeProductInModal = {
        name: name,
        price: Number(price),
        image: image,
        size: 'M'
    };

    document.querySelectorAll('.size-opt').forEach(function (size) {
        size.classList.toggle('active', size.textContent.trim() === 'M');
    });
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');

    if (modal) {
        modal.style.display = 'none';
    }
}

function selectSize(element) {
    document.querySelectorAll('.size-opt').forEach(function (size) {
        size.classList.remove('active');
    });

    element.classList.add('active');

    if (activeProductInModal) {
        activeProductInModal.size = element.textContent.trim();
    }
}

function addToCartFromModal() {
    if (!activeProductInModal) return;

    const product = activeProductInModal;

    const existingItem = cart.find(function (item) {
        return item.name === product.name &&
               item.size === product.size;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size,
            quantity: 1
        });
    }

    closeProductModal();
    updateCartUI();
    toggleCart();
}

/* نمایش سبد خرید */
function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-price');

    if (!countElement || !itemsContainer || !totalElement) return;

    const count = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    countElement.textContent = count;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML =
            '<p class="empty-cart-msg">سبد خرید شما خالی است.</p>';

        totalElement.textContent = '۰ تومان';
        return;
    }

    let total = 0;

    cart.forEach(function (item, index) {
        total += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-row';

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-meta">
                    سایز: ${item.size} | تعداد: ${item.quantity}
                </div>
                <div class="item-price">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
            <button class="remove-item-btn"
                    onclick="removeFromCart(${index})">
                ✕
            </button>
        `;

        itemsContainer.appendChild(itemElement);
    });

    totalElement.textContent = formatPrice(total);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/* ارسال سفارش به واتساپ */
function checkoutToWhatsApp() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است.');
        return;
    }

    let message = '️ سفارش جدید از سایت A&B\n\n';
    let total = 0;

    cart.forEach(function (item, index) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        message += `${index + 1}. ${item.name}\n`;
        message += `سایز: ${item.size}\n`;
        message += `تعداد: ${item.quantity}\n`;
        message += `قیمت: ${formatPrice(itemTotal)}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 جمع کل: ${formatPrice(total)}\n\n`;
    message += 'لطفاً برای تکمیل سفارش راهنمایی کنید. 🙏';

    const whatsappLink =
        'https://web.whatsapp.com/send?phone=989385734170&text=' +
        encodeURIComponent(message);

    window.location.href = whatsappLink;
}

/* هدر هنگام اسکرول */
const header = document.getElementById('main-header');

window.addEventListener('scroll', function () {
    if (!header) return;

    header.classList.toggle('scrolled', window.scrollY > 50);
});

/* بستن مودال با کلیک بیرون */
window.addEventListener('click', function (event) {
    const modal = document.getElementById('product-modal');

    if (modal && event.target === modal) {
        closeProductModal();
    }
});

/* دیباگ: اگر لودر حذف نشد، بعد از ۵ ثانیه به زور حذف بشه */
setTimeout(function() {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        console.warn('لودر به زور حذف شد - احتمالاً خطای جاوااسکریپت وجود دارد');
        preloader.style.display = 'none';
    }
}, 5000);
