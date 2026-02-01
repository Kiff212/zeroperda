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

        // Get INVITES count too (they count towards limit!)
        const { count: invitesCount, error: invitesError } = await supabase
            .from('organization_invites')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', organizationId);

        if (invitesError) console.error("Error checking invites count:", invitesError);

        const totalUsers = currentMembers.length + (invitesCount || 0);
        const limit = getPlanLimit(org.plan as any).users;

        if (totalUsers >= limit) {
            return { success: false, message: `Limite do plano atingido (${limit} usuários). Faça upgrade.` };
        }

        // B. Find Profile by Email
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        // C. LOGIC BRANCH: Existing User VS Invite
        if (profile) {
            // User Exists -> Add directly
            const isAlready = currentMembers.some(m => m.user_id === profile.id);
            if (isAlready) {
                return { success: false, message: "Este usuário já faz parte da equipe." };
            }

            const { error: insertError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: organizationId,
                    user_id: profile.id,
                    role: 'staff' // Default role
                });

            if (insertError) throw insertError;
            return { success: true, message: "Membro adicionado com sucesso!" };

        } else {
            // User Does Not Exist -> Create Invite
            // Check if already invited
            const { data: existingInvite } = await supabase
                .from('organization_invites')
                .select('id')
                .eq('organization_id', organizationId)
                .eq('email', email)
                .single();

            if (existingInvite) {
                return { success: false, message: "Já existe um convite pendente para este email." };
            }

            const { error: inviteError } = await supabase
                .from('organization_invites')
                .insert({
                    organization_id: organizationId,
                    email: email,
                    role: 'staff'
                });

            if (inviteError) throw inviteError;
            return { success: true, message: "Convite enviado! Assim que ele se cadastrar, entrará na equipe." };
        }
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
    },

    // 4. Get Pending Invites
    async getInvites(organizationId: string): Promise<{ id: string, email: string, role: string, created_at: string }[]> {
        const { data, error } = await supabase
            .from('organization_invites')
            .select('*')
            .eq('organization_id', organizationId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // 5. Cancel Invite
    async cancelInvite(inviteId: string): Promise<void> {
        const { error } = await supabase
            .from('organization_invites')
            .delete()
            .eq('id', inviteId);

        if (error) throw error;
    }
};
