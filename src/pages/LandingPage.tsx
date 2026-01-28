import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ArrowRight, AlertTriangle, TrendingDown, CheckCircle2, DollarSign } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const painRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

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

            // Features Animation
            gsap.from(".feature-row", {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 75%",
                },
                x: -30,
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
            {/* HERO SECTION */}
            <header ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center border-b border-zinc-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <div className="hero-text mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-industrial-red/30 bg-industrial-red/10 text-industrial-red text-xs font-bold uppercase tracking-widest animate-pulse">
                    <AlertTriangle size={14} />
                    Método Industrial Validado
                </div>

                <h1 className="hero-text text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                    Pare de Jogar<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-red to-red-600">Dinheiro no Lixo</span>
                </h1>

                <p className="hero-text text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-10">
                    O único sistema de controle de validade focado no <span className="text-white font-bold">Custo da Omissão</span>.
                    Monitoramento militar para supermercados e varejo.
                </p>

                <div className="hero-text flex flex-col md:flex-row gap-4 w-full max-w-md">
                    <button
                        onClick={() => navigate('/intro')}
                        className="flex-1 bg-industrial-red text-white p-5 rounded-lg border-2 border-industrial-red font-black uppercase tracking-wider hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 btn-glow"
                    >
                        Começar Agora
                        <ArrowRight size={20} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 bg-transparent text-zinc-400 p-5 rounded-lg border-2 border-zinc-800 font-bold uppercase tracking-wider hover:text-white hover:border-white transition-all"
                    >
                        Já sou Cliente
                    </button>
                </div>
            </header>

            {/* PAIN SECTION */}
            <section ref={painRef} className="py-24 px-6 border-b border-zinc-900 bg-zinc-950/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black uppercase text-center mb-16 tracking-tight">
                        Por que sua loja <span className="text-red-500">perde margem</span> todos os dias?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <DollarSign className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3">Prejuízo Silencioso</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Pequenas perdas de R$ 50,00 por dia somam mais de <span className="text-white font-bold">R$ 18.000,00</span> ao final do ano sem você perceber.
                            </p>
                        </div>

                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <AlertTriangle className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3">Risco Sanitário</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Um único produto vencido na prateleira pode gerar multas milionárias e destruir a reputação da sua marca.
                            </p>
                        </div>

                        <div className="pain-card bg-black p-8 rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/10 transition-colors">
                                <TrendingDown className="text-zinc-500 group-hover:text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3">Gestão Amadora</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Planilhas e caderninhos falham. Você precisa de um sistema que te avise **antes** do problema acontecer.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION SECTION */}
            <section ref={featuresRef} className="py-24 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="inline-block px-3 py-1 bg-industrial-yellow text-black font-black uppercase text-xs tracking-widest rounded-full">
                            Tecnologia Especializada
                        </div>
                        <h2 className="text-4xl font-black uppercase leading-none">
                            Controle Total<br />
                            <span className="text-zinc-600">Na Palma da Mão</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            O ZeroPerda é um sistema prático, direto e focado em resultado. Simples de usar para sua equipe, poderoso para sua gestão. Estanque o sangramento do seu caixa hoje mesmo.
                        </p>

                        <div className="space-y-4">
                            <div className="feature-row flex items-center gap-4 p-4 border border-zinc-900 bg-zinc-950 rounded-lg">
                                <CheckCircle2 className="text-green-500" />
                                <span className="font-bold uppercase text-sm">Alertas Críticos de 7 Dias</span>
                            </div>
                            <div className="feature-row flex items-center gap-4 p-4 border border-zinc-900 bg-zinc-950 rounded-lg">
                                <CheckCircle2 className="text-green-500" />
                                <span className="font-bold uppercase text-sm">Dashboard Industrial</span>
                            </div>
                            <div className="feature-row flex items-center gap-4 p-4 border border-zinc-900 bg-zinc-950 rounded-lg">
                                <CheckCircle2 className="text-green-500" />
                                <span className="font-bold uppercase text-sm">Cadastro Ultra-Rápido</span>
                            </div>
                            <div className="feature-row flex items-center gap-4 p-4 border border-zinc-900 bg-zinc-950 rounded-lg border-l-4 border-l-industrial-yellow">
                                <CheckCircle2 className="text-industrial-yellow" />
                                <div>
                                    <span className="font-bold uppercase text-sm block">Compatível com seu ERP</span>
                                    <span className="text-xs text-zinc-500">Não interfere no seu caixa ou fiscal</span>
                                </div>
                            </div>
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
                    <p className="mt-6 text-zinc-500 text-sm font-medium">
                        Instalação Gratuita • Treinamento Incluso • Cancelamento a qualquer momento
                    </p>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
