export interface Organization {
    id: string; // uuid
    name: string;
    plan?: string;
    created_at?: string;
}

export interface OrganizationMember {
    id: string; // uuid
    organization_id: string; // FK to organizations
    user_id: string; // FK to auth.users
    role?: 'owner' | 'member';
    created_at?: string;
}

export interface Section {
    id: string; // uuid
    organization_id: string; // uuid (replaced user_id)
    name: string;
    created_at?: string;
}

export interface Product {
    id: string; // uuid
    organization_id: string; // uuid (replaced user_id)
    section_id?: string; // FK to sections
    created_at?: string;
    name: string;
    category?: string;
    image_url?: string;
    min_stock_alert?: number;

    // Joined fields
    sections?: Section;
}

export interface Batch {
    id: string; // uuid
    created_at?: string;
    organization_id: string; // uuid
    product_id: string; // FK to products
    quantity: number;
    expiration_date: string;
    status?: 'active' | 'consumed' | 'discarded';

    // Joined fields
    products?: Product;
}
