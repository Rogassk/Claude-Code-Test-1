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
    '.demo-window',
    '.demo-cta-wrapper',
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

  // ---- Product Demo: Tab switching ----
  function setupDemoTabs(tabAttr, containerSelector) {
    var container = containerSelector
      ? document.querySelector(containerSelector)
      : document;
    if (!container) return;

    var links = container.querySelectorAll('[' + tabAttr + ']');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var targetId = link.getAttribute(tabAttr);

        // Deactivate all links
        links.forEach(function (l) {
          l.classList.remove('demo-sidebar-link--active');
        });
        link.classList.add('demo-sidebar-link--active');

        // Switch views
        var parent = link.closest('.demo-body');
        if (!parent) return;
        var views = parent.querySelectorAll('.demo-view');
        views.forEach(function (v) {
          v.classList.remove('demo-view--active');
        });

        var target = document.getElementById(targetId);
        if (target) {
          target.classList.add('demo-view--active');
          // Trigger chart animations when analytics is shown
          if (targetId.indexOf('analytics') !== -1) {
            animateCharts(target);
          }
        }
      });
    });
  }

  setupDemoTabs('data-demo-tab');
  setupDemoTabs('data-modal-tab', '#demoModal');

  // ---- Product Demo: Task checkbox interaction ----
  function setupTaskChecks(container) {
    var tasks = container.querySelectorAll('.demo-task[data-interactive]');
    tasks.forEach(function (task) {
      var check = task.querySelector('.demo-task-check');
      if (!check) return;
      check.addEventListener('click', function (e) {
        e.stopPropagation();
        var isCompleted = task.classList.toggle('demo-task--completed');
        check.classList.toggle('demo-task-check--done');

        // Update task meta text
        var meta = task.querySelector('.demo-task-meta');
        if (meta) {
          if (isCompleted) {
            meta.setAttribute('data-original', meta.textContent);
            var category = meta.textContent.split('\u00B7')[1] || '';
            meta.textContent = 'Completed \u00B7' + category;
          } else {
            var orig = meta.getAttribute('data-original');
            if (orig) meta.textContent = orig;
          }
        }
      });
    });
  }

  // Set up task checks on the inline demo and modal
  var demoSection = document.querySelector('.product-demo .demo-body');
  if (demoSection) setupTaskChecks(demoSection);

  // ---- Product Demo: Chart animations ----
  function animateCharts(container) {
    // Bar charts
    var bars = container.querySelectorAll('.demo-chart-bar');
    bars.forEach(function (bar, i) {
      bar.classList.remove('demo-chart-bar--animated');
      var h = bar.getAttribute('data-height');
      bar.style.setProperty('--bar-height', h);
      setTimeout(function () {
        bar.classList.add('demo-chart-bar--animated');
      }, i * 80);
    });

    // Breakdown bars
    var fills = container.querySelectorAll('.demo-breakdown-bar-fill');
    fills.forEach(function (fill, i) {
      fill.classList.remove('demo-breakdown-bar--animated');
      var w = fill.getAttribute('data-width');
      fill.style.setProperty('--fill-width', w);
      setTimeout(function () {
        fill.classList.add('demo-breakdown-bar--animated');
      }, 300 + i * 100);
    });
  }

  // Animate charts in inline demo when scrolled into view
  var demoAnalyticsView = document.getElementById('demo-analytics');
  if (demoAnalyticsView) {
    var chartObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCharts(entry.target);
            chartObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Also animate when the demo section first becomes visible
    var demoSectionEl = document.getElementById('product-demo');
    if (demoSectionEl) {
      var demoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              // Animate analytics charts if it's the active view
              var activeView = demoSectionEl.querySelector('.demo-view--active');
              if (activeView && activeView.id === 'demo-analytics') {
                animateCharts(activeView);
              }
              demoObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      demoObserver.observe(demoSectionEl);
    }
  }

  // ---- Demo Modal ----
  var modalOverlay = document.getElementById('demoModal');
  var openBtn = document.getElementById('openDemoModal');
  var closeBtn = document.getElementById('closeDemoModal');

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('demo-modal--open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Set up task checks in modal
    var modalBody = modalOverlay.querySelector('.demo-body');
    if (modalBody) setupTaskChecks(modalBody);

    // Animate charts if analytics is the active modal view
    var activeModalView = modalOverlay.querySelector('.demo-view--active');
    if (activeModalView && activeModalView.id === 'modal-analytics') {
      animateCharts(activeModalView);
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('demo-modal--open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close modal on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close modal on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ---- Modal: Add new task ----
  var modalAddBtn = document.getElementById('modalAddTask');
  var modalTaskList = document.getElementById('modalTaskList');

  if (modalAddBtn && modalTaskList) {
    modalAddBtn.addEventListener('click', function () {
      // Check if form already exists
      if (modalTaskList.querySelector('.demo-new-task-form')) return;

      var form = document.createElement('div');
      form.className = 'demo-new-task-form';
      form.innerHTML =
        '<input type="text" class="demo-new-task-input" placeholder="What needs to be done?" autofocus>' +
        '<button class="demo-new-task-submit">Add</button>';
      modalTaskList.prepend(form);

      var input = form.querySelector('.demo-new-task-input');
      var submit = form.querySelector('.demo-new-task-submit');

      function addTask() {
        var text = input.value.trim();
        if (!text) {
          form.remove();
          return;
        }

        var task = document.createElement('div');
        task.className = 'demo-task';
        task.setAttribute('data-interactive', '');
        task.innerHTML =
          '<button class="demo-task-check" aria-label="Toggle task completion"></button>' +
          '<div class="demo-task-content">' +
          '<span class="demo-task-title">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
          '<span class="demo-task-meta">Just added &middot; Custom</span>' +
          '</div>' +
          '<span class="demo-task-priority demo-task-priority--medium">Medium</span>';

        form.replaceWith(task);
        setupTaskChecks(task.parentElement);

        // Update total count
        var totalEl = document.getElementById('modalStatTotal');
        if (totalEl) {
          totalEl.textContent = parseInt(totalEl.textContent, 10) + 1;
        }
      }

      submit.addEventListener('click', addTask);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addTask();
        if (e.key === 'Escape') form.remove();
      });
      input.focus();
    });
  }
})();
