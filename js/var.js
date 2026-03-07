/* ===========================================
   var.js — JS spécifique à la page "Création site internet Var"
   À placer dans : js/var.js
   Chargé en complément de index-v2.js
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== HOVER GLOW SUR LES CARTES VILLES ===== //
    const villeCards = document.querySelectorAll('.ville-card');
    villeCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ===== ANIMATION COMPTEURS HERO ===== //
    function animateValue(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        const suffix = el.getAttribute('data-suffix') || '';

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(start + range * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Observer pour déclencher les compteurs quand visibles
    const counters = document.querySelectorAll('.hvs-num[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    const suffix = entry.target.getAttribute('data-suffix') || '';
                    animateValue(entry.target, 0, target, 1800);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }

    // ===== SMOOTH SCROLL VERS LES ANCRES ===== //
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});