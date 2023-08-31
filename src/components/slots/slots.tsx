import * as React from 'react';

interface Props {
    slots: string[];
    maxSlots?: number;
    onClick: (_: string) => void;
}
export function Slots({ slots, maxSlots = 3, onClick }: Props) {
    const emptySlots = Array(Math.max(maxSlots - slots.length)).fill('empty');
    return (
        <React.Fragment>
            {slots.map((value: string) => (
                <button
                    key={value}
                    className="text-sm font-medium transition-colors hover:text-primary bg-purple-100 rounded px-2"
                    onClick={() => onClick(value)}
                >
                    <span className="text-slate-500">x</span> {value}
                </button>
            ))}
            {emptySlots.map((_, i) => (
                <span
                    key={i}
                    className="text-sm font-medium transition-colors hover:text-primary bg-purple-50 rounded px-2"
                >
                    <span className="text-slate-300">empty slot</span>
                </span>
            ))}
        </React.Fragment>
    );
}
