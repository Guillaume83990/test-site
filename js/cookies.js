// ================================================
// GESTION DE LA BANNIÈRE COOKIES (RGPD)
// ================================================

document.addEventListener('DOMContentLoaded', function () {

    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        // Afficher la bannière après 1 seconde
        setTimeout(() => {
            const banner = document.querySelector('.cookie-banner');
            if (banner) {
                banner.classList.add('show');
            }
        }, 1000);
    } else if (cookieConsent === 'accepted') {
        // Si accepté, activer Google Analytics (si vous l'utilisez)
        enableAnalytics();
    }

    // Bouton ACCEPTER
    const acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            // Enregistrer le consentement
            localStorage.setItem('cookieConsent', 'accepted');

            // Activer les cookies analytiques
            enableAnalytics();

            // Masquer la bannière
            hideBanner();
        });
    }

    // Bouton REFUSER
    const refuseBtn = document.getElementById('cookie-refuse');
    if (refuseBtn) {
        refuseBtn.addEventListener('click', function () {
            // Enregistrer le refus
            localStorage.setItem('cookieConsent', 'refused');

            // Masquer la bannière
            hideBanner();
        });
    }
});

// Fonction pour masquer la bannière
function hideBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.classList.remove('show');

        // Supprimer complètement après l'animation
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
}

// Fonction pour activer Google Analytics (à compléter si vous l'utilisez)
function enableAnalytics() {
    // Si vous utilisez Google Analytics, décommentez et complétez :

    /*
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VOTRE-ID-GA4');
    
    // Charger le script GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID-GA4';
    document.head.appendChild(script);
    */

    console.log('Cookies analytiques activés');
}

// Fonction pour réinitialiser le choix (utile pour tester)
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    location.reload();
}