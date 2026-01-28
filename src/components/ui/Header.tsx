import { Box, AlertTriangle } from 'lucide-react';

interface HeaderProps {
    criticalCount: number;
    totalItems: number;
}

export function Header({ criticalCount, totalItems }: HeaderProps) {
    return (
        <header className="p-4 border-b-2 border-industrial bg-industrial-bg sticky top-0 z-40">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-black tracking-tighter uppercase border-2 border-industrial px-2 py-1 shadow-industrial-sm bg-industrial text-white">
                    Zero Perda
                </h1>
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-industrial-red rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-industrial p-3 shadow-industrial-sm bg-industrial-surface">
                    <div className="flex items-center gap-2 text-industrial-red mb-1">
                        <AlertTriangle size={14} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase">Crítico</span>
                    </div>
                    <span className="text-2xl font-mono font-bold block text-white leading-none mb-1">{criticalCount}</span>
                    <span className="text-[9px] text-zinc-400 uppercase font-medium">Itens vencendo</span>
                </div>

                <div className="border-2 border-industrial p-3 shadow-industrial-sm bg-industrial-surface">
                    <div className="flex items-center gap-2 text-white mb-1">
                        <Box size={14} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase">Total</span>
                    </div>
                    <span className="text-2xl font-mono font-bold block text-white leading-none mb-1">{totalItems}</span>
                    <span className="text-[9px] text-zinc-400 uppercase font-medium">Produtos Ativos</span>
                </div>
            </div>
        </header>
    );
}
