import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function UpdatePassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check to prevent direct access without session hash handled by Supabase
    // Actually, when clicking the link, Supabase sets the session automatically in the client.
    // So we just update the user.

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert("Senha atualizada com sucesso! Você será redirecionado.");
            navigate('/dashboard');

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao atualizar senha.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">

                <div className="mt-4 text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-industrial-yellow p-3 rounded-full border-4 border-black shadow">
                            <Lock className="text-black" size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                        Nova Senha
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Defina sua nova senha de acesso administrativo.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded mb-6 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Nova Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-industrial-yellow outline-none transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-industrial-yellow text-black font-black uppercase tracking-wider p-4 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Salvar Nova Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
