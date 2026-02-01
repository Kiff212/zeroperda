import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail, ShieldQuestion } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao enviar e-mail. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">

                {/* Accent Decor */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-zinc-700 to-zinc-900" />

                <div className="mt-4 text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-zinc-800 p-3 rounded-full border-4 border-black shadow">
                            <ShieldQuestion className="text-zinc-400" size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                        Recuperar Acesso
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Informe seu e-mail corporativo para redefinir sua senha.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded mb-6 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="bg-green-900/10 border border-green-900/30 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                        <h3 className="text-green-500 font-bold uppercase mb-2">E-mail Enviado!</h3>
                        <p className="text-zinc-400 text-xs mb-6">
                            Verifique sua caixa de entrada (e spam). Enviamos um link seguro para você criar uma nova senha.
                        </p>
                        <Link
                            to="/login"
                            className="text-white text-xs font-bold uppercase hover:text-industrial-yellow transition-colors underline"
                        >
                            Voltar para o Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1 block">Seu E-mail</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white outline-none transition-colors pl-10"
                                    placeholder="seu@email.com"
                                    required
                                />
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-black uppercase tracking-wider p-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Enviar Link de Recuperação'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-center">
                        <Link to="/login" className="text-zinc-500 hover:text-white text-xs font-bold uppercase flex items-center gap-2 transition-colors">
                            <ArrowLeft size={14} /> Voltar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
