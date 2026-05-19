/* ============================================================
   ARMCHLGY — main.js v9.0 (HydroFlow Level Cinematic)
   ============================================================ */

(function () {
    'use strict';

    /* ── HELPERS ────────────────────────────────────────────── */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const isHome = () => document.getElementById('loading-screen') !== null;

    /* ═══════════════════════════════════════════════════════
       1. CURSOR
    ═══════════════════════════════════════════════════════ */
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const dot  = document.createElement('div');
        const ring = document.createElement('div');
        dot.className  = 'cursor-dot';
        ring.className = 'cursor-outline';
        document.body.append(dot, ring);

        let mx = 0, my = 0, rx = 0, ry = 0;
        let raf;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        function tick() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            raf = requestAnimationFrame(tick);
        }
        tick();

        $$('a, button, .catalog-item, .track-item').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
        });
    }

    /* ═══════════════════════════════════════════════════════
       2. LENIS SMOOTH SCROLL
    ═══════════════════════════════════════════════════════ */
    let lenis;
    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        lenis = new Lenis({ duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
        function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }
    }

    /* ═══════════════════════════════════════════════════════
       3. PARTICLE CANVAS (Hero Background)
    ═══════════════════════════════════════════════════════ */
    function initCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = -Math.random() * 0.2 - 0.05;
                this.life = 0;
                this.maxLife = 180 + Math.random() * 180;
                this.size = Math.random() * 1.2 + 0.3;
            }
            update() {
                this.life++;
                this.x += this.vx;
                this.y += this.vy;
                if (this.life >= this.maxLife) this.reset();
            }
            draw() {
                const progress = this.life / this.maxLife;
                const alpha = Math.sin(Math.PI * progress) * 0.18;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) {
            const p = new Particle();
            p.life = Math.random() * p.maxLife;
            particles.push(p);
        }

        function animate() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ═══════════════════════════════════════════════════════
       4. LOADING SCREEN
    ═══════════════════════════════════════════════════════ */
    function initLoading() {
        const screen  = document.getElementById('loading-screen');
        const barFill = document.getElementById('loading-bar-fill');
        const chars   = $$('.loading-chars span');
        if (!screen || !chars.length) return;

        // Stagger each character in with GSAP
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.to(screen, {
                        opacity: 0,
                        duration: 0.9,
                        ease: 'power2.inOut',
                        delay: 0.3,
                        onComplete: () => {
                            screen.style.display = 'none';
                            // Animate hero content in
                            revealHeroContent();
                        }
                    });
                }
            });

            // Fill bar
            tl.to(barFill, { width: '100%', duration: 2.4, ease: 'power2.inOut' }, 0);

            // Stagger chars
            tl.to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out'
            }, 0.1);

        } else {
            // Fallback without GSAP
            setTimeout(() => {
                screen.style.opacity = '0';
                setTimeout(() => { screen.style.display = 'none'; revealHeroContent(); }, 900);
            }, 2500);
        }
    }

    /* ═══════════════════════════════════════════════════════
       5. HERO CONTENT REVEAL (after loading)
    ═══════════════════════════════════════════════════════ */
    function revealHeroContent() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline();

        // Eyebrow
        const eyebrow = document.getElementById('hero-eyebrow') || $('.hero-eyebrow');
        if (eyebrow) {
            tl.from(eyebrow, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, 0);
        }

        // Word-by-word headline
        const words = $$('.product-hero-headline .word-inner');
        if (words.length) {
            tl.to(words, {
                y: '0%',
                duration: 1.1,
                stagger: 0.06,
                ease: 'power4.out'
            }, 0.1);
        }

        // Showcase left/right columns
        const left  = document.getElementById('showcase-left');
        const right = document.getElementById('showcase-right');
        if (left)  tl.from(left,  { opacity: 0, x: -30, duration: 0.9, ease: 'power2.out' }, 0.6);
        if (right) tl.from(right, { opacity: 0, x: 30,  duration: 0.9, ease: 'power2.out' }, 0.7);

        // Product image
        const productImg = document.getElementById('product-hero-img');
        if (productImg) {
            tl.from(productImg, { opacity: 0, scale: 0.9, duration: 1.4, ease: 'power3.out' }, 0.3);
        }

        // Rotate hint
        const hint = document.getElementById('rotate-hint');
        if (hint) tl.from(hint, { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' }, 1.2);
    }

    /* ═══════════════════════════════════════════════════════
       6. PRODUCT IMAGE — MOUSE PARALLAX (HydroFlow effect)
    ═══════════════════════════════════════════════════════ */
    function initProductParallax() {
        const container = document.getElementById('product-img-container');
        const img       = document.getElementById('product-hero-img');
        if (!container || !img) return;

        let isHovering = false;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            targetX = (e.clientX - cx) / window.innerWidth  * 16;
            targetY = (e.clientY - cy) / window.innerHeight * 10;
        });

        // Pause float animation while tilting
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

    /* ═══════════════════════════════════════════════════════
       7. INFINITE AUTO-SCROLL CAROUSEL
    ═══════════════════════════════════════════════════════ */
    function initCarousel() {
        const wrapper = document.getElementById('track-wrapper');
        const track   = document.getElementById('infinite-track');
        if (!track || !wrapper) return;

        const speed      = 0.5; // px per frame
        let currentX     = 0;
        let isDragging   = false;
        let startX       = 0;
        let startScroll  = 0;
        let isPaused     = false;
        let momentum     = 0;

        // Total width of original (non-clone) items
        const origItems = $$('.track-item:not(.clone)', track);
        let trackWidth  = 0;
        origItems.forEach(el => { trackWidth += el.offsetWidth + 32; }); // 32 = gap (2rem)

        function animate() {
            if (!isDragging && !isPaused) {
                currentX -= speed;
            }
            // Seamless loop: reset when we've scrolled one full set
            if (currentX <= -trackWidth) currentX += trackWidth;
            if (currentX > 0) currentX = 0;

            track.style.transform = `translateX(${currentX}px)`;
            requestAnimationFrame(animate);
        }
        animate();

        // Drag support
        wrapper.addEventListener('mousedown', e => {
            isDragging = true;
            startX     = e.clientX;
            startScroll = currentX;
            wrapper.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const delta = e.clientX - startX;
            currentX = startScroll + delta;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        // Touch support
        wrapper.addEventListener('touchstart', e => {
            startX      = e.touches[0].clientX;
            startScroll = currentX;
        }, { passive: true });

        wrapper.addEventListener('touchmove', e => {
            const delta = e.touches[0].clientX - startX;
            currentX = startScroll + delta;
        }, { passive: true });

        // Pause on hover
        wrapper.addEventListener('mouseenter', () => { isPaused = true; });
        wrapper.addEventListener('mouseleave', () => { isPaused = false; });
    }

    /* ═══════════════════════════════════════════════════════
       8. SCROLL REVEAL (Intersection Observer)
    ═══════════════════════════════════════════════════════ */
    function initScrollReveal() {
        const targets = $$('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.transition = 'opacity 0.9s cubic-bezier(0.76,0,0.24,1), transform 0.9s cubic-bezier(0.76,0,0.24,1)';
                el.style.opacity    = '1';
                el.style.transform  = 'none';
                obs.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => obs.observe(el));
    }

    /* ═══════════════════════════════════════════════════════
       9. PHILOSOPHY CARD REVEALS
    ═══════════════════════════════════════════════════════ */
    function initPhilosophyReveal() {
        const cards = $$('.philosophy-card');
        const wipeLines = $$('.wipe-line');

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const dir = el.dataset.reveal;
                const xStart = dir === 'left' ? '-40px' : dir === 'right' ? '40px' : '0px';

                el.style.transition = 'none';
                el.style.opacity    = '0';
                el.style.transform  = `translateX(${xStart}) translateY(20px)`;

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.style.transition = `opacity 1.1s cubic-bezier(0.76,0,0.24,1), transform 1.1s cubic-bezier(0.76,0,0.24,1)`;
                        el.style.opacity    = '1';
                        el.style.transform  = 'none';
                    });
                });

                obs.unobserve(el);
            });
        }, { threshold: 0.15 });

        cards.forEach(c => obs.observe(c));

        const wipeObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.transition = 'transform 1.2s cubic-bezier(0.76,0,0.24,1)';
                entry.target.style.transform  = 'scaleX(1)';
                wipeObs.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        wipeLines.forEach(l => wipeObs.observe(l));
    }

    /* ═══════════════════════════════════════════════════════
       10. NAVBAR SCROLL EFFECT
    ═══════════════════════════════════════════════════════ */
    function initNavbar() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════════════════
       11. MOBILE HAMBURGER
    ═══════════════════════════════════════════════════════ */
    function initHamburger() {
        const btn     = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (!btn || !mobileNav) return;

        btn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            btn.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        $$('a', mobileNav).forEach(a => {
            a.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                btn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════
       12. ACCORDION (Product Pages)
    ═══════════════════════════════════════════════════════ */
    function initAccordion() {
        $$('.accordion-btn').forEach(btn => {
            const content = btn.nextElementSibling;
            if (!content) return;
            btn.addEventListener('click', () => {
                const isOpen = content.classList.toggle('open');
                if (isOpen) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
                // Toggle + icon if present
                const icon = btn.querySelector('.accordion-icon');
                if (icon) icon.textContent = isOpen ? '−' : '+';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════
       13. THUMBNAIL SWITCHER (Product Pages)
    ═══════════════════════════════════════════════════════ */
    function initThumbnails() {
        $$('.thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const wrapper = thumb.closest('.product-visuals, .product-page-container');
                if (!wrapper) return;
                const heroImg = wrapper.querySelector('.hero-product-img');
                if (!heroImg) return;

                $$('.thumb', wrapper).forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                heroImg.style.opacity = '0';
                setTimeout(() => {
                    heroImg.src = thumb.src;
                    heroImg.style.opacity = '1';
                }, 200);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════
       14. FOOTER BRAND NAME — SCROLL SCRUB
    ═══════════════════════════════════════════════════════ */
    function initFooterReveal() {
        const brandName = $('.footer-brand-name');
        if (!brandName) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                brandName.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.76,0,0.24,1)';
                brandName.style.opacity = '1';
                brandName.style.transform = 'none';
                obs.unobserve(brandName);
            });
        }, { threshold: 0.1 });

        brandName.style.opacity = '0';
        brandName.style.transform = 'translateY(60px)';
        obs.observe(brandName);
    }

    /* ═══════════════════════════════════════════════════════
       15. REGISTRY FORM SUBMIT
    ═══════════════════════════════════════════════════════ */
    function initRegistry() {
        const form = document.getElementById('registry-form');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            form.style.opacity = '0';
            setTimeout(() => {
                form.style.display = 'none';
                const msg = document.getElementById('confirmation-msg') || document.createElement('div');
                msg.id = 'confirmation-msg';
                msg.className = 'confirmation-message';
                msg.innerHTML = '<p>You have been added to the registry.</p><p style="margin-top:1rem; font-size:0.8rem; letter-spacing:0.1em; opacity:0.5;">We will contact you when the time is right.</p>';
                form.parentNode.appendChild(msg);
            }, 400);
        });
    }

    /* ═══════════════════════════════════════════════════════
       INIT
    ═══════════════════════════════════════════════════════ */
    function init() {
        initCursor();
        initLenis();
        initNavbar();
        initHamburger();
        initAccordion();
        initThumbnails();
        initScrollReveal();
        initPhilosophyReveal();
        initFooterReveal();
        initRegistry();

        if (isHome()) {
            initCanvas();
            initLoading();
            initProductParallax();
            initCarousel();
        } else {
            // On sub-pages, init carousel if present and skip loading
            initCarousel();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
