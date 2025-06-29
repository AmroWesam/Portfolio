document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen Management
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    // Show loading screen initially
    body.classList.add('no-scroll');
    
    // Hide loading screen after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            body.classList.remove('no-scroll');
        }, 1500); // Minimum loading time for better UX
    });

    // Progress Bar
    const progressBar = document.getElementById('myBar');
    const progressContainer = document.querySelector('.progress-container');
    
    function updateScrollProgress() {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset;
        const scrollPercentage = (scrollPosition / scrollTotal) * 100;
        
        progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
        
        // Show/hide progress bar based on scroll position
        if (scrollPosition > 100) {
            progressContainer.classList.add('visible');
        } else {
            progressContainer.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Enhanced Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add keyboard support for hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });

    // Enhanced smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Active Navigation Link Update
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Enhanced Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    
    function updateNavbarOnScroll() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbarOnScroll);

    // Enhanced Contact Form Validation and Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Form field validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: 'Message must be between 10-500 characters'
        }
    };

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.addEventListener('blur', () => validateField(field, errorElement));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    validateField(field, errorElement);
                }
            });
        }
    });

    // Character counter for message field
    const messageField = contactForm.querySelector('[name="message"]');
    const charCount = document.getElementById('char-count');
    const characterCounter = document.querySelector('.character-count');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            characterCounter.classList.remove('warning', 'error');
            
            if (currentLength > 450) {
                characterCounter.classList.add('error');
            } else if (currentLength > 400) {
                characterCounter.classList.add('warning');
            }
        });
    }

    function validateField(field, errorElement) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = validationRules[fieldName];
        
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }

        // Pattern validation
        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }

        // Length validation
        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message;
        }

        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.message;
        }

        // Update field appearance
        field.classList.remove('valid', 'invalid');
        if (value) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Show/hide error message
        if (errorMessage) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            errorElement.classList.remove('show');
        }

        return isValid;
    }

    // Form submission with enhanced validation
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            const errorElement = document.getElementById(`${fieldName}-error`);
            
            if (field && errorElement) {
                if (!validateField(field, errorElement)) {
                    isFormValid = false;
                }
            }
        });

        if (!isFormValid) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(new FormData(contactForm));
            
            // Success state
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset character counter
            if (charCount) charCount.textContent = '0';
            if (characterCounter) characterCounter.classList.remove('warning', 'error');
            
            // Remove validation classes
            contactForm.querySelectorAll('.valid, .invalid').forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Simulate form submission (replace with actual implementation)
    function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }

    // Enhanced Notification System
    let notificationId = 0;
    
    function showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        const id = ++notificationId;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-id', id);
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            soon: 'fas fa-hourglass-half'
        };
        
        const titleMap = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information',
            soon: 'Coming Soon'
        };
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${iconMap[type]}"></i>
                    ${titleMap[type]}
                </div>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Add to container
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(notification);
            }, duration);
        }
        
        return id;
    }
    
    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    function updateBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', updateBackToTopButton);

    // Typing animation for hero section
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        const titles = [
            'Front-End Developer',
            'React Specialist',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Creative Thinker'
        ];
        
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseDuration = 2000;
        
        function typeAnimation() {
            const currentTitle = titles[titleIndex];
            
            if (isDeleting) {
                typedTextElement.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    setTimeout(typeAnimation, 500);
                } else {
                    setTimeout(typeAnimation, deletingSpeed);
                }
            } else {
                typedTextElement.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentTitle.length) {
                    isDeleting = true;
                    setTimeout(typeAnimation, pauseDuration);
                } else {
                    setTimeout(typeAnimation, typingSpeed);
                }
            }
        }
        
        // Start typing animation after page load
        setTimeout(typeAnimation, 1500);
    }

    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .contact-method');
    animateElements.forEach(el => observer.observe(el));

    // Hero Stats Animation
    function animateHeroStats() {
        const statsElements = document.querySelectorAll('.stat-number');
        statsElements.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target')) || parseInt(stat.textContent);
            stat.setAttribute('data-target', target);
            
            setTimeout(() => {
                animateCounter(stat, target);
            }, index * 200);
        });
    }

    // Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Trigger hero stats animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateHeroStats();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        heroObserver.observe(heroSection);

        // About Stats Animation
        const aboutStats = document.querySelector('#about .about-stats');
        if (aboutStats) {
            const aboutObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        aboutStats.querySelectorAll('.stat h3').forEach(el => {
                            const target = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
                            animateCounter(el, target, 2000);
                        });
                        obs.unobserve(entry.target);
                    }
                });
            }, {threshold: 0.3});
            aboutObserver.observe(aboutStats);
        }
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key functionality
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
            
            // Close any open notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                removeNotification(notification);
            });
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(() => {
        updateScrollProgress();
        updateActiveNavLink();
        updateNavbarOnScroll();
        updateBackToTopButton();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize page
    function initializePage() {
        // Set up lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Initialize tooltips and other enhancements
        updateActiveNavLink();
        updateNavbarOnScroll();
        updateBackToTopButton();
        updateScrollProgress();
        
        // Show welcome notification after page loads
        setTimeout(() => {
            showNotification('Welcome to my portfolio! Feel free to explore and get in touch.', 'info', 4000);
        }, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }

    // Handle form reset
    window.addEventListener('beforeunload', function() {
        // Clean up any ongoing animations or timeouts
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            removeNotification(notification);
        });
    });

    // Add error handling for async operations
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('An unexpected error occurred. Please refresh the page.', 'error');
    });

    // Accessibility improvements
    function enhanceAccessibility() {
        // Add focus indicators for custom elements
        document.querySelectorAll('.social-link, .project-card, .skill-item').forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Add aria-labels where needed
        const downloadBtn = document.querySelector('.btn-secondary');
        if (downloadBtn && !downloadBtn.getAttribute('aria-label')) {
            downloadBtn.setAttribute('aria-label', 'Download resume PDF');
        }

        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.id && heading.textContent) {
                heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            }
        });
    }

    // Apply accessibility enhancements
    enhanceAccessibility();

    // Skill Level Color System
    function applySkillLevelColors() {
        const skillLevels = document.querySelectorAll('.skill-level');
        
        skillLevels.forEach(skillLevel => {
            const level = skillLevel.textContent.trim().toLowerCase();
            
            // Remove any existing level classes
            skillLevel.classList.remove('level-advanced', 'level-intermediate', 'level-beginner', 'level-expert');
            
            // Apply appropriate class based on skill level
            switch(level) {
                case 'advanced':
                    skillLevel.classList.add('level-advanced');
                    break;
                case 'intermediate':
                    skillLevel.classList.add('level-intermediate');
                    break;
                case 'beginner':
                    skillLevel.classList.add('level-beginner');
                    break;
                case 'expert':
                    skillLevel.classList.add('level-expert');
                    break;
                default:
                    skillLevel.classList.add('level-intermediate'); // Default fallback
            }
        });
    }

    // Apply skill level colors on page load
    applySkillLevelColors();

    // Apply colors to project tech tags
    applyProjectTechColors();

    // Handle Download CV button (feature coming soon)
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('This feature will be available soon!', 'soon', 4000);
        });
    }
    
    // Add print styles support
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
});

