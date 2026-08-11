let currentProduct = null;
let selectedSize = 'M';
let quantity = 1;

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) { window.location.href = 'index.html'; return; }

    currentProduct = getProductById(productId);
    if (!currentProduct) { window.location.href = 'index.html'; return; }

    loadProductDetail();
    loadRelatedProducts();
});

function loadProductDetail() {
    const img = document.getElementById('detail-image');
    if (img) img.src = currentProduct.image;
    
    setText('detail-category', getCategoryName(currentProduct.category));
    setText('detail-title', currentProduct.name);
    setText('detail-price', currentProduct.priceFormatted + ' تومان');
    setText('detail-desc', currentProduct.description);
    setText('detail-fabric', currentProduct.fabric);
    setText('detail-color', currentProduct.color);
    setText('detail-style', currentProduct.style);
    setText('breadcrumb-product', currentProduct.name);
    document.title = currentProduct.name + ' | A&B';
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function loadRelatedProducts() {
    const grid = document.getElementById('related-grid');
    if (!grid) return;
    const related = getRelatedProducts(currentProduct.category, currentProduct.id);
    if (related.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#888;padding:50px;">محصول مشابهی نیست.</p>';
        return;
    }
    grid.innerHTML = related.map(p => `
        <article class="product-card visible">
            <div class="img-box" onclick="window.location.href='product.html?id=${p.id}'">
                <img src="${p.image}" alt="${p.name}">
                <div class="hover-view">مشاهده</div>
            </div>
            <div class="product-info">
                <span class="cat-tag">${getCategoryName(p.category)}</span>
                <h3>${p.name}</h3>
                <p class="price">${p.priceFormatted} تومان</p>
            </div>
            <button class="add-btn" onclick="addToCartDirect('${p.name}', ${p.price}, '${p.image}')">افزودن</button>
        </article>
    `).join('');
}

function selectSize(el) {
    document.querySelectorAll('.size-opt').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    selectedSize = el.textContent.trim();
}

function changeQuantity(delta) {
    const input = document.getElementById('quantity-input');
    if (!input) return;
    let v = parseInt(input.value) + delta;
    if (v < 1) v = 1;
    if (v > 10) v = 10;
    input.value = v;
    quantity = v;
}

function addToCartFromDetail() {
    if (!currentProduct) return;
    const existing = cart.find(i => i.name === currentProduct.name && i.size === selectedSize);
    if (existing) existing.quantity += quantity;
    else cart.push({ name: currentProduct.name, price: currentProduct.price, image: currentProduct.image, size: selectedSize, quantity: quantity });
    updateCartUI();
    toggleCart();
    alert('اضافه شد! ✅');
}

function buyNowFromDetail() {
    addToCartFromDetail();
    setTimeout(() => checkoutToWhatsApp(), 500);
}

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.style.display = 'none'; }, 500); }, 1500);
    }
});

const header = document.getElementById('main-header');
window.addEventListener('scroll', () => { if (header) header.classList.toggle('scrolled', window.scrollY > 50); });

function toggleMobileMenu() { const m = document.getElementById('mobile-menu'); if (m) m.classList.toggle('active'); }
function toggleCart() {
    const s = document.getElementById('cart-sidebar');
    const o = document.getElementById('cart-overlay');
    if (s && o) { s.classList.toggle('open'); o.classList.toggle('open'); }
}
