// ============================
// TaskFlow AI — Landing Page Scripts
// ============================

(function () {
  'use strict';

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Scroll-reveal animation ----
  // Add .fade-in to all animatable elements
  var animatableSelectors = [
    '.feature-card',
    '.step-card',
    '.testimonial-card',
    '.pricing-card',
    '.faq-item',
    '.section-header',
    '.hero-content',
    '.hero-visual',
    '.cta-card',
  ];

  var animatables = document.querySelectorAll(animatableSelectors.join(','));

  animatables.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatables.forEach(function (el) {
    observer.observe(el);
  });

  // ---- Active nav link highlighting ----
  var sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--color-primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();
})();
