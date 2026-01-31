import { supabase } from "../lib/supabase";
import type { Batch, Categoria, Produto } from "../types/database.types";

export const batchService = {
    // Get all active batches with product details AND section details
    async getAllBatches(organizationId: string): Promise<Batch[]> {
        if (!organizationId) throw new Error("Organization ID is required");

        // Join produtos -> categorias
        const { data, error } = await supabase
            .from('batches')
            .select('*, produtos(*, categorias(*))')
            .eq('organization_id', organizationId)
            .neq('status', 'consumed')
            .neq('status', 'discarded')
            .order('expiration_date', { ascending: true });

        if (error) {
            console.error('Error fetching batches:', error);
            throw error;
        }
        return data as Batch[];
    },

    // Get all unique sections (Categories) for the organization
    async getSections(organizationId: string): Promise<Categoria[]> {
        if (!organizationId) return [];

        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('loja_id', organizationId)
            .order('nome', { ascending: true });

        if (error) throw error;
        return data as Categoria[];
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

    async createBatch(organizationId: string, sectionName: string, productName: string, quantity: number, expirationDate: string): Promise<void> {
        if (!organizationId) throw new Error("Organization ID is required");

        // 1. Resolve Section (Categoria)
        let sectionId: string;

        const { data: existingSection } = await supabase
            .from('categorias')
            .select('id')
            .eq('loja_id', organizationId)
            .ilike('nome', sectionName)
            .maybeSingle();

        if (existingSection) {
            sectionId = existingSection.id;
        } else {
            // Create Section linked to Org
            // NOTE: Using 'slug' is required by DB unique constraint or app logic, but for simplicity we slugify the name
            const slug = sectionName.toLowerCase().replace(/\s+/g, '-');
            const { data: newSection, error: secError } = await supabase
                .from('categorias')
                .insert({
                    loja_id: organizationId,
                    nome: sectionName,
                    slug: slug + '-' + Math.random().toString(36).substr(2, 5) // Simple slug generation to avoid conflict
                })
                .select()
                .single();
            if (secError) throw secError;
            sectionId = newSection.id;
        }

        // 2. Resolve Product (Produto)
        let productId: string;
        const { data: existingProduct } = await supabase
            .from('produtos')
            .select('id')
            .eq('loja_id', organizationId)
            .ilike('nome', productName)
            .eq('categoria_id', sectionId)
            .maybeSingle();

        if (existingProduct) {
            productId = existingProduct.id;
        } else {
            // Create Product linked to Org
            const { data: newProduct, error: prodError } = await supabase
                .from('produtos')
                .insert({
                    loja_id: organizationId,
                    categoria_id: sectionId,
                    nome: productName,
                    min_stock_alert: 5
                })
                .select()
                .single();

            if (prodError) throw prodError;
            productId = newProduct.id;
        }

        // 3. Create Batch linked to Org
        const { error: batchError } = await supabase
            .from('batches')
            .insert({
                organization_id: organizationId,
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

    async addBatchToProduct(organizationId: string, productId: string, quantity: number, expirationDate: string): Promise<void> {
        if (!organizationId) throw new Error("Organization ID is required");

        const { error } = await supabase
            .from('batches')
            .insert({
                organization_id: organizationId,
                product_id: productId,
                quantity,
                expiration_date: expirationDate,
                status: 'active'
            });

        if (error) throw error;
    },

    async deleteProduct(productId: string): Promise<void> {
        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', productId);

        if (error) throw error;
    },

    async importProductsManual(organizationId: string, items: { section: string; product: string }[]): Promise<void> {
        if (!organizationId) throw new Error("Organization ID is required");

        // NOTE: This manual implementation is fallback. Ideally use RPC if available.
        for (const item of items) {
            const sectionName = item.section.trim().toUpperCase();
            const productName = item.product.trim().toUpperCase();

            // 1. Resolve Categoria
            let categoriaId: string;
            const { data: existingSection } = await supabase
                .from('categorias')
                .select('id')
                .eq('loja_id', organizationId)
                .ilike('nome', sectionName)
                .maybeSingle();

            if (existingSection) {
                categoriaId = existingSection.id;
            } else {
                const slug = sectionName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                const { data: newSection, error: secError } = await supabase
                    .from('categorias')
                    .insert({ loja_id: organizationId, nome: sectionName, slug })
                    .select()
                    .single();
                if (secError) throw secError;
                categoriaId = newSection.id;
            }

            // 2. Resolve Produto
            const { data: existingProduct } = await supabase
                .from('produtos')
                .select('id')
                .eq('loja_id', organizationId)
                .eq('categoria_id', categoriaId)
                .ilike('nome', productName)
                .maybeSingle();

            if (!existingProduct) {
                const { error: prodError } = await supabase
                    .from('produtos')
                    .insert({
                        loja_id: organizationId,
                        categoria_id: categoriaId,
                        nome: productName,
                        min_stock_alert: 5
                    });
                if (prodError) throw prodError;
            }
        }
    },

    async getProductsBySection(sectionId: string): Promise<Produto[]> {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('categoria_id', sectionId)
            .order('nome', { ascending: true });

        if (error) throw error;
        return data as Produto[];
    }
};

