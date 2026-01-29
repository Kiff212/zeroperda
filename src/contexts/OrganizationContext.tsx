import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Organization } from '../types/database.types';

interface OrganizationContextType {
    currentOrg: Organization | null;
    loading: boolean;
    error: string | null;
    refreshOrg: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrg = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // 1. Get the membership for the current user
            const { data: memberData, error: memberError } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (memberError) {
                // If no row found, it means user has no org yet
                if (memberError.code === 'PGRST116') {
                    console.warn("User has no organization assigned.");
                    // Optional: You could redirect to an onboarding/create-org page here
                    // or just let the UI handle the null state
                }
                throw memberError;
            }

            if (memberData) {
                // 2. Get the organization details
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', memberData.organization_id)
                    .single();

                if (orgError) throw orgError;

                setCurrentOrg(orgData);
            }
        } catch (err: any) {
            console.error("Error fetching organization:", err);
            // Don't block the UI with a hard error if it's just "no rows found" (new user)
            if (err.code !== 'PGRST116') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrg();
    }, [user]); // Re-fetch when user changes (login/logout)

    return (
        <OrganizationContext.Provider value={{ currentOrg, loading, error, refreshOrg: fetchOrg }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
