"use client";

import { useState } from "react";
import { Player } from "@/types/fpl";
import { PlayerSearchInput } from "@/components/PlayerSearchInput";
import { PlayerComparison } from "@/components/PlayerComparison";
import { ArrowRightLeft, X } from "lucide-react";

export function TradeTab() {
    const [playersA, setPlayersA] = useState<Player[]>([]);
    const [playersB, setPlayersB] = useState<Player[]>([]);

    const addPlayerA = (player: Player) => {
        if (!playersA.find(p => p.id === player.id)) {
            setPlayersA([...playersA, player]);
        }
    };

    const addPlayerB = (player: Player) => {
        if (!playersB.find(p => p.id === player.id)) {
            setPlayersB([...playersB, player]);
        }
    };

    const removePlayerA = (id: number) => {
        setPlayersA(playersA.filter(p => p.id !== id));
    };

    const removePlayerB = (id: number) => {
        setPlayersB(playersB.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-2">
                <ArrowRightLeft className="h-6 w-6 text-emerald-400" />
                <div>
                    <h2 className="text-xl font-bold text-white">Trade Analyzer</h2>
                    <p className="text-slate-400 text-sm">Compare multiple players side-by-side.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Side A */}
                <div className="space-y-4">
                    <PlayerSearchInput
                        label="Add Your Player (Outgoing)"
                        onSelect={addPlayerA}
                        selectedPlayer={null} // Always reset after select
                        onClear={() => { }}
                    />
                    <div className="space-y-2">
                        {playersA.map(player => (
                            <div key={player.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <div>
                                    <div className="font-bold text-white">{player.web_name}</div>
                                    <div className="text-xs text-slate-400">{player.team} • {player.element_type === 1 ? "GK" : player.element_type === 2 ? "DEF" : player.element_type === 3 ? "MID" : "FWD"}</div>
                                </div>
                                <button onClick={() => removePlayerA(player.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side B */}
                <div className="space-y-4">
                    <PlayerSearchInput
                        label="Add Target Player (Incoming)"
                        onSelect={addPlayerB}
                        selectedPlayer={null}
                        onClear={() => { }}
                    />
                    <div className="space-y-2">
                        {playersB.map(player => (
                            <div key={player.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <div>
                                    <div className="font-bold text-white">{player.web_name}</div>
                                    <div className="text-xs text-slate-400">{player.team} • {player.element_type === 1 ? "GK" : player.element_type === 2 ? "DEF" : player.element_type === 3 ? "MID" : "FWD"}</div>
                                </div>
                                <button onClick={() => removePlayerB(player.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {playersA.length > 0 && playersB.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PlayerComparison playersA={playersA} playersB={playersB} />
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <ArrowRightLeft className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Add players to both sides to see the comparison.</p>
                </div>
            )}
        </div>
    );
}
