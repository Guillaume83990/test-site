/* ================================================
   INDEX.JS - JavaScript complet (tout-en-un)
   Navigation + Animations + Particules + Formulaire
   ================================================ */

// ============= NAVIGATION MOBILE ============= //
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');
const nav = document.getElementById('main-nav');

if (navToggle && navMenu && navOverlay) {
    // Toggle menu mobile
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

    // Fermer au clic sur overlay
    navOverlay.addEventListener('click', closeMenu);

    // Fermer au clic sur lien
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fermer avec Échap
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

    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}


// ============= PARTICULES BACKGROUND ============= //
const canvas = document.getElementById('particles-bg');
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


// ============= FORMULAIRE CONTACT ============= //
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        if (!validateEmail(formData.email)) {
            showNotification('❌ Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        const submitBtn = this.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';

        try {
            // ICI : Intégrer EmailJS, FormSpree, ou votre API
            // Exemple EmailJS:
            // await emailjs.send('service_id', 'template_id', formData);

            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('✅ Merci ! Je vous recontacte sous 24h maximum.', 'success');
            contactForm.reset();

        } catch (error) {
            showNotification('❌ Erreur. Contactez-moi directement : contact@sudwebproject.fr', 'error');
            console.error('Erreur:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function () {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#EF4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// ============= CURSOR GLOW (optionnel) ============= //
let cursorGlow = null;

if (window.innerWidth > 1024) {
    cursorGlow = document.createElement('div');
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
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.style.opacity = '0';
        }
    });
}


// ============= CONSOLE ============= //
console.log(
    '%c🌴 Sud Web Project - Saint-Tropez',
    'color: #3B82F6; font-size: 20px; font-weight: bold;'
);
console.log(
    '%c✨ Animations luxe activées',
    'color: #60A5FA; font-size: 14px;'
);
console.log(
    '%c📧 contact@sudwebproject.fr',
    'color: #10B981; font-size: 14px;'
);

// ============= GOOGLE TRANSLATE - BOUTONS CUSTOM ============= //
(function () {
    'use strict';

    let attempts = 0;
    const maxAttempts = 20;

    function initCustomButtons() {
        attempts++;

        const select = document.querySelector('.goog-te-combo');

        if (select) {
            console.log('✅ Traduction prête !');

            const langButtons = document.querySelectorAll('.lang-btn');

            langButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const targetLang = this.getAttribute('data-lang');

                    // Changer la langue
                    select.value = targetLang;
                    select.dispatchEvent(new Event('change'));

                    // Activer visuellement
                    langButtons.forEach(function (b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');

                    console.log('🌍 Langue:', targetLang);
                });
            });

        } else if (attempts < maxAttempts) {
            setTimeout(initCustomButtons, 500);
        }
    }

    // Démarrer après chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(initCustomButtons, 1000);
        });
    } else {
        setTimeout(initCustomButtons, 1000);
    }
})();