export const PRICING = {
    start: {
        monthly: 79.90,
        annualDiscount: 0.20, // 20%
    },
    pro: {
        monthly: 179.90,
        annualDiscount: 0.35, // 35%
    }
};

export const getPrice = (plan: 'start' | 'pro', cycle: 'monthly' | 'annual') => {
    const base = PRICING[plan].monthly;
    if (cycle === 'monthly') return base.toFixed(2).replace('.', ',');

    const discounted = base * (1 - PRICING[plan].annualDiscount);
    return discounted.toFixed(2).replace('.', ',');
};

export const getAnnualTotal = (plan: 'start' | 'pro') => {
    const base = PRICING[plan].monthly;
    const total = (base * 12) * (1 - PRICING[plan].annualDiscount);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
