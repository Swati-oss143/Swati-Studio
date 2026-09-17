import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://lmtqzkkyjebjdabahnnl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector('#registerForm, #loginForm, #adminLoginForm');
const message = document.getElementById('msg');

function showMessage(text, error = false) {
  if (!message) return;
  message.textContent = text;
  message.classList.toggle('error', error);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const email = form.querySelector('input[type="email"]')?.value.trim().toLowerCase();
  const password = form.querySelector('input[type="password"]')?.value || '';

  if (!email || !password) {
    showMessage('Please enter your email and password.', true);
    return;
  }

  if (form.id === 'registerForm' && password.length < 6) {
    showMessage('Password must contain at least 6 characters.', true);
    return;
  }

  if (button) button.disabled = true;
  showMessage('Please wait…');

  try {
    let result;
    if (form.id === 'registerForm') {
      const name = document.getElementById('name')?.value.trim() || '';
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name, full_name: name } }
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) throw result.error;

    if (form.id === 'registerForm') {
      if (result.data?.session) {
        showMessage('Account created. Redirecting…');
        window.location.assign('dashboard.html');
      } else {
        showMessage('Registration successful. Check your email to confirm your account, then sign in.');
        form.reset();
      }
    } else {
      showMessage('Login successful. Redirecting…');
      window.location.assign(form.id === 'adminLoginForm' ? 'admin-index.html' : 'dashboard.html');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    showMessage(error?.message || 'Registration/login failed. Please try again.', true);
  } finally {
    if (button) button.disabled = false;
  }
});
