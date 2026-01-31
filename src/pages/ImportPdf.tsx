
import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/nav/BottomNav';
import { useOrganization } from '../contexts/OrganizationContext';
import { batchService } from '../services/batchService';
import { parseInvoicePDF, type ParsedItem } from '../utils/pdfParser';
import { ArrowLeft, Upload, Loader2, AlertCircle, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ImportPdf() {
    const navigate = useNavigate();
    const { currentOrg } = useOrganization();

    // State
    // State
    const [file, setFile] = useState<File | null>(null);
    const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

    // UI State
    const [isParsing, setIsParsing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successCount, setSuccessCount] = useState<number | null>(null);

    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);


    /*
    useEffect(() => {
        if (currentOrg) {
            batchService.getSections(currentOrg.id).then(setCategories).catch(console.error);
        }
    }, [currentOrg]);
    */

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            handleParse(f);
        }
    };

    const handleParse = async (f: File) => {
        setIsParsing(true);
        setError(null);
        setParsedItems([]);

        try {
            const items = await parseInvoicePDF(f);
            if (items.length === 0) {
                setError("Nenhum item detectado. Tente um PDF diferente ou mais legível.");
            }
            setParsedItems(items);
        } catch (err) {
            console.error(err);
            setError("Erro ao ler o arquivo. Certifique-se que é um PDF válido.");
        } finally {
            setIsParsing(false);
        }
    };

    const toggleSelection = (index: number) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            setSelectedIndices([...selectedIndices, index]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIndices.length === parsedItems.length) {
            setSelectedIndices([]);
        } else {
            setSelectedIndices(parsedItems.map((_, i) => i));
        }
    };


    const handleSave = async () => {
        if (!currentOrg) return;

        const validItems = parsedItems.filter((_, idx) => selectedIndices.includes(idx));
        if (validItems.length === 0) {
            setError("Selecione pelo menos um item para salvar.");
            return;
        }

        setIsSaving(true);
        setError(null);
        let saved = 0;

        try {
            // Sequential save (could be parallel but safer sequential for rate limits)
            for (const item of validItems) {
                // Product Only - No Batches created
                await batchService.createProductOnly(
                    currentOrg.id,
                    'IMPORTADOS', // Default Section per user request
                    item.name
                );
                saved++;
            }
            setSuccessCount(saved);
            // Remove saved items from list
            const remaining = parsedItems.filter(i => !i.suggestedCategory);
            setParsedItems(remaining);

        } catch (err) {
            console.error(err);
            setError("Erro ao salvar alguns itens. Verifique sua conexão.");
        } finally {
            setIsSaving(false);
        }
    };

    const removeItem = (index: number) => {
        const updated = [...parsedItems];
        updated.splice(index, 1);
        setParsedItems(updated);
        // Also update selection indices logic? Or just clear selection to avoid bugs
        setSelectedIndices([]);
    };

    // Render Success State
    if (successCount !== null) {
        return (
            <AppShell>
                <main className="h-screen flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-in zoom-in">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase mb-2">Sucesso!</h1>
                    <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                        {successCount} produtos foram cadastrados na sua base de dados.
                    </p>
                    <button
                        onClick={() => { setSuccessCount(null); navigate('/dashboard'); }}
                        className="w-full max-w-xs bg-industrial-yellow text-black font-black uppercase p-4"
                    >
                        Voltar ao Dashboard
                    </button>
                    <button
                        onClick={() => setSuccessCount(null)}
                        className="mt-4 text-zinc-500 font-bold uppercase text-xs hover:text-white"
                    >
                        Continuar Importando
                    </button>
                </main>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <header className="p-4 border-b-2 border-industrial bg-industrial-bg sticky top-0 z-40 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-industrial text-white p-2 border-2 border-black shadow-industrial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                    Importar NFe (PDF)
                </h1>
            </header>

            <main className="p-6 pb-32 max-w-4xl mx-auto">

                {/* File Upload Zone */}
                {!file && (
                    <div className="border-4 border-dashed border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-industrial-yellow/50 transition-colors bg-industrial-surface group cursor-pointer relative">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="p-4 bg-zinc-900 rounded-full mb-4 group-hover:scale-110 transition-transform text-zinc-500 group-hover:text-industrial-yellow">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase mb-1">Arraste ou Clique</h3>
                        <p className="text-zinc-500 text-sm">Selecione o PDF da Nota Fiscal</p>
                    </div>
                )}

                {/* Parsing Loader */}
                {isParsing && (
                    <div className="py-20 text-center">
                        <Loader2 size={40} className="animate-spin text-industrial-yellow mx-auto mb-4" />
                        <p className="font-mono text-zinc-400 animate-pulse">Lendo PDF...</p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-900/20 border border-red-500/50 p-4 flex items-center gap-3 text-red-200">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm uppercase">{error}</span>
                    </div>
                )}

                {/* Staging Area */}
                {parsedItems.length > 0 && !isParsing && (
                    <div className="space-y-6">

                        {/* Toolbar */}
                        <div className="sticky top-20 z-30 bg-zinc-900 border border-zinc-700 p-4 rounded-lg shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <span className="text-xs font-bold uppercase text-zinc-500 whitespace-nowrap">
                                    {selectedIndices.length} selecionados
                                </span>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || selectedIndices.length === 0}
                                className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded font-black uppercase hover:bg-green-500 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Salvar Itens Selecionados
                            </button>
                        </div>

                        <div className="bg-industrial-surface border border-zinc-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black text-zinc-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-3 w-10">
                                            <input type="checkbox" checked={selectedIndices.length === parsedItems.length} onChange={toggleSelectAll} className="accent-industrial-yellow" />
                                        </th>
                                        <th className="p-3">Produto (Cadastro)</th>
                                        <th className="p-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {parsedItems.map((item, idx) => (
                                        <tr key={idx} className={`group hover:bg-zinc-800/50 transition-colors ${selectedIndices.includes(idx) ? 'bg-industrial-yellow/5' : ''}`}>
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIndices.includes(idx)}
                                                    onChange={() => toggleSelection(idx)}
                                                    className="accent-industrial-yellow"
                                                />
                                            </td>
                                            <td className="p-3 font-mono text-white">
                                                <div className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]" title={item.name}>
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-zinc-600 truncate max-w-[200px]">{item.originalLine}</div>
                                            </td>

                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => removeItem(idx)}
                                                    className="text-zinc-600 hover:text-red-500 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            <BottomNav />
        </AppShell>
    );
}
