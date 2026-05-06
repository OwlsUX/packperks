(function () {
  function init() {
    initFilter();
    initCodeCopy();
    initOfferModal();
  }

  function initFilter() {
    var filterBar = document.querySelector('.ppl-filter');
    if (!filterBar) return;

    var search = filterBar.querySelector('#ppl-search');
    var pills = filterBar.querySelectorAll('.ppl-filter-pill');
    var emptyMsg = filterBar.querySelector('.ppl-filter-empty');

    var sections = Array.prototype.slice.call(
      document.querySelectorAll('[data-section]')
    );

    var cards = Array.prototype.slice.call(
      document.querySelectorAll('.perk-card, .ppl-feat-card')
    );

    cards.forEach(function (card) {
      var parentSection = card.closest('[data-section]');
      card.dataset.cardSection = parentSection ? parentSection.dataset.section : 'other';
      card.dataset.cardText = (card.textContent || '').toLowerCase().replace(/\s+/g, ' ').trim();
    });

    var state = { filter: 'all', query: '' };

    function apply() {
      var q = state.query.trim().toLowerCase();
      var f = state.filter;
      var visibleByFilter = (f === 'all') ? null : { featured: 1 }; // featured always allowed; specific filter narrows
      // simpler: a card matches the filter if filter === 'all' OR its section === filter
      var visibleCount = 0;
      var sectionVisible = {};

      cards.forEach(function (card) {
        var sec = card.dataset.cardSection;
        var matchFilter = (f === 'all') || sec === f;
        var matchQuery = !q || card.dataset.cardText.indexOf(q) !== -1;
        var visible = matchFilter && matchQuery;
        card.hidden = !visible;
        if (visible) {
          visibleCount++;
          sectionVisible[sec] = true;
        }
      });

      sections.forEach(function (sec) {
        var name = sec.dataset.section;
        if (name === 'divider') {
          sec.hidden = (f !== 'all') || !!q;
          return;
        }
        // Featured header + grid: visible if featured has visible cards
        if (sec.classList.contains('cat-block-head') || sec.classList.contains('ppl-featured-grid')) {
          sec.hidden = !sectionVisible[name];
          return;
        }
        // .cat-block (vet/food/travel) — wraps its own header
        sec.hidden = !sectionVisible[name];
      });

      if (emptyMsg) emptyMsg.hidden = visibleCount > 0;
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) {
          p.classList.toggle('is-active', p === pill);
          p.setAttribute('aria-selected', p === pill ? 'true' : 'false');
        });
        state.filter = pill.dataset.filter;
        apply();
      });
    });

    if (search) {
      var debounce;
      search.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
          state.query = search.value || '';
          apply();
        }, 80);
      });
    }

    apply();
  }

  function initCodeCopy() {
    if (initCodeCopy._done) return;
    initCodeCopy._done = true;

    document.addEventListener('click', function (e) {
      var line = e.target.closest('.code-line');
      if (!line) return;
      var match = (line.textContent || '').match(/#[A-Z0-9-]+/);
      if (!match) return;
      var code = match[0];
      e.preventDefault();
      var write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(code)
        : Promise.reject();
      write.catch(function () {
        try {
          var ta = document.createElement('textarea');
          ta.value = code;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (_) {}
      });
      var prev = line.dataset.prev || line.textContent;
      line.dataset.prev = prev;
      line.textContent = 'Copied ' + code + ' ✓';
      line.classList.add('is-copied');
      clearTimeout(line._t);
      line._t = setTimeout(function () {
        line.textContent = prev;
        line.classList.remove('is-copied');
      }, 1400);
    });

    document.querySelectorAll('.code-line').forEach(function (line) {
      line.setAttribute('role', 'button');
      line.setAttribute('tabindex', '0');
      line.setAttribute('title', 'Click to copy');
      line.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          line.click();
        }
      });
    });
  }

  function initOfferModal() {
    var modal = document.getElementById('offer-modal');
    if (!modal) return;
    var titleEl = modal.querySelector('#offer-modal-title');
    var brandImg = modal.querySelector('.modal-brand img');
    var heroImg = modal.querySelector('.modal-img img');
    var blurbEl = modal.querySelector('.blurb');
    var codePill = modal.querySelector('.code-pill');
    var codeText = modal.querySelector('.code-pill__text');
    var codeBlock = modal.querySelector('.code-block');
    var disclaim = modal.querySelector('.disclaim');
    var ctaEl = modal.querySelector('[data-modal-cta]');
    var lastFocus = null;

    function open(card) {
      lastFocus = document.activeElement;
      var heroSrc = '';
      var heroAlt = '';
      var heroEl = card.querySelector('.perk-img > img:not(.brand-logo), .ppl-feat-img > img:not(.brand-logo)');
      if (heroEl) { heroSrc = heroEl.getAttribute('src'); heroAlt = heroEl.getAttribute('alt') || ''; }

      var brandSrc = '';
      var brandEl = card.querySelector('.brand-logo, .brand-logo-wrap img');
      if (brandEl) brandSrc = brandEl.getAttribute('src');

      var titleEl2 = card.querySelector('h4, h3');
      var title = titleEl2 ? titleEl2.textContent.trim() : 'Redeem Offer';

      var blurbSrc = card.querySelector('.perk-body > p, .ppl-feat-text > p');
      var blurb = blurbSrc ? blurbSrc.textContent.trim() : '';

      var codeLineEl = card.querySelector('.code-line');
      var codeMatch = codeLineEl ? (codeLineEl.dataset.prev || codeLineEl.textContent || '').match(/#[A-Z0-9-]+/) : null;
      var code = codeMatch ? codeMatch[0] : '';

      var brandName = (heroAlt || title).replace(/^[$\d.+%]+\s*/, '').replace(/\s+(Credit|Insurance|DNA Credit).*$/i, '').trim() || 'partner';

      brandImg.src = brandSrc || '';
      brandImg.alt = heroAlt || brandName;
      brandImg.style.display = brandSrc ? '' : 'none';

      heroImg.src = heroSrc || '';
      heroImg.alt = heroAlt;
      heroImg.parentElement.style.display = heroSrc ? '' : 'none';

      titleEl.textContent = title;
      blurbEl.textContent = blurb;

      if (code) {
        codeBlock.style.display = '';
        codeText.textContent = code;
        disclaim.style.display = '';
      } else {
        codeBlock.style.display = 'none';
        disclaim.style.display = 'none';
      }

      ctaEl.textContent = 'Continue to ' + brandName;

      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-locked');
      requestAnimationFrame(function () { modal.classList.add('is-open'); });
      var closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
      setTimeout(function () { modal.hidden = true; }, 180);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) {
        close();
        return;
      }
      // Ignore clicks inside the modal itself so internal interactions work.
      if (e.target.closest('.offer-modal__shell')) return;
      var card = e.target.closest('.perk-card, .ppl-feat-card');
      if (card) {
        e.preventDefault();
        open(card);
      }
    });

    // Make cards keyboard-accessible
    document.querySelectorAll('.perk-card, .ppl-feat-card').forEach(function (card) {
      if (card.dataset.modalBound === '1') return;
      card.dataset.modalBound = '1';
      if (card.tagName !== 'A' && card.tagName !== 'BUTTON') {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
      }
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });

    if (codePill) {
      codePill.addEventListener('click', function () {
        var code = codeText.textContent.trim();
        if (!code) return;
        var write = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(code)
          : Promise.reject();
        write.catch(function () {
          try {
            var ta = document.createElement('textarea');
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          } catch (_) {}
        });
        var prev = codeText.textContent;
        codeText.textContent = 'Copied!';
        setTimeout(function () { codeText.textContent = prev; }, 1400);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
