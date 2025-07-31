/*----------------------------------------------------
  script.js  |  Lavanya R Portfolio
  Updated for Education & Work Experience Tiles & Bootstrap-ready
----------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  
  /*=========== 1. DARK/LIGHT MODE TOGGLE ===========*/
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });


  /*=========== 2. SMOOTH SCROLL FOR ANCHORS WITH OFFSET ===========*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /*=========== 3. BOOTSTRAP NAVBAR AUTO COLLAPSE ON LINK CLICK (MOBILE UX) ===========*/
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse && window.getComputedStyle(navbarCollapse).display !== 'none') {
        bsCollapse.hide();
      }
    });
  });


  /*=========== 4. SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER) ===========*/
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /*=========== 5. SKILL-BAR FILL ANIMATIONS ===========*/
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.progress + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill__bar-fill').forEach(bar => skillObserver.observe(bar));


  function updateScrollArrows() {
    // Project horizontal scroll arrows
    const projectsGrid = document.querySelector('.projects-grid');
    const projectsLeftArrow = document.querySelector('.projects-wrapper .scroll-arrow-left');
    const projectsRightArrow = document.querySelector('.projects-wrapper .scroll-arrow-right');
  
    if (projectsGrid && projectsLeftArrow && projectsRightArrow) {
      const atStart = projectsGrid.scrollLeft <= 10;
      const atEnd = projectsGrid.scrollLeft >= projectsGrid.scrollWidth - projectsGrid.clientWidth - 10;
  
      projectsLeftArrow.disabled = atStart;
      projectsRightArrow.disabled = atEnd;
  
      projectsLeftArrow.style.opacity = atStart ? '0.3' : '1';
      projectsRightArrow.style.opacity = atEnd ? '0.3' : '1';
    }
  
    // Skills horizontal scroll arrows
    const skillsGrid = document.querySelector('.skills-grid');
    const skillsLeftArrow = document.querySelector('.skills-wrapper .scroll-arrow-left');
    const skillsRightArrow = document.querySelector('.skills-wrapper .scroll-arrow-right');
  
    if (skillsGrid && skillsLeftArrow && skillsRightArrow) {
      const atStart = skillsGrid.scrollLeft <= 10;
      const atEnd = skillsGrid.scrollLeft >= skillsGrid.scrollWidth - skillsGrid.clientWidth - 10;
  
      skillsLeftArrow.disabled = atStart;
      skillsRightArrow.disabled = atEnd;
  
      skillsLeftArrow.style.opacity = atStart ? '0.3' : '1';
      skillsRightArrow.style.opacity = atEnd ? '0.3' : '1';
    }
  }
  
  // Add debouncing to prevent flooding scroll events
  function debounce(fn, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  const debouncedUpdateScrollArrows = debounce(updateScrollArrows, 100);
  document.querySelector('.projects-grid')?.addEventListener('scroll', debouncedUpdateScrollArrows);
  document.querySelector('.skills-grid')?.addEventListener('scroll', debouncedUpdateScrollArrows);
  // Initial arrow update
  setTimeout(updateScrollArrows, 200);


  /*=========== 8. TOUCH/SWIPE SUPPORT FOR MOBILE ===========*/
  function addTouchSupport(container) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    container.addEventListener('touchstart', e => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchmove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX)*1.5;
    }, { passive: false });

    container.addEventListener('touchend', () => {
      isDown = false;
    });
  }

  addTouchSupport(document.querySelector('.projects-grid'));
  addTouchSupport(document.querySelector('.skills-grid'));


  /*=========== 9. KEYBOARD NAVIGATION FOR HORIZONTAL SCROLL ===========*/
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const active = document.activeElement.closest('.projects-grid, .skills-grid');
      if (active) {
        e.preventDefault();
        if (active.classList.contains('projects-grid')) {
          window.scrollProjects(e.key === 'ArrowLeft' ? 'left' : 'right');
        } else if (active.classList.contains('skills-grid')) {
          window.scrollSkills(e.key === 'ArrowLeft' ? 'left' : 'right');
        }
      }
    }
  });


  /*=========== 10. BACK TO TOP BUTTON ===========*/
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('to-top--visible', window.scrollY > 600);
    });
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /*=========== 11. CONTACT FORM VALIDATION ===========*/
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      const { name, email, message } = contactForm;
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        alert('Please complete all fields before submitting.');
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate success behavior (replace with actual submission logic)
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    });
  }


  /*=========== 12. LAZY LOADING FOR IMAGES (optional: use data-src) ===========*/
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        observer.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));


  /*=========== 13. LOGO LOAD AND ERROR HANDLING ===========*/
  document.querySelectorAll('.institution-logo, .company-logo, .skill-logo').forEach(logo => {
    logo.style.opacity = '0';
    logo.style.transform = 'scale(0.9)';
    logo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    logo.addEventListener('load', () => {
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
    });

    logo.addEventListener('error', () => {
      logo.style.background = '#f0f0f0';
      logo.style.border = '2px solid #ddd';
      logo.alt = 'Logo not available';
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
    });
  });


  /*=========== 14. TYPING ANIMATION FOR HERO HEADING ===========*/
  const typingEl = document.querySelector('.hero-text h1, .typing-text');
  if (typingEl) {
    const originalText = typingEl.textContent.trim();
    typingEl.textContent = '';
    let i = 0;
    function type() {
      if (i < originalText.length) {
        typingEl.textContent += originalText.charAt(i);
        i++;
        setTimeout(type, 100);
      }
    }
    setTimeout(type, 600);
  }


  /*=========== 15. NAVBAR SCROLL EFFECT ===========*/
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255,255,255,0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      navbar.style.background = 'rgba(255,255,255,0.95)';
      navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
  });


  /*=========== 16. ERROR HANDLING (optional) ===========*/
  window.addEventListener('error', e => console.warn('Portfolio Error:', e.error));
  window.addEventListener('unhandledrejection', e => {
    console.warn('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
  });

});
