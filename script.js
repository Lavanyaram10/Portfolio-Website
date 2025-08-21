/*----------------------------------------------------
  portfolio-enhanced.js | Updated Portfolio JavaScript
  Compatible with updated-portfolio.css and theme-manager.js
  
  Features: Mobile nav toggle, smooth scroll, scroll-reveal, 
           skill-bar animation, horizontal scroll navigation,
           back-to-top button, contact form validation,
           theme integration, performance optimizations
----------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  
  /*=========== 1. MOBILE NAV TOGGLE ===========*/
  const navToggle = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-collapse');

  if (navToggle && navMenu) {
    // Bootstrap handles the toggle, but we can add custom behavior
    navToggle.addEventListener('click', () => {
      // Add custom animations or analytics here if needed
      setTimeout(() => {
        const isOpen = navMenu.classList.contains('show');
        navToggle.setAttribute('aria-expanded', isOpen);
      }, 100);
    });

    // Close menu after clicking any nav link (mobile UX)
    navMenu.querySelectorAll('a[href^="#"]').forEach(link =>
      link.addEventListener('click', () => {
        const bsCollapse = new bootstrap.Collapse(navMenu, {
          toggle: false
        });
        bsCollapse.hide();
      })
    );
  }

  /*=========== 2. SMOOTH SCROLL FOR ANCHORS ===========*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Adjust for fixed navbar height
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
      }
    })
  );

  /*=========== 3. SCROLL-REVEAL ANIMATION ===========*/
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          // Keep observing for better UX (elements can animate out and back in)
        }
      });
    },
    { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all elements with reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /*=========== 4. SKILL-BAR FILL ANIMATION ===========*/
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillItem = entry.target;
          const skillBar = skillItem.querySelector('.skill__bar-fill');
          const progress = skillItem.dataset.skill || '90';
          
          if (skillBar && !skillBar.style.width) {
            setTimeout(() => {
              skillBar.style.width = progress + '%';
            }, 300);
          }
          skillObserver.unobserve(skillItem);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.skill-item').forEach(skill => {
    skillObserver.observe(skill);
  });

  /*=========== 5. BACK-TO-TOP BUTTON ===========*/
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      // Debounce scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const isVisible = window.pageYOffset > 300;
        toTopBtn.classList.toggle('to-top--visible', isVisible);
      }, 10);
    });

    toTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Analytics or feedback
      console.log('Back to top clicked');
    });
  }

  /*=========== 6. CONTACT-FORM VALIDATION ===========*/
  const contactForm = document.querySelector('form'); // Updated selector for the contact form
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const name = formData.get('name') || contactForm.querySelector('#name')?.value;
      const email = formData.get('email') || contactForm.querySelector('#email')?.value;
      const subject = formData.get('subject') || contactForm.querySelector('#subject')?.value;
      const message = formData.get('message') || contactForm.querySelector('#message')?.value;

      // Validation
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        showNotification('Please complete all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual submission logic)
      setTimeout(() => {
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /*=========== 7. HORIZONTAL SCROLL NAVIGATION ===========*/
  window.scrollHorizontal = function(container, direction) {
    const scrollContainer = document.querySelector(container);
    if (!scrollContainer) return;
    
    const scrollAmount = container.includes('project') ? 280 : 260;
    const currentScroll = scrollContainer.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Backwards compatibility
  window.scrollProjects = (direction) => scrollHorizontal('.horizontal-scroll', direction);
  window.scrollSkills = (direction) => scrollHorizontal('.horizontal-scroll', direction);

  /*=========== 8. SCROLL ARROW VISIBILITY ===========*/
  function updateScrollArrows() {
    document.querySelectorAll('.horizontal-scroll').forEach(container => {
      const wrapper = container.closest('.scroll-wrapper, .projects-wrapper, .skills-wrapper');
      if (!wrapper) return;

      const leftArrow = wrapper.querySelector('.scroll-arrow-left, [onclick*="left"]');
      const rightArrow = wrapper.querySelector('.scroll-arrow-right, [onclick*="right"]');
      
      if (leftArrow && rightArrow) {
        const isAtStart = container.scrollLeft <= 10;
        const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 10);
        
        leftArrow.style.opacity = isAtStart ? '0.3' : '1';
        rightArrow.style.opacity = isAtEnd ? '0.3' : '1';
        leftArrow.style.pointerEvents = isAtStart ? 'none' : 'auto';
        rightArrow.style.pointerEvents = isAtEnd ? 'none' : 'auto';
      }
    });
  }

  // Debounce helper
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

  const debouncedUpdateScrollArrows = debounce(updateScrollArrows, 100);

  // Add scroll listeners to all horizontal scroll containers
  document.querySelectorAll('.horizontal-scroll').forEach(container => {
    container.addEventListener('scroll', debouncedUpdateScrollArrows, { passive: true });
  });

  // Initial arrow update
  setTimeout(updateScrollArrows, 500);

  /*=========== 9. TOUCH/SWIPE SUPPORT FOR MOBILE ===========*/
  function addTouchSupport(element) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    let startTime = 0;

    const touchStart = (e) => {
      isDown = true;
      startTime = Date.now();
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    };

    const touchMove = (e) => {
      if (!isDown) return;
      
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
      
      // Prevent default only if we're actually scrolling horizontally
      if (Math.abs(walk) > 10) {
        e.preventDefault();
      }
    };

    const touchEnd = () => {
      isDown = false;
      element.style.cursor = 'grab';
      element.style.userSelect = 'auto';
      
      // Check if it was a click vs drag
      const endTime = Date.now();
      if (endTime - startTime < 200 && Math.abs(element.scrollLeft - scrollLeft) < 5) {
        // It was likely a click, let it bubble up
        return;
      }
    };

    // Touch events
    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('touchmove', touchMove, { passive: false });
    element.addEventListener('touchend', touchEnd, { passive: true });

    // Mouse events for desktop drag
    element.addEventListener('mousedown', touchStart);
    element.addEventListener('mousemove', touchMove);
    element.addEventListener('mouseup', touchEnd);
    element.addEventListener('mouseleave', touchEnd);
  }

  // Add touch support to all horizontal scroll containers
  document.querySelectorAll('.horizontal-scroll').forEach(container => {
    addTouchSupport(container);
    container.style.cursor = 'grab';
  });

  /*=========== 10. KEYBOARD NAVIGATION ===========*/
  document.addEventListener('keydown', (e) => {
    // Only handle arrow keys when focus is on horizontal scroll areas
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const active = document.activeElement;
      const scrollContainer = active.closest('.horizontal-scroll');
      
      if (scrollContainer) {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? 'left' : 'right';
        scrollHorizontal('.' + scrollContainer.classList[0], direction);
      }
    }

    // Theme switching shortcut (if theme manager is not loaded)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      if (!window.themeManager) {
        e.preventDefault();
        toggleSimpleTheme();
      }
    }
  });

  /*=========== 11. NAVBAR SCROLL EFFECT ===========*/
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollY = window.scrollY;
    let navbarTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(navbarTimeout);
      navbarTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        const scrolledPast = currentScrollY > 100;

        // Update navbar appearance based on scroll
        if (scrolledPast) {
          navbar.style.backdropFilter = 'blur(20px)';
          navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.backdropFilter = 'blur(10px)';
          navbar.style.boxShadow = 'var(--shadow-md)';
        }

        lastScrollY = currentScrollY;
      }, 10);
    }, { passive: true });
  }

  /*=========== 12. ENHANCED IMAGE LOADING ===========*/
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Handle data-src lazy loading
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        // Add loaded class for CSS transitions
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });

        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  // Observe all images for lazy loading
  document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });

  /*=========== 13. LOGO LOADING ENHANCEMENT ===========*/
  document.querySelectorAll('.institution-logo, .company-logo, .skill-logo, .profile-photo').forEach(logo => {
    // Set initial loading state
    logo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    if (!logo.complete) {
      logo.style.opacity = '0.6';
      logo.style.transform = 'scale(0.95)';
    }

    const handleLoad = () => {
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
      logo.classList.add('loaded');
    };

    const handleError = () => {
      // Fallback for broken images
      logo.style.opacity = '0.5';
      logo.alt = logo.alt + ' (Image unavailable)';
      logo.classList.add('error');
      console.warn('Failed to load image:', logo.src);
    };

    if (logo.complete) {
      handleLoad();
    } else {
      logo.addEventListener('load', handleLoad);
      logo.addEventListener('error', handleError);
    }
  });

  /*=========== 14. TYPING ANIMATION FOR HERO HEADING ===========*/
  const typingElement = document.querySelector('.hero h1');
  if (typingElement && !typingElement.dataset.typed) {
    const fullText = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.dataset.typed = 'true';
    
    let index = 0;
    const typeSpeed = 80;
    const startDelay = 1000;

    function type() {
      if (index < fullText.length) {
        typingElement.textContent += fullText.charAt(index);
        index++;
        setTimeout(type, typeSpeed);
      } else {
        // Add cursor blink effect
        typingElement.style.borderRight = '2px solid var(--color-primary)';
        setTimeout(() => {
          typingElement.style.borderRight = 'none';
        }, 3000);
      }
    }

    setTimeout(type, startDelay);
  }

  /*=========== 15. THEME INTEGRATION ===========*/
  // Listen for theme changes from theme manager
  window.addEventListener('themechange', (e) => {
    const { theme, isDark } = e.detail;
    
    // Update any theme-dependent elements
    updateThemeDependentElements(isDark);
    
    // Analytics or additional theme-specific logic
    console.log(`Theme changed to: ${theme}`);
  });

  function updateThemeDependentElements(isDark) {
    // Update navbar if needed
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.transition = 'all 0.3s ease';
    }

    // Update any custom elements that need theme-specific behavior
    document.querySelectorAll('.card, .project-card, .skill-item').forEach(card => {
      card.style.transition = 'all 0.3s ease';
    });
  }

  /*=========== 16. SIMPLE THEME TOGGLE (FALLBACK) ===========*/
  function toggleSimpleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('simple-theme', newTheme);
    
    showNotification(`Switched to ${newTheme} theme`, 'info');
  }

  /*=========== 17. NOTIFICATION SYSTEM ===========*/
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-surface);
      color: var(--color-text);
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border-left: 4px solid var(--color-primary);
      z-index: 1003;
      max-width: 350px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    if (type === 'error') {
      notification.style.borderLeftColor = '#ef4444';
    } else if (type === 'success') {
      notification.style.borderLeftColor = '#22c55e';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 4000);
  }

  /*=========== 18. PERFORMANCE MONITORING ===========*/
  // Monitor performance and log slow operations
  function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (end - start > 16) { // More than one frame (16ms)
      console.warn(`Slow operation "${name}": ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }

  /*=========== 19. ACCESSIBILITY ENHANCEMENTS ===========*/
  // Improved focus management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 1004;
    border-radius: 4px;
    transition: top 0.3s ease;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.prepend(skipLink);

  /*=========== 20. INITIALIZATION COMPLETE ===========*/
  console.log('Portfolio JavaScript initialized successfully');
  
  // Dispatch custom event for other scripts
  window.dispatchEvent(new CustomEvent('portfolioready', {
    detail: {
      version: '2.0',
      features: [
        'mobile-nav', 'smooth-scroll', 'scroll-reveal', 'skill-bars',
        'back-to-top', 'form-validation', 'horizontal-scroll', 'touch-support',
        'keyboard-nav', 'navbar-effects', 'image-loading', 'typing-animation',
        'theme-integration', 'accessibility', 'performance-monitoring'
      ]
    }
  }));
});

/*=========== ERROR HANDLING ===========*/
window.addEventListener('error', (e) => {
  console.error('Portfolio JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

/*=========== EXPORT FOR MODULE USAGE ===========*/
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    scrollHorizontal: window.scrollHorizontal,
    showNotification: (msg, type) => showNotification(msg, type)
  };
}