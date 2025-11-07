// ===== SMOOTH SCROLL ANIMATIONS - FIXED VERSION =====
// No scroll manipulation, pure intersection-based animations

(function() {
    'use strict';

    // === ANIMATION CONFIG ===
    const ANIMATION_CONFIG = {
        duration: 600,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        staggerDelay: 100,
        threshold: 0.15
    };

    // === UTILITY FUNCTIONS ===
    const utils = {
        prefersReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        addTransition(element, duration = ANIMATION_CONFIG.duration) {
            if (this.prefersReducedMotion()) return;
            
            element.style.transition = `opacity ${duration}ms ${ANIMATION_CONFIG.easing}, transform ${duration}ms ${ANIMATION_CONFIG.easing}`;
        },

        setInitialState(element) {
            if (this.prefersReducedMotion()) {
                element.style.opacity = '1';
                return;
            }

            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        },

        triggerAnimation(element) {
            if (this.prefersReducedMotion()) {
                element.style.opacity = '1';
                element.style.transform = 'none';
                return;
            }

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('animated');
            });
        }
    };

    // === SCROLL ANIMATION MANAGER ===
    class ScrollAnimationManager {
        constructor() {
            this.observers = new Map();
            this.animatedElements = new Set();
            this.init();
        }

        init() {
            // Wait for DOM to be fully loaded before initializing
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
            } else {
                this.setupAnimations();
            }
        }

        setupAnimations() {
            this.setupIntersectionObserver();
            this.initializeElements();
            this.addScrollProgressIndicator();
            this.setupNavbarEffects();
        }

        setupIntersectionObserver() {
            const options = {
                threshold: ANIMATION_CONFIG.threshold,
                rootMargin: '0px'
            };

            const mainObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, options);

            this.observers.set('main', mainObserver);
        }

        initializeElements() {
            const animationSelectors = [
                '.animate-on-scroll',
                '.hero-content',
                '.section-title',
                '.section-description',
                '.service-card',
                '.feature-card',
                '.stat-item',
                '.testimonial-card',
                '.case-study-card',
                '.website-card',
                '.product-card',
                '.pricing-card',
                '.team-member',
                '.process-step',
                '.faq-item'
            ];

            animationSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    utils.setInitialState(element);
                    utils.addTransition(element, ANIMATION_CONFIG.duration + (index * 50));
                    this.observers.get('main').observe(element);
                });
            });
        }

        animateElement(element) {
            utils.triggerAnimation(element);
        }

        addScrollProgressIndicator() {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 2px;
                background: linear-gradient(90deg, #6366f1, #8b5cf6);
                z-index: 10000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);

            let ticking = false;
            const updateProgress = () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateProgress);
                    ticking = true;
                }
            }, { passive: true });
        }

        setupNavbarEffects() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            let lastScrollTop = 0;
            let ticking = false;

            const updateNavbar = () => {
                const scrollTop = window.pageYOffset;
                navbar.classList.toggle('scrolled', scrollTop > 50);
                lastScrollTop = scrollTop;
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            }, { passive: true });
        }
    }

    // === BUTTON ANIMATIONS ===
    class ButtonAnimations {
        constructor() {
            this.init();
        }

        init() {
            const buttons = document.querySelectorAll('.btn, .nav-link');
            buttons.forEach(button => {
                button.style.transition = 'all 0.3s ease';
            });
        }
    }

    // === INITIALIZATION ===
    function initializeAnimations() {
        try {
            new ScrollAnimationManager();
            new ButtonAnimations();
            console.log('✓ Animations initialized');
        } catch (error) {
            console.error('Animation initialization error:', error);
        }
    }

    // Start when DOM is ready - NO SCROLL MANIPULATION
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
        initializeAnimations();
    }

})();
