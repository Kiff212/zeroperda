import { Scan, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';

export function BottomNav() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                scale: 1.15,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    };

    const handleMouseLeave = () => {
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    };

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-md mx-auto px-4 pointer-events-auto">
                <nav className="bg-industrial text-white border-2 border-black shadow-industrial p-2 grid grid-cols-3 items-center rounded-lg">
                    <div className="p-3 flex flex-col items-center gap-1 opacity-50 justify-self-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">2026 - Zero Perda</span>
                    </div>

                    <button
                        ref={buttonRef}
                        onClick={() => navigate('/add')}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="justify-self-center bg-industrial-yellow text-black p-5 rounded-full border-2 border-black shadow-none -mt-10 transition-all flex items-center justify-center cursor-pointer"
                    >
                        <Scan size={28} strokeWidth={3} />
                    </button>

                    <button
                        onClick={signOut}
                        className="p-3 hover:bg-white/10 rounded-md transition-colors flex flex-col items-center gap-1 active:scale-95 text-red-400 justify-self-end"
                    >
                        <LogOut size={20} strokeWidth={2} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Sair</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
