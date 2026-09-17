import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const supabase=createClient("https://lmtqzkkyjebjdabahnnl.supabase.co","sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY");
const {data:{session}}=await supabase.auth.getSession();
if(!session?.user){ location.replace("../admin-login.html"); }
else { const {data:admin}=await supabase.from("admin_users").select("id").eq("id",session.user.id).eq("role","admin").eq("is_active",true).maybeSingle(); if(!admin){await supabase.auth.signOut();location.replace("../admin-login.html");} }
