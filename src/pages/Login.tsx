import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Box, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Falha na autenticação";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell className="flex flex-col justify-center bg-industrial-bg">
            <div className="p-8">
                <div className="mb-12 text-center">
                    <div className="w-16 h-16 bg-industrial text-white mx-auto flex items-center justify-center border-2 border-black shadow-industrial mb-6">
                        <Box size={32} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">
                        Zero Perda
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                        Internal System v1.0
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/40 border-2 border-industrial-red text-industrial-red p-3 flex items-center gap-2 text-xs font-bold uppercase">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase ml-1 block text-zinc-400">Email de Acesso</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@zeroperda.com"
                            className="w-full bg-industrial-surface border-2 border-industrial p-4 font-bold text-white outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all placeholder:text-zinc-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase ml-1 block text-zinc-400">Chave de Acesso</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-industrial-surface border-2 border-industrial p-4 font-bold text-white outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all placeholder:text-zinc-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-industrial text-white border-2 border-black p-4 font-black uppercase tracking-wider shadow-industrial flex items-center justify-center gap-2 hover:bg-white hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-pulse">Autenticando...</span>
                        ) : (
                            <>
                                <Lock size={18} />
                                Entrar no Sistema
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center opacity-40">
                    <p className="text-[10px] font-mono leading-relaxed text-zinc-500">
                        RESTRICTED ACCESS<br />
                        AUTHORIZED PERSONNEL ONLY
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
