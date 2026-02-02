import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ArrowRight, AlertTriangle, CheckCircle2, DollarSign, ShieldCheck, Database, Zap, Lock } from 'lucide-react';
import { getPrice } from '../config/pricing';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const painRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);

    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

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

            {/* HERO SECTION - NANO BANANA STYLE */}
            <header ref={heroRef} className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between p-6 md:p-12 border-b border-zinc-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                {/* TEXT CONTENT (Left) */}
                <div className="relative z-10 max-w-2xl text-center md:text-left pt-12 md:pt-0">
                    <h1 className="hero-text text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                        Sua margem de lucro<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-red to-red-600">não deveria ter data de validade.</span>
                    </h1>

                    <p className="hero-text text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
                        O sistema de inteligência que transforma perdas invisíveis em caixa recuperado. Deixe de reagir aos vencimentos e comece a antecipar o lucro.
                    </p>

                    <div className="hero-text flex flex-col w-full max-w-md mx-auto md:mx-0">
                        <div className="flex gap-4 mb-3">
                            <button
                                onClick={() => navigate('/intro')}
                                className="flex-1 bg-industrial-red text-white p-5 rounded-lg border-2 border-industrial-red font-black uppercase tracking-wider hover:bg-red-500 hover:border-red-400 active:scale-95 transition-all shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2 btn-glow group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
                                Estancar perdas agora
                                <ArrowRight size={20} strokeWidth={3} className="text-white group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-transparent text-zinc-400 p-5 rounded-lg border-2 border-zinc-800 font-bold uppercase tracking-wider hover:text-white hover:border-white transition-all"
                            >
                                Já tenho acesso
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide text-center md:text-left pl-1">
                            🚀 Instalação em 2 minutos. <span className="text-zinc-600">Sem cartão de crédito.</span>
                        </p>
                    </div>
                </div>

                {/* PRODUCT VISUAL (Right / Mockup) */}
                <div className="relative z-10 w-full max-w-2xl mt-16 md:mt-0 perspective-1000 hidden md:block">
                    {/* Floating Glow Behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-industrial-red/20 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>

                    {/* Glassmorphism Dashboard Container */}
                    <div className="
                        relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden
                        transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out
                    ">
                        {/* Header Bar */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                        </div>

                        {/* Fake Dashboard Content */}
                        <div className="p-6 grid grid-cols-3 gap-4">
                            {/* Left Col */}
                            <div className="col-span-1 space-y-3">
                                <div className="h-20 bg-white/5 rounded-lg animate-pulse"></div>
                                <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
                                <div className="h-8 bg-white/5 rounded-lg w-1/2"></div>
                            </div>
                            {/* Right Col */}
                            <div className="col-span-2 space-y-4">
                                <div className="h-32 bg-gradient-to-br from-industrial-red/20 to-transparent rounded-lg border border-industrial-red/20 relative overflow-hidden">
                                    {/* Graph Line */}
                                    <svg className="absolute bottom-0 left-0 w-full h-[60%] text-industrial-red" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <path d="M0 40 L10 35 L20 38 L30 25 L40 30 L50 20 L60 25 L70 15 L80 18 L90 10 L100 15 V40 H0 Z" fill="currentColor" opacity="0.5" />
                                        <path d="M0 40 L10 35 L20 38 L30 25 L40 30 L50 20 L60 25 L70 15 L80 18 L90 10 L100 15" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 h-12 bg-white/5 rounded-lg"></div>
                                    <div className="flex-1 h-12 bg-white/5 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* FLOATING NOTIFICATION (The "Product Hero" Detail) */}
                        <div className="absolute top-1/2 -right-8 md:-right-12 translate-y-[-20%] bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-2xl max-w-[280px] animate-bounce-slow z-30">
                            <div className="flex items-start gap-4">
                                <div className="bg-industrial-red/20 p-2 rounded-lg text-industrial-red">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">Iogurte Batavo Morango</h4>
                                    <p className="text-zinc-400 text-xs mb-2">Vence em <span className="text-industrial-red font-bold">3 dias</span></p>
                                    <button className="text-[10px] bg-industrial-red text-white py-1 px-2 rounded uppercase font-bold tracking-wider w-full hover:bg-red-600 transition-colors">
                                        Aplicar 30% OFF
                                    </button>
                                </div>
                            </div>
                            {/* Badge */}
                            <div className="absolute -top-2 -left-2 bg-green-500 text-black text-[9px] font-black px-1.5 rounded-full uppercase">
                                Ação Necessária
                            </div>
                        </div>

                    </div>
                </div>

                {/* TICKER (Footer of Hero) */}
                <div className="absolute bottom-0 left-0 w-full border-t border-zinc-900 bg-black/50 backdrop-blur-sm overflow-hidden py-3">
                    <div className="flex whitespace-nowrap animate-marquee">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-12 px-6">
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🥛</span> Leite Integral: <span className="text-green-500">SALVO</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🥩</span> Picanha: <span className="text-yellow-500 animate-pulse">ATENÇÃO</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🍞</span> Pão de Forma: <span className="text-industrial-red animate-pulse">CRÍTICO</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🥫</span> Molho Tomate: <span className="text-blue-500">MONITORADO</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🥬</span> Alface: <span className="text-green-500">SALVO</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 uppercase">
                                    <span className="text-lg">🧀</span> Queijo Prato: <span className="text-yellow-500">ATENÇÃO</span>
                                </span>
                            </div>
                        ))}
                    </div>
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
                    <h2 className="text-4xl font-black uppercase text-center mb-8 tracking-tighter">
                        Quanto custa a <span className="text-industrial-yellow">tranquilidade</span> da sua operação?
                    </h2>

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

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">

                        {/* PLANO START */}
                        <div className="pricing-card bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl flex flex-col hover:border-white/30 transition-colors">
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Plano Start</h3>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Validação</span>

                            <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                                <span className="text-4xl font-black text-white">R$ {getPrice('start', billingCycle)}</span>
                                <span className="text-zinc-500 font-bold">/mês</span>
                                {billingCycle === 'annual' && <span className="text-xs text-zinc-500 font-medium ml-1">(cobrado anualmente)</span>}
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
                                onClick={() => {
                                    const url = billingCycle === 'monthly'
                                        ? 'https://pay.kiwify.com.br/aIpNoCI'
                                        : 'https://pay.kiwify.com.br/ORh6A5v';
                                    window.location.href = url;
                                }}
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

                            <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                                <span className="text-5xl font-black text-white">R$ {getPrice('pro', billingCycle)}</span>
                                <span className="text-zinc-500 font-bold">/mês</span>
                                {billingCycle === 'annual' && <span className="text-xs text-zinc-400 font-medium ml-1">(cobrado anualmente)</span>}
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
                                onClick={() => {
                                    const url = billingCycle === 'monthly'
                                        ? 'https://pay.kiwify.com.br/h9JaixL'
                                        : 'https://pay.kiwify.com.br/6DQ3srd';
                                    window.location.href = url;
                                }}
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
                                    <CheckCircle2 size={16} className="text-white" /> <span className="font-bold text-white">Tudo do Plano Pro</span>
                                </li>
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
