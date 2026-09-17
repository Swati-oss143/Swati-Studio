(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.querySelector('.side');

  document.querySelectorAll('[data-active]').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
    link.addEventListener('click', function () {
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-menu-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (sidebar) sidebar.classList.toggle('open');
    });
  });

  document.querySelectorAll('[data-demo-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      const target = button.dataset.demoAction;
      if (target) location.href = target;
    });
  });

  document.querySelectorAll('form[data-message]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const box = form.querySelector('.form-message');
      if (box) box.textContent = form.dataset.message || 'Form submitted. Connect backend to save data.';
    });
  });
})();
