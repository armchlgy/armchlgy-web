/* ============================================================
   ARMCHLGY — Main Interactive Engine v2.0 (Cinematic Edition)
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
if (!isTouchDevice && !prefersReducedMotion) {
    const cursorDot     = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className     = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mX = window.innerWidth / 2,
        mY = window.innerHeight / 2,
        oX = mX, oY = mY;

    document.addEventListener('mousemove', e => {
        mX = e.clientX;
        mY = e.clientY;
        cursorDot.style.transform = `translate(${mX - 3}px, ${mY - 3}px)`;
    });

    (function lerpCursor() {
        oX += (mX - oX) * 0.12;
        oY += (mY - oY) * 0.12;
        cursorOutline.style.transform = `translate(${oX - 16}px, ${oY - 16}px)`;
        requestAnimationFrame(lerpCursor);
    })();

    document.querySelectorAll('a, button, .catalog-item, .accordion-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
    });
}

/* ─────────────────────────────────────────────────────────────
   2. NAVBAR — TRANSPARENT → FROSTED GLASS ON SCROLL
───────────────────────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   3. HERO CANVAS PARTICLES
───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('hero-canvas');
if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const particles = Array.from({ length: 75 }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.2 + 0.3,
        vx:    (Math.random() - 0.5) * 0.22,
        vy:    (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.35 + 0.05
    }));

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

/* ─────────────────────────────────────────────────────────────
   4. HERO — MOUSE PARALLAX (text follows cursor gently)
───────────────────────────────────────────────────────────── */
const heroOverlay = document.querySelector('.home-hero-overlay');
const heroSection = document.querySelector('.home-hero');
if (heroOverlay && heroSection && !isTouchDevice && !prefersReducedMotion) {
    let tX = 0, tY = 0, cX = 0, cY = 0;

    heroSection.addEventListener('mousemove', e => {
        const r = heroSection.getBoundingClientRect();
        tX = ((e.clientX - r.left) / r.width  - 0.5) * 20;
        tY = ((e.clientY - r.top)  / r.height - 0.5) * 20;
    });

    (function lerpParallax() {
        cX += (tX - cX) * 0.06;
        cY += (tY - cY) * 0.06;
        heroOverlay.style.transform =
            `translate(calc(-50% + ${cX}px), calc(-50% + ${cY}px))`;
        requestAnimationFrame(lerpParallax);
    })();
}

/* ─────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — Intersection Observer
───────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
).forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────────
   6. MAGNETIC 3D HOVER — Catalog Cards
───────────────────────────────────────────────────────────── */
if (!isTouchDevice && !prefersReducedMotion) {
    document.querySelectorAll('.catalog-item').forEach(card => {
        const spotlight = card.querySelector('.card-spotlight');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tiltX = ((y / rect.height) - 0.5) * 14;
            const tiltY = -((x / rect.width)  - 0.5) * 14;
            card.style.transform =
                `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px) scale(1.02)`;
            if (spotlight) {
                spotlight.style.background =
                    `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 65%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
            if (spotlight) spotlight.style.background = 'transparent';
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   7. WIPE LINE ANIMATION — Horizontal dividers
───────────────────────────────────────────────────────────── */
const wipeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('wipe-in');
    });
}, { threshold: 0.5 });

document.querySelectorAll('.wipe-line').forEach(el => wipeObserver.observe(el));

/* ─────────────────────────────────────────────────────────────
   8. ACCORDION (Dossier Reveal — preserved from v1)
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        const icon    = this.querySelector('.icon');

        if (content.classList.contains('open')) {
            content.style.maxHeight = null;
            content.classList.remove('open');
            if (icon) icon.textContent = '+';
        } else {
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 150 + 'px';
            if (icon) icon.textContent = '−';
        }
    });
});

/* ─────────────────────────────────────────────────────────────
   9. THUMBNAIL IMAGE GALLERY (preserved from v1)
───────────────────────────────────────────────────────────── */
window.changeImage = function(mainImageId, thumbElement) {
    const mainImg = document.getElementById(mainImageId);
    if (!mainImg) return;
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = thumbElement.src;
        mainImg.style.opacity = '1';
    }, 200);
    const row = thumbElement.parentElement;
    row.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
};

/* ─────────────────────────────────────────────────────────────
   10. REGISTRY FORM SUBMIT (preserved from v1)
───────────────────────────────────────────────────────────── */
const agForm = document.getElementById('ag-form');
if (agForm) {
    agForm.addEventListener('submit', function(e) {
        e.preventDefault();
        agForm.classList.add('hidden');
        document.getElementById('confirmation').classList.remove('hidden');
    });
}

/* ─────────────────────────────────────────────────────────────
   11. MAIN IMAGE TRANSITION STYLE (for gallery fade)
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.hero-product-img').forEach(img => {
    img.style.transition = 'opacity 0.3s ease';
});
