(function(){
  const path = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.side a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
    link.addEventListener('click', () => {
      document.querySelector('.side')?.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.side')?.classList.toggle('open');
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