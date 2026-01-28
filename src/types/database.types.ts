export interface Section {
    id: string; // uuid
    user_id: string; // uuid
    name: string;
    created_at?: string;
}

export interface Product {
    id: string; // uuid
    user_id: string; // uuid
    section_id?: string; // FK to sections
    created_at?: string;
    name: string;
    category?: string; // Kept for backward compatibility or extra grouping
    image_url?: string;
    min_stock_alert?: number;

    // Joined fields
    sections?: Section;
}

export interface Batch {
    id: string; // uuid
    created_at?: string;
    product_id: string; // FK to products
    quantity: number;
    expiration_date: string;
    status?: 'active' | 'consumed' | 'discarded';

    // Joined fields
    products?: Product;
}
