"use client";

import { Player } from "@/types/fpl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerComparisonProps {
    playersA: Player[];
    playersB: Player[];
}

export function PlayerComparison({ playersA, playersB }: PlayerComparisonProps) {
    const compare = (valA: number, valB: number) => {
        if (valA > valB) return "A";
        if (valB > valA) return "B";
        return "equal";
    };

    const calculateTotal = (players: Player[], key: keyof Player) => {
        return players.reduce((sum, p) => {
            const val = p[key];
            return sum + (typeof val === 'string' ? parseFloat(val) : (val as number) || 0);
        }, 0);
    };

    const metrics = [
        { label: "Form", key: "form", format: (v: number) => v.toFixed(1) },
        { label: "Points Per Game", key: "points_per_game", format: (v: number) => v.toFixed(1) },
        { label: "Total Points", key: "total_points", format: (v: number) => v },
        { label: "ICT Index", key: "ict_index", format: (v: number) => v.toFixed(1) },
        { label: "Influence", key: "influence", format: (v: number) => v.toFixed(1) },
        { label: "Creativity", key: "creativity", format: (v: number) => v.toFixed(1) },
        { label: "Threat", key: "threat", format: (v: number) => v.toFixed(1) },
        { label: "Exp. Points (Next)", key: "ep_next", format: (v: number) => v.toFixed(1) },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900/80 p-4 border-b border-slate-800 text-center">
                <div className="px-2">
                    <div className="font-bold text-[#e90052] text-lg">Outgoing</div>
                    <div className="text-xs text-slate-400 mt-1">
                        {playersA.map(p => p.web_name).join(", ")}
                    </div>
                </div>
                <div className="text-slate-500 text-sm uppercase tracking-wider self-center">VS</div>
                <div className="px-2">
                    <div className="font-bold text-[#00ff87] text-lg">Incoming</div>
                    <div className="text-xs text-slate-400 mt-1">
                        {playersB.map(p => p.web_name).join(", ")}
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-800/50">
                {metrics.map((metric) => {
                    // @ts-ignore
                    const valA = calculateTotal(playersA, metric.key);
                    // @ts-ignore
                    const valB = calculateTotal(playersB, metric.key);
                    const winner = compare(valA, valB);

                    return (
                        <div key={metric.key} className="grid grid-cols-3 py-4 hover:bg-slate-800/30 transition-colors">
                            <div className={cn(
                                "text-center font-mono text-lg flex items-center justify-center gap-2",
                                winner === "A" ? "text-[#e90052] font-bold" : "text-slate-400"
                            )}>
                                {winner === "A" && <Check className="w-4 h-4" />}
                                {metric.format(valA)}
                            </div>

                            <div className="text-center text-slate-500 text-sm flex items-center justify-center">
                                {metric.label}
                            </div>

                            <div className={cn(
                                "text-center font-mono text-lg flex items-center justify-center gap-2",
                                winner === "B" ? "text-[#00ff87] font-bold" : "text-slate-400"
                            )}>
                                {metric.format(valB)}
                                {winner === "B" && <Check className="w-4 h-4" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 bg-slate-900/30 text-center text-xs text-slate-500">
                * Green checkmark indicates the better total stat
            </div>
        </div>
    );
}
