import { ShieldCheck, Lock } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-black py-12 px-6 border-t border-zinc-900">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-white font-black uppercase text-xl font-mono tracking-tighter">
                        ZERO<span className="text-industrial-red">PERDA</span>
                    </span>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider">
                        © 2026 - Controle Industrial de Validade
                    </span>
                </div>

                <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase">
                        <ShieldCheck size={16} />
                        Dados Criptografados
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase">
                        <Lock size={16} />
                        Pagamento Seguro
                    </div>
                </div>
            </div>
        </footer>
    );
}
