/* ============================================================
   ARMCHLGY — Main Interactive Engine v3.0 (Cinematic GSAP Edition)
   ============================================================ */

// 1. REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// 2. INITIALIZE LENIS SMOOTH SCROLL
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─────────────────────────────────────────────────────────────
   3. CUSTOM MAGNETIC CURSOR
───────────────────────────────────────────────────────────── */
if (!isTouchDevice && !prefersReducedMotion) {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Set initial position out of bounds
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(cursorOutline, { xPercent: -50, yPercent: -50, opacity: 0 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorDotTween = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    let cursorDotTweenY = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
    let cursorOutlineTween = gsap.quickTo(cursorOutline, "x", {duration: 0.6, ease: "power3"});
    let cursorOutlineTweenY = gsap.quickTo(cursorOutline, "y", {duration: 0.6, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
        gsap.to([cursorDot, cursorOutline], { opacity: 1, duration: 0.3, overwrite: "auto" });
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDotTween(mouseX);
        cursorDotTweenY(mouseY);
        cursorOutlineTween(mouseX);
        cursorOutlineTweenY(mouseY);
    });

    // Magnetic snap effect for interactables
    const interactables = document.querySelectorAll('a, button, .catalog-item, .accordion-btn');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            cursorOutline.classList.add('cursor-hover');
            // Slight magnetic pull on the element itself
            const rect = el.getBoundingClientRect();
            gsap.to(el, {
                x: (e.clientX - (rect.left + rect.width / 2)) * 0.2,
                y: (e.clientY - (rect.top + rect.height / 2)) * 0.2,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            gsap.to(el, {
                x: (e.clientX - (rect.left + rect.width / 2)) * 0.3,
                y: (e.clientY - (rect.top + rect.height / 2)) * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   4. NAVBAR — FROSTED GLASS ON SCROLL
───────────────────────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
    ScrollTrigger.create({
        start: "top -60",
        onUpdate: self => {
            if (self.direction === 1) {
                navbar.classList.add('scrolled');
            } else if (self.scroll() <= 60) {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   5. SPLIT TYPE TEXT REVEALS (Cinematic Awwwards Style)
───────────────────────────────────────────────────────────── */
if (!prefersReducedMotion && typeof SplitType !== 'undefined') {
    // Split hero titles
    const heroTitles = new SplitType('.hero-title-main', { types: 'lines, words, chars' });
    const heroSubtitles = new SplitType('.hero-subtitle-main', { types: 'lines, words' });
    
    // Initial hero load animation
    // Wait for the CSS loading gate to finish (approx 3.4s)
    setTimeout(() => {
        const heroTl = gsap.timeline();
        
        if (heroTitles.chars) {
            gsap.set(heroTitles.chars, { yPercent: 120, opacity: 0 });
            heroTl.to(heroTitles.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.03,
                ease: "power4.out"
            });
        }
        
        if (heroSubtitles.words) {
            gsap.set(heroSubtitles.words, { yPercent: 100, opacity: 0 });
            heroTl.to(heroSubtitles.words, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: "power3.out"
            }, "-=0.8");
        }

        gsap.fromTo('.hero-cta-wrapper', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
            "-=0.6"
        );
    }, 3200);

    // Split editorial titles for scroll reveal
    const revealTexts = document.querySelectorAll('.editorial-title, .editorial-manifesto h2');
    revealTexts.forEach(text => {
        const splitText = new SplitType(text, { types: 'lines, words' });
        
        // Wrap lines for clipping
        splitText.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('line-wrapper');
            wrapper.style.overflow = 'hidden';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        gsap.from(splitText.words, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            yPercent: 120,
            opacity: 0,
            duration: 1.2,
            stagger: 0.04,
            ease: "power4.out"
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   6. SCROLL REVEALS (Images, Blocks, Lines)
───────────────────────────────────────────────────────────── */
if (!prefersReducedMotion) {
    // Fade up standard blocks
    gsap.utils.toArray('.reveal, .reveal-up').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Fade left/right for editorial grid
    gsap.utils.toArray('.reveal-left').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: "top 85%" },
            x: -60, opacity: 0, duration: 1.4, ease: "power3.out"
        });
    });
    
    gsap.utils.toArray('.reveal-right').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: "top 85%" },
            x: 60, opacity: 0, duration: 1.4, ease: "power3.out"
        });
    });

    // Scale reveals for imagery
    gsap.utils.toArray('.reveal-scale img, .catalog-item img').forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: "top 95%",
                toggleActions: "play none none reverse"
            },
            scale: 1.15,
            opacity: 0,
            duration: 1.8,
            ease: "power3.out"
        });
    });

    // Wipe lines
    gsap.utils.toArray('.wipe-line').forEach(line => {
        gsap.fromTo(line, 
            { scaleX: 0, transformOrigin: "left center" },
            { 
                scrollTrigger: { trigger: line, start: "top 90%" },
                scaleX: 1, duration: 1.5, ease: "power4.inOut" 
            }
        );
    });

    /* ─────────────────────────────────────────────────────────────
       7. HERO PARALLAX SCROLL
    ───────────────────────────────────────────────────────────── */
    const heroSection = document.querySelector('.home-hero');
    const heroOverlay = document.querySelector('.home-hero-overlay');
    if (heroSection && heroOverlay) {
        gsap.to(heroOverlay, {
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            yPercent: 30,
            opacity: 0.2,
            ease: "none"
        });
    }
}

