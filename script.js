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
        .from('.hero-badge', {
            opacity: 0,
            y: -10,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1
        })
        .from('.hero-title-line', {
            y: '110%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        }, "-=0.4")
        .from('.hero-subtitle', {
            opacity: 0,
            y: 16,
            duration: 0.9,
            ease: 'power3.out'
        }, "-=0.8")
        .from('.hero-cta', {
            opacity: 0,
            y: 16,
            duration: 0.9,
            ease: 'power3.out'
        }, "-=0.7")
        .from('.hero-video-card', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.6")
        .from('.hero-video-card .hero-video-badge', {
            opacity: 0,
            y: 14,
            duration: 0.6,
            ease: 'power2.out'
        }, "-=0.6")
        .to('.floating-element', {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out'
        }, "-=0.7");

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

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
        });

        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
            });
        });
    }

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
    // --- Contact Form Submission with Web3Forms ---
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');
            const formMessage = document.getElementById('formMessage');

            // Show loading state
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            formMessage.classList.add('hidden');

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Success
                    formMessage.textContent = '✓ Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.';
                    formMessage.className = 'p-4 rounded-xl text-center font-medium bg-green-100 text-green-800';
                    formMessage.classList.remove('hidden');
                    contactForm.reset();
                } else {
                    // Error from API
                    throw new Error(data.message || 'Erreur lors de l\'envoi');
                }
            } catch (error) {
                // Network or other error
                formMessage.textContent = '✗ Une erreur est survenue. Veuillez réessayer.';
                formMessage.className = 'p-4 rounded-xl text-center font-medium bg-red-100 text-red-800';
                formMessage.classList.remove('hidden');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            }
        });
    }
});
