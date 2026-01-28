

interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    autoFocus?: boolean;
}

export function QuantityInput({ value, onChange, autoFocus }: QuantityInputProps) {

    const handleAdd = (amount: number) => {
        onChange(Math.max(0, value + amount));
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <input
                    type="number"
                    value={value === 0 ? '' : value}
                    onChange={(e) => onChange(parseInt(e.target.value || '0'))}
                    placeholder="0"
                    className="w-full bg-black/50 border border-zinc-700 p-2 font-black text-white text-center outline-none focus:border-industrial-yellow transition-all placeholder:text-zinc-700"
                    autoFocus={autoFocus}
                />
            </div>

            <div className="grid grid-cols-2 gap-1">
                <div className="flex gap-px">
                    <button
                        type="button"
                        onClick={() => handleAdd(-6)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-500 font-bold py-1 px-1 text-[10px] uppercase hover:bg-zinc-700 active:bg-zinc-900 flex items-center justify-center gap-1"
                    >
                        -6
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAdd(6)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold py-1 px-1 text-[10px] uppercase hover:bg-zinc-700 active:bg-zinc-900 flex items-center justify-center gap-1"
                    >
                        +6
                    </button>
                </div>
                <div className="flex gap-px">
                    <button
                        type="button"
                        onClick={() => handleAdd(-12)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-500 font-bold py-1 px-1 text-[10px] uppercase hover:bg-zinc-700 active:bg-zinc-900 flex items-center justify-center gap-1"
                    >
                        -12
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAdd(12)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold py-1 px-1 text-[10px] uppercase hover:bg-zinc-700 active:bg-zinc-900 flex items-center justify-center gap-1"
                    >
                        +12
                    </button>
                </div>
            </div>
        </div>
    );
}
