"use client";

import { Player } from "@/types/fpl";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface PlayerDetailModalProps {
    player: Player | null;
    onClose: () => void;
}

export function PlayerDetailModal({ player, onClose }: PlayerDetailModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (player) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [player, onClose]);

    if (!player) return null;

    const positionName = player.element_type === 1 ? "Goalkeeper"
        : player.element_type === 2 ? "Defender"
            : player.element_type === 3 ? "Midfielder"
                : "Forward";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#2a1a2f] to-[#1a0a1f] border border-[#4a2a4f] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#38003c] to-[#e90052] p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>

                    <div className="pr-12">
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {player.first_name} {player.second_name}
                        </h2>
                        <p className="text-[#00ff87] font-medium">{positionName} • Team {player.team}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* News/Status */}
                    {player.news && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-200 font-medium text-sm">Player News</p>
                                <p className="text-amber-100/80 text-sm mt-1">{player.news}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard label="Form" value={player.form} highlight />
                        <StatCard label="Points/Game" value={player.points_per_game} />
                        <StatCard label="Total Points" value={player.total_points.toString()} />
                        <StatCard label="Expected Points" value={player.ep_next || "0"} highlight />
                        <StatCard label="ICT Index" value={player.ict_index} />
                        <StatCard label="Influence" value={player.influence} />
                        <StatCard label="Creativity" value={player.creativity} />
                        <StatCard label="Threat" value={player.threat} />
                    </div>

                    {/* Availability */}
                    <div className="bg-[#2a1a2f]/50 border border-[#4a2a4f] rounded-lg p-4">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-[#00ff87]" />
                            Availability
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Next Round:</span>
                                <span className={`font-medium ${player.chance_of_playing_next_round === 100 ? "text-[#00ff87]" :
                                        player.chance_of_playing_next_round === null ? "text-slate-300" :
                                            player.chance_of_playing_next_round >= 75 ? "text-yellow-400" :
                                                "text-red-400"
                                    }`}>
                                    {player.chance_of_playing_next_round === null ? "100%" : `${player.chance_of_playing_next_round}%`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status:</span>
                                <span className={`font-medium ${player.status === "a" ? "text-[#00ff87]" :
                                        player.status === "d" ? "text-yellow-400" :
                                            "text-red-400"
                                    }`}>
                                    {player.status === "a" ? "Available" :
                                        player.status === "d" ? "Doubtful" :
                                            "Injured"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`bg-[#2a1a2f]/50 border rounded-lg p-4 ${highlight ? "border-[#e90052]/50 bg-[#e90052]/5" : "border-[#4a2a4f]"
            }`}>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${highlight ? "text-[#e90052]" : "text-white"}`}>
                {value}
            </p>
        </div>
    );
}
