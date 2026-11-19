// ipinfo.js - خدمة الحصول على الموقع من ipinfo.io
const LOCATION_SERVICE = {
    // Cache للموقع لتجنب طلبات متعددة
    locationCache: null,
    cacheDuration: 24 * 60 * 60 * 1000, // 24 ساعة
    
    // الحصول على بيانات الموقع
    async getUserLocation() {
        // التحقق من الكاش أولاً
        const cached = this.getCachedLocation();
        if (cached) {
            console.log('📍 استخدام بيانات الموقع المخزنة:', cached);
            return cached;
        }
        
        try {
            console.log('🌍 جاري الحصول على بيانات الموقع من ipinfo.io...');
            
            // استخدام ipinfo.io بدون token (مجاني، 1000 طلب/يوم)
            const url = 'https://ipinfo.io/json';
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📍 بيانات الموقع المستلمة:', data);
            
            // تنسيق البيانات
            const locationData = {
                country: data.country || 'Unknown',
                region: data.region || '',
                city: data.city || '',
                ip: data.ip || '',
                timezone: data.timezone || '',
                org: data.org || '',
                loc: data.loc || '', // خطوط الطول والعرض
                postal: data.postal || ''
            };
            
            // حفظ في الكاش
            this.saveLocationToCache(locationData);
            
            return locationData;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على بيانات الموقع:', error);
            
            // محاولة استخدام خدمة احتياطية
            try {
                const fallbackData = await this.getLocationFallback();
                return fallbackData;
            } catch (fallbackError) {
                console.error('❌ فشلت جميع محاولات الحصول على الموقع');
                return this.getDefaultLocation();
            }
        }
    },
    
    // خدمة احتياطية
    async getLocationFallback() {
        try {
            // محاولة مع ipapi.co
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    country: data.country_name || 'Unknown',
                    region: data.region || '',
                    city: data.city || '',
                    ip: data.ip || ''
                };
            }
            
            throw new Error('ipapi.co failed');
            
        } catch (error) {
            console.error('❌ فشلت الخدمة الاحتياطية:', error);
            throw error;
        }
    },
    
    // موقع افتراضي
    getDefaultLocation() {
        return {
            country: 'Unknown',
            region: '',
            city: '',
            ip: '',
            timezone: '',
            org: '',
            loc: '',
            postal: ''
        };
    },
    
    // حفظ في الكاش
    saveLocationToCache(locationData) {
        try {
            const cacheData = {
                data: locationData,
                timestamp: Date.now()
            };
            localStorage.setItem('user_location_cache', JSON.stringify(cacheData));
            this.locationCache = locationData;
            console.log('💾 بيانات الموقع محفوظة في الكاش');
        } catch (error) {
            console.error('❌ خطأ في حفظ بيانات الموقع في الكاش:', error);
        }
    },
    
    // الحصول من الكاش
    getCachedLocation() {
        try {
            const cacheStr = localStorage.getItem('user_location_cache');
            if (!cacheStr) return null;
            
            const cacheData = JSON.parse(cacheStr);
            const now = Date.now();
            
            // التحقق من انتهاء الصلاحية
            if (now - cacheData.timestamp > this.cacheDuration) {
                console.log('🕒 بيانات الموقع منتهية الصلاحية');
                localStorage.removeItem('user_location_cache');
                return null;
            }
            
            return cacheData.data;
        } catch (error) {
            console.error('❌ خطأ في قراءة بيانات الموقع من الكاش:', error);
            return null;
        }
    },
    
    // مسح الكاش
    clearLocationCache() {
        localStorage.removeItem('user_location_cache');
        this.locationCache = null;
        console.log('🧹 تم مسح كاش الموقع');
    },
    
    // الحصول على البلد فقط
    async getUserCountry() {
        const location = await this.getUserLocation();
        return location.country || 'Unknown';
    },
    
    // الحصول على المنطقة فقط
    async getUserRegion() {
        const location = await this.getUserLocation();
        return location.region || '';
    },
    
    // الحصول على تنسيق مفصل للموقع
    async getFormattedLocation() {
        const location = await this.getUserLocation();
        
        if (location.country === 'Unknown') {
            return 'Location unknown';
        }
        
        let formatted = location.country;
        
        if (location.region) {
            formatted = `${location.region}, ${formatted}`;
        }
        
        if (location.city) {
            formatted = `${location.city}, ${formatted}`;
        }
        
        return formatted;
    }
};

// جعل الخدمة متاحة عالمياً
if (typeof window !== 'undefined') {
    window.LOCATION_SERVICE = LOCATION_SERVICE;
    console.log('📍 خدمة الموقع جاهزة للاستخدام');
}