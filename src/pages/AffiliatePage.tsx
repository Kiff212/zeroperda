import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/ui/Header";
import { LandingFooter } from "../components/landing/LandingFooter";
import { TrendingUp, Users, DollarSign, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { PRICING } from "../config/pricing";

export function AffiliatePage() {
    const [simulatedSales, setSimulatedSales] = useState(10);
    const COMMISSION_RATE = 0.30; // 30% commission assumption
    const TICKET_PRICE = PRICING.pro.monthly; // Reference: Pro Plan

    // Monthly Recurring Revenue Simulation
    const monthlyIncome = (simulatedSales * TICKET_PRICE * COMMISSION_RATE).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const annualIncome = (simulatedSales * TICKET_PRICE * COMMISSION_RATE * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
            {/* Simple Header override for this page usually, but preserving AppShell structure if logged in, 
                 or a public header if not. Using AppShell with empty criticals for consistency 
                 or maybe just a cleaner Layout. Let's use a Custom Public Header wrapper or just AppShell 
                 to keep it simple for now, but this feels like a Landing Page essentially. */}

            <AppShell>
                <Header criticalCount={0} totalItems={0} />

                <main className="pb-24">

                    {/* HERO SECTION */}
                    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black -z-10"></div>

                        <div className="max-w-4xl mx-auto text-center">
                            <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest mb-6 border border-green-500/20">
                                Programa de Parceria Oficial
                            </span>

                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
                                Sua indicação vale <br />
                                <span className="text-green-500">Renda Recorrente.</span>
                            </h1>

                            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
                                O Zero Perda é um sistema obrigatório para qualquer mercado.
                                Ganhe comissões vitalícias indicando a solução que salva o lucro dos seus clientes.
                            </p>

                            <button
                                onClick={() => window.open('https://dashboard.kiwify.com/join/affiliate/OCrRrfoK', '_blank')}
                                className="bg-green-500 text-black text-xl font-black uppercase px-12 py-6 rounded-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] flex items-center justify-center gap-3 mx-auto group"
                            >
                                Quero Ser Parceiro
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </button>

                            <p className="mt-6 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                Plataforma Kiwify • Pagamento Automático • Aprovação Imediata
                            </p>
                        </div>
                    </section>

                    {/* EARNINGS SIMULATOR */}
                    <section className="py-24 bg-zinc-950 border-y border-zinc-900">
                        <div className="max-w-5xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-black uppercase mb-4">Simulador de Ganhos</h2>
                                <p className="text-zinc-500">Arraste para ver o potencial da sua carteira de clientes.</p>
                            </div>

                            <div className="bg-black border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                                <div className="mb-12">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-zinc-400 font-bold uppercase text-sm">Vendas Ativas</label>
                                        <span className="text-4xl font-black text-white">{simulatedSales}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="500"
                                        value={simulatedSales}
                                        onChange={(e) => setSimulatedSales(parseInt(e.target.value))}
                                        className="w-full h-4 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                                    <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                        <div className="text-green-500 font-bold uppercase text-xs mb-2 tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                            <TrendingUp size={16} /> Comissão Mensal
                                        </div>
                                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                            {monthlyIncome}
                                        </div>
                                        <p className="text-zinc-600 text-xs mt-2 uppercase font-bold">Na sua conta todo mês</p>
                                    </div>

                                    <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <div className="text-green-400 font-bold uppercase text-xs mb-2 tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                            <Wallet size={16} /> Projeção Anual
                                        </div>
                                        <div className="text-4xl md:text-5xl font-black text-green-500 tracking-tight">
                                            {annualIncome}
                                        </div>
                                        <p className="text-green-500/50 text-xs mt-2 uppercase font-bold">Renda passiva acumulada</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WHY SELL ZEROPERDA */}
                    <section className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-black uppercase text-center mb-16 tracking-tight">
                                Por que indicar o <span className="text-industrial-yellow">Zero Perda</span>?
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
                                    <ShieldCheck className="text-industrial-yellow mb-6" size={40} />
                                    <h3 className="text-xl font-bold uppercase mb-3">Produto Obrigatório</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Diferente de cursos ou "extras", o controle de validade é uma necessidade para evitar prejuízos reais. Vender remédio para dor é mais fácil que vender vitamina.
                                    </p>
                                </div>
                                <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
                                    <Users className="text-industrial-yellow mb-6" size={40} />
                                    <h3 className="text-xl font-bold uppercase mb-3">Retenção Absurda</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Uma vez que o supermercado cadastra o estoque, ele dificilmente sai. O LTV (Lifetime Value) é altíssimo, garantindo sua comissão por anos.
                                    </p>
                                </div>
                                <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
                                    <DollarSign className="text-industrial-yellow mb-6" size={40} />
                                    <h3 className="text-xl font-bold uppercase mb-3">Comissão Agressiva</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Pagamos acima da média do mercado de SaaS porque confiamos no nosso produto. Você ganha na recorrência, não apenas na primeira venda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STEPS */}
                    <section className="py-24 px-6 bg-zinc-900 border-y border-zinc-800">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-black uppercase text-center mb-16">Como Começar</h2>

                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-xl shrink-0">1</div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold uppercase text-white mb-2">Faça seu Cadastro na Kiwify</h3>
                                        <p className="text-zinc-400 text-sm">Nossa afiliação é gerida pela maior plataforma de infoprodutos e SaaS do Brasil.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-xl shrink-0">2</div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold uppercase text-white mb-2">Pegue seu Link Exclusivo</h3>
                                        <p className="text-zinc-400 text-sm">Ao ser aprovado, você recebe um link único. Quem clica nele fica "marcado" com seu cookie.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-12 h-12 bg-zinc-800 text-zinc-500 rounded-full flex items-center justify-center font-black text-xl shrink-0">3</div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold uppercase text-white mb-2">Receba Automático</h3>
                                        <p className="text-zinc-400 text-sm">Sempre que seu indicado pagar a mensalidade, a Kiwify separa sua parte e deposita na sua conta.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 text-center">
                                <button
                                    onClick={() => window.open('https://dashboard.kiwify.com/join/affiliate/OCrRrfoK', '_blank')}
                                    className="bg-white text-black text-lg font-black uppercase px-12 py-5 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 mx-auto"
                                >
                                    Solicitar Afiliação Agora
                                </button>
                            </div>
                        </div>
                    </section>

                </main>
                <LandingFooter />
            </AppShell>
        </div>
    );
}
