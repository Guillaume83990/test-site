/* ================================================
   INTRO.JS - Animation spectaculaire
   Particules formant un hexagone avec symbole </> au centre
   ================================================ */

'use strict';

// ============= CONFIGURATION =============
const CONFIG = {
    particleCount: 300,
    hexagonRadius: 150,
    codeSymbolSize: 80,
    animationDuration: 3000,
    glowColor: '#3B82F6',
    particleColor: '#60A5FA',
};

// ============= CANVAS SETUP =============
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

// Redimensionnement
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
});

// ============= PARTICULES =============
class Particle {
    constructor(targetX, targetY, isCodeSymbol = false) {
        // Position de départ aléatoire (hors écran ou dispersée)
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 500 + 500;
        this.x = centerX + Math.cos(angle) * distance;
        this.y = centerY + Math.sin(angle) * distance;

        // Position cible
        this.targetX = targetX;
        this.targetY = targetY;

        // Propriétés
        this.size = isCodeSymbol ? 3 : Math.random() * 2 + 1;
        this.isCodeSymbol = isCodeSymbol;

        // Animation
        this.progress = 0;
        this.arrived = false;

        // Oscillation après arrivée
        this.oscillationOffset = Math.random() * Math.PI * 2;
    }

    update(deltaProgress) {
        if (!this.arrived) {
            this.progress += deltaProgress;

            if (this.progress >= 1) {
                this.progress = 1;
                this.arrived = true;
            }

            // Easing (ease-out cubic)
            const eased = 1 - Math.pow(1 - this.progress, 3);

            this.x = this.x + (this.targetX - this.x) * eased * 0.1;
            this.y = this.y + (this.targetY - this.y) * eased * 0.1;
        } else {
            // Petite oscillation une fois arrivé
            const time = Date.now() * 0.001;
            const oscillation = Math.sin(time * 2 + this.oscillationOffset) * 1;
            this.x = this.targetX + oscillation;
            this.y = this.targetY + Math.cos(time * 2 + this.oscillationOffset) * 1;
        }
    }

    draw() {
        const glowSize = this.isCodeSymbol ? 15 : 8;

        // Glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
        gradient.addColorStop(0, this.isCodeSymbol ? CONFIG.glowColor : CONFIG.particleColor);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Particule centrale
        ctx.fillStyle = this.isCodeSymbol ? '#FFFFFF' : CONFIG.particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============= GÉNÉRATION DES POINTS DE L'HEXAGONE =============
function generateHexagonPoints(centerX, centerY, radius, pointsPerSide) {
    const points = [];
    const angles = [0, 60, 120, 180, 240, 300]; // 6 côtés

    for (let i = 0; i < 6; i++) {
        const angle1 = (angles[i] - 90) * Math.PI / 180;
        const angle2 = (angles[(i + 1) % 6] - 90) * Math.PI / 180;

        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;

        // Points le long de chaque côté
        for (let j = 0; j < pointsPerSide; j++) {
            const t = j / pointsPerSide;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            points.push({ x, y, isCodeSymbol: false });
        }
    }

    return points;
}

// ============= GÉNÉRATION DU SYMBOLE </> =============
function generateCodeSymbolPoints(centerX, centerY, size) {
    const points = [];
    const spacing = 3;

    // Chevron gauche <
    for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const x = centerX - size / 2 + t * size / 3;
        const y1 = centerY - size / 3 + t * size / 1.5;
        const y2 = centerY + size / 3 - t * size / 1.5;

        points.push({ x: x, y: y1, isCodeSymbol: true });
        points.push({ x: x, y: y2, isCodeSymbol: true });
    }

    // Slash /
    for (let i = 0; i < 20; i++) {
        const t = i / 20;
        const x = centerX - size / 4 + t * size / 2;
        const y = centerY + size / 2.5 - t * size * 1.2;
        points.push({ x: x, y: y, isCodeSymbol: true });
    }

    // Chevron droit >
    for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const x = centerX + size / 2 - t * size / 3;
        const y1 = centerY - size / 3 + t * size / 1.5;
        const y2 = centerY + size / 3 - t * size / 1.5;

        points.push({ x: x, y: y1, isCodeSymbol: true });
        points.push({ x: x, y: y2, isCodeSymbol: true });
    }

    return points;
}

// ============= INITIALISATION =============
const particles = [];
let animationComplete = false;

function init() {
    // Générer les points de l'hexagone
    const hexPoints = generateHexagonPoints(centerX, centerY, CONFIG.hexagonRadius, 8);

    // Générer les points du symbole de code
    const codePoints = generateCodeSymbolPoints(centerX, centerY, CONFIG.codeSymbolSize);

    // Combiner tous les points
    const allPoints = [...hexPoints, ...codePoints];

    // Créer les particules
    allPoints.forEach(point => {
        particles.push(new Particle(point.x, point.y, point.isCodeSymbol));
    });

    // Remplir avec des particules aléatoires si besoin
    while (particles.length < CONFIG.particleCount) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * CONFIG.hexagonRadius * 0.8;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        particles.push(new Particle(x, y, false));
    }
}

// ============= ANIMATION =============
let startTime = Date.now();

function animate() {
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const elapsed = Date.now() - startTime;
    const deltaProgress = 1 / (CONFIG.animationDuration / 16); // ~60fps

    // Mettre à jour et dessiner les particules
    particles.forEach(particle => {
        particle.update(deltaProgress);
        particle.draw();
    });

    // Dessiner des connexions entre particules proches
    if (elapsed > CONFIG.animationDuration * 0.5) {
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    const opacity = (50 - distance) / 50 * 0.3;
                    ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
    }

    // Vérifier si l'animation est terminée
    if (!animationComplete && elapsed > CONFIG.animationDuration) {
        animationComplete = true;
        showContent();
    }

    requestAnimationFrame(animate);
}

// ============= AFFICHER LE CONTENU =============
function showContent() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');

    loading.classList.add('hidden');
    content.classList.remove('hidden');

    setTimeout(() => {
        content.classList.add('visible');
    }, 100);
}

// ============= BOUTON ENTRER =============
document.getElementById('enter-btn').addEventListener('click', () => {
    const container = document.getElementById('intro-container');
    container.classList.add('fade-out');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
});

// Navigation clavier
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && animationComplete) {
        document.getElementById('enter-btn').click();
    }
});

// ============= DÉMARRAGE =============
init();
animate();

console.log('🚀 Animation Sud Web Project');
console.log(`✨ ${particles.length} particules actives`);