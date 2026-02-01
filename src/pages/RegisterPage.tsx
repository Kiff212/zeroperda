import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';

import { useLocation } from 'react-router-dom';

export function RegisterPage() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get plan from navigation state or default to start/monthly (safety fallback)
    const { plan, cycle } = location.state || { plan: 'start', cycle: 'monthly' };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Pass plan metadata to Auth Context -> Supabase -> Post-Signup Trigger
            const onboardingData = localStorage.getItem('zp_onboarding_data');
            const meta = onboardingData ? JSON.parse(onboardingData) : {};

            await signUp(email, password, {
                plan_tier: plan,
                billing_cycle: cycle,
                ...meta
            });
            navigate('/dashboard'); // Direct access after success
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Success Banner */}
                <div className="absolute top-0 left-0 right-0 bg-green-500/10 border-b border-green-500/20 p-2 flex items-center justify-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    Pagamento Confirmado
                </div>

                <div className="mt-8 text-center mb-8">
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                        Finalizar Acesso
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Crie sua conta administrativa para acessar o dashboard.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded mb-6 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Email Corporativo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-industrial-red outline-none transition-colors"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Senha Segura</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-industrial-red outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black uppercase tracking-wider p-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Acessar Sistema'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600 text-[10px] uppercase font-bold">
                    <Lock size={12} />
                    Ambiente 100% Seguro
                </div>
            </div>
        </div>
    );
}
