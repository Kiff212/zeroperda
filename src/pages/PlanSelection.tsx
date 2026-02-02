import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { getPrice, getAnnualTotal } from '../config/pricing';
import { useAuth } from '../contexts/AuthContext';

export function PlanSelection() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    const { session } = useAuth();

    const handlePlanSelect = (plan: 'start' | 'pro') => {
        // Kiwify Links provided by user
        const KIWIFY_LINKS = {
            start: {
                monthly: "https://pay.kiwify.com.br/aIpNoCI",
                annual: "https://pay.kiwify.com.br/ORh6A5v"
            },
            pro: {
                monthly: "https://pay.kiwify.com.br/h9JaixL",
                annual: "https://pay.kiwify.com.br/6DQ3srd"
            }
        };

        const link = KIWIFY_LINKS[plan][billingCycle];

        if (session) {
            // IF LOGGED IN: Go directly to payment (Avoid "Create Account" loop)
            // Ideally passing email to Kiwify if they support it (e.g. ?email=...)
            // For now, robust direct link.
            window.open(link, '_blank');
        } else {
            // IF LOGGED OUT: Go to Register first (Standard Flow)
            // Why? Because we need to create the account in Supabase first.
            // Kiwify webhook will then find the user by email.
            navigate('/register', { state: { plan, cycle: billingCycle } });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-industrial-red selection:text-white p-6 pb-24">
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center py-12">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                    Instalação <span className="text-industrial-yellow">Desbloqueada</span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Você completou o diagnóstico. Agora escolha como quer estancar suas perdas.
                </p>
            </header>

            {/* Billing Slider */}
            <div className="flex justify-center mb-16">
                <div
                    className="bg-zinc-900/80 p-1.5 rounded-full flex relative items-center cursor-pointer border border-zinc-800 shadow-2xl select-none"
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                >
                    {/* Toggle Slider */}
                    <div
                        className="absolute h-[calc(100%-12px)] top-1.5 bg-industrial-yellow rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg"
                        style={{
                            left: billingCycle === 'monthly' ? '6px' : '50%',
                            width: 'calc(50% - 6px)'
                        }}
                    />

                    <button
                        onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                        className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all relative z-10 w-40 ${billingCycle === 'monthly' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setBillingCycle('annual'); }}
                        className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all relative z-10 w-40 flex flex-col items-center leading-none gap-1 ${billingCycle === 'annual' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <span>Anual</span>
                        {billingCycle !== 'annual' && <span className="text-[9px] bg-green-500 text-black px-1.5 rounded font-bold absolute -top-2 -right-2 animate-bounce">Até -25%</span>}
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">

                {/* START PLAN */}
                <div className="p-8 rounded-2xl border-2 bg-zinc-900/30 border-zinc-800 transition-all duration-500 hover:border-zinc-600 group">
                    <h3 className="text-2xl font-black uppercase text-white mb-2">Plano Start</h3>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 block">Validação</span>

                    <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                        <span className="text-4xl font-black text-white">R$ {getPrice('start', billingCycle)}</span>
                        <span className="text-zinc-500 font-bold">/mês</span>
                        {billingCycle === 'annual' && <span className="text-xs text-zinc-500 font-medium ml-1">(cobrado anualmente)</span>}
                    </div>

                    <div className="h-8 mb-4">
                        {billingCycle === 'annual' && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-xs text-green-500 font-bold uppercase bg-green-500/10 px-2 py-1 rounded">10% de Desconto</span>
                                <span className="text-xs text-zinc-500 font-mono">Total: {getAnnualTotal('start')}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-industrial-yellow font-bold uppercase mb-8">
                        O custo de 2 produtos vencidos paga o sistema.
                    </p>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <span className="text-white font-bold">1 Usuário</span>
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                            Até 500 Itens Monitorados
                        </li>
                        <li className="flex items-center gap-3 text-zinc-500 text-sm">
                            <CheckCircle2 size={18} className="text-zinc-700" />
                            Sem Backup em Nuvem
                        </li>
                    </ul>

                    <button
                        onClick={() => handlePlanSelect('start')}
                        className="w-full py-4 bg-zinc-800 text-white font-bold uppercase rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-zinc-500 flex items-center justify-center gap-2"
                    >
                        Selecionar Start
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-center gap-2">
                            <ShieldCheck size={12} /> Instalação Imediata
                        </p>
                    </div>
                </div>

                {/* PRO PLAN (HERO) */}
                <div className="p-8 rounded-2xl border-2 border-industrial-red bg-zinc-900 relative overflow-hidden transition-all duration-500 shadow-[0_0_50px_rgba(239,68,68,0.15)] scale-105 z-10">
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-industrial-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg shadow-lg">
                        Mais Escolhido
                    </div>

                    <h3 className="text-2xl font-black uppercase text-white mb-2 flex items-center gap-2">
                        Plano Pro <Zap size={18} className="text-industrial-yellow fill-industrial-yellow" />
                    </h3>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 block">Escala</span>

                    <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                        <span className="text-5xl md:text-6xl font-black text-white">R$ {getPrice('pro', billingCycle)}</span>
                        <span className="text-zinc-400 font-bold">/mês</span>
                        {billingCycle === 'annual' && <span className="text-xs text-zinc-400 font-medium ml-1">(cobrado anualmente)</span>}
                    </div>

                    <div className="h-8 mb-4">
                        {billingCycle === 'annual' && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-xs text-industrial-yellow font-bold uppercase bg-industrial-yellow/10 px-2 py-1 rounded">25% de Desconto</span>
                                <span className="text-xs text-zinc-500 font-mono">Total: {getAnnualTotal('pro')}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-industrial-yellow font-bold uppercase mb-8">
                        Blindagem completa contra falhas.
                    </p>

                    <div className="bg-industrial-yellow/5 border border-industrial-yellow/10 p-5 rounded-xl mb-8">
                        <h4 className="text-industrial-yellow font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={12} /> Funcionalidades de Escala
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                Itens Ilimitados
                            </li>
                            <li className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                5 Usuários + Gestor Dedicado
                            </li>
                            <li className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                <span className="uppercase">Toalheiro de Dados</span> (Offline)
                            </li>
                            <li className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-industrial-yellow" />
                                Gestor Dedicado
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => handlePlanSelect('pro')}
                        className="w-full py-5 bg-industrial-red text-white text-lg font-black uppercase rounded-lg hover:bg-red-600 transition-all shadow-lg btn-glow flex items-center justify-center gap-2 group"
                    >
                        Quero o Pro
                        <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-4 text-zinc-500 text-[10px] font-bold uppercase">
                        <span className="flex items-center gap-1"><ShieldCheck size={12} /> Garantia de 7 Dias</span>
                        <span className="flex items-center gap-1"><Zap size={12} /> Setup Instantâneo</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
