import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  'https://lmtqzkkyjebjdabahnnl.supabase.co',
  'sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY'
);

const form = document.querySelector('form');
const msg = document.getElementById('msg');

function showMessage(text, type = 'muted') {
  if (!msg) return;
  msg.className = `form-message ${type}`;
  msg.textContent = text;
}

function getFormValues() {
  const email = document.getElementById('email')?.value.trim().toLowerCase() || '';
  const password = document.getElementById('password')?.value || '';
  return { email, password };
}

function readableAuthError(error) {
  const message = String(error?.message || 'Something went wrong.');
  const lower = message.toLowerCase();

  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Supabase email limit reached. Please wait before trying again, or disable email confirmation during testing in Supabase Auth settings.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'This email is already registered. Please use Login or Forgot Password.';
  }
  if (lower.includes('password')) {
    return 'Password must meet the minimum password rules configured in Supabase.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  return message;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  if (button?.disabled) return;

  const { email, password } = getFormValues();
  if (!email || !password) {
    showMessage('Please enter your email and password.', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters.', 'error');
    return;
  }

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = form.id === 'registerForm' ? 'Creating account…' : 'Signing in…';
  }
  showMessage('Please wait…');

  try {
    let result;

    if (form.id === 'registerForm') {
      const name = document.getElementById('name')?.value.trim() || '';
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } }
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      showMessage(readableAuthError(result.error), 'error');
      return;
    }

    if (form.id === 'registerForm') {
      if (result.data?.session) {
        showMessage('Account created successfully. Opening your dashboard…', 'success');
        window.location.assign('dashboard.html');
      } else {
        showMessage('Account created. Check your email to confirm your account, then sign in.', 'success');
      }
    } else {
      showMessage('Login successful. Opening your dashboard…', 'success');
      window.location.assign('dashboard.html');
    }
  } catch (error) {
    showMessage(readableAuthError(error), 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Submit';
    }
  }
});
