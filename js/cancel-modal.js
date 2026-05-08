(function () {
  function init() {
    var modal = document.getElementById('cancel-modal');
    if (!modal) {
      console.warn('[cancel-modal] no #cancel-modal element found');
      return;
    }
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
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

    // Bind directly to each trigger so the handler is unmistakable
    var triggers = document.querySelectorAll('[data-open-cancel-modal]');
    if (!triggers.length) {
      console.warn('[cancel-modal] no [data-open-cancel-modal] triggers found');
    }
    triggers.forEach(function (trig) {
      trig.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    // Close handlers via delegation on the modal itself
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });

    // Expose for debugging
    window.__cancelModal = { open: open, close: close };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
