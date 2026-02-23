/* ====================================================
   LOOT GOBLINS — Landing Page Scripts
   ==================================================== */

(function () {
    'use strict';

    // ---------- Gold particle system ----------
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.15; // slight upward drift
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacityDir = Math.random() > 0.5 ? 1 : -1;
            this.hue = 40 + Math.random() * 20; // gold range
            this.life = Math.random() * 400 + 200;
            this.age = 0;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.age++;

            // Twinkle
            this.opacity += this.opacityDir * 0.004;
            if (this.opacity > 0.65) this.opacityDir = -1;
            if (this.opacity < 0.08) this.opacityDir = 1;

            if (this.age > this.life || this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
            ctx.fill();

            // tiny glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    // Determine particle count based on device
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 80;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ---------- Floating loot items ----------
    const floatingContainer = document.getElementById('floating-loot');
    const lootImages = [
        'Assets/Images/coinsandbars/gold_coin_pile_r1_c1.png',
        'Assets/Images/coinsandbars/gold_coin_pile_r1_c2.png',
        'Assets/Images/coinsandbars/gold_coin_pile_r2_c1.png',
        'Assets/Images/coinsandbars/gold_coin_pile_r2_c2.png',
        'Assets/Images/coinsandbars/gold_coin_pile_r3_c1.png',
        'Assets/Images/items/bronze_pickaxe_r1_c1.png',
        'Assets/Images/items/bronze_pickaxe_r1_c2.png',
        'Assets/Images/items/bronze_pickaxe_r2_c1.png',
        'Assets/Images/chest_debris_from_mimic.png',
    ];

    const floatCount = isMobile ? 5 : 10;

    function spawnFloatingItem() {
        const img = document.createElement('img');
        const src = lootImages[Math.floor(Math.random() * lootImages.length)];
        img.src = src;
        img.className = 'floating-item';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');

        const scale = 0.4 + Math.random() * 0.6;
        const duration = 18 + Math.random() * 30;
        const delay = Math.random() * -duration;
        const left = Math.random() * 100;
        const maxOpacity = 0.25 + Math.random() * 0.3;

        img.style.cssText = `
            left: ${left}%;
            width: ${32 + Math.random() * 28}px;
            --scale: ${scale};
            --max-opacity: ${maxOpacity};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        floatingContainer.appendChild(img);
    }

    for (let i = 0; i < floatCount; i++) {
        spawnFloatingItem();
    }

    // ---------- Scroll reveal ----------
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    // ---------- Scroll indicator fade ----------
    const scrollIndicator = document.getElementById('scroll-indicator');

    function handleScrollIndicator() {
        if (!scrollIndicator) return;
        const scrollY = window.scrollY || window.pageYOffset;
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 200);
    }

    window.addEventListener('scroll', handleScrollIndicator, { passive: true });

    // ---------- Parallax-lite on hero ----------
    const heroBg = document.querySelector('.hero-bg-overlay');

    function handleParallax() {
        if (!heroBg) return;
        const scrollY = window.scrollY || window.pageYOffset;
        heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
    }

    if (!isMobile) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ---------- Tilt on showcase card (desktop only) ----------
    const showcaseCard = document.getElementById('card-splash');

    if (showcaseCard && !isMobile) {
        showcaseCard.addEventListener('mousemove', (e) => {
            const rect = showcaseCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            showcaseCard.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
        });

        showcaseCard.addEventListener('mouseleave', () => {
            showcaseCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    }

    // ---------- Button ripple effect ----------
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                transform: scale(0);
                animation: rippleAnim 0.6s ease-out;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnim {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

})();
