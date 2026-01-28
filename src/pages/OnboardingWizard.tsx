import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function OnboardingWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const questions = [
        {
            title: "Qual o tamanho do seu estoque?",
            subtitle: "Para calibrarmos a sensibilidade dos alertas.",
            options: ["Pequeno (Até R$ 50k)", "Médio (R$ 50k - R$ 200k)", "Grande (+ R$ 200k)"]
        },
        {
            title: "Quanto você estima perder por mês?",
            subtitle: "Seja honesto. O primeiro passo é reconhecer o custo.",
            options: ["Até R$ 500,00", "Entre R$ 500 e R$ 2.000", "Mais de R$ 5.000,00"]
        },
        {
            title: "Quantas pessoas vão usar o sistema?",
            subtitle: "O ZeroPerda é multi-usuário.",
            options: ["Apenas Eu", "2 - 5 Pessoas", "+ 5 Pessoas"]
        },
        {
            title: "Você assume o compromisso?",
            subtitle: "Nossa tecnologia só funciona se você decidir parar de aceitar o desperdício.",
            options: ["SIM, EU QUERO PARAR DE PERDER DINHEIRO"]
        }
    ];

    const handleSelect = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Finished
            navigate('/checkout');
        }
    };

    const progress = ((step + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Noise & Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black -z-10"></div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-zinc-900">
                <div
                    className="h-full bg-industrial-red transition-all duration-500 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <main className="max-w-2xl w-full">
                <div className="mb-12">
                    <span className="text-industrial-red text-xs font-bold uppercase tracking-widest mb-4 block">
                        Passo 0{step + 1} / 0{questions.length}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-2 animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-backwards key={step}">
                        {questions[step]?.title}
                    </h1>
                    <p className="text-zinc-500 text-lg animate-in slide-in-from-bottom-5 duration-700 fade-in fill-mode-backwards key={`sub-${step}`}">
                        {questions[step]?.subtitle}
                    </p>
                </div>

                <div className="space-y-4">
                    {questions[step]?.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={handleSelect}
                            className="w-full text-left p-6 md:p-8 bg-zinc-900/50 border border-zinc-800 hover:border-industrial-red hover:bg-industrial-red/5 rounded-xl transition-all group flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500 fade-in fill-mode-backwards"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <span className="text-xl font-bold uppercase group-hover:text-white text-zinc-300 transition-colors">
                                {opt}
                            </span>
                            <ArrowRight className="text-zinc-600 group-hover:text-industrial-red transition-colors" />
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
