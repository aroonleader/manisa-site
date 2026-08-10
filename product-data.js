// دیتابیس محصولات
const products = [
    {
        id: 'dress1',
        name: 'مانتو کلاسیک مشکی',
        category: 'manto',
        price: 2450000,
        priceFormatted: '۲,۴۵۰,۰۰۰',
        image: 'dress1.jpg',
        fabric: 'پارچه اعلا کرپ',
        color: 'مشکی',
        style: 'کلاسیک',
        description: 'مانتو کلاسیک مشکی با طراحی مینیمال و دوخت تمیز. مناسب برای مجالس رسمی و محیط کار. پارچه باکیفیت که چروک نمی‌شود.'
    },
    {
        id: 'dress2',
        name: 'پیراهن مجلسی بلند',
        category: 'pirahan',
        price: 3200000,
        priceFormatted: '۳,۲۰۰,۰۰۰',
        image: 'dress2.jpg',
        fabric: 'ساتن ابریشم',
        color: 'سرمه‌ای',
        style: 'مجلسی',
        description: 'پیراهن مجلسی بلند با پارچه ساتن ابریشم. طراحی خاص و منحصر به فرد برای مهمانی‌های ویژه.'
    },
    {
        id: 'dress3',
        name: 'شومیز حریر صورتی',
        category: 'shomiz',
        price: 1200000,
        priceFormatted: '۱,۲۰۰,۰۰۰',
        image: 'dress3.jpg',
        fabric: 'حریر طبیعی',
        color: 'صورتی',
        style: 'روزمره',
        description: 'شومیز حریر صورتی با آستین‌های پفی. سبک و خنک، مناسب برای فصل بهار و تابستان.'
    },
    {
        id: 'dress4',
        name: 'کت و شلوار رسمی',
        category: 'set',
        price: 4800000,
        priceFormatted: '۴,۸۰۰,۰۰',
        image: 'dress4.jpg',
        fabric: 'پارچه فاستونی',
        color: 'طوسی',
        style: 'اداری',
        description: 'کت و شلوار رسمی با پارچه فاستونی وارداتی. دوخت حرفه‌ای و فیت عالی.'
    },
    {
        id: 'dress5',
        name: 'مانتو بهاره کرم',
        category: 'manto',
        price: 1950000,
        priceFormatted: '۱,۹۵,۰۰۰',
        image: 'dress5.jpg',
        fabric: 'لینن',
        color: 'کرم',
        style: 'روزمره',
        description: 'مانتو بهاره کرم با پارچه لینن خنک. طراحی جلو باز و راحت برای استفاده روزمره.'
    },
    {
        id: 'dress6',
        name: 'پیراهن روزمره',
        category: 'pirahan',
        price: 1650000,
        priceFormatted: '۱,۶۵۰,۰۰۰',
        image: 'dress6.jpg',
        fabric: 'نخ پنبه',
        color: 'سفید',
        style: 'روزمره',
        description: 'پیراهن روزمره با پارچه نخ پنبه. راحت و خنک برای استفاده روزانه.'
    }
];

// پیدا کردن محصول بر اساس ID
function getProductById(id) {
    if (!products || products.length === 0) {
        console.error('دیتابیس محصولات خالی است!');
        return null;
    }
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('محصول با ID یافت نشد:', id);
    }
    return product;
}

// گرفتن محصولات مشابه
function getRelatedProducts(category, currentId, limit = 4) {
    if (!products) return [];
    return products
        .filter(product => product.category === category && product.id !== currentId)
        .slice(0, limit);
}

// دریافت نام دسته‌بندی
function getCategoryName(category) {
    const names = {
        manto: 'مانتو',
        pirahan: 'پیراهن',
        shomiz: 'شومیز',
        set: 'کت و شلوار'
    };
    return names[category] || category;
}
