const products = [
    { id: 'dress1', name: 'مانتو کلاسیک مشکی', category: 'manto', price: 2450000, priceFormatted: '۲,۴۵۰,۰۰', image: 'dress1.jpg', fabric: 'کرپ اعلا', color: 'مشکی', style: 'کلاسیک', description: 'مانتو کلاسیک با طراحی مینیمال.' },
    { id: 'dress2', name: 'پیراهن مجلسی بلند', category: 'pirahan', price: 3200000, priceFormatted: '۳,۲۰۰,۰۰۰', image: 'dress2.jpg', fabric: 'ساتن', color: 'سرمه‌ای', style: 'مجلسی', description: 'پیراهن مجلسی با پارچه ساتن.' },
    { id: 'dress3', name: 'شومیز حریر صورتی', category: 'shomiz', price: 1200000, priceFormatted: '۱,۲۰۰,۰۰۰', image: 'dress3.jpg', fabric: 'حریر', color: 'صورتی', style: 'روزمره', description: 'شومیز حریر خنک و سبک.' },
    { id: 'dress4', name: 'کت و شلوار رسمی', category: 'set', price: 4800000, priceFormatted: '۴,۸۰۰,۰۰۰', image: 'dress4.jpg', fabric: 'فاستونی', color: 'طوسی', style: 'اداری', description: 'کت و شلوار رسمی با دوخت حرفه‌ای.' },
    { id: 'dress5', name: 'مانتو بهاره کرم', category: 'manto', price: 1950000, priceFormatted: '۱,۹۵,۰۰۰', image: 'dress5.jpg', fabric: 'لینن', color: 'کرم', style: 'روزمره', description: 'مانتو لینن خنک برای بهار.' },
    { id: 'dress6', name: 'پیراهن روزمره', category: 'pirahan', price: 1650000, priceFormatted: '۱,۶۵۰,۰۰۰', image: 'dress6.jpg', fabric: 'نخ پنبه', color: 'سفید', style: 'روزمره', description: 'پیراهن راحت برای استفاده روزانه.' }
];

function getProductById(id) {
    if (!products) return null;
    return products.find(p => p.id === id);
}

function getRelatedProducts(category, currentId, limit = 4) {
    if (!products) return [];
    return products.filter(p => p.category === category && p.id !== currentId).slice(0, limit);
}

function getCategoryName(category) {
    const names = { manto: 'مانتو', pirahan: 'پیراهن', shomiz: 'شومیز', set: 'کت و شلوار' };
    return names[category] || category;
}
