"use client";

import { useState } from "react";
import { Player, OptimalLineup } from "@/types/fpl";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { PlayerDetailModal } from "./PlayerDetailModal";

const PlayerCard = ({
    player,
    captain,
    vice,
    onClick
}: {
    player: Player;
    captain: Player;
    vice: Player;
    onClick: () => void;
}) => {
    const isCaptain = captain.id === player.id;
    const isVice = vice.id === player.id;

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center w-20 md:w-24 group cursor-pointer"
        >
            <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 shadow-lg relative mb-2 transition-all duration-300",
                "group-hover:scale-110 group-hover:shadow-2xl",
                isCaptain ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-yellow-300 group-hover:shadow-yellow-500/50" :
                    isVice ? "bg-gradient-to-br from-[#4a2a4f] to-[#2a1a2f] text-white border-[#e90052] group-hover:shadow-[#e90052]/50" :
                        "bg-gradient-to-br from-[#2a1a2f] to-[#1a0a1f] text-slate-200 border-[#4a2a4f] group-hover:shadow-[#e90052]/30"
            )}>
                {player.ep_next || "-"}
                {isCaptain && <span className="absolute -top-2 -right-2 bg-black text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-500">C</span>}
                {isVice && <span className="absolute -top-2 -right-2 bg-black text-[#e90052] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#e90052]">V</span>}
            </div>
            <div className="bg-[#2a1a2f]/90 px-2 py-1 rounded text-[10px] md:text-xs font-medium text-white text-center w-full truncate border border-[#4a2a4f] group-hover:border-[#e90052] transition-colors">
                {player.web_name}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{player.team}</div>
        </button>
    );
};

interface TeamLineupProps {
    optimalLineup: OptimalLineup;
}

export function TeamLineup({ optimalLineup }: TeamLineupProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    return (
        <>
            <section className="bg-gradient-to-br from-[#2a1a2f]/50 to-[#1a0a1f]/50 border border-[#4a2a4f] rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-[#e90052]/10 rounded-lg">
                        <ArrowUpRight className="h-6 w-6 text-[#e90052]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Optimal Starting XI</h2>
                        <p className="text-slate-400 text-sm">Based on predicted points for next Gameweek</p>
                    </div>
                </div>

                <div className="relative bg-gradient-to-b from-[#38003c]/20 via-[#2a1a2f]/10 to-[#1a0a1f]/20 border border-[#e90052]/20 rounded-xl p-8 min-h-[600px] flex flex-col justify-between">
                    {/* Pitch Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-px bg-[#e90052]/10"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#e90052]/10"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#e90052]/10"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#e90052]/10"></div>
                    </div>

                    {/* Goalkeeper */}
                    <div className="flex justify-center relative z-10">
                        {optimalLineup.startingXI.filter(p => p.element_type === 1).map(p => (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                captain={optimalLineup.captain}
                                vice={optimalLineup.viceCaptain}
                                onClick={() => setSelectedPlayer(p)}
                            />
                        ))}
                    </div>

                    {/* Defenders */}
                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                        {optimalLineup.startingXI.filter(p => p.element_type === 2).map(p => (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                captain={optimalLineup.captain}
                                vice={optimalLineup.viceCaptain}
                                onClick={() => setSelectedPlayer(p)}
                            />
                        ))}
                    </div>

                    {/* Midfielders */}
                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                        {optimalLineup.startingXI.filter(p => p.element_type === 3).map(p => (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                captain={optimalLineup.captain}
                                vice={optimalLineup.viceCaptain}
                                onClick={() => setSelectedPlayer(p)}
                            />
                        ))}
                    </div>

                    {/* Forwards */}
                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                        {optimalLineup.startingXI.filter(p => p.element_type === 4).map(p => (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                captain={optimalLineup.captain}
                                vice={optimalLineup.viceCaptain}
                                onClick={() => setSelectedPlayer(p)}
                            />
                        ))}
                    </div>
                </div>

                {/* Bench Section */}
                <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4a2a4f]"></span>
                        Bench
                    </h3>
                    <div className="bg-[#2a1a2f]/30 border border-[#4a2a4f] rounded-xl p-6 flex flex-wrap justify-center gap-4 md:gap-8">
                        {optimalLineup.bench.map(p => (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                captain={optimalLineup.captain}
                                vice={optimalLineup.viceCaptain}
                                onClick={() => setSelectedPlayer(p)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <PlayerDetailModal
                player={selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
            />
        </>
    );
}
