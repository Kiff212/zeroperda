import { Package } from 'lucide-react';

interface BatchListItemProps {
    productName: string;
    quantity: number;
    date: string;
    onClick?: () => void;
}

export function BatchListItem({ productName, quantity, date, onClick }: BatchListItemProps) {
    return (
        <div onClick={onClick} className="bg-industrial-surface p-3 border-2 border-industrial shadow-industrial-sm flex items-center justify-between active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:border-zinc-500">
            <div className="flex items-center gap-3">
                <div className="bg-black/40 p-2 border border-industrial rounded">
                    <Package size={20} className="text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase text-white">{productName}</h4>
                    <span className="text-xs text-zinc-500 font-mono">Vence: {date}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="font-mono font-bold text-lg text-white">{quantity}</span>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Unid.</span>
            </div>
        </div>
    );
}
