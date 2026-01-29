import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/nav/BottomNav';
import { ArrowLeft, FileSpreadsheet, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { batchService } from '../services/batchService';

import { useOrganization } from '../contexts/OrganizationContext';

export function ImportPage() {
    const navigate = useNavigate();
    const { currentOrg } = useOrganization();

    const [rawText, setRawText] = useState('');
    const [previewData, setPreviewData] = useState<{ section: string, product: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Parse Tab-Separated Values (Excel copy/paste)
    const handleParse = () => {
        try {
            if (!rawText.trim()) return;

            const lines = rawText.split('\n').filter(l => l.trim().length > 0);
            const parsed = lines.map((line, index) => {
                // Split by tab (Excel standard for copy)
                const columns = line.split('\t');

                // Expected: SECTION | PRODUCT
                if (columns.length < 2) {
                    throw new Error(`Linha ${index + 1} inválida: "Use o formato: SESSÃO | PRODUTO"`);
                }

                const [section, product] = columns;

                if (!section.trim() || !product.trim()) {
                    throw new Error(`Linha ${index + 1}: Sessão ou Produto vazios.`);
                }

                return {
                    section: section.trim().toUpperCase(),
                    product: product.trim().toUpperCase()
                };
            });

            setPreviewData(parsed);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro desconhecido ao analisar");
            }
            setPreviewData([]);
        }
    };

    const handleImport = async () => {
        if (!currentOrg) {
            setError("Erro: Nenhuma organização detectada.");
            return;
        }
        if (previewData.length === 0) return;
        setLoading(true);
        setError(null);

        try {
            await batchService.importProductsManual(currentOrg.id, previewData);
            setSuccess(true);
            setRawText('');
            setPreviewData([]);
        } catch (err: unknown) {
            console.error(err);
            setError("Erro ao importar. Verifique o console ou tente menos itens.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <header className="p-4 border-b-2 border-industrial bg-industrial-bg flex items-center gap-4">
                <button
                    onClick={() => navigate('/add')}
                    className="bg-industrial text-white p-2 border-2 border-black shadow-industrial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                    <FileSpreadsheet /> Importação em Massa
                </h1>
            </header>

            <main className="p-6 pb-24 space-y-6">

                {success ? (
                    <div className="bg-green-900/40 border-2 border-green-500 p-8 flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase">Importado!</h2>
                        <p className="text-green-200">
                            Os produtos foram cadastrados com sucesso.
                            <br />
                            Eles aparecerão automaticamente no <b>AUTOCOMPLETE</b> quando você for cadastrar lotes.
                        </p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="bg-zinc-800 text-white px-6 py-3 font-bold uppercase hover:bg-zinc-700"
                        >
                            Importar Mais
                        </button>
                    </div>
                ) : (
                    <>
                        {/* INSTRUCTIONS */}
                        <div className="bg-industrial-surface p-4 border-l-4 border-industrial-yellow text-sm text-zinc-300 space-y-2">
                            <p className="font-bold text-white uppercase">Como usar:</p>
                            <ol className="list-decimal ml-4 space-y-1">
                                <li>Abra seu Excel / Google Sheets</li>
                                <li>Selecione as colunas: <b className="text-white">SESSÃO | PRODUTO</b></li>
                                <li>Copie (Ctrl+C)</li>
                                <li>Cole abaixo (Ctrl+V)</li>
                            </ol>
                        </div>

                        {/* INPUT AREA */}
                        <div className="space-y-2">
                            <textarea
                                value={rawText}
                                onChange={(e) => {
                                    setRawText(e.target.value);
                                    if (previewData.length > 0) setPreviewData([]); // Reset preview on edit
                                    if (error) setError(null);
                                }}
                                placeholder={`Exemplo de colunas no Excel:\n\nLATICINIOS\tLEITE\nPADARIA\tPAO`}
                                className="w-full h-48 bg-zinc-900 border-2 border-zinc-700 p-4 font-mono text-xs text-zinc-300 focus:border-industrial-yellow outline-none resize-none placeholder:text-zinc-700"
                            />
                            <button
                                onClick={handleParse}
                                disabled={!rawText}
                                className="bg-zinc-800 text-white w-full py-3 font-bold uppercase border-2 border-zinc-700 hover:border-white disabled:opacity-50"
                            >
                                1. Analisar Dados
                            </button>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-red-900/40 border-2 border-industrial-red text-industrial-red p-3 flex items-center gap-2 text-xs font-bold uppercase animate-bounce">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* PREVIEW */}
                        {previewData.length > 0 && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-white uppercase text-lg">
                                        {previewData.length} Produtos Encontrados
                                    </h3>
                                </div>

                                <div className="border-2 border-zinc-800 rounded overflow-hidden max-h-60 overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-zinc-800 text-zinc-400 font-bold uppercase sticky top-0">
                                            <tr>
                                                <th className="p-2">Sessão</th>
                                                <th className="p-2">Produto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {previewData.slice(0, 100).map((item, i) => (
                                                <tr key={i} className="text-zinc-300 hover:bg-zinc-800/50">
                                                    <td className="p-2">{item.section}</td>
                                                    <td className="p-2 font-bold text-white">{item.product}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {previewData.length > 100 && (
                                        <div className="p-2 text-center text-zinc-500 text-xs italic bg-zinc-900">
                                            ... e mais {previewData.length - 100} itens
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleImport}
                                    disabled={loading}
                                    className="w-full bg-industrial-yellow text-black border-2 border-black p-4 font-black uppercase tracking-wider shadow-industrial flex items-center justify-center gap-2 hover:bg-white hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                                >
                                    {loading ? "Processando..." : (
                                        <>
                                            <Play size={20} fill="black" />
                                            2. Confirmar Cadastro
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

            </main>

            <BottomNav />
        </AppShell>
    );
}
