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

  // ---- Scroll-reveal animation (enhanced) ----

  // Elements with directional reveals via data-reveal attribute
  var directionalEls = document.querySelectorAll('[data-reveal]');
  directionalEls.forEach(function (el) {
    var direction = el.getAttribute('data-reveal');
    if (direction === 'slide-left') el.classList.add('reveal-slide-left');
    else if (direction === 'slide-right') el.classList.add('reveal-slide-right');
    else if (direction === 'scale') el.classList.add('reveal-scale');
    else el.classList.add('fade-in');
  });

  // Standard fade-in elements (not already handled by data-reveal)
  var animatableSelectors = [
    '.feature-card',
    '.step-card',
    '.testimonial-card',
    '.pricing-card',
    '.faq-item',
    '.section-header',
    '.demo-window',
    '.demo-cta-wrapper',
    '.cta-card',
    '.metric',
  ];

  var animatables = document.querySelectorAll(animatableSelectors.join(','));

  animatables.forEach(function (el) {
    if (!el.classList.contains('reveal-slide-left') &&
        !el.classList.contains('reveal-slide-right') &&
        !el.classList.contains('reveal-scale')) {
      el.classList.add('fade-in');
    }
  });

  // Stagger children — apply incremental delays
  var staggerContainers = document.querySelectorAll('[data-stagger]');
  staggerContainers.forEach(function (container) {
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.setProperty('--stagger-delay', (i * 100) + 'ms');
    }
  });

  // Unified reveal observer
  var allRevealEls = document.querySelectorAll(
    '.fade-in, .reveal-slide-left, .reveal-slide-right, .reveal-scale'
  );

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  allRevealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Hero parallax ----
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  var heroSection = document.getElementById('hero');
  var ticking = false;

  if (parallaxEls.length && heroSection) {
    function updateParallax() {
      var scrollY = window.scrollY;
      var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

      // Only apply parallax within the hero section range
      if (scrollY < heroBottom) {
        parallaxEls.forEach(function (el) {
          // Only apply after reveal animation has completed
          if (!el.classList.contains('visible')) { ticking = false; return; }
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          var offset = scrollY * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        });
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Number counter animation ----
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var decimals = parseInt(el.getAttribute('data-count-decimals'), 10) || 0;
    var suffix = el.getAttribute('data-count-suffix') || '';
    var prefix = el.getAttribute('data-count-prefix') || '';
    var duration = 1600;
    var startTime = null;

    function formatNumber(num) {
      if (num >= 1000 && decimals === 0) {
        return num.toLocaleString('en-US');
      }
      return num.toFixed(decimals);
    }

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = easedProgress * target;

      el.textContent = prefix + formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll('.count-up');
  if (counterEls.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ---- Progress bar fill on scroll ----
  var scrollFillBars = document.querySelectorAll('[data-scroll-fill]');
  if (scrollFillBars.length) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var pct = entry.target.getAttribute('data-scroll-fill');
            entry.target.style.setProperty('--fill-target', pct + '%');
            entry.target.classList.add('scroll-filled');
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    scrollFillBars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }

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

  // ---- Pricing Calculator ----
  var MONTHLY_PRICE_PRO = 24;  // $ per user per month
  var ANNUAL_DISCOUNT    = 0.20; // 20% off

  var pricingSlider      = document.getElementById('userSlider');
  var billingSwitch      = document.getElementById('billingSwitch');
  var userCountDisplay   = document.getElementById('userCountDisplay');
  var summaryUsers       = document.getElementById('summaryUsers');
  var summaryTotal       = document.getElementById('summaryTotal');
  var summaryPerUser     = document.getElementById('summaryPerUser');
  var summaryAnnualGrp   = document.getElementById('summaryAnnualSavingsGroup');
  var summaryAnnualSav   = document.getElementById('summaryAnnualSavings');
  var summaryDiv3        = document.getElementById('summaryDivider3');
  var labelMonthly       = document.getElementById('labelMonthly');
  var labelAnnual        = document.getElementById('labelAnnual');
  var pricePro           = document.getElementById('pricePro');
  var periodPro          = document.getElementById('periodPro');
  var totalLinePro       = document.getElementById('totalLinePro');
  var savingsLinePro     = document.getElementById('savingsLinePro');
  var totalLineEnterprise= document.getElementById('totalLineEnterprise');
  var recStarter         = document.getElementById('recStarter');
  var recPro             = document.getElementById('recPro');
  var recEnterprise      = document.getElementById('recEnterprise');
  var cardStarter        = document.getElementById('cardStarter');
  var cardPro            = document.getElementById('cardPro');
  var cardEnterprise     = document.getElementById('cardEnterprise');
  var badgePro           = document.getElementById('badgePro');

  if (!pricingSlider || !billingSwitch) return; // guard if section not present

  var isAnnual   = false;
  var userCount  = parseInt(pricingSlider.value, 10);

  function fmt(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function flashEl(el) {
    el.classList.remove('val-flash');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('val-flash');
  }

  function flipPrice(el) {
    el.classList.remove('price-updating');
    void el.offsetWidth;
    el.classList.add('price-updating');
  }

  function updateSliderFill() {
    var min = parseInt(pricingSlider.min, 10);
    var max = parseInt(pricingSlider.max, 10);
    var pct = ((userCount - min) / (max - min)) * 100;
    pricingSlider.style.setProperty('--slider-fill', pct + '%');
    pricingSlider.style.backgroundSize = pct + '% 100%';
  }

  function getRecommended(users) {
    if (users <= 5)  return 'starter';
    if (users <= 50) return 'pro';
    return 'enterprise';
  }

  function updateRecommendedBadges(rec) {
    // Clear all
    [recStarter, recPro, recEnterprise].forEach(function (el) {
      el.classList.remove('pricing-recommended--visible');
    });
    [cardStarter, cardPro, cardEnterprise].forEach(function (card) {
      card.classList.remove('pricing-recommended-active');
    });

    if (rec === 'starter') {
      recStarter.classList.add('pricing-recommended--visible');
      cardStarter.classList.add('pricing-recommended-active');
    } else if (rec === 'pro') {
      recPro.classList.add('pricing-recommended--visible');
      cardPro.classList.add('pricing-recommended-active');
      // Hide "Most Popular" badge so recommended takes its place visually
      if (badgePro) badgePro.style.display = 'none';
    } else {
      recEnterprise.classList.add('pricing-recommended--visible');
      cardEnterprise.classList.add('pricing-recommended-active');
      if (badgePro) badgePro.style.display = '';
    }
  }

  function updatePricing() {
    var users = userCount;
    var perUserMonthly = MONTHLY_PRICE_PRO;
    var perUserPrice   = isAnnual ? perUserMonthly * (1 - ANNUAL_DISCOUNT) : perUserMonthly;
    var totalMonthly   = perUserMonthly * users;
    var totalPrice     = Math.round(perUserPrice * users);
    var annualTotal    = totalPrice * 12;
    var annualFullPrice= totalMonthly * 12;
    var annualSavings  = annualFullPrice - annualTotal;

    // User count displays
    userCountDisplay.textContent = users.toLocaleString('en-US');
    flashEl(userCountDisplay);
    summaryUsers.textContent = users.toLocaleString('en-US');
    flashEl(summaryUsers);

    // Summary bar
    summaryTotal.textContent = fmt(totalPrice);
    flashEl(summaryTotal);
    summaryPerUser.textContent = isAnnual
      ? '$' + perUserPrice.toFixed(2)
      : fmt(perUserPrice);
    flashEl(summaryPerUser);

    // Annual savings row
    if (isAnnual) {
      summaryAnnualGrp.style.opacity = '1';
      summaryAnnualGrp.style.pointerEvents = '';
      if (summaryDiv3) summaryDiv3.style.opacity = '1';
      summaryAnnualSav.textContent = fmt(annualSavings);
      flashEl(summaryAnnualSav);
    } else {
      summaryAnnualGrp.style.opacity = '0.35';
      summaryAnnualGrp.style.pointerEvents = 'none';
      if (summaryDiv3) summaryDiv3.style.opacity = '0.35';
      summaryAnnualSav.textContent = fmt(Math.round(annualFullPrice * ANNUAL_DISCOUNT));
    }

    // Pro card price
    flipPrice(pricePro);
    if (isAnnual) {
      pricePro.textContent = '$' + perUserPrice.toFixed(2);
      periodPro.textContent = '/user/month';
      totalLinePro.textContent = fmt(totalPrice) + ' / month, billed annually';
      savingsLinePro.textContent = 'Save ' + fmt(annualSavings) + ' vs monthly';
    } else {
      pricePro.textContent = fmt(perUserMonthly);
      periodPro.textContent = '/user/month';
      totalLinePro.textContent = fmt(totalPrice) + ' / month total';
      savingsLinePro.textContent = 'Switch to annual to save ' + fmt(Math.round(annualFullPrice * ANNUAL_DISCOUNT));
    }

    // Enterprise hint
    if (users > 100) {
      totalLineEnterprise.textContent = 'Volume discounts for ' + users.toLocaleString('en-US') + '+ users';
    } else {
      totalLineEnterprise.textContent = 'Tailored to your organization';
    }

    // Billing toggle labels
    labelMonthly.classList.toggle('billing-label--active', !isAnnual);
    labelAnnual.classList.toggle('billing-label--active', isAnnual);

    // Recommended badge
    updateRecommendedBadges(getRecommended(users));

    // Slider fill
    updateSliderFill();
  }

  // Slider input
  pricingSlider.addEventListener('input', function () {
    userCount = parseInt(pricingSlider.value, 10);
    updatePricing();
  });

  // Billing switch
  billingSwitch.addEventListener('click', function () {
    isAnnual = !isAnnual;
    billingSwitch.setAttribute('aria-checked', isAnnual ? 'true' : 'false');
    updatePricing();
  });

  // Initialize
  updatePricing();
})();
