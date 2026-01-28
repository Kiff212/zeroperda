import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ArrowRight, AlertTriangle, CheckCircle2, DollarSign, ShieldCheck, Database, Zap, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const painRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-text", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });

            // Pain Points Animation
            gsap.from(".pain-card", {
                scrollTrigger: {
                    trigger: painRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

            // Pricing Animation
            gsap.from(".pricing-card", {
                scrollTrigger: {
                    trigger: pricingRef.current,
                    start: "top 75%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-industrial-red selection:text-white overflow-x-hidden">
            {/* TOP BANNER */}
            <div className="bg-industrial-red text-white text-center py-2 px-4 text-xs font-bold uppercase tracking-widest sticky top-0 z-50 shadow-lg">
                <span className="animate-pulse mr-2">⚠️</span>
                O desconto anual é por tempo limitado
                <span className="animate-pulse ml-2">⚠️</span>
            </div>

            {/* HERO SECTION */}
            <header ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center border-b border-zinc-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <h1 className="hero-text text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9] max-w-5xl">
                    Sua margem de lucro<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-red to-red-600">não deveria ter data de validade.</span>
                </h1>

                <p className="hero-text text-zinc-400 text-lg md:text-xl max-w-3xl font-medium leading-relaxed mb-10">
                    O sistema de inteligência que transforma perdas invisíveis em caixa recuperado. Deixe de reagir aos vencimentos e comece a antecipar o lucro.
                </p>

                <div className="hero-text flex flex-col md:flex-row gap-4 w-full max-w-md">
                    <button
                        onClick={() => navigate('/intro')}
                        className="flex-1 bg-industrial-red text-white p-5 rounded-lg border-2 border-industrial-red font-black uppercase tracking-wider hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 btn-glow"
                    >
                        Estancar perdas agora
                        <ArrowRight size={20} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 bg-transparent text-zinc-400 p-5 rounded-lg border-2 border-zinc-800 font-bold uppercase tracking-wider hover:text-white hover:border-white transition-all"
                    >
                        Já tenho acesso
                    </button>
                </div>
            </header>

            {/* CONSCIOUSNESS SECTION (MAIEUTICA) */}
            <section ref={painRef} className="py-24 px-6 border-b border-zinc-900 bg-zinc-950/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-black uppercase text-center mb-16 tracking-tight">
                        O vazamento silencioso na sua operação <span className="text-zinc-600">(e como contê-lo)</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* CARD 1: O FINANCEIRO */}
                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <DollarSign className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 text-white">O Custo do "Pouco"</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                R$ 50,00 descartados hoje parecem inofensivos. Mas multiplicados por 365 dias, tornam-se o lucro líquido de um carro popular que sua loja deixou de embolsar.
                            </p>
                        </div>

                        {/* CARD 2: A REPUTAÇÃO */}
                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <ShieldCheck className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 text-white">A Fragilidade da Confiança</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                A segurança alimentar é o pilar da sua marca. Não permita que um único descuido operacional seja o motivo para seu cliente testar o concorrente.
                            </p>
                        </div>

                        {/* CARD 3: O PROCESSO */}
                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <Database className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 text-white">A Evolução da Memória</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                O erro humano é natural, mas evitável. Planilhas e anotações dependem de memória; seu negócio precisa da certeza de dados automatizados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section ref={pricingRef} className="py-24 px-6 bg-black">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">
                        Quanto custa a <span className="text-industrial-yellow">tranquilidade</span> da sua operação?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">

                        {/* PLANO START */}
                        <div className="pricing-card bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl flex flex-col hover:border-white/30 transition-colors">
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Plano Start</h3>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Validação</span>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-black text-white">R$ 79,90</span>
                                <span className="text-zinc-500 font-bold">/mês</span>
                            </div>
                            <p className="text-xs text-industrial-yellow font-bold uppercase mb-8">
                                O custo de 2 produtos vencidos paga o sistema.
                            </p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CheckCircle2 size={16} className="text-white" /> 1 Usuário
                                </li>
                                <li className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CheckCircle2 size={16} className="text-white" /> Até 500 itens monitorados
                                </li>
                                <li className="flex items-center gap-3 text-zinc-400 text-sm opacity-50">
                                    <CheckCircle2 size={16} /> Sem Backup em Nuvem
                                </li>
                            </ul>

                            <button
                                onClick={() => navigate('/intro')}
                                className="w-full py-4 bg-zinc-800 text-white font-bold uppercase rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-white"
                            >
                                Começar Agora
                            </button>
                        </div>

                        {/* PLANO PRO (HERO) */}
                        <div className="pricing-card bg-zinc-900 border-2 border-industrial-red p-8 rounded-xl flex flex-col relative scale-105 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                            <div className="absolute top-0 right-0 bg-industrial-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                                Mais Escolhido
                            </div>

                            <h3 className="text-2xl font-black uppercase text-white mb-2 flex items-center gap-2">
                                Plano Pro <Zap size={18} className="text-industrial-yellow fill-industrial-yellow" />
                            </h3>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Escala</span>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black text-white">R$ 179,90</span>
                                <span className="text-zinc-500 font-bold">/mês</span>
                            </div>
                            <p className="text-xs text-industrial-yellow font-bold uppercase mb-8">
                                Blindagem completa contra falhas.
                            </p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-white font-bold text-sm">
                                    <CheckCircle2 size={16} className="text-industrial-red" /> Itens Ilimitados
                                </li>
                                <li className="flex items-center gap-3 text-white font-bold text-sm">
                                    <CheckCircle2 size={16} className="text-industrial-red" /> 5 Usuários
                                </li>
                                <li className="flex items-center gap-3 text-white font-bold text-sm">
                                    <CheckCircle2 size={16} className="text-industrial-red" /> Funciona Offline (Toalheiro)
                                </li>
                                <li className="flex items-center gap-3 text-white font-bold text-sm">
                                    <CheckCircle2 size={16} className="text-industrial-red" /> Gestor Dedicado
                                </li>
                            </ul>

                            <button
                                onClick={() => navigate('/intro')}
                                className="w-full py-5 bg-industrial-red text-white text-lg font-black uppercase rounded-lg hover:bg-red-600 transition-all shadow-lg btn-glow"
                            >
                                Quero o Pro
                            </button>
                        </div>

                        {/* PLANO SOVEREIGN */}
                        <div className="pricing-card bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl flex flex-col hover:border-white/30 transition-colors">
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Sovereign</h3>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Redes & Franquias</span>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-black text-zinc-300">Sob Consulta</span>
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase mb-8">
                                Soberania de dados total.
                            </p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CheckCircle2 size={16} className="text-white" /> Múltiplas Lojas (Filiais)
                                </li>
                                <li className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CheckCircle2 size={16} className="text-white" /> Servidor Dedicado
                                </li>
                                <li className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CheckCircle2 size={16} className="text-white" /> Auditoria de Logs
                                </li>
                            </ul>

                            <button
                                onClick={() => window.location.href = "mailto:comercial@zeroperda.com.br"}
                                className="w-full py-4 bg-transparent text-white font-bold uppercase rounded-lg hover:bg-white/10 transition-all border border-zinc-600 hover:border-white"
                            >
                                Falar com Consultor
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 px-6 text-center border-t border-zinc-900 bg-industrial-red/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter">
                        O custo da omissão<br />
                        é muito alto.
                    </h2>
                    <button
                        onClick={() => navigate('/intro')}
                        className="w-full md:w-auto px-12 py-6 bg-white text-black text-xl font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 hover:scale-105 transition-all shadow-xl"
                    >
                        Parar de Perder Dinheiro
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-4 text-zinc-500 text-sm font-bold uppercase">
                        <span className="flex items-center gap-2"><Lock size={14} /> Compra Segura</span>
                        <span className="flex items-center gap-2"><ShieldCheck size={14} /> Garantia de 7 Dias</span>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
