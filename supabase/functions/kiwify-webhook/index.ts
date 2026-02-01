import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    // CORS Headers (Kiwify might need OK response)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    try {
        // 1. Parse Payload
        const payload = await req.json()
        console.log("Webhook received:", payload)

        // Kiwify sends 'order_status'
        // paid, refunded, chargedback
        const status = payload.order_status
        if (status !== 'paid') {
            return new Response(JSON.stringify({ message: "Ignored: Not paid" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            })
        }

        // 2. Get Email
        const email = payload.Customer?.email || payload.customer?.email || payload.email
        if (!email) {
            throw new Error("Email not found in payload")
        }

        console.log("Processing upgrade for:", email)

        // 4. Determine Plan based on Amount Paid
        // Kiwify sends commissions (value passed to producer) or full value.
        // Let's use a safe heuristic based on our pricing.
        // Start ~ R$79.00 | Pro ~ R$179.00
        // If value > 100, it's PRO. If < 100, it's START.

        // Payload usually has:
        // commissions: { my_commission: X } -> X in cents? No, usually float/string.
        // OR
        // order: { total: X } -> Full price paid by customer.

        let amountPaid = 0;

        // Try to extract amount from typical Kiwify payload fields
        if (payload.order && payload.order.total) { // "79.90" string or number
            amountPaid = Number(payload.order.total);
        } else if (payload.Commissions && payload.Commissions.my_commission) {
            amountPaid = Number(payload.Commissions.my_commission);
        } else if (payload.commission) {
            amountPaid = Number(payload.commission);
        }

        console.log("Amount Detected:", amountPaid);

        const targetPlan = amountPaid > 100 ? 'pro' : 'start';
        console.log("Target Plan:", targetPlan);

        // 5. Init Supabase Admin (Service Role)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 6. Find User by Email (in public.profiles or auth.users)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single()

        if (profileError || !profile) {
            console.error("Profile not found:", profileError)
            // Auto-Create Account if not exists? 
            // For now, let's stick to updating existing, or creating a pending state if complex.
            // User requested "Simplest", so we error if not found.
            return new Response(JSON.stringify({ error: "User not found. Please register first." }), {
                headers: { "Content-Type": "application/json" },
                status: 200, // Return 200 to stop Kiwify retrying forever if it's a logic error
            })
        }

        // 7. Find Organization for this user
        const { data: member, error: memberError } = await supabaseAdmin
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', profile.id)
            .single() // Any member can upgrade? Ideally owner.

        if (memberError || !member) {
            throw new Error("User has no organization")
        }

        // 8. Update Organization Plan
        const { error: updateError } = await supabaseAdmin
            .from('organizations')
            .update({
                plan: targetPlan
                // updated_at removed (column does not exist)
            })
            .eq('id', member.organization_id)

        if (updateError) throw updateError

        console.log(`Success! Upgraded org ${member.organization_id} to ${targetPlan} (Paid: ${amountPaid})`)

        return new Response(JSON.stringify({ message: `Upgraded to ${targetPlan}` }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        })
    }
})
