import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, ShieldCheck } from 'lucide-react';


export function PlanSelection() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-industrial-red selection:text-white p-6 pb-24">
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center py-12">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                    Instalação <span className="text-industrial-yellow">Desbloqueada</span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Você qualificou para o nosso programa de acompanhamento Premium.
                </p>
            </header>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-12">
                <div className="bg-zinc-900 p-1 rounded-full flex relative">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all relative z-10 ${billingCycle === 'annual' ? 'text-black' : 'text-zinc-500'}`}
                    >
                        Anual (-35%)
                    </button>

                    {/* Sliding Background */}
                    <div
                        className="absolute top-1 bottom-1 bg-industrial-yellow rounded-full transition-all duration-300 ease-out"
                        style={{
                            left: billingCycle === 'monthly' ? '4px' : '50%',
                            width: 'calc(50% - 4px)'
                        }}
                    />
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">

                {/* MONTHLY CARD */}
                <div className={`
                    p-8 rounded-2xl border-2 transition-all duration-300
                    ${billingCycle === 'monthly' ? 'bg-zinc-900 border-zinc-700 opacity-100 scale-100' : 'bg-black border-zinc-800 opacity-70 scale-95'}
                `}>
                    <h3 className="text-xl font-bold uppercase text-zinc-400 mb-2">Plano Mensal</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-black">R$ 75</span>
                        <span className="text-zinc-500 font-bold">/mês</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500" />
                            <span className="text-white font-bold">Até 2 Usuários</span>
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500" />
                            Treinamento Básico Incluso
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500" />
                            Dicas de "Onde Começar"
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500" />
                            Importação de Produtos (Excel)
                        </li>
                    </ul>

                    <div className="bg-zinc-900/50 p-4 rounded-lg mb-8 border border-zinc-800">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold text-center leading-relaxed">
                            <ShieldCheck size={12} className="inline mr-1" />
                            Compatível com seu ERP.<br />Não substitui seu sistema de caixa.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/register')}
                        className="w-full py-4 bg-zinc-800 text-white font-bold uppercase rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-zinc-500"
                    >
                        Selecionar Mensal
                    </button>
                </div>

                {/* ANNUAL CARD (HERO) */}
                <div className={`
                    p-8 rounded-2xl border-2 relative overflow-hidden transition-all duration-300 shadow-[0_0_50px_rgba(239,68,68,0.1)]
                    ${billingCycle === 'annual' ? 'bg-zinc-900 border-industrial-red scale-105 z-10' : 'bg-black border-zinc-800 opacity-70 scale-95'}
                `}>
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-industrial-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                        Recomendado
                    </div>

                    <h3 className="text-xl font-bold uppercase text-white mb-2 flex items-center gap-2">
                        Plano Anual <Star size={16} className="text-industrial-yellow fill-industrial-yellow" />
                    </h3>
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-5xl md:text-6xl font-black text-white">R$ 48,75</span>
                        <span className="text-zinc-400 font-bold">/mês</span>
                    </div>
                    <p className="text-industrial-red text-xs font-bold uppercase tracking-wide mb-8">
                        Faturado anualmente (R$ 585,00)
                    </p>

                    <div className="bg-industrial-yellow/10 border border-industrial-yellow/20 p-4 rounded-lg mb-6">
                        <h4 className="text-industrial-yellow font-black uppercase text-xs tracking-wider mb-3">
                            Vantagens Exclusivas
                        </h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                Usuários Ilimitados
                            </li>
                            <li className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                Relatórios de Performance
                            </li>
                            <li className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                Treinamento VIP p/ Equipe
                            </li>
                        </ul>
                    </div>

                    <div className="bg-zinc-900 p-4 rounded-lg mb-8 border border-zinc-800">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold text-center leading-relaxed">
                            <ShieldCheck size={12} className="inline mr-1" />
                            Usa seus produtos do ERP.<br />100% Seguro e Independente do Caixa.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/register')}
                        className="w-full py-5 bg-industrial-red text-white text-lg font-black uppercase rounded-lg hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-lg btn-glow flex items-center justify-center gap-2"
                    >
                        Quero Economizar 35%
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase">
                        <ShieldCheck size={12} />
                        Garantia de 7 Dias
                    </div>
                </div>

            </div>
        </div>
    );
}
