import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, Users } from 'lucide-react';

export function JoinTeam() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get invite email from URL
    const inviteEmail = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check
    useEffect(() => {
        if (!inviteEmail) {
            setError("Link inválido: faltou o e-mail no convite.");
        }
    }, [inviteEmail]);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!inviteEmail) return;

        try {
            // Sign Up normally. The Trigger `handle_new_user` will catch the invite logic.
            await signUp(inviteEmail, password, {
                full_name: name
            });
            navigate('/dashboard');
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
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">

                {/* Accent Decor */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-industrial-yellow to-yellow-600" />

                <div className="mt-4 text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-industrial-yellow p-3 rounded-full border-4 border-black shadow">
                            <Users className="text-black" size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                        Junte-se à Equipe
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Você recebeu um convite exclusivo para acessar o sistema.
                        Defina sua senha para continuar.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded mb-6 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Seu E-mail (Convidado)</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={inviteEmail}
                                disabled
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-400 cursor-not-allowed outline-none"
                            />
                            <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Seu Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-industrial-yellow outline-none transition-colors"
                            placeholder="Ex: João da Silva"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Criar Senha</label>
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
                        disabled={loading || !inviteEmail}
                        className="w-full bg-industrial-yellow text-black font-black uppercase tracking-wider p-4 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Entrar na Loja <ArrowRight size={20} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col items-center gap-2 text-center">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500" /> Link Seguro e Verificado
                    </span>
                    <p className="text-[10px] text-zinc-700 max-w-[200px]">
                        Ao criar a senha, você concorda com os termos de privacidade do Zero Perda.
                    </p>
                </div>
            </div>
        </div>
    );
}
