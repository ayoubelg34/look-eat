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
let lenisScrollY = 0;
lenis.on('scroll', ({ scroll }) => {
    lenisScrollY = scroll;
    ScrollTrigger.update();
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
        if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
        }
        return lenisScrollY;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
});
ScrollTrigger.addEventListener('refresh', () => lenis.update());
ScrollTrigger.refresh();

document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Animation (Immediate) ---
    const heroTimeline = gsap.timeline();

    heroTimeline
        .from('.hero-title div', {
            y: '100%',
            duration: 1.5,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 0.2
        })
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
        }, "-=1");

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

    // --- Text Reveal Animation (Smoother) ---
    gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.fromTo(element,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
    });

    // --- General Fade In Up ---
    // You can add 'fade-in-up' class to any element to animate it
    gsap.utils.toArray('.fade-in-up').forEach((element) => {
        gsap.fromTo(element,
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
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

    // --- Section Reveal (light fade/slide) ---
    gsap.utils.toArray('main section').forEach((section, index) => {
        if (index === 0) return; // skip hero
        gsap.fromTo(section,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            });
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
    document.querySelectorAll('a[href^="#"], [data-scroll-to]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || this.getAttribute('data-scroll-to');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement);
            }
        });
    });

    // --- Reveal Animations (IntersectionObserver) ---
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay || '0', 10);
                    if (delay) {
                        el.style.transitionDelay = `${delay}ms`;
                    }
                    el.classList.add('active');
                    obs.unobserve(el);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        revealItems.forEach((el) => observer.observe(el));
    }

    // --- Results Number Counter ---
    const resultNumbers = document.querySelectorAll('.result-number');
    if (resultNumbers.length) {
        const formatValue = (value, decimals = 0) =>
            value.toFixed(decimals).replace('.', ',');

        let countersPlayed = false;
        const playCounters = () => {
            if (countersPlayed) return;
            countersPlayed = true;
            resultNumbers.forEach((el) => {
                const target = parseFloat(el.dataset.target || '0');
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                const decimals = parseInt(el.dataset.decimals || '0', 10);
                const counter = { value: 0 };

                gsap.to(counter, {
                    value: target,
                    duration: 1.8,
                    ease: 'power1.out',
                    onUpdate: () => {
                        el.textContent = `${prefix}${formatValue(counter.value, decimals)}${suffix}`;
                    }
                });
            });
        };

        ScrollTrigger.create({
            trigger: '#results',
            start: 'top 80%',
            once: true,
            onEnter: playCounters,
        });

        // Fallback if already visible on load
        const resultsSection = document.querySelector('#results');
        if (resultsSection) {
            const rect = resultsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                playCounters();
            }
        }
    }
    // --- Contact Form -> Mailto ---
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('name')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();
            const restaurant = (document.getElementById('restaurant')?.value || '').trim();
            const message = (document.getElementById('message')?.value || '').trim();

            const subject = `Demande de démo - ${restaurant || name || 'Look-Eat'}`;
            const body = [
                `Nom : ${name || 'Non renseigné'}`,
                `Email : ${email || 'Non renseigné'}`,
                `Restaurant : ${restaurant || 'Non renseigné'}`,
                '',
                'Message :',
                message || 'Non renseigné'
            ].join('\n');

            const mailtoUrl = `mailto:boutelga2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        });
    }
});
