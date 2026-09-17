import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  'https://lmtqzkkyjebjdabahnnl.supabase.co',
  'sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY'
);

const $ = (id) => document.getElementById(id);

async function countRows(table) {
  const result = await supabase.from(table).select('id', { count: 'exact', head: true });
  return result.error ? null : (result.count ?? 0);
}

async function initAdmin() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    $('status').textContent = 'Session expired. Redirecting to Admin Login…';
    setTimeout(() => { window.location.href = '../admin-login.html'; }, 700);
    return;
  }

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .eq('role', 'admin')
    .eq('is_active', true)
    .maybeSingle();

  if (adminError || !admin) {
    $('status').textContent = 'Access denied: active admin permission is required.';
    await supabase.auth.signOut();
    setTimeout(() => { window.location.href = '../admin-login.html'; }, 900);
    return;
  }

  $('status').textContent = `Signed in securely as ${user.email}`;
  const [users, projects] = await Promise.all([countRows('profiles'), countRows('projects')]);
  $('usersCount').textContent = users ?? '—';
  $('projectsCount').textContent = projects ?? '—';
  $('revenueCount').textContent = '—';
  $('ticketsCount').textContent = '—';
}

$('logout')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = '../admin-login.html';
});

initAdmin();
