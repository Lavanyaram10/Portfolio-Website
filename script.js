/*----------------------------------------------------
  script.js  |  Lavanya R Portfolio
  Updated for Education & Work Experience Tiles
  Features: Mobile nav, smooth scroll, scroll-reveal animations,
           skill-bar fill animation, horizontal scroll navigation,
           back-to-top button, contact form validation
----------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  /*=========== 1. MOBILE NAV TOGGLE ===========*/
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu--open');
      navToggle.classList.toggle('nav-toggle--open');
    });

    /*-- Close menu after clicking any nav link (mobile UX) */
    navMenu.querySelectorAll('a[href^="#"]').forEach(link =>
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu--open');
        navToggle.classList.remove('nav-toggle--open');
      })
    );
  }

  /*=========== 2. SMOOTH SCROLL FOR ANCHORS ===========*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    })
  );

  /*=========== 3. SCROLL-REVEAL ANIMATION ===========*/
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  // This will automatically include education tiles and work items with .reveal class
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /*=========== 4. SKILL-BAR FILL ANIMATION ===========*/
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.progress + '%';
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill__bar-fill').forEach(bar => skillObserver.observe(bar));

  /*=========== 5. BACK-TO-TOP BUTTON ===========*/
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('to-top--visible', window.scrollY > 600);
    });
    toTopBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /*=========== 6. CONTACT-FORM VALIDATION ===========*/
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      const { name, email, message } = contactForm;
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        alert('Please complete all fields before submitting.');
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }
      
      // If form is valid, show success message (you can replace this with actual form submission)
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    });
  }

  /*=========== 7. HORIZONTAL SCROLL NAVIGATION ===========*/
  // Projects horizontal scroll
  window.scrollProjects = function(direction) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      const scrollAmount = 300;
      const currentScroll = projectsGrid.scrollLeft;
      
      if (direction === 'left') {
        projectsGrid.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        projectsGrid.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Skills horizontal scroll
  window.scrollSkills = function(direction) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      const scrollAmount = 260;
      const currentScroll = skillsGrid.scrollLeft;
      
      if (direction === 'left') {
        skillsGrid.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        skillsGrid.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  /*=========== 8. SCROLL ARROW VISIBILITY ===========*/
  function updateScrollArrows() {
    // Projects arrows
    const projectsGrid = document.querySelector('.projects-grid');
    const projectsLeftArrow = document.querySelector('.projects-wrapper .scroll-arrow-left');
    const projectsRightArrow = document.querySelector('.projects-wrapper .scroll-arrow-right');
    
    if (projectsGrid && projectsLeftArrow && projectsRightArrow) {
      const isAtStart = projectsGrid.scrollLeft <= 10;
      const isAtEnd = projectsGrid.scrollLeft >= (projectsGrid.scrollWidth - projectsGrid.clientWidth - 10);
      
      projectsLeftArrow.style.opacity = isAtStart ? '0.3' : '1';
      projectsRightArrow.style.opacity = isAtEnd ? '0.3' : '1';
      projectsLeftArrow.disabled = isAtStart;
      projectsRightArrow.disabled = isAtEnd;
    }

    // Skills arrows
    const skillsGrid = document.querySelector('.skills-grid');
    const skillsLeftArrow = document.querySelector('.skills-wrapper .scroll-arrow-left');
    const skillsRightArrow = document.querySelector('.skills-wrapper .scroll-arrow-right');
    
    if (skillsGrid && skillsLeftArrow && skillsRightArrow) {
      const isAtStart = skillsGrid.scrollLeft <= 10;
      const isAtEnd = skillsGrid.scrollLeft >= (skillsGrid.scrollWidth - skillsGrid.clientWidth - 10);
      
      skillsLeftArrow.style.opacity = isAtStart ? '0.3' : '1';
      skillsRightArrow.style.opacity = isAtEnd ? '0.3' : '1';
      skillsLeftArrow.disabled = isAtStart;
      skillsRightArrow.disabled = isAtEnd;
    }
  }

  // Update arrow visibility on scroll
  document.querySelector('.projects-grid')?.addEventListener('scroll', updateScrollArrows);
  document.querySelector('.skills-grid')?.addEventListener('scroll', updateScrollArrows);

  // Initial arrow state
  setTimeout(updateScrollArrows, 100);

  /*=========== 9. TOUCH/SWIPE SUPPORT FOR MOBILE ===========*/
  function addTouchSupport(element) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    element.addEventListener('touchstart', e => {
      isDown = true;
      startX = e.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('touchmove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    });

    element.addEventListener('touchend', () => {
      isDown = false;
    });
  }

  // Apply touch support to horizontal scroll containers
  const projectsGrid = document.querySelector('.projects-grid');
  const skillsGrid = document.querySelector('.skills-grid');
  
  if (projectsGrid) addTouchSupport(projectsGrid);
  if (skillsGrid) addTouchSupport(skillsGrid);

  /*=========== 10. KEYBOARD NAVIGATION ===========*/
  document.addEventListener('keydown', e => {
    // Arrow key navigation for horizontal scroll sections
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeElement = document.activeElement;
      
      if (activeElement.closest('.projects-grid')) {
        e.preventDefault();
        scrollProjects(e.key === 'ArrowLeft' ? 'left' : 'right');
      } else if (activeElement.closest('.skills-grid')) {
        e.preventDefault();
        scrollSkills(e.key === 'ArrowLeft' ? 'left' : 'right');
      }
    }
  });

  /*=========== 11. NAVBAR SCROLL EFFECT ===========*/
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add background on scroll
    if (scrollTop > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, false);

  /*=========== 12. LAZY LOADING FOR IMAGES ===========*/
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  /*=========== 13. LOGO LOADING ENHANCEMENT ===========*/
  // Add loading states for education and company logos
  document.querySelectorAll('.institution-logo, .company-logo, .skill-logo').forEach(logo => {
    logo.addEventListener('load', () => {
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
    });
    
    logo.addEventListener('error', () => {
      // Set a default placeholder if logo fails to load
      logo.style.background = '#f0f0f0';
      logo.style.border = '2px solid #ddd';
      logo.alt = 'Logo not available';
    });

    // Initial state for smooth loading animation
    logo.style.opacity = '0';
    logo.style.transform = 'scale(0.8)';
    logo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  /*=========== 14. TYPING ANIMATION (OPTIONAL) ===========*/
  const typewriterText = document.querySelector('.hero-text h1');
  if (typewriterText) {
    const originalText = typewriterText.textContent;
    typewriterText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        typewriterText.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
  }

  /*=========== 15. PERFORMANCE OPTIMIZATIONS ===========*/
  // Debounce scroll events
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

  // Apply debouncing to scroll-intensive functions
  const debouncedUpdateArrows = debounce(updateScrollArrows, 100);
  document.querySelector('.projects-grid')?.addEventListener('scroll', debouncedUpdateArrows);
  document.querySelector('.skills-grid')?.addEventListener('scroll', debouncedUpdateArrows);

  /*=========== 16. ERROR HANDLING ===========*/
  window.addEventListener('error', e => {
    console.warn('Portfolio Error:', e.error);
    // Graceful degradation - don't show errors to users
  });

  // Handle promise rejections
  window.addEventListener('unhandledrejection', e => {
    console.warn('Portfolio Promise Rejection:', e.reason);
    e.preventDefault();
  });

  /*=========== 17. INITIALIZATION COMPLETE ===========*/
  console.log('Lavanya R Portfolio - Fully Loaded');
  
  // Trigger initial animations
  document.body.classList.add('loaded');
  
  // Final setup
  setTimeout(() => {
    updateScrollArrows();
    // Trigger any remaining reveal animations
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach(el => {
      if (isElementInViewport(el)) {
        el.classList.add('reveal--visible');
      }
    });
  }, 500);
});

/*=========== UTILITY FUNCTIONS ===========*/
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export functions for global access
window.portfolioUtils = {
  scrollProjects: window.scrollProjects,
  scrollSkills: window.scrollSkills,
  isElementInViewport
};