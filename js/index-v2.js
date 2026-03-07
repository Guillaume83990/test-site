/* ================================================
   INDEX-V2.JS - JavaScript complet (tout-en-un)
   Navigation + Animations + Particules
   Fonctionne sur toutes les pages du site
   ================================================ */

// ============= NAVIGATION MOBILE ============= //
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');
const nav = document.getElementById('main-nav');

if (navToggle && navMenu && navOverlay) {
    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    navOverlay.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ============= EFFET SCROLL NAVIGATION ============= //
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleNavScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleNavScroll() {
    const currentScroll = window.pageYOffset;
    if (nav) {
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    lastScroll = currentScroll;
}


// ============= PARTICULES BACKGROUND ============= //
// Uniquement sur les pages qui ont le canvas#particles-bg (index.html)
const canvas = document.getElementById('particles-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class BackgroundParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
            gradient.addColorStop(0, `rgba(59, 130, 246, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particlesArray = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new BackgroundParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });

        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.15;
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}


// ============= ANIMATIONS AU SCROLL ============= //
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 100);
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('[data-scroll]');
animateElements.forEach(el => scrollObserver.observe(el));


// ============= PARALLAX IMAGES ============= //
let tickingParallax = false;

function updateParallax() {
    const scrolled = window.pageYOffset;

    const heroImage = document.querySelector('.hero-image-wrapper img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    const cardImages = document.querySelectorAll('.card-image img');
    cardImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const speed = 0.15;
            const yPos = -(rect.top * speed);
            img.style.transform = `translateY(${yPos}px) scale(1.1)`;
        }
    });

    tickingParallax = false;
}

window.addEventListener('scroll', () => {
    if (!tickingParallax) {
        requestAnimationFrame(updateParallax);
        tickingParallax = true;
    }
});


// ============= GLOW EFFECT SUR CARTES ============= //
const cards = document.querySelectorAll('.service-card, .expertise-card, .hero-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(59, 130, 246, 0.25), transparent 40%)`;
        }
    });
});

// ============= ANIMATION COMPTEURS ============= //
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.replace(/[0-9]/g, '');

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

const heroCard = document.querySelector('.hero-card');
if (heroCard) {
    statsObserver.observe(heroCard);
}


// ============= BOUTON RETOUR EN HAUT ============= //
const backToTopBtn = document.getElementById('back-to-top');
let tickingBackTop = false;

window.addEventListener('scroll', () => {
    if (!tickingBackTop) {
        requestAnimationFrame(() => {
            handleBackToTop();
            tickingBackTop = false;
        });
        tickingBackTop = true;
    }
});

function handleBackToTop() {
    if (!backToTopBtn) return;
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ============= ANNÉE DYNAMIQUE FOOTER ============= //
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}


// ============= CURSOR GLOW (desktop uniquement) ============= //
if (window.innerWidth > 1024) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}


// ============= CONSOLE ============= //
console.log('%c🌴 Sud Web Project - Saint-Tropez', 'color: #3B82F6; font-size: 20px; font-weight: bold;');
console.log('%c✨ Animations luxe activées', 'color: #60A5FA; font-size: 14px;');
console.log('%c📧 contact@sudwebproject.com', 'color: #10B981; font-size: 14px;');


// ============= GOOGLE TRANSLATE - TOUTES LES PAGES ============= //
// NOTE : googleTranslateElementInit() est définie en INLINE sur chaque page HTML

(function () {
    'use strict';

    var attempts = 0;
    var maxAttempts = 30;
    var buttonsReady = false;

    function initCustomButtons() {
        if (buttonsReady) return;
        attempts++;

        // Vérifier que le widget Google est prêt
        var combo = document.querySelector('.goog-te-combo');
        if (!combo) {
            if (attempts < maxAttempts) setTimeout(initCustomButtons, 300);
            else console.warn('⚠️ Google Translate non trouvé.');
            return;
        }

        buttonsReady = true;
        console.log('✅ Traduction prête !');

        var langButtons = document.querySelectorAll('.lang-btn');
        if (!langButtons.length) return;

        langButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetLang = this.getAttribute('data-lang');

                // Mettre à jour le bouton actif
                langButtons.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Utiliser doGTranslate — méthode officielle Google, sans récursion
                if (typeof window.doGTranslate === 'function') {
                    if (targetLang === 'fr') {
                        window.doGTranslate('fr|fr');
                    } else {
                        window.doGTranslate('fr|' + targetLang);
                    }
                    console.log('🌍 Langue :', targetLang);
                } else {
                    // Fallback : manipuler le select directement
                    combo.value = targetLang;
                    combo.dispatchEvent(new Event('change'));
                }
            });
        });

        // Sync bouton actif au chargement
        var currentLang = combo.value || 'fr';
        langButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(initCustomButtons, 800); });
    } else {
        setTimeout(initCustomButtons, 800);
    }
})();