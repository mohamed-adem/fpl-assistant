"use client";

import { Player } from "@/types/fpl";
import { TrendingUp } from "lucide-react";

interface WaiverListProps {
    players: Player[];
}

export function WaiverList({ players }: WaiverListProps) {
    return (
        <section>
            <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-6 w-6 text-[#e90052]" />
                <h2 className="text-xl font-semibold text-white">Waiver Wire Watchdog</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                    <div
                        key={player.id}
                        className="bg-[#2a1a2f]/50 border border-[#4a2a4f]/50 rounded-xl p-4 hover:bg-[#2a1a2f] transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-mono text-slate-500">
                                        #{index + 1}
                                    </span>
                                    <h3 className="font-bold text-white group-hover:text-[#e90052] transition-colors">
                                        {player.web_name}
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {player.element_type === 1
                                        ? "GK"
                                        : player.element_type === 2
                                            ? "DEF"
                                            : player.element_type === 3
                                                ? "MID"
                                                : "FWD"}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-[#e90052]">
                                    {player.form}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                                    Form
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-slate-900/50 rounded p-2">
                                <div className="text-slate-300">{player.ict_index}</div>
                                <div className="text-slate-600 mt-1">ICT</div>
                            </div>
                            <div className="bg-slate-900/50 rounded p-2">
                                <div className="text-slate-300">{player.points_per_game}</div>
                                <div className="text-slate-600 mt-1">PPG</div>
                            </div>
                            <div className="bg-slate-900/50 rounded p-2">
                                <div className="text-slate-300">{player.total_points}</div>
                                <div className="text-slate-600 mt-1">Total</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
