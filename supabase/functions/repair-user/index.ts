import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = await req.json()
        const email = payload.email;

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required in body" }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }

        console.log(`Reparing user: ${email}...`);

        // 1. Get User ID from Auth (Admin API)
        const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();

        // Simple logic: filter in memory since listUsers doesn't support equal filter for email easily in all versions, 
        // or use GetUserByEmail if available.
        const user = users.find(u => u.email === email);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found in Auth" }), { status: 404 });
        }

        console.log(`Found User ID: ${user.id}`);

        // 2. Fix Profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: user.id,
                email: email,
                full_name: 'Heitor (Repair)'
            })

        if (profileError) console.error("Profile Error:", profileError);

        // 3. Fix Org
        // Check if member exists
        const { data: membership } = await supabaseAdmin
            .from('organization_members')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!membership) {
            console.log("Creating Organization...");
            const { data: org, error: orgError } = await supabaseAdmin
                .from('organizations')
                .insert({ name: 'Loja Repair', plan: 'start' })
                .select()
                .single();

            if (orgError) throw orgError;

            console.log("Linking Member...");
            const { error: memberError } = await supabaseAdmin
                .from('organization_members')
                .insert({
                    organization_id: org.id,
                    user_id: user.id,
                    role: 'owner'
                });

            if (memberError) throw memberError;
        } else {
            console.log("User already has organization.");
        }

        return new Response(JSON.stringify({ message: "Repair Complete", userId: user.id }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        })
    }
})
