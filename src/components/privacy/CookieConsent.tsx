import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('zp_cookie_consent');
        if (!consent) {
            // Delay slightly for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('zp_cookie_consent', 'true');
        setIsVisible(false);
        // Here you would trigger analytics/tracking scripts initialization if any
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-950/90 backdrop-blur-md border border-industrial-yellow/30 p-5 rounded-lg shadow-[0_0_30px_rgba(234,179,8,0.1)] relative">
                <button
                    onClick={() => setIsVisible(false)} // Just close, don't set logic yet (or treat as decline/dismiss)
                    className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-industrial-yellow/10 p-2 rounded-lg text-industrial-yellow">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase mb-1">
                            Privacidade Blindada
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Nós usamos cookies essenciais para garantir que você não perca dinheiro (nem dados). Zero rastreio invasivo.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-industrial-yellow text-black font-black uppercase text-xs py-2.5 rounded hover:bg-white transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    >
                        Aceitar & Continuar
                    </button>
                    <a
                        href="/privacy" // Future privacy page
                        className="flex-1 flex items-center justify-center text-zinc-500 font-bold uppercase text-xs hover:text-white transition-colors border border-zinc-800 rounded hover:border-zinc-600"
                    >
                        Ler Política
                    </a>
                </div>
            </div>
        </div>
    );
}
