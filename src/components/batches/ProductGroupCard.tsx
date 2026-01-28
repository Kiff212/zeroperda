import { Package, Plus, Check, Calendar } from 'lucide-react';
import type { Batch } from '../../types/database.types';
import { batchService } from '../../services/batchService';
import { useState } from 'react';
import { QuantityInput } from '../ui/QuantityInput';

interface ProductGroupCardProps {
    productName: string;
    productId: string; // Needed for adding
    batches: Batch[]; // Assumed sorted by date ascending (FIFO)
    onBatchClick: (batch: Batch) => void;
    onAddBatch: (productId: string, qty: number, date: string) => Promise<void>;
}

export function ProductGroupCard({ productName, productId, batches, onBatchClick, onAddBatch }: ProductGroupCardProps) {
    const totalQuantity = batches.reduce((acc, b) => acc + b.quantity, 0);

    const [isAdding, setIsAdding] = useState(false);
    const [newQty, setNewQty] = useState(0);
    const [newDate, setNewDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (newQty <= 0 || !newDate) return;

        setLoading(true);
        try {
            await onAddBatch(productId, newQty, newDate);
            setIsAdding(false);
            setNewQty(0);
            setNewDate('');
        } catch (e: unknown) {
            console.error("Erro Supabase:", e);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = e as any;
            alert(`Erro: ${err.message || err.details || JSON.stringify(e, null, 2) || "Desconhecido"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-industrial-surface border-2 border-industrial shadow-industrial mb-3 overflow-hidden">
            {/* Header / Product Info */}
            <div className="p-3 bg-zinc-900/80 border-b-2 border-industrial flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-black/40 p-2 border border-industrial rounded">
                        <Package size={18} className="text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase text-white leading-tight">
                            {productName}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {batches.length} {batches.length === 1 ? 'Lote' : 'Lotes'}
                        </span>
                    </div>
                </div>
                <div className="text-right flex items-center gap-3">
                    <div>
                        <span className="font-mono font-bold text-base text-white block leading-none">
                            {totalQuantity}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase font-medium">Total Unid.</span>
                    </div>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-2 border-2 transition-all ${isAdding ? 'bg-industrial-yellow border-white text-black rotate-45' : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-white hover:border-white'}`}
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* QUICK ADD FORM */}
            {isAdding && (
                <div className="bg-zinc-900/90 border-b-2 border-industrial p-3 animate-in slide-in-from-top-2">
                    <div className="flex gap-2 items-start">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 flex items-center gap-1">
                                <Calendar size={10} /> Validade
                            </label>
                            <input
                                type="date"
                                className="w-full bg-black/50 border border-zinc-700 text-white p-2 font-mono text-sm uppercase outline-none focus:border-industrial-yellow"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 flex items-center gap-1">
                                Qtd.
                            </label>
                            <QuantityInput value={newQty} onChange={setNewQty} autoFocus />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="flex-1 py-1 border border-zinc-700 text-zinc-400 font-bold uppercase text-xs hover:bg-zinc-800"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || newQty <= 0 || !newDate}
                            className="flex-1 py-1 bg-industrial text-white border border-industrial-light font-bold uppercase text-xs hover:bg-industrial-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? '...' : <><Check size={14} /> Confirmar</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Batches List (FIFO) */}
            <div className="divide-y divide-zinc-800">
                {batches.map(batch => (
                    <button
                        key={batch.id}
                        onClick={() => onBatchClick(batch)}
                        className="w-full text-left p-3 flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            {/* Status Indicator (Optional: Red if expiring soon) */}
                            <div className={`w-2 h-2 rounded-full ${batchService.getDaysRemaining(batch.expiration_date) <= 3 ? 'bg-industrial-red animate-pulse' : 'bg-industrial-yellow'}`} />

                            <div>
                                <span className="text-zinc-400 text-xs font-bold uppercase block group-hover:text-white transition-colors">
                                    Vence: <span className="text-white font-mono">{batchService.formatDate(batch.expiration_date)}</span>
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="font-mono text-sm font-bold text-white group-hover:scale-110 transition-transform inline-block">
                                {batch.quantity}
                            </span>
                            <span className="text-[9px] text-zinc-500 ml-1 font-bold uppercase">Un.</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
