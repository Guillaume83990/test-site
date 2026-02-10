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
        // Si déjà accepté → charger Google Translate immédiatement
        enableAnalytics();
        loadGoogleTranslate();
    }
    // Bouton ACCEPTER
    const acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            // Enregistrer le consentement
            localStorage.setItem('cookieConsent', 'accepted');
            // Activer les cookies analytiques
            enableAnalytics();
            // Charger Google Translate APRÈS consentement
            loadGoogleTranslate();
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
            // Masquer la bannière SANS charger Google Translate
            hideBanner();
        });
    }
});

// ================================================
// FONCTION GOOGLE TRANSLATE - RGPD CONFORME
// Chargé UNIQUEMENT après consentement
// ================================================
function loadGoogleTranslate() {
    // Éviter de charger 2 fois
    if (document.getElementById('google-translate-script')) return;

    // Initialisation Google Translate
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            { pageLanguage: 'fr', includedLanguages: 'en' },
            'google_translate_element'
        );
    };

    // Charger le script Google Translate dynamiquement
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
}

// ================================================
// FONCTION MASQUER BANNIÈRE
// ================================================
function hideBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
}

// ================================================
// FONCTION ANALYTICS (optionnel)
// ================================================
function enableAnalytics() {
    // Google Analytics 4 - décommenter si vous l'utilisez :
    /*
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VOTRE-ID-GA4');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID-GA4';
    document.head.appendChild(script);
    */
    console.log('Cookies analytiques activés');
}

// ================================================
// FONCTION RESET (pour tests)
// ================================================
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    location.reload();
}