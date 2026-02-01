import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/ui/Header";
import { Shield, Lock, Eye, Server, FileText } from "lucide-react";

export function PrivacyPolicy() {
    return (
        <AppShell>
            <Header criticalCount={0} totalItems={0} />

            <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Política de Privacidade <span className="text-industrial-yellow">& LGPD</span>
                    </h1>
                    <p className="text-zinc-400 leading-relaxed">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg space-y-6">
                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Shield size={24} />
                            <h2 className="text-xl font-bold uppercase">1. Compromisso com a Segurança</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            A segurança dos seus dados não é apenas uma obrigação legal, é o pilar da nossa operação.
                            Utilizamos criptografia de ponta a ponta e seguimos rigorosamente as diretrizes da
                            Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Seus dados são seus;
                            nós apenas os guardamos com a máxima segurança possível.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Eye size={24} />
                            <h2 className="text-xl font-bold uppercase">2. Coleta de Dados</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Coletamos apenas o essencial para o funcionamento da plataforma Zero Perda:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li>Dados de Cadastro: Nome, E-mail e Telefone (para autenticação).</li>
                            <li>Dados Operacionais: Inventário, validades e movimentações de estoque.</li>
                            <li>Logs de Acesso: IP e User-Agent para auditoria de segurança e prevenção de fraudes.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Server size={24} />
                            <h2 className="text-xl font-bold uppercase">3. Armazenamento e Compartilhamento</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Seus dados são armazenados em infraestrutura de nuvem segura (Supabase/AWS), com servidores
                            que atendem aos mais altos padrões de compliance internacional.
                            <strong className="text-white block mt-2">NÃO vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</strong>
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <Lock size={24} />
                            <h2 className="text-xl font-bold uppercase">4. Seus Direitos (LGPD)</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Conforme o Art. 18 da LGPD, você tem direito a:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            <li className="bg-black/40 p-3 rounded border border-zinc-800 text-zinc-400 text-sm">
                                <strong className="text-white block mb-1">Confirmação e Acesso</strong>
                                Saber se tratamos seus dados e ter acesso a eles.
                            </li>
                            <li className="bg-black/40 p-3 rounded border border-zinc-800 text-zinc-400 text-sm">
                                <strong className="text-white block mb-1">Correção</strong>
                                Solicitar a correção de dados incompletos ou desatualizados.
                            </li>
                            <li className="bg-black/40 p-3 rounded border border-zinc-800 text-zinc-400 text-sm">
                                <strong className="text-white block mb-1">Anonimização/Bloqueio</strong>
                                Para dados desnecessários ou excessivos.
                            </li>
                            <li className="bg-black/40 p-3 rounded border border-zinc-800 text-zinc-400 text-sm">
                                <strong className="text-white block mb-1">Eliminação</strong>
                                Solicitar a exclusão de dados tratados com seu consentimento.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3 text-industrial-yellow">
                            <FileText size={24} />
                            <h2 className="text-xl font-bold uppercase">5. Cookies</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Utilizamos apenas cookies essenciais para autenticação e segurança. Não utilizamos
                            cookies de rastreamento publicitário invasivo. Ao continuar usando a plataforma,
                            você concorda com este uso estritamente operacional.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-zinc-800">
                        <p className="text-zinc-500 text-sm text-center">
                            Dúvidas sobre seus dados? Entre em contato com nosso DPO (Encarregado de Dados) através do suporte.
                        </p>
                    </section>
                </div>
            </main>
        </AppShell>
    );
}
