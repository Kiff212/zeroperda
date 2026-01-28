import { supabase } from "../lib/supabase";
import type { Batch, Section, Product } from "../types/database.types";

export const batchService = {
    // Get all active batches with product details AND section details
    async getAllBatches(): Promise<Batch[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Join products -> sections
        const { data, error } = await supabase
            .from('batches')
            .select('*, products(*, sections(*))')
            .neq('status', 'consumed')
            .neq('status', 'discarded')
            .order('expiration_date', { ascending: true });

        if (error) {
            console.error('Error fetching batches:', error);
            throw error;
        }
        return data as Batch[];
    },

    // Get all unique sections for the user
    async getSections(): Promise<Section[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('sections')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data as Section[];
    },

    // Helper to calculate days remaining
    getDaysRemaining(dateString: string): number {
        const today = new Date();
        const expDate = new Date(dateString);
        const diffTime = expDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Format date for display (e.g., 12/OUT)
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const month = months[date.getMonth()];
        return `${day}/${month}`;
    },

    async createBatch(sectionName: string, productName: string, quantity: number, expirationDate: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // 1. Resolve Section
        let sectionId: string;

        // Check if section exists
        const { data: existingSection } = await supabase
            .from('sections')
            .select('id')
            .ilike('name', sectionName)
            .single();

        if (existingSection) {
            sectionId = existingSection.id;
        } else {
            // Create Section
            const { data: newSection, error: secError } = await supabase
                .from('sections')
                .insert({ user_id: user.id, name: sectionName })
                .select()
                .single();
            if (secError) throw secError;
            sectionId = newSection.id;
        }

        // 2. Resolve Product
        let productId: string;
        const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .ilike('name', productName)
            .eq('section_id', sectionId) // Enforce product uniqueness PER SECTION too? Or globally? Let's check name only first to match previous logic logic, but better to check if it exists for this user.
            // But user might put "Milk" in "Dairy" and "Milk" in "Bakery" -> different products.
            .single();

        if (existingProduct) {
            productId = existingProduct.id;
        } else {
            // Create Product
            const { data: newProduct, error: prodError } = await supabase
                .from('products')
                .insert({
                    user_id: user.id,
                    section_id: sectionId,
                    name: productName,
                    category: sectionName, // Keeping backward compat
                    min_stock_alert: 5
                })
                .select()
                .single();

            if (prodError) throw prodError;
            productId = newProduct.id;
        }

        // 3. Create Batch
        const { error: batchError } = await supabase
            .from('batches')
            .insert({
                product_id: productId,
                quantity,
                expiration_date: expirationDate,
                status: 'active'
            });

        if (batchError) throw batchError;
    },

    async updateBatchStatus(batchId: string, status: 'consumed' | 'discarded'): Promise<void> {
        const { error } = await supabase
            .from('batches')
            .update({ status })
            .eq('id', batchId);

        if (error) throw error;
    },

    async addBatchToProduct(productId: string, quantity: number, expirationDate: string): Promise<void> {
        const { error } = await supabase
            .from('batches')
            .insert({
                product_id: productId,
                quantity,
                expiration_date: expirationDate,
                status: 'active'
            });

        if (error) throw error;
    },

    async deleteProduct(productId: string): Promise<void> {
        // RLS Policies ensure we can only delete our own products
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;
    },

    async importProducts(items: { section: string; product: string }[]): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Process sequentially to handle dependent creations (Section -> Product)
        for (const item of items) {
            const sectionName = item.section.trim().toUpperCase();
            const productName = item.product.trim().toUpperCase();

            // 1. Resolve Section
            let sectionId: string;
            const { data: existingSection } = await supabase
                .from('sections')
                .select('id')
                .eq('user_id', user.id)
                .ilike('name', sectionName)
                .maybeSingle(); // Use maybeSingle to avoid 406 on no rows

            if (existingSection) {
                sectionId = existingSection.id;
            } else {
                const { data: newSection, error: secError } = await supabase
                    .from('sections')
                    .insert({ user_id: user.id, name: sectionName })
                    .select()
                    .single();
                if (secError) throw secError;
                sectionId = newSection.id;
            }

            // 2. Resolve Product
            const { data: existingProduct } = await supabase
                .from('products')
                .select('id')
                .eq('user_id', user.id)
                .eq('section_id', sectionId)
                .ilike('name', productName)
                .maybeSingle();

            if (!existingProduct) {
                const { error: prodError } = await supabase
                    .from('products')
                    .insert({
                        user_id: user.id,
                        section_id: sectionId,
                        name: productName,
                        category: sectionName,
                        min_stock_alert: 5
                    });
                if (prodError) throw prodError;
            }
        }
    },

    async getProductsBySection(sectionId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('section_id', sectionId)
            .order('name', { ascending: true });

        if (error) throw error;
        return data as Product[];
    }
};

