// ===== SILKY SMOOTH SCROLL ANIMATIONS =====
// Universal animation system for all pages

(function() {
    'use strict';

    // === ANIMATION CONFIG ===
    const ANIMATION_CONFIG = {
        duration: 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Ultra smooth easing
        staggerDelay: 150,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // === UTILITY FUNCTIONS ===
    const utils = {
        // Check if user prefers reduced motion
        prefersReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        // Add CSS transition to element
        addTransition(element, duration = ANIMATION_CONFIG.duration) {
            if (this.prefersReducedMotion()) return;
            
            element.style.transition = `
                opacity ${duration}ms ${ANIMATION_CONFIG.easing},
                transform ${duration}ms ${ANIMATION_CONFIG.easing}
            `;
        },

        // Set initial animation state
        setInitialState(element, animation = 'fadeInUp') {
            if (this.prefersReducedMotion()) return;

            const animations = {
                fadeInUp: {
                    opacity: '0',
                    transform: 'translateY(40px)'
                },
                fadeInLeft: {
                    opacity: '0',
                    transform: 'translateX(-40px)'
                },
                fadeInRight: {
                    opacity: '0',
                    transform: 'translateX(40px)'
                },
                fadeIn: {
                    opacity: '0',
                    transform: 'scale(0.95)'
                },
                slideInUp: {
                    opacity: '0',
                    transform: 'translateY(60px)'
                }
            };

            const state = animations[animation];
            if (state) {
                Object.assign(element.style, state);
            }
        },

        // Trigger animation
        triggerAnimation(element) {
            if (this.prefersReducedMotion()) {
                element.style.opacity = '1';
                element.style.transform = 'none';
                return;
            }

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0) scale(1)';
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
            this.setupIntersectionObserver();
            this.initializeElements();
            this.addScrollProgressIndicator();
            this.addParallaxEffects();
        }

        setupIntersectionObserver() {
            const options = {
                threshold: ANIMATION_CONFIG.threshold,
                rootMargin: ANIMATION_CONFIG.rootMargin
            };

            // Main animation observer
            const mainObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, options);

            // Stagger animation observer for grids
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStaggeredChildren(entry.target);
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            this.observers.set('main', mainObserver);
            this.observers.set('stagger', staggerObserver);
        }

        initializeElements() {
            // Check if mobile device
            const isMobile = window.innerWidth <= 768;
            
            // Define animation selectors and their types
            const animationMap = [
                { selector: '.hero-title', animation: 'slideInUp', delay: isMobile ? 0 : 0 },
                { selector: '.hero-description', animation: 'fadeInUp', delay: isMobile ? 0 : 200 },
                { selector: '.hero-stats', animation: 'fadeInUp', delay: isMobile ? 0 : 400 },
                { selector: '.hero-buttons', animation: 'fadeInUp', delay: isMobile ? 0 : 600 },
                { selector: '.floating-card', animation: 'fadeIn', delay: isMobile ? 0 : 800 },
                { selector: '.section-title', animation: 'fadeInUp', delay: 0 },
                { selector: '.section-description', animation: 'fadeInUp', delay: 100 },
                { selector: '.service-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.stat-item', animation: 'fadeInUp', delay: 0 },
                { selector: '.feature-item', animation: 'fadeInLeft', delay: 0 },
                { selector: '.process-step', animation: 'fadeInUp', delay: 0 },
                { selector: '.testimonial-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.case-study-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.website-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.product-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.reel-card', animation: 'fadeInUp', delay: 0 },
                { selector: '.faq-item', animation: 'fadeInUp', delay: 0 },
                { selector: '.contact-content', animation: 'fadeInUp', delay: 0 },
                { selector: '.why-content', animation: 'fadeInUp', delay: 0 }
            ];

            animationMap.forEach(({ selector, animation, delay }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    // Set initial state
                    utils.setInitialState(element, animation);
                    utils.addTransition(element, ANIMATION_CONFIG.duration + delay);
                    
                    // Add delay for multiple elements
                    if (elements.length > 1) {
                        element.style.transitionDelay = `${delay + (index * 100)}ms`;
                    } else {
                        element.style.transitionDelay = `${delay}ms`;
                    }

                    // Observe for animation
                    this.observers.get('main').observe(element);
                });
            });

            // Setup staggered animations for grids
            const staggerContainers = document.querySelectorAll(`
                .services-grid,
                .stats-grid,
                .features-grid,
                .process-steps,
                .testimonials-grid,
                .case-studies-grid,
                .websites-grid,
                .product-grid,
                .reels-grid,
                .steps-container
            `);

            staggerContainers.forEach(container => {
                this.observers.get('stagger').observe(container);
            });
        }

        animateElement(element) {
            if (utils.prefersReducedMotion()) {
                element.style.opacity = '1';
                element.style.transform = 'none';
                return;
            }

            utils.triggerAnimation(element);
        }

        animateStaggeredChildren(container) {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                if (!this.animatedElements.has(child)) {
                    setTimeout(() => {
                        this.animateElement(child);
                        this.animatedElements.add(child);
                    }, index * ANIMATION_CONFIG.staggerDelay);
                }
            });
        }

        addScrollProgressIndicator() {
            // Create scroll progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #6366f1, #8b5cf6);
                z-index: 1001;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);

            // Update progress on scroll
            const updateProgress = () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            };

            // Throttled scroll listener
            let ticking = false;
            const scrollListener = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateProgress();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', scrollListener);
        }

        addParallaxEffects() {
            const parallaxElements = document.querySelectorAll('.floating-card, .hero');
            
            // Disable parallax on mobile devices to prevent scroll conflicts
            const isMobile = window.innerWidth <= 768;
            if (parallaxElements.length === 0 || utils.prefersReducedMotion() || isMobile) return;

            let ticking = false;
            const updateParallax = () => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach((element, index) => {
                    if (element.classList.contains('floating-card')) {
                        const speed = 0.3 + (index * 0.1);
                        element.style.transform = `translateY(${scrolled * speed}px)`;
                    } else if (element.classList.contains('hero')) {
                        element.style.transform = `translateY(${scrolled * -0.2}px)`;
                    }
                });
                
                ticking = false;
            };

            const parallaxListener = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', parallaxListener);
        }
    }

    // === ENHANCED BUTTON ANIMATIONS ===
    class ButtonAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.setupButtonHovers();
            this.setupMagneticEffects();
        }

        setupButtonHovers() {
            const buttons = document.querySelectorAll(`
                .btn,
                .service-link,
                .case-study-link,
                .step-link,
                .nav-link
            `);

            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    if (!utils.prefersReducedMotion()) {
                        button.style.transform = 'translateY(-2px) scale(1.02)';
                    }
                });

                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0) scale(1)';
                });

                button.addEventListener('mousedown', () => {
                    if (!utils.prefersReducedMotion()) {
                        button.style.transform = 'translateY(0) scale(0.98)';
                    }
                });

                button.addEventListener('mouseup', () => {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                });
            });
        }

        setupMagneticEffects() {
            // Magnetic effects disabled - cursor-following animations removed
            return;
        }
    }

    // === ENHANCED CARD ANIMATIONS ===
    class CardAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.setupCardHovers();
            this.setupCardTilts();
        }

        setupCardHovers() {
            const cards = document.querySelectorAll(`
                .service-card,
                .stat-item,
                .case-study-card,
                .website-card,
                .product-card,
                .testimonial-card,
                .process-step,
                .faq-item
            `);

            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    if (!utils.prefersReducedMotion()) {
                        card.style.transform = 'translateY(-8px) scale(1.02)';
                        card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.boxShadow = '';
                });
            });
        }

        setupCardTilts() {
            // Card tilt effects disabled - cursor-following animations removed
            return;
        }
    }

    // === TEXT ANIMATIONS ===
    class TextAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.setupTypewriterEffect();
            this.setupCounterAnimations();
        }

        setupTypewriterEffect() {
            // Typewriter effect disabled - text displays normally
            return;
        }

        setupCounterAnimations() {
            const counters = document.querySelectorAll('.stat-number, .metric-number');
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }

        animateCounter(element) {
            if (utils.prefersReducedMotion()) return;

            const text = element.textContent.trim();
            const hasPercent = text.includes('%');
            const hasPlus = text.includes('+');
            const hasDollar = text.includes('$');
            const hasM = text.includes('M');
            const hasK = text.includes('K');
            
            // Extract number more carefully
            let targetValue;
            if (hasM && hasDollar) {
                // Handle $5.2M
                targetValue = parseFloat(text.replace(/[$M]/g, ''));
            } else if (hasM) {
                // Handle 2.8M
                targetValue = parseFloat(text.replace(/[M]/g, ''));
            } else if (hasK) {
                // Handle 12.5K
                targetValue = parseFloat(text.replace(/[K]/g, ''));
            } else if (hasPercent) {
                // Handle 347%
                targetValue = parseFloat(text.replace(/[%+]/g, ''));
            } else {
                targetValue = parseFloat(text.replace(/[^0-9.]/g, ''));
            }
            
            if (isNaN(targetValue) || targetValue === 0) return;

            let currentValue = 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ultra smooth easing
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                currentValue = targetValue * easeOutQuart;

                // Format number properly
                let displayValue;
                if (hasDollar && hasM) {
                    displayValue = `$${currentValue.toFixed(1)}M`;
                } else if (hasM) {
                    displayValue = `${currentValue.toFixed(1)}M`;
                } else if (hasK) {
                    displayValue = `${currentValue.toFixed(1)}K`;
                } else if (hasPercent) {
                    displayValue = `${Math.floor(currentValue)}%`;
                } else {
                    displayValue = Math.floor(currentValue).toString();
                }

                element.textContent = displayValue;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Ensure final value is correct
                    element.textContent = text;
                    // Ultra silky smooth bounce with premium easing
                    element.style.transition = 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)';
                    element.style.transform = 'scale(1.03)';
                    setTimeout(() => {
                        element.style.transition = 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1)';
                        element.style.transform = 'scale(1)';
                        setTimeout(() => {
                            element.style.transition = '';
                        }, 500);
                    }, 200);
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // === PAGE TRANSITION EFFECTS ===
    class PageTransitions {
        constructor() {
            this.init();
        }

        init() {
            this.setupPageLoad();
            this.setupPageTransitions();
        }

        setupPageLoad() {
            const isMobile = window.innerWidth <= 768;
            
            // Skip page load animation on mobile to prevent scroll conflicts
            if (isMobile) {
                document.body.style.opacity = '1';
                document.body.style.transform = 'none';
                return;
            }
            
            // Initial page load animation for desktop only
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            
            window.addEventListener('load', () => {
                if (!utils.prefersReducedMotion()) {
                    document.body.style.transition = 'opacity 600ms ease, transform 600ms ease';
                }
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
            });
        }

        setupPageTransitions() {
            const pageLinks = document.querySelectorAll('a[href$=".html"]');
            
            pageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (utils.prefersReducedMotion()) return;

                    e.preventDefault();
                    const href = link.getAttribute('href');
                    
                    // Page exit animation
                    document.body.style.opacity = '0';
                    document.body.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                });
            });
        }
    }

    // === SCROLL EFFECTS ===
    class ScrollEffects {
        constructor() {
            this.init();
        }

        init() {
            this.setupSmoothScrolling();
            this.setupNavbarEffects();
        }

        setupSmoothScrolling() {
            // Enhanced smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    
                    if (target) {
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        setupNavbarEffects() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            let lastScrollTop = 0;
            let ticking = false;

            const updateNavbar = () => {
                const scrollTop = window.pageYOffset;
                
                // Add/remove scrolled class
                navbar.classList.toggle('scrolled', scrollTop > 50);
                
                // Hide/show navbar on scroll (mobile only)
                if (window.innerWidth < 768) {
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            };

            const scrollListener = () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', scrollListener);
        }
    }

    // === INITIALIZATION ===
    function initializeAnimations() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startAnimations);
        } else {
            startAnimations();
        }
    }

    function startAnimations() {
        try {
            const isMobile = window.innerWidth <= 768;
            
            // On mobile, delay animation initialization to prevent scroll conflicts
            if (isMobile) {
                setTimeout(() => {
                    new ScrollAnimationManager();
                    new ButtonAnimations();
                    new CardAnimations();
                    new TextAnimations();
                    new PageTransitions();
                    new ScrollEffects();
                    
                    console.log('🎬 Mobile-optimized animations initialized');
                }, 1000); // 1 second delay to let initial scroll settle
            } else {
                new ScrollAnimationManager();
                new ButtonAnimations();
                new CardAnimations();
                new TextAnimations();
                new PageTransitions();
                new ScrollEffects();
                
                console.log('🎬 Silky smooth animations initialized');
            }
        } catch (error) {
            console.error('Animation initialization error:', error);
        }
    }

    // Start the animation system
    initializeAnimations();

    // === EXPORT FOR DEBUGGING ===
    window.BrandomizeAnimations = {
        utils,
        ScrollAnimationManager,
        ButtonAnimations,
        CardAnimations,
        TextAnimations,
        PageTransitions,
        ScrollEffects
    };

})();
