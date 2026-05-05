(function () {
  function init() {
    var navs = document.querySelectorAll('nav.halo-navigation');
    navs.forEach(function (nav) {
      var toggle = nav.querySelector('.nav-mobile-toggle');
      if (!toggle || toggle.dataset.bound === '1') return;

      var panel = nav.querySelector('.nav-mobile-panel');
      if (!panel) {
        panel = buildPanel(nav);
        nav.appendChild(panel);
      }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', panel.id);
      toggle.dataset.bound = '1';

      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-locked', open);
      });

      panel.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-locked');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-locked');
          toggle.focus();
        }
      });
    });
  }

  function buildPanel(nav) {
    var panel = document.createElement('div');
    panel.className = 'nav-mobile-panel';
    panel.id = 'nav-mobile-panel-' + Math.random().toString(36).slice(2, 7);

    var desktopLinks = nav.querySelectorAll('.nav-menu-desktop > .nav-link, .nav-menu-desktop .nav-dropdown-toggle');
    var accountLinks = nav.querySelectorAll('.account-dropdown .dropdown-link');
    var cta = nav.querySelector('.nav-cta-btn');

    var section = document.createElement('div');
    section.className = 'nav-mobile-section';

    desktopLinks.forEach(function (el) {
      var a = document.createElement('a');
      a.className = 'nav-mobile-link';
      a.textContent = el.textContent.trim();
      a.href = el.tagName === 'A' ? el.getAttribute('href') : '#';
      section.appendChild(a);
    });
    panel.appendChild(section);

    if (accountLinks.length) {
      var accountSection = document.createElement('div');
      accountSection.className = 'nav-mobile-section';
      var label = document.createElement('p');
      label.className = 'nav-mobile-label';
      label.textContent = 'Account';
      accountSection.appendChild(label);
      accountLinks.forEach(function (el) {
        var a = document.createElement('a');
        a.className = 'nav-mobile-link';
        a.textContent = el.textContent.trim();
        a.href = el.getAttribute('href') || '#';
        accountSection.appendChild(a);
      });
      panel.appendChild(accountSection);
    }

    if (cta) {
      var ctaClone = cta.cloneNode(true);
      ctaClone.classList.add('nav-mobile-cta');
      panel.appendChild(ctaClone);
    }

    return panel;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
