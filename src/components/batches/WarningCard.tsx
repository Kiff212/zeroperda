import { AlertCircle } from 'lucide-react';

interface WarningCardProps {
    productName: string;
    category: string;
    expirationDate: string;
    status: string;
}

export function WarningCard({ productName, category, expirationDate, status }: WarningCardProps) {
    return (
        <div className="bg-industrial-yellow text-black p-3 border-2 border-black shadow-industrial flex justify-between items-center group cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] transition-all">
            <div className="flex items-center gap-3">
                <div className="bg-black/10 p-2 rounded-full border-2 border-black/10">
                    <AlertCircle size={24} strokeWidth={2.5} className="text-black" />
                </div>
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                        {category}
                    </span>
                    <h4 className="font-bold text-lg leading-none uppercase">{productName}</h4>
                    <span className="text-xs font-bold block mt-1">
                        {status}
                    </span>
                </div>
            </div>

            <div className="text-right border-l-2 border-black/10 pl-3">
                <span className="text-[10px] font-bold uppercase block opacity-70">Vence em</span>
                <span className="font-mono text-xl font-bold">{expirationDate}</span>
            </div>
        </div>
    );
}
