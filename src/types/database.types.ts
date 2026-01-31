export interface Organization {
    id: string; // uuid
    name: string;
    plan?: 'start' | 'pro' | 'sovereign';
    created_at?: string;
}

export interface OrganizationMember {
    id: string; // uuid
    organization_id: string; // FK to organizations
    user_id: string; // FK to auth.users
    role?: 'owner' | 'member';
    created_at?: string;
}

export interface Categoria {
    id: string; // uuid
    loja_id: string; // uuid (replaced organization_id)
    nome: string;
    slug: string;
    created_at?: string;
}

export interface Produto {
    id: string; // uuid
    loja_id: string; // uuid (replaced organization_id)
    categoria_id?: string; // FK to sections
    created_at?: string;
    nome: string;
    ean?: string;
    medida?: string;
    ativo?: boolean;
    image_url?: string;
    min_stock_alert?: number;

    // Joined fields
    categorias?: Categoria;
}

export interface Batch {
    id: string; // uuid
    created_at?: string;
    organization_id: string; // uuid (Note: SQL for batches still says organization_id in some places, but we should align if possible. Keeping as is per current code until verified, but usually it links to products)
    product_id: string; // FK to products
    quantity: number;
    expiration_date: string;
    status?: 'active' | 'consumed' | 'discarded';

    // Joined fields
    produtos?: Produto;
}
