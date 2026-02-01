import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/ui/Header";
import { Scale, AlertTriangle, CreditCard, Ban } from "lucide-react";

export function TermsOfService() {
    return (
        <AppShell>
            <Header criticalCount={0} totalItems={0} />

            <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Termos de Uso <span className="text-industrial-yellow">& Serviço</span>
                    </h1>
                    <p className="text-zinc-400 leading-relaxed">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg space-y-6">
                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Scale size={24} />
                            <h2 className="text-xl font-bold uppercase">1. Aceite dos Termos</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Ao criar uma conta na plataforma Zero Perda, você concorda expressamente com estes termos.
                            O serviço é fornecido "no estado em que se encontra" (as-is), focado na otimização de gestão de estoque.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <AlertTriangle size={24} />
                            <h2 className="text-xl font-bold uppercase">2. Isenção de Responsabilidade</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            O Zero Perda é uma ferramenta de auxílio à gestão.
                            <strong className="text-white block mt-2">NÃO NOS RESPONSABILIZAMOS POR:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li>Prejuízos financeiros decorrentes de mau uso da ferramenta.</li>
                            <li>Perda de dados causada por falhas de conexão ou hardware do usuário.</li>
                            <li>Multas ou sanções sanitárias aplicadas ao estabelecimento (a responsabilidade final sobre a validade dos produtos é 100% do lojista).</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <CreditCard size={24} />
                            <h2 className="text-xl font-bold uppercase">3. Planos e Pagamentos</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Os pagamentos são processados via Kiwify/Asaas. O cancelamento pode ser solicitado a qualquer momento,
                            respeitando o período de vigência já pago. Não realizamos reembolsos parciais de planos anuais
                            após o prazo de garantia legal de 7 dias.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Ban size={24} />
                            <h2 className="text-xl font-bold uppercase">4. Uso Aceitável</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            É estritamente proibido usar a plataforma para gerenciar produtos ilegais, ilícitos ou de
                            procedência duvidosa. Reservamo-nos o direito de suspender contas que violem esta diretriz
                            sem aviso prévio.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-zinc-800">
                        <p className="text-zinc-500 text-sm text-center">
                            Zero Perda Soluções Digitais LTDA
                        </p>
                    </section>
                </div>
            </main>
        </AppShell>
    );
}
