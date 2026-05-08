(function () {
  function init() {
    var modal = document.getElementById('cancel-modal');
    if (!modal) return;
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

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-cancel-modal]');
      if (trigger) {
        e.preventDefault();
        open();
        return;
      }
      if (e.target.closest('[data-modal-close]') && modal.contains(e.target)) {
        close();
      }
    });

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