// Apply colors to project technology tags
function applyProjectTechColors() {
    const techColors = {
        'react': { bg: 'linear-gradient(135deg, #61dafb 0%, #21d4fd 100%)', shadow: 'rgba(97, 218, 251, 0.3)' },
        'typescript': { bg: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)', shadow: 'rgba(49, 120, 198, 0.3)' },
        'tailwind css': { bg: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', shadow: 'rgba(56, 189, 248, 0.3)' },
        'firebase': { bg: 'linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)', shadow: 'rgba(255, 202, 40, 0.3)' },
        'vue.js': { bg: 'linear-gradient(135deg, #4fc08d 0%, #42b883 100%)', shadow: 'rgba(79, 192, 141, 0.3)' },
        'javascript': { bg: 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)', shadow: 'rgba(247, 223, 30, 0.3)', color: '#333' },
        'scss': { bg: 'linear-gradient(135deg, #cc6699 0%, #bf5f82 100%)', shadow: 'rgba(204, 102, 153, 0.3)' },
        'html5': { bg: 'linear-gradient(135deg, #e34f26 0%, #f56500 100%)', shadow: 'rgba(227, 79, 38, 0.3)' },
        'css3': { bg: 'linear-gradient(135deg, #1572b6 0%, #2196f3 100%)', shadow: 'rgba(21, 114, 182, 0.3)' },
        'vanilla js': { bg: 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)', shadow: 'rgba(247, 223, 30, 0.3)', color: '#333' },
        'rest api': { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
        'ai integration': { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.3)' }
    };

    document.querySelectorAll('.tech-tag').forEach(tag => {
        const techName = tag.textContent.toLowerCase();
        const colorInfo = techColors[techName];
        
        if (colorInfo) {
            tag.style.background = colorInfo.bg;
            tag.style.boxShadow = `0 2px 8px ${colorInfo.shadow}`;
            if (colorInfo.color) {
                tag.style.color = colorInfo.color;
            }
        }
    });
}
