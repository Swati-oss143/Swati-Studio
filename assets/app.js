
(function(){
 const path=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('[data-active]').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
 document.querySelectorAll('[data-menu-toggle]').forEach(b=>b.addEventListener('click',()=>document.querySelector('.side')?.classList.toggle('open')));
 document.querySelectorAll('[data-demo-action]').forEach(b=>b.addEventListener('click',()=>{const target=b.dataset.demoAction;if(target)location.href=target;}));
 document.querySelectorAll('form[data-message]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const box=f.querySelector('.form-message');if(box)box.textContent=f.dataset.message||'Form submitted. Connect backend to save data.';}));
})();
