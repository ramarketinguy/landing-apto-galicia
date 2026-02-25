// ═══════════════════════════════════════════
// SCRIPT.JS - Landing Apartamento 1927
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // ─── Dynamic Year Calculation ───
    const currentYear = new Date().getFullYear();
    const historyEl = document.getElementById('yearsHistory');
    if (historyEl) {
        historyEl.setAttribute('data-target', currentYear - 1927);
    }

    // ─── Meta Pixel & CAPI Tracking ───
    const trackContact = (method) => {
        // Pixel Tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: 'Apartamento Galicia y Rondeau',
                value: 115000,
                currency: 'USD',
                method: method
            });
        }

        // Conversions API (Vercel Proxy style if available)
        // Note: For total privacy and bypassing blockers, we'd call a serverless function here
        console.log('Contacto trackeado:', method);
    };

    // Attach to all WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp, .whatsapp-float');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', () => trackContact('WhatsApp'));
    });

    // Attach to phone call button
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
    phoneButtons.forEach(btn => {
        btn.addEventListener('click', () => trackContact('Phone'));
    });

    // ─── Navbar Scroll ───
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Mobile Menu ───
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // ─── Smooth Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });

    // ─── Reveal on Scroll ───
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 150;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // ─── Counter Animation ───
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (target > 0) {
                    let count = 0;
                    const increment = target / 30;
                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            el.innerText = Math.ceil(count);
                            setTimeout(updateCount, 40);
                        } else {
                            el.innerText = target;
                        }
                    };
                    updateCount();
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(num => counterObserver.observe(num));

    // ─── Gallery Filter ───
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            const category = filter.getAttribute('data-filter');

            items.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ─── Lightbox ───
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        items.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }
});
