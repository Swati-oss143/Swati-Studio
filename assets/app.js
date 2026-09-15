const $ = id => document.getElementById(id);

// Supabase configuration
const SUPABASE_URL = 'https://lmtqzkkyjebjdabahnnl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY';
let supabaseClient = null;

async function initSupabase() {
  if (SUPABASE_PUBLISHABLE_KEY.startsWith('PASTE_')) return;
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (error) {
    console.error('Supabase load failed:', error);
  }
}

const loginModal = $('loginModal');
$('loginBtn').addEventListener('click', () => loginModal.classList.remove('hidden'));
$('closeLogin').addEventListener('click', () => loginModal.classList.add('hidden'));

$('continueLogin').addEventListener('click', async () => {
  const identity = $('identity').value.trim();
  const password = $('password').value;
  const message = $('loginMessage');
  if (!identity || !password) {
    message.textContent = 'Please enter email and password.';
    return;
  }
  if (!supabaseClient) {
    message.textContent = 'Supabase is not configured yet. Add your publishable key in assets/app.js.';
    return;
  }
  const { error } = await supabaseClient.auth.signInWithPassword({ email: identity, password });
  message.textContent = error ? error.message : 'Login successful. Welcome to Swati Studio.';
});

$('registerBtn').addEventListener('click', async () => {
  const identity = $('identity').value.trim();
  const password = $('password').value;
  const message = $('loginMessage');
  if (!identity || !password) { message.textContent = 'Enter email and password to register.'; return; }
  if (!identity.includes('@')) { message.textContent = 'Registration currently requires an email address.'; return; }
  if (!supabaseClient) { message.textContent = 'Supabase is not configured.'; return; }
  const { data, error } = await supabaseClient.auth.signUp({ email: identity, password, options: { data: { display_name: identity.split('@')[0] } } });
  message.textContent = error ? error.message : (data.user ? 'Registration successful. Check your email if confirmation is enabled.' : 'Registration submitted.');
});

$('photo').addEventListener('change', e => {
  const file = e.target.files[0];
  $('photoName').textContent = file ? file.name : 'No photo selected';
  if (file) { $('photoPreview').src = URL.createObjectURL(file); $('photoPreview').classList.remove('hidden'); }
});
$('voice').addEventListener('change', e => {
  const file = e.target.files[0];
  $('voiceName').textContent = file ? file.name : 'No voice sample selected';
  if (file) { $('voicePreview').src = URL.createObjectURL(file); $('voicePreview').classList.remove('hidden'); }
});

let report = '';
$('generateBtn').addEventListener('click', () => {
  const script = $('script').value.trim();
  if (!script) { $('previewStatus').textContent = 'Script missing'; $('previewDetails').textContent = 'Please enter a script first.'; return; }
  if (!$('consent').checked) { $('previewStatus').textContent = 'Consent required'; $('previewDetails').textContent = 'Confirm that you own or have permission to use the photo and voice.'; return; }
  const format = $('format').value, language = $('language').value;
  report = 'Swati Studio Project Report\n\nFormat: ' + format + '\nLanguage: ' + language + '\nPhoto: ' + ($('photo').files[0]?.name || 'Not selected') + '\nVoice: ' + ($('voice').files[0]?.name || 'Not selected') + '\n\nScript:\n' + script;
  $('previewStatus').textContent = 'Demo ready';
  $('videoStage').innerHTML = '<div class="play-icon">✓</div><p>Demo project prepared</p><small>This is not a rendered AI video.</small>';
  $('previewDetails').textContent = 'Project prepared successfully.\n\n' + format + ' · ' + language + '\nPhoto and voice consent confirmed.';
  $('downloadBtn').disabled = false;
});
$('downloadBtn').addEventListener('click', () => {
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'swati-studio-project-report.txt'; a.click(); URL.revokeObjectURL(url);
});
document.querySelectorAll('[data-tool]').forEach(btn => btn.addEventListener('click', () => {
  $('toolMessage').textContent = btn.dataset.tool + ' prototype selected. Full editor will be connected in the next development phase.';
}));

initSupabase();
