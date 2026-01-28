import { X, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import type { Batch } from '../../types/database.types';
import { useState } from 'react';

interface BatchActionModalProps {
    batch: Batch | null;
    onClose: () => void;
    onAction: (action: 'consumed' | 'discarded' | 'delete_product') => void;
    loading: boolean;
}

export function BatchActionModal({ batch, onClose, onAction, loading }: BatchActionModalProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!batch) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Sheet */}
            <div className="bg-industrial-surface w-full max-w-md border-t-2 sm:border-2 border-industrial shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 pb-12 animate-in slide-in-from-bottom duration-200 pointer-events-auto sm:rounded-lg relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                    <X size={24} />
                </button>

                <div className="mb-8">
                    <span className="text-xs font-bold uppercase text-zinc-500 block mb-1">
                        Gerenciar Item
                    </span>
                    <h2 className="text-2xl font-black uppercase text-white leading-tight">
                        {batch.products?.name}
                    </h2>
                    <p className="text-zinc-400 font-mono text-sm mt-1">
                        Validade: {batch.expiration_date.split('-').reverse().join('/')} • Qtd: {batch.quantity}
                    </p>
                </div>

                {confirmDelete ? (
                    <div className="bg-red-900/20 border-2 border-red-500/50 p-4 rounded-lg mb-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <AlertTriangle size={32} />
                            <div>
                                <h3 className="font-black uppercase text-sm">Tem certeza?</h3>
                                <p className="text-xs opacity-80">Isso apagará o produto e todos os lotes.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="bg-transparent border-2 border-zinc-700 text-zinc-400 font-bold uppercase py-3 rounded hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => onAction('delete_product')}
                                className="bg-red-600 text-white font-black uppercase py-3 rounded hover:bg-red-700 transition-colors shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            disabled={loading}
                            onClick={() => onAction('consumed')}
                            className="w-full bg-emerald-600 border-2 border-black text-white p-4 font-black uppercase tracking-wider flex items-center justify-between group hover:bg-emerald-500 transition-all active:scale-[0.98]"
                        >
                            <span className="flex items-center gap-3">
                                <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                                Baixa por Venda
                            </span>
                        </button>

                        <button
                            disabled={loading}
                            onClick={() => onAction('discarded')}
                            className="w-full bg-rose-600 border-2 border-black text-white p-4 font-black uppercase tracking-wider flex items-center justify-between group hover:bg-rose-500 transition-all active:scale-[0.98]"
                        >
                            <span className="flex items-center gap-3">
                                <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                                Baixa por Perda
                            </span>
                        </button>

                        <div className="h-4 border-b border-zinc-800 my-4" />

                        <button
                            disabled={loading}
                            onClick={() => setConfirmDelete(true)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-zinc-400 p-3 font-bold uppercase text-xs tracking-wider hover:bg-zinc-800 hover:text-red-400 hover:border-red-900/50 transition-all"
                        >
                            Excluir Produto do Sistema
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
