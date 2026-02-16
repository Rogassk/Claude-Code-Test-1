// ============================
// TaskFlow AI — Roadmap Script
// ============================

(function () {
  'use strict';

  var LS_KEY = 'taskflow_roadmap_votes';

  // ---- State ----
  var allFeatures   = [];
  var activeFilter  = 'all';
  var searchQuery   = '';
  var sortMode      = 'votes';
  var userVotes     = {};   // { featureId: true }
  var voteCounts    = {};   // { featureId: number }

  // ---- DOM refs ----
  var filtersEl   = document.getElementById('rmFilters');
  var searchEl    = document.getElementById('rmSearch');
  var sortEl      = document.getElementById('rmSort');
  var emptyEl     = document.getElementById('rmEmpty');
  var headerMeta  = document.getElementById('rmHeaderMeta');
  var tooltipEl   = document.getElementById('rmTooltip');
  var tooltipTitle = document.getElementById('rmTooltipTitle');
  var tooltipDesc  = document.getElementById('rmTooltipDesc');
  var tooltipEta   = document.getElementById('rmTooltipEta');
  var tooltipTags  = document.getElementById('rmTooltipTags');

  var cardContainers = {
    'shipped':     document.getElementById('cardsShipped'),
    'in-progress': document.getElementById('cardsProgress'),
    'planned':     document.getElementById('cardsPlanned'),
  };

  var countEls = {
    'shipped':     document.getElementById('countShipped'),
    'in-progress': document.getElementById('countProgress'),
    'planned':     document.getElementById('countPlanned'),
  };

  // ---- Load persisted votes ----
  function loadVotes() {
    try {
      var stored = localStorage.getItem(LS_KEY);
      userVotes = stored ? JSON.parse(stored) : {};
    } catch (e) {
      userVotes = {};
    }
  }

  function saveVotes() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(userVotes));
    } catch (e) { /* quota exceeded — silently ignore */ }
  }

  // ---- Helpers ----
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function categoryClass(cat) {
    return 'rm-tag--' + cat.replace(/\s+/g, '-');
  }

  function statusClass(status) {
    if (status === 'shipped')     return 'rm-status--shipped';
    if (status === 'in-progress') return 'rm-status--progress';
    return 'rm-status--planned';
  }

  function statusLabel(status) {
    if (status === 'shipped')     return 'Shipped';
    if (status === 'in-progress') return 'In Progress';
    return 'Planned';
  }

  function cardClass(status) {
    if (status === 'shipped')     return 'rm-card--shipped';
    if (status === 'in-progress') return 'rm-card--progress';
    return 'rm-card--planned';
  }

  // ---- Build category filter buttons ----
  function buildFilters(categories) {
    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'rm-filter';
      btn.setAttribute('data-filter', cat);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.textContent = cat;
      filtersEl.appendChild(btn);
    });

    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.rm-filter');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter');
      filtersEl.querySelectorAll('.rm-filter').forEach(function (b) {
        b.classList.remove('rm-filter--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('rm-filter--active');
      btn.setAttribute('aria-selected', 'true');
      render();
    });
  }

  // ---- Build header meta stats ----
  function buildHeaderMeta(features) {
    var shipped    = features.filter(function (f) { return f.status === 'shipped'; }).length;
    var inProgress = features.filter(function (f) { return f.status === 'in-progress'; }).length;
    var planned    = features.filter(function (f) { return f.status === 'planned'; }).length;
    var totalVotes = features.reduce(function (sum, f) { return sum + voteCounts[f.id]; }, 0);

    var stats = [
      { val: shipped,    label: 'Shipped' },
      { val: inProgress, label: 'In Progress' },
      { val: planned,    label: 'Planned' },
      { val: totalVotes.toLocaleString('en-US'), label: 'Total Votes' },
    ];

    headerMeta.innerHTML = stats.map(function (s) {
      return '<div class="rm-meta-stat">' +
        '<span class="rm-meta-stat-val">' + s.val + '</span>' +
        '<span class="rm-meta-stat-label">' + escHtml(s.label) + '</span>' +
        '</div>';
    }).join('');
  }

  // ---- Sort features ----
  function sortFeatures(features) {
    var order = { 'shipped': 0, 'in-progress': 1, 'planned': 2 };
    var copy  = features.slice();

    if (sortMode === 'votes') {
      copy.sort(function (a, b) { return voteCounts[b.id] - voteCounts[a.id]; });
    } else if (sortMode === 'newest') {
      // Use reverse of original array order as proxy for "newest"
      copy.reverse();
    } else if (sortMode === 'status') {
      copy.sort(function (a, b) { return order[a.status] - order[b.status]; });
    }
    return copy;
  }

  // ---- Filter features ----
  function filterFeatures(features) {
    return features.filter(function (f) {
      var matchCat    = activeFilter === 'all' || f.category === activeFilter;
      var q           = searchQuery.toLowerCase();
      var matchSearch = !q ||
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some(function (t) { return t.toLowerCase().includes(q); });
      return matchCat && matchSearch;
    });
  }

  // ---- Build one card element ----
  function buildCard(feature) {
    var id      = feature.id;
    var voted   = userVotes[id] === true;
    var count   = voteCounts[id];

    var card = document.createElement('article');
    card.className = 'rm-card ' + cardClass(feature.status);
    card.setAttribute('data-id', id);
    card.setAttribute('data-status', feature.status);

    card.innerHTML =
      '<div class="rm-card-top">' +
        '<span class="rm-card-title">' + escHtml(feature.title) + '</span>' +
        '<button class="rm-vote' + (voted ? ' rm-vote--voted' : '') + '" ' +
          'aria-label="' + (voted ? 'Remove vote for' : 'Vote for') + ' ' + escHtml(feature.title) + '" ' +
          'data-id="' + id + '">' +
          '<svg class="rm-vote-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>' +
          '<span class="rm-vote-count">' + count + '</span>' +
        '</button>' +
      '</div>' +
      '<p class="rm-card-desc">' + escHtml(feature.description) + '</p>' +
      '<div class="rm-card-footer">' +
        '<div class="rm-card-tags">' +
          '<span class="rm-tag ' + categoryClass(feature.category) + '">' + escHtml(feature.category) + '</span>' +
          feature.tags.map(function (t) {
            return '<span class="rm-tag rm-tag--category">' + escHtml(t) + '</span>';
          }).join('') +
        '</div>' +
        '<span class="rm-card-eta">' + escHtml(feature.eta) + '</span>' +
      '</div>';

    // Vote interaction
    var voteBtn = card.querySelector('.rm-vote');
    voteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      handleVote(id, card);
    });

    // Tooltip on hover
    card.addEventListener('mouseenter', function (e) { showTooltip(feature, e); });
    card.addEventListener('mousemove',  function (e) { positionTooltip(e); });
    card.addEventListener('mouseleave', hideTooltip);

    return card;
  }

  // ---- Handle vote ----
  function handleVote(id, card) {
    var voted = userVotes[id] === true;
    if (voted) {
      delete userVotes[id];
      voteCounts[id] = Math.max(0, voteCounts[id] - 1);
    } else {
      userVotes[id] = true;
      voteCounts[id] += 1;
    }
    saveVotes();

    // Update button in-place
    var voteBtn   = card.querySelector('.rm-vote');
    var countSpan = card.querySelector('.rm-vote-count');
    var newVoted  = !voted;

    voteBtn.classList.toggle('rm-vote--voted', newVoted);
    voteBtn.setAttribute('aria-label', (newVoted ? 'Remove vote for' : 'Vote for') + ' ' + card.querySelector('.rm-card-title').textContent);
    countSpan.textContent = voteCounts[id];

    voteBtn.classList.remove('rm-vote--pop');
    void voteBtn.offsetWidth; // reflow
    voteBtn.classList.add('rm-vote--pop');

    // If sorting by votes, debounce re-render to avoid jarring jumps
    if (sortMode === 'votes') {
      clearTimeout(handleVote._timer);
      handleVote._timer = setTimeout(render, 800);
    }
  }

  // ---- Render ----
  function render() {
    var filtered = filterFeatures(sortFeatures(allFeatures));
    var buckets  = { 'shipped': [], 'in-progress': [], 'planned': [] };

    filtered.forEach(function (f) {
      if (buckets[f.status]) buckets[f.status].push(f);
    });

    var totalVisible = filtered.length;

    // Populate each column
    ['shipped', 'in-progress', 'planned'].forEach(function (status) {
      var container = cardContainers[status];
      var countEl   = countEls[status];

      // Diff: remove cards no longer in bucket
      var currentIds = {};
      buckets[status].forEach(function (f) { currentIds[f.id] = true; });

      Array.from(container.children).forEach(function (el) {
        if (!currentIds[el.getAttribute('data-id')]) {
          el.style.animation = 'none';
          el.style.opacity   = '0';
          el.style.transform = 'scale(0.95)';
          el.style.transition = 'opacity 200ms, transform 200ms';
          setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
        }
      });

      // Insert/update cards
      buckets[status].forEach(function (feature, idx) {
        var existing = container.querySelector('[data-id="' + feature.id + '"]');
        if (!existing) {
          var card = buildCard(feature);
          card.style.animationDelay = (idx * 40) + 'ms';
          container.appendChild(card);
        }
      });

      countEl.textContent = buckets[status].length;
    });

    // Empty state
    var hasAny = totalVisible > 0;
    emptyEl.hidden = hasAny;
    document.getElementById('rmColumns').style.display = hasAny ? '' : 'none';
  }

  // ---- Tooltip ----
  function showTooltip(feature, e) {
    tooltipTitle.textContent = feature.title;
    tooltipDesc.textContent  = feature.description;
    tooltipEta.textContent   = feature.eta;
    tooltipTags.innerHTML = feature.tags.map(function (t) {
      return '<span class="rm-tag">' + escHtml(t) + '</span>';
    }).join('');
    positionTooltip(e);
    tooltipEl.setAttribute('aria-hidden', 'false');
    tooltipEl.classList.add('rm-tooltip--visible');
  }

  function positionTooltip(e) {
    var gap  = 14;
    var tw   = tooltipEl.offsetWidth  || 300;
    var th   = tooltipEl.offsetHeight || 120;
    var x    = e.clientX + gap;
    var y    = e.clientY - th / 2;

    // Keep inside viewport
    if (x + tw > window.innerWidth  - 8) x = e.clientX - tw - gap;
    if (y < 8)                           y = 8;
    if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;

    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top  = y + 'px';
  }

  function hideTooltip() {
    tooltipEl.classList.remove('rm-tooltip--visible');
    tooltipEl.setAttribute('aria-hidden', 'true');
  }

  // ---- Search ----
  var searchDebounce;
  searchEl.addEventListener('input', function () {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(function () {
      searchQuery = searchEl.value.trim();
      render();
    }, 180);
  });

  // ---- Sort ----
  sortEl.addEventListener('change', function () {
    sortMode = sortEl.value;
    render();
  });

  // ---- Clear filters button ----
  var clearBtn = document.getElementById('rmClearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      activeFilter = 'all';
      searchQuery  = '';
      searchEl.value = '';
      filtersEl.querySelectorAll('.rm-filter').forEach(function (b) {
        var isAll = b.getAttribute('data-filter') === 'all';
        b.classList.toggle('rm-filter--active', isAll);
        b.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      render();
    });
  }

  // ---- Bootstrap: fetch data ----
  function init() {
    loadVotes();

    fetch('roadmap-data.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allFeatures = data.features;

        // Initialise vote counts from data + any user-added votes
        allFeatures.forEach(function (f) {
          var base  = f.initialVotes || 0;
          var extra = userVotes[f.id] ? 1 : 0;
          voteCounts[f.id] = base + extra;
        });

        buildFilters(data.categories || []);
        buildHeaderMeta(allFeatures);
        render();
      })
      .catch(function (err) {
        console.error('Failed to load roadmap data:', err);
        emptyEl.hidden = false;
        emptyEl.querySelector('h3').textContent = 'Failed to load roadmap';
        emptyEl.querySelector('p').textContent  = 'Please try refreshing the page.';
      });
  }

  init();
})();
