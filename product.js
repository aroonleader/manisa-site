// متغیرها از script.js میان، اینجا فقط استفاده می‌کنیم
let selectedSize = 'M';
let quantity = 1;

window.addEventListener('DOMContentLoaded', function() {
    console.log('=== صفحه محصول لود شد ===');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('Product ID from URL:', productId);

    if (!productId) {
        console.error('هیچ ID محصولی در URL یافت نشد!');
        alert('محصول یافت نشد!');
        window.location.href = 'index.html';
        return;
    }

    // صبر می‌کنیم تا product-data.js لود بشه
    setTimeout(function() {
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
    }, 500);
});

function loadProductDetail() {
    console.log('Loading product detail...');
    
    const mainImage = document.getElementById('detail-image');
    if (mainImage && currentProduct.image) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
        mainImage.onerror = function() {
            console.error('عکس لود نشد:', currentProduct.image);
            this.src = 'dress1.jpg';
        };
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

function setTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.error('عنصر یافت نشد:', elementId);
    }
}

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

function selectSize(element) {
    document.querySelectorAll('.size-opt').forEach(size => {
        size.classList.remove('active');
    });
    element.classList.add('active');
    selectedSize = element.textContent.trim();
}

function changeQuantity(delta) {
    const input = document.getElementById('quantity-input');
    if (!input) return;
    
    let newValue = parseInt(input.value) + delta;
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    input.value = newValue;
    quantity = newValue;
}

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

function buyNowFromDetail() {
    addToCartFromDetail();
    setTimeout(() => {
        checkoutToWhatsApp();
    }, 500);
}

// لودر فقط برای صفحه محصول
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 2000);
    }
});
