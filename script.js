// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Sync Lenis and ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Loader Animation ---
    const loaderTimeline = gsap.timeline({
        onComplete: () => {
            // Ensure loader is gone
            gsap.set('#loader', { display: 'none' });
        }
    });

    // Safety net: Hide loader after 5 seconds max if something breaks
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 5000);

    loaderTimeline
        .to('#loader-text', {
            y: 0,
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.5
        })
        .to('#loader-text', {
            y: '-100%',
            duration: 1,
            ease: 'power4.in',
            delay: 0.5
        })
        .to('#loader', {
            y: '-100%',
            duration: 1,
            ease: 'power4.inOut'
        }, "-=0.5")
        .from('.hero-title div', {
            y: '100%',
            duration: 1.5,
            stagger: 0.2,
            ease: 'power4.out'
        }, "-=0.5")
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=1")
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.8")
        .to('.floating-element', {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out'
        }, "-=1")
        .from('#hero-bg-img', {
            opacity: 0,
            scale: 0.8,
            duration: 2,
            ease: 'power2.out'
        }, "-=2");

    // --- Hero Background Parallax & Floating ---
    const heroBg = document.querySelector('#hero-bg-img');

    if (heroBg) {
        // Parallax (scroll-based)
        gsap.to(heroBg, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 200,
            ease: 'none'
        });

        // Floating Animation (independent, continuous)
        gsap.to(heroBg, {
            y: '+=50',
            rotation: '+=10',
            scale: '+=0.1',
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'center center'
        });
    }

    // --- Floating Elements Animation ---
    gsap.utils.toArray('.floating-element').forEach((element) => {
        const speed = element.dataset.speed || 0.5;

        gsap.to(element, {
            y: -20 * speed,
            rotation: 5 * speed,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Parallax on scroll
        gsap.to(element, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -100 * speed,
            ease: 'none'
        });
    });

    // --- Text Reveal Animation ---
    gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // --- Feature Cards Stagger ---
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '#features',
            start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // --- Pricing Cards Stagger ---
    gsap.from('.pricing-card', {
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // --- Testimonials Stagger ---
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // --- Magnetic Buttons ---
    const magneticButtons = document.querySelectorAll('[data-magnetic]');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- Smooth Scroll to Anchors & Buttons ---
    const scrollElements = document.querySelectorAll('a[href^="#"], [data-scroll-to]');
    console.log('Found scroll elements:', scrollElements.length);

    scrollElements.forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || this.getAttribute('data-scroll-to');
            console.log('Clicked element, target:', targetId);

            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            console.log('Target element found:', targetElement);

            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -100,
                    duration: 1.5
                });
            }
        });
    });
});