/* ─────────────────────────────────────────────────────────────
   8. HERO CANVAS PARTICLES
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

    const particles = Array.from({ length: 85 }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.5 + 0.3,
        vx:    (Math.random() - 0.5) * 0.25,
        vy:    (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.05
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
   9. MAGNETIC 3D HOVER — Catalog Cards
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
            
            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                z: 12,
                scale: 1.02,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 900
            });
            
            if (spotlight) {
                spotlight.style.background =
                    `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 65%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out"
            });
            if (spotlight) spotlight.style.background = 'transparent';
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   10. ACCORDION (Dossier Reveal)
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
   11. THUMBNAIL IMAGE GALLERY
───────────────────────────────────────────────────────────── */
window.changeImage = function(mainImageId, thumbElement) {
    const mainImg = document.getElementById(mainImageId);
    if (!mainImg) return;
    
    gsap.to(mainImg, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            mainImg.src = thumbElement.src;
            gsap.to(mainImg, { opacity: 1, duration: 0.3 });
        }
    });
    
    const row = thumbElement.parentElement;
    row.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
};

/* ─────────────────────────────────────────────────────────────
   12. REGISTRY FORM SUBMIT
───────────────────────────────────────────────────────────── */
const agForm = document.getElementById('ag-form');
if (agForm) {
    agForm.addEventListener('submit', function(e) {
        e.preventDefault();
        gsap.to(agForm, { opacity: 0, duration: 0.4, onComplete: () => {
            agForm.classList.add('hidden');
            const conf = document.getElementById('confirmation');
            conf.classList.remove('hidden');
            gsap.fromTo(conf, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }});
    });
}

/* ─────────────────────────────────────────────────────────────
   13. SHOWCASE HERO LOGIC (NEW)
───────────────────────────────────────────────────────────── */
(function() {
    // Reveal entrance
    const heroTop = document.querySelector('.showcase-hero-top');
    const heroLeft = document.querySelector('.showcase-left');
    const heroRight = document.querySelector('.showcase-right');
    const heroCenter = document.querySelector('.showcase-center');
    
    if (heroTop) {
        gsap.from(heroTop, { y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
    }
    if (heroLeft) {
        gsap.from(heroLeft, { x: -40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });
    }
    if (heroRight) {
        gsap.from(heroRight, { x: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });
    }
    if (heroCenter) {
        gsap.from(heroCenter, { scale: 0.9, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.3 });
    }

    // Parallax mouse tilt
    const container = document.getElementById('product-img-container');
    const img = document.getElementById('product-hero-img');
    if (container && img) {
        let isHovering = false;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            targetX = (e.clientX - cx) / window.innerWidth * 15;
            targetY = (e.clientY - cy) / window.innerHeight * 15;
        });

        container.addEventListener('mouseenter', () => {
            isHovering = true;
            img.style.animationPlayState = 'paused';
        });
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0; targetY = 0;
            setTimeout(() => { if (!isHovering) img.style.animationPlayState = 'running'; }, 600);
        });

        function tiltLoop() {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            img.style.transform = `perspective(800px) rotateY(${currentX}deg) rotateX(${-currentY}deg) translateZ(10px)`;
            requestAnimationFrame(tiltLoop);
        }
        tiltLoop();
    }
})();
