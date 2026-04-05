"use strict";

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Burger Menu
    // ==========================================
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const overlay = document.querySelector('.header__overlay');
    const navLinks = document.querySelectorAll('.header__nav-link, .header__cta--mobile');

    const toggleMenu = () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
        overlay.classList.toggle('header__overlay--active');
        document.body.style.overflow = nav.classList.contains('header__nav--active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        burger.classList.remove('header__burger--active');
        nav.classList.remove('header__nav--active');
        overlay.classList.remove('header__overlay--active');
        document.body.style.overflow = '';
    };

    if (burger && overlay) {
        burger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        navLinks.forEach(link => link.addEventListener('click', closeMenu));
    }


    // ==========================================
    // 2. Dark/Light Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('.theme-toggle__icon');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark theme logic in HTML, but we use [data-theme='dark'] explicitly now
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '🌞'; // Show Sun for dark theme to switch to light
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌗'; // Show Moon for light theme to switch to dark
        }
    };
    
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }


    // ==========================================
    // 3. Scroll Animations (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const animationObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, animationObserverOptions);

    animatedElements.forEach(el => animationObserver.observe(el));


    // ==========================================
    // 4. Gallery Filter
    // ==========================================
    const filterBtns = document.querySelectorAll('.gallery__filter-btn');
    const galleryItems = document.querySelectorAll('.gallery__item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    // Start fade out
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            // Trigger reflow to apply transition
                            void item.offsetWidth;
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        } else {
                            item.style.display = 'none';
                        }
                    }, 300); // Wait for fade out
                });
            });
        });
    }


    // ==========================================
    // 5. Modals (Success, Info, Interactive elements)
    // ==========================================
    const modals = document.querySelectorAll('.modal');
    const successModal = document.getElementById('success-modal');
    const infoModal = document.getElementById('info-modal');
    
    // Open modal function
    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close modal function
    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on buttons or overlay
    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // Handle Contact Form Submit -> Show Success Modal
    const contactForm = document.querySelector('.contact__form form');
    if (contactForm && successModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop actual submit
            
            // Simple validation simulation
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            
            if (name && email) {
                contactForm.reset();
                openModal(successModal);
            }
        });
    }

    // Handle "Дізнатися більше" clicks to show Info Modal
    const featuresLinks = document.querySelectorAll('.features__card-link');
    const modalDynamicText = document.getElementById('modal-dynamic-text');

    if (infoModal && modalDynamicText) {
        featuresLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Stop link navigation
                const cardTitle = e.target.closest('.features__card').querySelector('.features__card-title').textContent;
                
                modalDynamicText.textContent = `Тут можна розмістити детальну інтерактивну інформацію про "${cardTitle}". Ми використовуємо ES6+ для динамічної зміни цього тексту.`;
                openModal(infoModal);
            });
        });
    }
});
