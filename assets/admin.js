import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const supabase=createClient("https://lmtqzkkyjebjdabahnnl.supabase.co","sb_publishable_RQOsIyFMOOegEknGAjNFsg_HVENkEEY");
const $=id=>document.getElementById(id);
async function run(){
 const {data:{user}}=await supabase.auth.getUser();
 if(!user){location.replace("../admin-login.html");return;}
 const {data:admin,error}=await supabase.from("admin_users").select("role,is_active").eq("id",user.id).maybeSingle();
 if(error||!admin||admin.role!=="admin"||admin.is_active!==true){if($("status"))$("status").textContent="Access denied. Active admin role required.";await supabase.auth.signOut();setTimeout(()=>location.replace("../admin-login.html"),700);return;}
 if($("status"))$("status").textContent=`Signed in securely as ${user.email}`;
 const [u,pr,s]=await Promise.all([supabase.from("profiles").select("id",{count:"exact",head:true}),supabase.from("projects").select("id",{count:"exact",head:true}),supabase.from("services").select("id",{count:"exact",head:true})]);
 if($("users-count"))$("users-count").textContent=String(u.count??0);
 if($("projects-count"))$("projects-count").textContent=String(pr.count??0);
 if($("services-count"))$("services-count").textContent=String(s.count??0);
}
$("logout")?.addEventListener("click",async e=>{e.preventDefault();await supabase.auth.signOut();location.replace("../admin-login.html")});run();