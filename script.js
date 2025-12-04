// Simplified script without Lenis and GSAP
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scroll to Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                }
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');

    if (mobileMenuBtn && mobileMenu && menuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');

            // Animate icon
            if (mobileMenu.classList.contains('block')) {
                menuIcon.textContent = 'close';
                menuIcon.style.transform = 'rotate(180deg)';
            } else {
                menuIcon.textContent = 'menu';
                menuIcon.style.transform = 'rotate(0deg)';
            }
        });

        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                menuIcon.textContent = 'menu';
                menuIcon.style.transform = 'rotate(0deg)';
            });
        });
    }

    // --- Results Number Counter (Simple Version) ---
    const resultNumbers = document.querySelectorAll('.result-number');
    if (resultNumbers.length) {
        const animateCounter = (el) => {
            const target = parseFloat(el.dataset.target || '0');
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            const duration = 2000; // 2 seconds
            const start = 0;
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = `${prefix}${current.toFixed(decimals).replace('.', ',')}${suffix}`;
            }, 16);
        };

        // Simple intersection observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        resultNumbers.forEach(el => observer.observe(el));
    }

    // --- Contact Form Submission ---
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
}); c