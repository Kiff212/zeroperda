import { Scan, LogOut, Users, Home } from 'lucide-react';
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
                <nav className="bg-industrial text-white border-2 border-black shadow-industrial p-2 grid grid-cols-5 items-center rounded-lg gap-1">

                    {/* HOME */}
                    <button onClick={() => navigate('/dashboard')} className="p-2 flex flex-col items-center gap-1 active:scale-95 text-zinc-400 hover:text-white transition-colors">
                        <Home size={20} />
                        <span className="text-[9px] font-bold uppercase">Home</span>
                    </button>

                    {/* TEAM */}
                    <button onClick={() => navigate('/team')} className="p-2 flex flex-col items-center gap-1 active:scale-95 text-zinc-400 hover:text-white transition-colors">
                        <Users size={20} />
                        <span className="text-[9px] font-bold uppercase">Time</span>
                    </button>

                    {/* ADD (Floating) */}
                    <div className="relative flex justify-center">
                        <button
                            ref={buttonRef}
                            onClick={() => navigate('/add')}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="bg-industrial-yellow text-black p-4 rounded-full border-2 border-black shadow-none -mt-12 transition-all flex items-center justify-center cursor-pointer absolute top-[-10px]"
                        >
                            <Scan size={24} strokeWidth={3} />
                        </button>
                    </div>

                    {/* SPACER (For future use or settings) */}
                    <div className="p-2"></div>

                    {/* LOGOUT */}
                    <button
                        onClick={signOut}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors flex flex-col items-center gap-1 active:scale-95 text-red-400 justify-self-center"
                    >
                        <LogOut size={20} strokeWidth={2} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Sair</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
