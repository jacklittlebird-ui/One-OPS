import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const users = [
    { email: "ahmed.hassan@linkagency.com", name: "Ahmed Hassan", role: "admin" },
    { email: "sara.ibrahim@linkagency.com", name: "Sara Ibrahim", role: "station_manager" },
    { email: "omar.khalil@linkagency.com", name: "Omar Khalil", role: "station_manager" },
    { email: "fatma.ali@linkagency.com", name: "Fatma Ali", role: "station_ops" },
    { email: "mohamed.youssef@linkagency.com", name: "Mohamed Youssef", role: "station_ops" },
    { email: "nour.ahmed@linkagency.com", name: "Nour Ahmed", role: "employee" },
    { email: "tarek.mansour@linkagency.com", name: "Tarek Mansour", role: "employee" },
    { email: "dina.mostafa@linkagency.com", name: "Dina Mostafa", role: "station_ops" },
    { email: "khaled.samy@linkagency.com", name: "Khaled Samy", role: "employee" },
    { email: "mona.farid@linkagency.com", name: "Mona Farid", role: "station_manager" },
    { email: "yasser.nabil@linkagency.com", name: "Yasser Nabil", role: "employee" },
    { email: "heba.gamal@linkagency.com", name: "Heba Gamal", role: "station_ops" },
    { email: "amr.reda@linkagency.com", name: "Amr Reda", role: "employee" },
    { email: "layla.adel@linkagency.com", name: "Layla Adel", role: "employee" },
    { email: "hassan.magdy@linkagency.com", name: "Hassan Magdy", role: "admin" },
  ];

  const results = [];
  for (const u of users) {
    const password = "Link@2025";
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: u.name },
    });

    if (error) {
      results.push({ email: u.email, error: error.message });
      continue;
    }

    if (data.user) {
      await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: u.role });
    }
    results.push({ email: u.email, name: u.name, role: u.role, success: true });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
