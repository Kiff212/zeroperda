import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/nav/BottomNav';
import { ArrowLeft, Save, Loader2, AlertCircle, Calendar, Layers, Search, PlusCircle, FileText } from 'lucide-react';
import { batchService } from '../services/batchService';
import type { Categoria, Produto } from '../types/database.types';

import { useOrganization } from '../contexts/OrganizationContext';

export function AddBatch() {
    const navigate = useNavigate();
    const { currentOrg } = useOrganization();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [section, setSection] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');

    const [existingSections, setExistingSections] = useState<Categoria[]>([]);
    const [suggestedProducts, setSuggestedProducts] = useState<Produto[]>([]);
    const [isNewProductMode, setIsNewProductMode] = useState(false);

    useEffect(() => {
        if (currentOrg) {
            batchService.getSections(currentOrg.id).then(setExistingSections).catch(console.error);
        }
    }, [currentOrg]);

    // Generic Product Search Effect
    useEffect(() => {
        // If we have suggestions from "Section Change", keep them.
        // But if user types something custom, search GLOBALLY (to find IMPORTADOS items).

        const delayDebounceFn = setTimeout(async () => {
            if (name.length > 2 && currentOrg) {
                // If the name typed matches one of the suggestedProducts (from current section), do nothing extra.
                const alreadySuggested = suggestedProducts.some(p => p.nome.toUpperCase() === name.toUpperCase());

                if (!alreadySuggested) {
                    // Search Global
                    const globalMatches = await batchService.searchAllProducts(currentOrg.id, name);
                    if (globalMatches.length > 0) {
                        setSuggestedProducts(globalMatches);
                        setIsNewProductMode(false); // Enable dropdown selection mode if we found something
                    }
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [name, currentOrg]);

    // Update suggestions when section changes (Initial Load for Section)
    useEffect(() => {
        if (!section) {
            setSuggestedProducts([]);
            setIsNewProductMode(true);
            return;
        }

        const secObj = existingSections.find(s => s.nome === section);
        if (secObj) {
            batchService.getProductsBySection(secObj.id)
                .then(products => {
                    setSuggestedProducts(products);

                    // Logic: If user selected a name (potentially from IMPORTADOS), we don't want to clear it.
                    if (name.length < 2) {
                        // Empty name? Show dropdown if products exist, else text input
                        setIsNewProductMode(products.length === 0);
                        setName('');
                    } else {
                        // User has a name (e.g. "SPATTEN")
                        // He changed section to "GELADEIRA"
                        // If "SPATTEN" is NOT in "GELADEIRA", switch to Text Mode to preserve it.
                        // If it IS in "GELADEIRA", switch to Dropdown Mode.
                        const existsInNewSection = products.some(p => p.nome.toUpperCase() === name.toUpperCase());
                        setIsNewProductMode(!existsInNewSection);
                    }
                })
                .catch(console.error);
        } else {
            // New section (typed manually)
            setSuggestedProducts([]);
            // Always text mode for new/unknown section
            setIsNewProductMode(true);
        }
    }, [section, existingSections]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentOrg) {
            setError("Organização não carregada");
            return;
        }
        if (!section || !name || !quantity || !date) {
            setError("Preencha todos os campos");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await batchService.createBatch(currentOrg.id, section, name, parseInt(quantity), date);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao salvar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <header className="p-4 border-b-2 border-industrial bg-industrial-bg sticky top-0 z-40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-industrial text-white p-2 border-2 border-black shadow-industrial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <ArrowLeft size={20} strokeWidth={3} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                        Novo Item
                    </h1>
                </div>

                <button
                    onClick={() => navigate('/import-pdf')}
                    className="text-xs bg-industrial-yellow text-black border border-black px-3 py-2 font-black uppercase tracking-wide hover:bg-white hover:border-white shadow-industrial active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                >
                    <FileText size={16} />
                    Importar PDF
                </button>
            </header>

            <main className="p-6 pb-32">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="bg-red-900/40 border-2 border-industrial-red text-industrial-red p-3 flex items-center gap-2 text-xs font-bold uppercase animate-bounce">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* SECTION INPUT */}
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase ml-1 block text-zinc-400 flex items-center gap-1">
                            <Layers size={12} /> Sessão / Corredor
                        </label>

                        {/* Visual Section Selector - Compact version */}
                        {existingSections.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x">
                                {existingSections.map(s => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setSection(s.nome)}
                                        className={`
                                flex-shrink-0 snap-start
                                min-w-[100px] p-3 border-2
                                flex flex-col items-start gap-1
                                transition-all
                                ${section === s.nome
                                                ? 'bg-industrial-yellow border-white text-black shadow-[2px_2px_0px_white]'
                                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                            }
                            `}
                                    >
                                        <span className={`text-[9px] font-bold uppercase ${section === s.nome ? 'opacity-80' : 'opacity-50'}`}>Sessão</span>
                                        <span className="font-extrabold text-xs uppercase leading-tight text-left">
                                            {s.nome}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <input
                            type="text"
                            list="sections-list"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="OU DIGITE UMA NOVA..."
                            className="w-full bg-industrial-surface border-2 border-industrial p-4 font-bold text-white text-lg outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all placeholder:text-zinc-600 uppercase"
                            autoFocus
                        />
                        <datalist id="sections-list">
                            {existingSections.map(s => (
                                <option key={s.id} value={s.nome} />
                            ))}
                        </datalist>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase ml-1 block text-zinc-400">Nome do Produto</label>

                            {!isNewProductMode && suggestedProducts.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNewProductMode(true);
                                        setName('');
                                        // Auto-focus logic might be needed here via ref, but let's keep it simple first
                                    }}
                                    className="text-[10px] font-bold text-industrial-yellow hover:underline"
                                >
                                    NOVO PRODUTO?
                                </button>
                            )}

                            {isNewProductMode && suggestedProducts.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNewProductMode(false);
                                        setName('');
                                    }}
                                    className="text-[10px] font-bold text-industrial-yellow hover:underline"
                                >
                                    VOLTAR P/ LISTA
                                </button>
                            )}
                        </div>

                        {!isNewProductMode && suggestedProducts.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={name}
                                    onChange={(e) => {
                                        if (e.target.value === '___NEW___') {
                                            setIsNewProductMode(true);
                                            setName('');
                                        } else {
                                            setName(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-industrial-surface border-2 border-industrial p-4 font-bold text-white text-lg outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all uppercase appearance-none"
                                >
                                    <option value="" disabled>SELECIONE O PRODUTO...</option>
                                    {suggestedProducts.map(p => (
                                        <option key={p.id} value={p.nome}>
                                            {p.nome} {p.categoria_id && p.categoria_id !== existingSections.find(s => s.nome === section)?.id ? '(MIGRAR)' : ''}
                                        </option>
                                    ))}
                                    <option value="___NEW___" className="font-bold text-industrial-yellow">➕ NOVO PRODUTO...</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <Search size={24} />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: LEITE INTEGRAL"
                                    className="w-full bg-industrial-surface border-2 border-industrial p-4 font-bold text-white text-lg outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all placeholder:text-zinc-600 uppercase"
                                    autoFocus={isNewProductMode && suggestedProducts.length > 0}
                                />
                                {isNewProductMode && suggestedProducts.length > 0 && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-industrial-yellow animate-pulse">
                                        <PlusCircle size={24} strokeWidth={2.5} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase ml-1 block text-zinc-400">Validade</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-industrial-surface border-2 border-industrial p-4 py-6 font-bold text-white text-lg outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all uppercase [&::-webkit-calendar-picker-indicator]:invert"
                                />
                                <Calendar size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase ml-1 block text-zinc-400">Quantidade</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0"
                                className="w-full bg-industrial-surface border-2 border-industrial p-4 py-6 font-bold text-white text-lg outline-none focus:border-white focus:shadow-[0px_0px_10px_rgba(255,255,255,0.2)] transition-all placeholder:text-zinc-600 text-center"
                            />

                            {/* Quick Quantity Controls */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseInt(quantity || '0');
                                            setQuantity(Math.max(0, current - 6).toString());
                                        }}
                                        className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-300 font-bold p-2 text-xs uppercase hover:bg-zinc-700 active:bg-zinc-900"
                                    >
                                        -6
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseInt(quantity || '0');
                                            setQuantity((current + 6).toString());
                                        }}
                                        className="flex-1 bg-zinc-800 border border-zinc-600 text-white font-bold p-2 text-xs uppercase hover:bg-zinc-700 active:bg-zinc-900"
                                    >
                                        +6
                                    </button>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseInt(quantity || '0');
                                            setQuantity(Math.max(0, current - 12).toString());
                                        }}
                                        className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-300 font-bold p-2 text-xs uppercase hover:bg-zinc-700 active:bg-zinc-900"
                                    >
                                        -12
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseInt(quantity || '0');
                                            setQuantity((current + 12).toString());
                                        }}
                                        className="flex-1 bg-zinc-800 border border-zinc-600 text-white font-bold p-2 text-xs uppercase hover:bg-zinc-700 active:bg-zinc-900"
                                    >
                                        +12
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-industrial-yellow text-black border-2 border-black p-4 font-black uppercase tracking-wider shadow-industrial flex items-center justify-center gap-2 hover:bg-white hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={24} strokeWidth={2.5} />
                                    Salvar Registro
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <BottomNav />
        </AppShell>
    );
}
