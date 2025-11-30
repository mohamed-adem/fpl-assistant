"use client";

import { useState } from "react";
import { Player } from "@/types/fpl";
import { PlayerSearchInput } from "@/components/PlayerSearchInput";
import { PlayerComparison } from "@/components/PlayerComparison";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

export default function TradePage() {
    const [playerA, setPlayerA] = useState<Player | null>(null);
    const [playerB, setPlayerB] = useState<Player | null>(null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ArrowRightLeft className="h-6 w-6 text-emerald-400" />
                                Trade Analyzer
                            </h1>
                            <p className="text-slate-400 text-sm">Compare players side-by-side to evaluate trades.</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <PlayerSearchInput
                        label="Your Player (Outgoing)"
                        onSelect={setPlayerA}
                        selectedPlayer={playerA}
                        onClear={() => setPlayerA(null)}
                    />
                    <PlayerSearchInput
                        label="Target Player (Incoming)"
                        onSelect={setPlayerB}
                        selectedPlayer={playerB}
                        onClear={() => setPlayerB(null)}
                    />
                </div>

                {playerA && playerB ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PlayerComparison playersA={[playerA]} playersB={[playerB]} />
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                        <ArrowRightLeft className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">Select two players to see the comparison.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
