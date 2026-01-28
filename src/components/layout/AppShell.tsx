import React from 'react';
import { cn } from '../../lib/utils';

interface AppShellProps {
    children: React.ReactNode;
    className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
    return (
        <div className="min-h-screen bg-black grain-overlay font-sans text-white">
            <div className={cn(
                "max-w-md mx-auto min-h-screen bg-industrial-bg border-x-2 border-industrial shadow-2xl relative",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
