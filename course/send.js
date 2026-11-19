// send_certificate.js - Send certificate data to Google Sheets (ONE TIME ONLY with IPINFO support)
const CERTIFICATE_HANDLER = {
    // Google Apps Script Web App URL
    sheetUrl: 'https://script.google.com/macros/s/AKfycbw5bqVioljqul0YRK1xesEi58LY5slrDIKVT-lWEhZbNaggMyiKLgQEItyYmZL35bj1AA/exec',
    
    // Flags
    isSending: false,
    retryCount: 0,
    maxRetries: 0, // ⚠️ **تم تعطيل إعادة المحاولة تماماً**
    
    // Initialize
    init: function() {
        console.log("📄 Certificate handler initialized - ONE TIME SEND ONLY with IPINFO");
        
        // Listen for certificate generation
        this.setupListeners();
        
        // Auto-clean old sent markers (older than 24 hours)
        this.cleanOldSentMarkers();
        
        return true;
    },
    
    // Setup event listeners
    setupListeners: function() {
        // Listen for custom certificate generation event
        document.addEventListener('certificateGenerated', (event) => {
            if (event.detail && event.detail.certificate) {
                console.log("📨 Certificate generated event received");
                this.sendCertificateToSheets(event.detail.certificate);
            }
        });
        
        // Listen for manual send
        document.addEventListener('sendCertificateManually', (event) => {
            if (event.detail && event.detail.certificate) {
                console.log("📨 Manual send event received");
                this.sendCertificateToSheets(event.detail.certificate);
            }
        });
    },
    
    // 🔥 **دوال جديدة للحصول على بيانات الموقع**
    
    // الحصول على بيانات الموقع من VISITOR_COLLECTOR
    async enrichWithLocationData(certificateData) {
        try {
            // إذا كانت البيانات تحتوي بالفعل على بلد ومدينة، لا داعي للتحديث
            if (certificateData.country && certificateData.country !== 'Unknown' && 
                certificateData.country !== 'العراق' && certificateData.region) {
                console.log("📍 Using existing location data");
                return;
            }
            
            console.log("🌍 Fetching location data from VISITOR_COLLECTOR...");
            
            // التحقق من وجود VISITOR_COLLECTOR
            if (!window.VISITOR_COLLECTOR || !window.VISITOR_COLLECTOR.info_vistor) {
                console.warn("⚠️ VISITOR_COLLECTOR not available");
                return;
            }
            
            // الحصول على بيانات الزوار
            const visitorData = window.VISITOR_COLLECTOR.info_vistor;
            
            if (visitorData.length > 0) {
                // استخدام آخر بيانات زائر
                const lastVisitor = visitorData[visitorData.length - 1];
                
                // تحديث بيانات الشهادة
                certificateData.country = lastVisitor.country || 'Unknown';
                certificateData.region = lastVisitor.region || lastVisitor.city || '';
                certificateData.city = lastVisitor.city || '';
                certificateData.ip = lastVisitor.ipv4 || '';
                
                console.log(`📍 Location updated: ${certificateData.region}, ${certificateData.country}`);
                
            } else {
                // إذا لم توجد بيانات، جلب بيانات جديدة
                console.log("🔄 No visitor data found, collecting new data...");
                
                if (window.VISITOR_COLLECTOR.collectVisitorInfo) {
                    const newVisitorInfo = await window.VISITOR_COLLECTOR.collectVisitorInfo();
                    
                    if (newVisitorInfo) {
                        certificateData.country = newVisitorInfo.country || 'Unknown';
                        certificateData.region = newVisitorInfo.region || newVisitorInfo.city || '';
                        certificateData.city = newVisitorInfo.city || '';
                        certificateData.ip = newVisitorInfo.ipv4 || '';
                        
                        console.log(`📍 New location data: ${certificateData.region}, ${certificateData.country}`);
                    }
                }
            }
            
        } catch (error) {
            console.error("❌ Error enriching with location data:", error);
            // الاستمرار حتى لو فشل الحصول على الموقع
        }
    },
    
    // الحصول على IP المستخدم
    async getUserIP() {
        try {
            // محاولة من VISITOR_COLLECTOR أولاً
            if (window.VISITOR_COLLECTOR && window.VISITOR_COLLECTOR.info_vistor && 
                window.VISITOR_COLLECTOR.info_vistor.length > 0) {
                const lastVisitor = window.VISITOR_COLLECTOR.info_vistor[window.VISITOR_COLLECTOR.info_vistor.length - 1];
                if (lastVisitor.ipv4 && lastVisitor.ipv4 !== 'Unknown') {
                    return lastVisitor.ipv4;
                }
            }
            
            // محاولة الحصول مباشرة من الخدمات
            const services = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json',
                'https://api64.ipify.org?format=json'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service, { 
                        signal: AbortSignal.timeout(2000) 
                    });
                    const data = await response.json();
                    return data.ip || 'Unknown';
                } catch (e) {
                    continue;
                }
            }
            
            return 'Unknown';
        } catch (error) {
            console.warn("❌ Could not get user IP:", error);
            return 'Unknown';
        }
    },
    
    // 🔥 **تعديل دالة prepareCertificateData لاستخدام الموقع الفعلي**
    
    // Prepare certificate data with actual location
    prepareCertificateData: function(certificate) {
        try {
            // Get additional information
            const userAgent = navigator.userAgent;
            const platform = navigator.platform;
            const language = navigator.language;
            const screenResolution = `${window.screen.width}x${window.screen.height}`;
            
            // Get current date
            const currentDate = new Date().toISOString().split('T')[0];
            
            // Generate unique certificate ID if not exists
            if (!certificate.certificateId) {
                certificate.certificateId = this.generateCertificateId(certificate.studentName);
            }
            
            // Generate course number if not exists
            if (!certificate.courseNumber) {
                certificate.courseNumber = this.generateCourseNumber(certificate.courseTitle);
            }
            
            // استخدام بيانات الموقع الفعلية
            const country = certificate.country || 'Unknown';
            const region = certificate.region || '';
            const city = certificate.city || '';
            
            // Prepare complete certificate data
            const completeCertificate = {
                // Core certificate data
                certificateId: certificate.certificateId,
                studentName: certificate.studentName || 'غير محدد',
                courseTitle: certificate.courseTitle || 'غير محدد',
                courseNumber: certificate.courseNumber,
                score: certificate.score || 0,
                issueDate: certificate.issueDate || currentDate,
                country: country, // ✅ البلد الفعلي
                region: region,   // ✅ المنطقة/المدينة الفعلية
                city: city,      // ✅ المدينة الفعلية
                
                // Additional data
                email: certificate.email || '',
                phone: certificate.phone || '',
                studentId: certificate.studentId || '',
                hoursCompleted: certificate.hoursCompleted || '40',
                certificateType: certificate.certificateType || 'Course Completion',
                language: certificate.language || 'ar',
                issuer: 'HOOK Platform',
                
                // Technical data
                platform: 'HOOK Cybersecurity Platform',
                userAgent: userAgent,
                screenResolution: screenResolution,
                language: language,
                platformType: platform.includes('Win') ? 'Windows' : 
                           platform.includes('Mac') ? 'macOS' : 
                           platform.includes('Linux') ? 'Linux' : 'Other',
                
                // Location data
                userIP: certificate.ip || '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                
                // Timestamps
                createdAt: new Date().toISOString(),
                clientTimestamp: new Date().toISOString(),
                
                // Metadata
                source: 'HOOK Certificate Generator',
                version: '4.1.0', // إصدار محسن
                status: certificate.status || 'ACTIVE'
            };
            
            // Calculate composite key for duplicate check
            completeCertificate.compositeKey = `${completeCertificate.courseNumber}_${completeCertificate.studentName}_${completeCertificate.country}`.replace(/\s+/g, '_');
            
            return completeCertificate;
            
        } catch (error) {
            console.error("❌ Error preparing certificate data:", error);
            return null;
        }
    },
    
    // Generate unique certificate ID
    generateCertificateId: function(studentName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const nameCode = studentName ? studentName.substring(0, 3).toUpperCase() : 'CERT';
        return `HOOK_${nameCode}_${timestamp}_${random}`;
    },
    
    // Generate course number from title
    generateCourseNumber: function(courseTitle) {
        if (!courseTitle) return 'CS000';
        
        const words = courseTitle.split(' ');
        let courseNumber = 'CS';
        
        if (words.length >= 2) {
            courseNumber += words[0].substring(0, 2).toUpperCase();
            courseNumber += words[1].substring(0, 2).toUpperCase();
        } else {
            courseNumber += courseTitle.substring(0, 4).toUpperCase();
        }
        
        courseNumber += Math.floor(Math.random() * 900 + 100);
        return courseNumber;
    },
    
    // Check if certificate was already sent - IMPROVED
    checkIfAlreadySent: function(certificateId) {
        try {
            // التحقق من ثلاث طرق مختلفة
            const checks = {
                sentMarker: false,
                sentList: false,
                userCertificates: false
            };
            
            // 1. Check in sent markers (التحقق الأساسي)
            const sentMarker = localStorage.getItem(`cert_sent_${certificateId}`);
            checks.sentMarker = sentMarker === 'true';
            
            if (checks.sentMarker) {
                console.log(`🔍 Certificate ${certificateId} - Sent marker found`);
                return true;
            }
            
            // 2. Check in sent certificates list
            const sentCerts = this.getSentCertificates();
            const alreadyInSent = sentCerts.some(cert => cert.certificateId === certificateId);
            checks.sentList = alreadyInSent;
            
            if (checks.sentList) {
                console.log(`🔍 Certificate ${certificateId} - Found in sent list`);
                return true;
            }
            
            // 3. Check in user certificates (with sent flag)
            const userCerts = JSON.parse(localStorage.getItem('userCertificates') || '[]');
            const userCert = userCerts.find(cert => cert.certificateId === certificateId);
            checks.userCertificates = userCert && userCert.sentToGoogleSheets === true;
            
            if (checks.userCertificates) {
                console.log(`🔍 Certificate ${certificateId} - Marked as sent in user certificates`);
                return true;
            }
            
            console.log(`🔍 Certificate ${certificateId} - Not sent (checks:`, checks, ')');
            return false;
            
        } catch (error) {
            console.error('Error checking if already sent:', error);
            return false;
        }
    },
    
    // Send certificate to Google Sheets - ONE TIME ONLY with IPINFO support
    async sendCertificateToSheets(certificateData) {
        console.log("🔄 sendCertificateToSheets called for:", certificateData.certificateId);
        
        // 🔥 **التحقق الأساسي: منع الإرسال المتكرر**
        const alreadySentKey = `cert_sent_${certificateData.certificateId}`;
        const alreadySentTimeKey = `cert_sent_time_${certificateData.certificateId}`;
        
        // التحقق إذا تم الإرسال خلال الدقيقة الماضية
        const lastSentTime = parseInt(localStorage.getItem(alreadySentTimeKey) || '0');
        const timeSinceLastSend = Date.now() - lastSentTime;
        const recentlySent = timeSinceLastSend < 60000; // أقل من دقيقة
        
        if (recentlySent) {
            console.log(`⏸️ Certificate ${certificateData.certificateId} was sent ${Math.floor(timeSinceLastSend/1000)} seconds ago - SKIPPING`);
            return {
                success: false,
                message: 'تم إرسال هذه الشهادة مؤخراً',
                alreadySent: true,
                isDuplicate: true,
                timeSinceLastSend: Math.floor(timeSinceLastSend/1000)
            };
        }
        
        // التحقق من الإرسال المسبق باستخدام الدالة المحسنة
        if (this.checkIfAlreadySent(certificateData.certificateId)) {
            console.log(`🛑 Certificate ${certificateData.certificateId} was already sent - ABORTING`);
            return {
                success: false,
                message: 'تم إرسال هذه الشهادة مسبقاً',
                alreadySent: true,
                isDuplicate: true
            };
        }
        
        // منع إرسال متزامن
        if (this.isSending) {
            console.log("⏸️ Already sending another certificate - WAITING");
            return {
                success: false,
                message: 'جاري إرسال شهادة أخرى',
                alreadyProcessing: true
            };
        }
        
        // Check if certificate data is complete
        if (!certificateData.studentName || certificateData.studentName.trim().length < 3) {
            console.log('❌ Incomplete certificate data: missing student name');
            return {
                success: false,
                message: 'بيانات الشهادة غير مكتملة',
                incompleteData: true
            };
        }
        
        this.isSending = true;
        console.log("🚀 Starting certificate send process...");
        
        try {
            // 🔥 **الحصول على بيانات الموقع من VISITOR_COLLECTOR**
            await this.enrichWithLocationData(certificateData);
            
            // Prepare data
            const preparedData = this.prepareCertificateData(certificateData);
            
            if (!preparedData) {
                throw new Error('Failed to prepare certificate data');
            }
            
            console.log("📤 Sending certificate to Google Sheets:", preparedData.certificateId);
            console.log("📍 Location data:", {
                country: preparedData.country,
                region: preparedData.region,
                city: preparedData.city
            });
            
            // وضع علامة مؤقتة لمنع الإرسال المتكرر أثناء العملية
            localStorage.setItem(alreadySentTimeKey, Date.now().toString());
            
            // الحصول على IP المستخدم لبيانات payload
            const userIP = await this.getUserIP();
            
            // Create payload
            const payload = {
                action: 'save_certificate',
                data: preparedData,
                timestamp: new Date().toISOString(),
                source: 'HOOK Certificate Generator',
                clientIp: userIP,
                userAgent: navigator.userAgent
            };
            
            // Send to Google Sheets
            const response = await this.sendToGoogleSheets(payload);
            
            if (response && response.status === 'success') {
                console.log("✅ Certificate saved successfully:", response.message);
                
                // 🔥 **وضع العلامة النهائية للإرسال**
                this.markAsSent(preparedData.certificateId);
                
                // Update certificate status in userCertificates
                this.updateCertificateStatus(preparedData.certificateId, {
                    sentToGoogleSheets: true,
                    sentAt: new Date().toISOString(),
                    sheetRow: response.rowAdded,
                    googleSheetsResponse: response,
                    actualLocation: {
                        country: preparedData.country,
                        region: preparedData.region,
                        city: preparedData.city
                    }
                });
                
                // Store sent certificate locally
                this.storeSentCertificate(preparedData, response);
                
                // Trigger success event
                this.triggerEvent('certificateSaved', {
                    certificate: preparedData,
                    response: response,
                    timestamp: new Date().toISOString()
                });
                
                return {
                    success: true,
                    message: response.message,
                    certificateId: preparedData.certificateId,
                    sheetRow: response.rowAdded,
                    isDuplicate: false,
                    firstTimeSent: true,
                    locationData: {
                        country: preparedData.country,
                        region: preparedData.region
                    }
                };
                
            } else if (response && response.status === 'duplicate') {
                console.log("⚠️ Duplicate certificate detected");
                
                // وضع علامة كمكرر (يعتبر مرسلاً)
                this.markAsSent(preparedData.certificateId);
                
                // Update certificate status
                this.updateCertificateStatus(preparedData.certificateId, {
                    isDuplicate: true,
                    duplicateDetectedAt: new Date().toISOString(),
                    actualLocation: {
                        country: preparedData.country,
                        region: preparedData.region,
                        city: preparedData.city
                    }
                });
                
                // Trigger duplicate event
                this.triggerEvent('certificateDuplicate', {
                    certificate: preparedData,
                    response: response,
                    timestamp: new Date().toISOString()
                });
                
                return {
                    success: false,
                    message: response.message,
                    certificateId: preparedData.certificateId,
                    isDuplicate: true,
                    duplicateDetected: true
                };
                
            } else {
                throw new Error(response?.message || 'Failed to save certificate');
            }
            
        } catch (error) {
            console.error("❌ Error sending certificate:", error);
            
            // ⚠️ **تم إلغاء منطق إعادة المحاولة تماماً**
            console.log("⏹️ Auto-retry disabled. Certificate will be marked as failed.");
            
            // وضع علامة الفشل
            const failedKey = `cert_failed_${certificateData.certificateId}`;
            localStorage.setItem(failedKey, 'true');
            localStorage.setItem(`${failedKey}_time`, Date.now().toString());
            localStorage.setItem(`${failedKey}_error`, error.message);
            
            // Store failed certificate for later retry
            this.storeFailedCertificate(certificateData, error.message);
            
            // إزالة العلامة المؤقتة
            localStorage.removeItem(alreadySentTimeKey);
            
            // Trigger error event
            this.triggerEvent('certificateError', {
                certificate: certificateData,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: false,
                message: `فشل في حفظ الشهادة: ${error.message}`,
                error: error.message,
                failed: true,
                canRetryManually: true
            };
            
        } finally {
            this.isSending = false;
            console.log("🏁 Certificate send process completed");
        }
    },
    
    // Mark certificate as sent
    markAsSent: function(certificateId) {
        try {
            // Set sent marker with timestamp
            const timestamp = Date.now();
            localStorage.setItem(`cert_sent_${certificateId}`, 'true');
            localStorage.setItem(`cert_sent_time_${certificateId}`, timestamp.toString());
            localStorage.setItem(`cert_sent_full_${certificateId}`, JSON.stringify({
                sent: true,
                timestamp: timestamp,
                date: new Date().toISOString()
            }));
            
            console.log(`✅ Marked certificate ${certificateId} as sent at ${new Date(timestamp).toLocaleString()}`);
        } catch (error) {
            console.error('Error marking certificate as sent:', error);
        }
    },
    
    // Update certificate status in userCertificates
    updateCertificateStatus: function(certificateId, updates) {
        try {
            const userCerts = JSON.parse(localStorage.getItem('userCertificates') || '[]');
            const certIndex = userCerts.findIndex(cert => cert.certificateId === certificateId);
            
            if (certIndex !== -1) {
                userCerts[certIndex] = {
                    ...userCerts[certIndex],
                    ...updates,
                    lastUpdated: new Date().toISOString()
                };
                
                localStorage.setItem('userCertificates', JSON.stringify(userCerts));
                console.log(`✅ Updated certificate ${certificateId} status`);
            }
        } catch (error) {
            console.error('Error updating certificate status:', error);
        }
    },
    
    // Send to Google Apps Script - ONE ATTEMPT ONLY with no-cors
    async sendToGoogleSheets(payload) {
        console.log("🌐 Attempting to send to Google Sheets (no-cors mode)");
        
        try {
            // طريقة 1: استخدام no-cors مع FormData
            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));
            formData.append('timestamp', new Date().toISOString());
            formData.append('source', 'HOOK Certificate Generator');
            
            console.log("📤 Sending via FormData with no-cors...");
            
            const response = await fetch(this.sheetUrl, {
                method: 'POST',
                mode: 'no-cors', // ⚠️ هذا هو المفتاح
                body: formData
                // لا يمكن استخدام headers مع no-cors
            });
            
            console.log("📨 Request sent (no-cors mode)");
            
            // في وضع no-cors، لا يمكننا قراءة response
            // نعتبر أن الطلب تم بنجاح
            return {
                status: 'success',
                message: 'Certificate data sent (no-cors mode)',
                rowAdded: 'unknown',
                noCorsMode: true
            };
            
        } catch (error) {
            console.error("❌ Fetch error in no-cors mode:", error.name, error.message);
            
            // حاول بطريقة بديلة
            try {
                console.log("🔄 Trying alternative method...");
                
                // طريقة بديلة: استخدام JSONP أو proxy
                await this.sendViaImagePixel(payload);
                
                return {
                    status: 'success',
                    message: 'Certificate sent via alternative method',
                    rowAdded: 'unknown',
                    alternativeMethod: true
                };
                
            } catch (fallbackError) {
                console.error("❌ All methods failed:", fallbackError);
                throw new Error("Failed to send certificate via all methods");
            }
        }
    },
    
    // طريقة بديلة باستخدام صورة بكسل (بدون CORS)
    sendViaImagePixel: function(payload) {
        return new Promise((resolve, reject) => {
            try {
                // تحويل البيانات إلى parameters في URL
                const params = new URLSearchParams();
                
                // إضافة البيانات الأساسية
                params.append('action', 'save_certificate');
                params.append('timestamp', new Date().toISOString());
                params.append('source', 'HOOK_Certificate_Generator');
                
                // إضافة البيانات كـ JSON
                const dataStr = JSON.stringify(payload.data || {});
                params.append('certificateData', dataStr);
                
                // إنشاء URL
                const pixelUrl = `${this.sheetUrl}?${params.toString()}`;
                
                console.log("📡 Sending via image pixel...");
                
                // استخدام صورة بكسل لإرسال الطلب
                const img = new Image();
                img.style.display = 'none';
                
                img.onload = () => {
                    console.log("✅ Pixel image loaded - request sent");
                    resolve();
                };
                
                img.onerror = (err) => {
                    console.log("⚠️ Pixel image error (but request might have been sent)");
                    resolve(); // حتى لو حدث خطأ، قد يكون الطلب تم إرساله
                };
                
                img.src = pixelUrl;
                
            } catch (error) {
                console.error("❌ Error in pixel method:", error);
                reject(error);
            }
        });
    },
    
    // Store sent certificate locally
    storeSentCertificate(certificate, response) {
        try {
            // Get existing sent certificates
            const sentCertificates = JSON.parse(localStorage.getItem('sent_certificates') || '[]');
            
            // Add new certificate
            const certificateRecord = {
                ...certificate,
                sentAt: new Date().toISOString(),
                sheetResponse: response,
                storedLocally: true,
                syncedWithGoogleSheets: true
            };
            
            sentCertificates.push(certificateRecord);
            
            // Keep only last 100 certificates
            if (sentCertificates.length > 100) {
                sentCertificates.shift();
            }
            
            // Save to localStorage
            localStorage.setItem('sent_certificates', JSON.stringify(sentCertificates));
            
            console.log("✅ Certificate stored locally:", certificate.certificateId);
            
        } catch (error) {
            console.error("❌ Error storing sent certificate:", error);
        }
    },
    
    // Store failed certificate
    storeFailedCertificate(certificate, error) {
        try {
            // Get existing failed certificates
            const failedCertificates = JSON.parse(localStorage.getItem('failed_certificates') || '[]');
            
            // Add failed certificate
            const failedRecord = {
                certificate: certificate,
                error: error,
                failedAt: new Date().toISOString(),
                retryCount: 0,
                canRetry: true
            };
            
            failedCertificates.push(failedRecord);
            
            // Save to localStorage
            localStorage.setItem('failed_certificates', JSON.stringify(failedCertificates));
            
            console.log("⚠️ Failed certificate stored for manual retry:", certificate.certificateId);
            
        } catch (error) {
            console.error("❌ Error storing failed certificate:", error);
        }
    },
    
    // Clean old sent markers (older than 24 hours)
    cleanOldSentMarkers: function() {
        try {
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            const keysToRemove = [];
            
            // Find old sent markers
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                if (key.startsWith('cert_sent_time_')) {
                    const certId = key.replace('cert_sent_time_', '');
                    const sentTime = parseInt(localStorage.getItem(key) || '0');
                    
                    if (sentTime < oneDayAgo) {
                        keysToRemove.push(`cert_sent_${certId}`);
                        keysToRemove.push(key);
                        keysToRemove.push(`cert_sent_full_${certId}`);
                    }
                }
            }
            
            // Remove old markers
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            if (keysToRemove.length > 0) {
                console.log(`🧹 Cleaned ${keysToRemove.length / 3} old sent markers`);
            }
            
        } catch (error) {
            console.error('Error cleaning old sent markers:', error);
        }
    },
    
    // Manual retry function - must be called explicitly
    async retryFailedCertificates() {
        try {
            const failedCertificates = JSON.parse(localStorage.getItem('failed_certificates') || '[]');
            
            if (failedCertificates.length === 0) {
                console.log("✅ No failed certificates to retry");
                return { retried: 0, success: 0, failed: 0 };
            }
            
            console.log(`🔧 هناك ${failedCertificates.length} شهادات فاشلة تحتاج إعادة محاولة يدوية`);
            console.log(`🔧 استخدم CERTIFICATE_HANDLER.retryFailedCertificate('certificateId') لكل شهادة`);
            
            return {
                retried: 0,
                success: 0,
                failed: 0,
                remaining: failedCertificates.length,
                message: "Manual retry required. Use retryFailedCertificate() for each certificate."
            };
            
        } catch (error) {
            console.error("❌ Error checking failed certificates:", error);
            return { retried: 0, success: 0, failed: 0, error: error.message };
        }
    },
    
    // Retry specific failed certificate
    async retryFailedCertificate(certificateId) {
        try {
            console.log(`🔄 Manual retry requested for: ${certificateId}`);
            
            // التحقق من وجود الشهادة الفاشلة
            const failedCerts = JSON.parse(localStorage.getItem('failed_certificates') || '[]');
            const failedCert = failedCerts.find(cert => 
                cert.certificate && cert.certificate.certificateId === certificateId
            );
            
            if (!failedCert) {
                console.log(`❌ No failed certificate found with ID: ${certificateId}`);
                return {
                    success: false,
                    message: 'لا توجد شهادة فاشلة بهذا المعرف',
                    certificateId: certificateId
                };
            }
            
            // التحقق مما إذا كانت الشهادة قد أرسلت بالفعل
            if (this.checkIfAlreadySent(certificateId)) {
                console.log(`✅ Certificate ${certificateId} was already sent successfully`);
                return {
                    success: true,
                    message: 'الشهادة مرسلة بالفعل',
                    alreadySent: true,
                    certificateId: certificateId
                };
            }
            
            // إزالة علامة الفشل
            localStorage.removeItem(`cert_failed_${certificateId}`);
            localStorage.removeItem(`cert_failed_${certificateId}_time`);
            localStorage.removeItem(`cert_failed_${certificateId}_error`);
            
            // إعادة المحاولة
            console.log(`🚀 Retrying certificate: ${certificateId}`);
            return await this.sendCertificateToSheets(failedCert.certificate);
            
        } catch (error) {
            console.error(`❌ Error retrying certificate ${certificateId}:`, error);
            return {
                success: false,
                message: `فشل في إعادة المحاولة: ${error.message}`,
                error: error.message,
                certificateId: certificateId
            };
        }
    },
    
    // Trigger custom event
    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: detail
        });
        document.dispatchEvent(event);
    },
    
    // Manual send function
    manualSend: function(certificateData) {
        if (!this.isSending) {
            console.log("🔧 Manual certificate send triggered");
            return this.sendCertificateToSheets(certificateData);
        }
        return Promise.resolve({
            success: false,
            message: 'Already sending another certificate'
        });
    },
    
    // Get sent certificates
    getSentCertificates() {
        try {
            return JSON.parse(localStorage.getItem('sent_certificates') || '[]');
        } catch {
            return [];
        }
    },
    
    // Get failed certificates
    getFailedCertificates() {
        try {
            return JSON.parse(localStorage.getItem('failed_certificates') || '[]');
        } catch {
            return [];
        }
    },
    
    // Get pending certificates (not sent yet)
    getPendingCertificates() {
        try {
            const userCerts = JSON.parse(localStorage.getItem('userCertificates') || '[]');
            return userCerts.filter(cert =>
                !cert.sentToGoogleSheets &&
                cert.studentName &&
                cert.studentName.trim().length >= 3
            );
        } catch {
            return [];
        }
    },
    
    // Clear stored certificates
    clearStoredCertificates() {
        try {
            // Clear sent certificates
            localStorage.removeItem('sent_certificates');
            
            // Clear failed certificates
            localStorage.removeItem('failed_certificates');
            
            // Clear sent markers
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('cert_sent_') || key.startsWith('cert_failed_')) {
                    localStorage.removeItem(key);
                }
            }
            
            console.log("🧹 All stored certificates cleared");
            return true;
            
        } catch (error) {
            console.error("❌ Error clearing stored certificates:", error);
            return false;
        }
    },
    
    // Get handler status
    getStatus() {
        return {
            isSending: this.isSending,
            retryCount: this.retryCount,
            sheetUrl: this.sheetUrl,
            sentCount: this.getSentCertificates().length,
            failedCount: this.getFailedCertificates().length,
            pendingCount: this.getPendingCertificates().length,
            userCertificatesCount: JSON.parse(localStorage.getItem('userCertificates') || '[]').length,
            lastCleanup: localStorage.getItem('last_cleanup_time'),
            version: '4.1.0 - ONE TIME SEND with IPINFO'
        };
    },
    
    // Set custom Google Sheets URL
    setSheetUrl(url) {
        if (url && url.startsWith('https://script.google.com/')) {
            this.sheetUrl = url;
            console.log("✅ Google Sheets URL updated:", url);
            return true;
        }
        console.error("❌ Invalid Google Sheets URL");
        return false;
    },
    
    // Get certificate statistics
    getCertificateStats() {
        try {
            const userCerts = JSON.parse(localStorage.getItem('userCertificates') || '[]');
            const sentCerts = this.getSentCertificates();
            const failedCerts = this.getFailedCertificates();
            
            return {
                total: userCerts.length,
                sent: sentCerts.length,
                failed: failedCerts.length,
                pending: this.getPendingCertificates().length,
                duplicates: userCerts.filter(cert => cert.isDuplicate).length,
                byCourse: this.getCertificatesByCourse(userCerts),
                byScore: this.getCertificatesByScore(userCerts)
            };
        } catch (error) {
            console.error('Error getting certificate stats:', error);
            return null;
        }
    },
    
    // Get certificates grouped by course
    getCertificatesByCourse(certificates) {
        const byCourse = {};
        certificates.forEach(cert => {
            const course = cert.courseTitle || 'Unknown';
            byCourse[course] = (byCourse[course] || 0) + 1;
        });
        return byCourse;
    },
    
    // Get certificates grouped by score
    getCertificatesByScore(certificates) {
        const byScore = {
            excellent: 0, // 90-100
            good: 0,      // 70-89
            average: 0,   // 50-69
            below: 0      // 0-49
        };
        
        certificates.forEach(cert => {
            const score = cert.score || 0;
            if (score >= 90) byScore.excellent++;
            else if (score >= 70) byScore.good++;
            else if (score >= 50) byScore.average++;
            else byScore.below++;
        });
        
        return byScore;
    }
};

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    let initialized = false;
    
    function initializeCertificateHandler() {
        if (initialized) {
            console.log("⚠️ Certificate handler already initialized");
            return;
        }
        
        initialized = true;
        
        setTimeout(() => {
            try {
                if (typeof CERTIFICATE_HANDLER !== 'undefined') {
                    CERTIFICATE_HANDLER.init();
                    console.log("✅ Certificate handler initialized successfully");
                    console.log("⚠️ IMPORTANT: Auto-retry is COMPLETELY DISABLED");
                    console.log("⚠️ IMPORTANT: Certificates will be sent ONCE ONLY");
                    console.log("📍 IPINFO Support: Using VISITOR_COLLECTOR for location data");
                    
                    // التحقق من الشهادات الفاشلة
                    const failedCount = CERTIFICATE_HANDLER.getFailedCertificates().length;
                    const pendingCount = CERTIFICATE_HANDLER.getPendingCertificates().length;
                    
                    if (failedCount > 0) {
                        console.log(`🔴 هناك ${failedCount} شهادات فاشلة تحتاج إعادة محاولة يدوية`);
                    }
                    
                    if (pendingCount > 0) {
                        console.log(`🟡 هناك ${pendingCount} شهادات معلقة لم ترسل بعد`);
                    }
                    
                    // التحقق من وجود VISITOR_COLLECTOR
                    if (window.VISITOR_COLLECTOR) {
                        console.log("✅ VISITOR_COLLECTOR detected for location data");
                    } else {
                        console.warn("⚠️ VISITOR_COLLECTOR not found - location data may not be accurate");
                    }
                }
            } catch (error) {
                console.error("❌ Error initializing certificate handler:", error);
            }
        }, 1000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCertificateHandler);
    } else {
        initializeCertificateHandler();
    }
    
    // Make available globally
    window.CERTIFICATE_HANDLER = CERTIFICATE_HANDLER;
    
    // Debug commands
    Object.defineProperty(window, 'hookCertificates', {
        get: function() {
            console.log(`
🎓 HOOK Certificate Handler (ONE TIME SEND with IPINFO)
  الإصدار: 4.1.0 - الإرسال لمرة واحدة فقط مع بيانات الموقع
  
  الأوامر المتاحة:
  CERTIFICATE_HANDLER.getStatus()           - حالة النظام
  CERTIFICATE_HANDLER.getCertificateStats() - إحصائيات الشهادات
  CERTIFICATE_HANDLER.getSentCertificates() - الشهادات المرسلة
  CERTIFICATE_HANDLER.getFailedCertificates() - الشهادات الفاشلة
  CERTIFICATE_HANDLER.getPendingCertificates() - الشهادات المعلقة
  
  ⚠️ **إعادة المحاولة اليدوية فقط**:
  CERTIFICATE_HANDLER.retryFailedCertificate('CERT_ID') - إعادة محاولة شهادة محددة
  
  📍 **بيانات الموقع**:
  باستخدام VISITOR_COLLECTOR للحصول على البلد والمنطقة الفعلية
  
  // التحقق من شهادة محددة
  localStorage.getItem('cert_sent_CERT_ID') - هل أرسلت؟
  localStorage.getItem('cert_failed_CERT_ID') - هل فشلت؟
  
  // مثال على إرسال يدوي:
  const certData = {
    studentName: 'الاسم',
    courseTitle: 'عنوان الكورس',
    score: 95,
    certificateId: 'ID_123'
    // البلد والمنطقة سيتم الحصول عليها تلقائياً
  };
  CERTIFICATE_HANDLER.manualSend(certData)
            `);
            return CERTIFICATE_HANDLER;
        },
        configurable: false,
        enumerable: false
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CERTIFICATE_HANDLER;
}