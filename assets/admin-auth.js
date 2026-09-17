import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://lmtqzkkyjebjdabahnnl.supabase.co",
  "sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY"
);

const form = document.getElementById("adminLoginForm");
const msg = document.getElementById("msg");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("adminPassword").value;
  button.disabled = true;
  msg.textContent = "Signing in…";

  const { data: signIn, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signIn.user) {
    msg.textContent = signInError?.message || "Login failed.";
    button.disabled = false;
    return;
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("id, role, is_active")
    .eq("id", signIn.user.id)
    .eq("role", "admin")
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    msg.textContent = "Access denied: this account is not an active admin.";
    button.disabled = false;
    return;
  }

  msg.textContent = "Login successful. Redirecting…";
  window.location.href = "admin/index.html";
});
