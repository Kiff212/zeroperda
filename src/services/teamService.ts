import { supabase } from "../lib/supabase";
import type { OrganizationMember } from "../types/database.types";
import { getPlanLimit } from "../config/limits";

export const teamService = {
    // 1. Get Members with Profile Data
    async getMembers(organizationId: string): Promise<OrganizationMember[]> {
        const { data, error } = await supabase
            .from('organization_members')
            .select('*, profiles(*)')
            .eq('organization_id', organizationId);

        if (error) throw error;
        return data as OrganizationMember[];
    },

    // 2. Add Member (By Email)
    async addMember(organizationId: string, email: string): Promise<{ success: boolean; message: string }> {
        // A. Validate Limits
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .select('plan')
            .eq('id', organizationId)
            .single();

        if (orgError) throw orgError;

        const currentMembers = await this.getMembers(organizationId);
        const limit = getPlanLimit(org.plan as any).users;

        if (currentMembers.length >= limit) {
            return { success: false, message: `Limite do plano atingido (${limit} usuários). Faça upgrade.` };
        }

        // B. Find Profile by Email
        // NOTE: This assumes 'profiles' table is readable. 
        // If RLS blocks this, we would need a secure Edge Function. 
        // Based on schema review, profiles seems public or readable by auth users.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            return { success: false, message: "Usuário não encontrado. Peça para ele criar uma conta grátis no app primeiro." };
        }

        // C. Check if already member
        const isAlready = currentMembers.some(m => m.user_id === profile.id);
        if (isAlready) {
            return { success: false, message: "Este usuário já faz parte da equipe." };
        }

        // D. Insert
        const { error: insertError } = await supabase
            .from('organization_members')
            .insert({
                organization_id: organizationId,
                user_id: profile.id,
                role: 'member' // Default role
            });

        if (insertError) throw insertError;

        return { success: true, message: "Membro adicionado com sucesso!" };
    },

    // 3. Remove Member
    async removeMember(organizationId: string, userId: string): Promise<void> {
        // Prevent removing self or owner if not owner? RLS handles most of this.
        // We just call delete.
        const { error } = await supabase
            .from('organization_members')
            .delete()
            .eq('organization_id', organizationId)
            .eq('user_id', userId);

        if (error) throw error;
    }
};
