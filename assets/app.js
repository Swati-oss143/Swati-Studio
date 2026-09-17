(function(){
  const path = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-active]').forEach((link) => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });

  const side = document.querySelector('.side');
  document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
    button.addEventListener('click', () => side?.classList.toggle('open'));
  });

  document.querySelectorAll('.side a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 760px)').matches) side?.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-logout]').forEach((link) => {
    link.addEventListener('click', () => {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (/supabase|auth|session/i.test(key)) localStorage.removeItem(key);
        });
        Object.keys(sessionStorage).forEach((key) => {
          if (/supabase|auth|session/i.test(key)) sessionStorage.removeItem(key);
        });
      } catch (_) {}
    });
  });

  document.querySelectorAll('[data-demo-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.demoAction;
      if (target) location.href = target;
    });
  });

  document.querySelectorAll('form[data-message]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const box = form.querySelector('.form-message');
      if (box) box.textContent = form.dataset.message || 'Form submitted. Connect backend to save data.';
    });
  });
})();
