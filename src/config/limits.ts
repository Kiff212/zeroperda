export const PLAN_LIMITS = {
    start: {
        users: 1,
        items: 500,
        label: 'START',
        offline: false,
    },
    pro: {
        users: 5,
        items: Infinity,
        label: 'PRO ⚡',
        offline: true,
    },
    sovereign: {
        users: Infinity,
        items: Infinity,
        label: 'SOVEREIGN 👑',
        offline: true,
    }
};

export const getPlanLimit = (plan: 'start' | 'pro' | 'sovereign' | undefined) => {
    const p = plan || 'start';
    return PLAN_LIMITS[p];
};
