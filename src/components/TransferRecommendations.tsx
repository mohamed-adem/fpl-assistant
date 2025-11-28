"use client";

import { Recommendation } from "@/types/fpl";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface TransferRecommendationsProps {
    recommendations: Recommendation[];
    sort: "form" | "ep_next";
    onSortChange: (sort: "form" | "ep_next") => void;
}

export function TransferRecommendations({ recommendations, sort, onSortChange }: TransferRecommendationsProps) {
    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Transfer Recommendations</h3>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={() => onSortChange("form")}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            sort === "form" ? "bg-[#e90052] text-white" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Based on Form
                    </button>
                    <button
                        onClick={() => onSortChange("ep_next")}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            sort === "ep_next" ? "bg-[#e90052] text-white" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Based on Exp. Points
                    </button>
                </div>
            </div>

            {recommendations.map(({ player, upgrades }) => (
                <div key={player.id} className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 transition-all hover:border-slate-700">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        {/* Current Player */}
                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Player</div>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                    (sort === "form" ? parseFloat(player.form) : (parseFloat(player.ep_next) || 0)) < 3 ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-300"
                                )}>
                                    {sort === "form" ? player.form : (player.ep_next || "0")}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">{player.web_name}</div>
                                    <div className="text-sm text-slate-400">
                                        {sort === "form" ? `Form: ${player.form}` : `Exp. Points: ${player.ep_next}`} • PPG: {player.points_per_game}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="flex-[2]">
                            <div className="text-xs font-bold text-[#e90052] uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4" />
                                Recommended Upgrades (Free Agents)
                            </div>

                            {upgrades.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {upgrades.map((upgrade) => (
                                        <div key={upgrade.id} className="bg-[#e90052]/10 border border-[#e90052]/20 rounded-lg p-3 hover:bg-[#e90052]/20 transition-colors">
                                            <div className="font-bold text-[#00ff87]">{upgrade.web_name}</div>
                                            <div className="text-xs text-[#00ff87]/70 mt-1">
                                                {sort === "form" ? "Form" : "EP"}: {sort === "form" ? upgrade.form : upgrade.ep_next}
                                                <span className="text-[#00ff87]"> (+{
                                                    ((sort === "form" ? parseFloat(upgrade.form) : (parseFloat(upgrade.ep_next) || 0)) -
                                                        (sort === "form" ? parseFloat(player.form) : (parseFloat(player.ep_next) || 0))).toFixed(1)
                                                })</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {upgrade.team} • {upgrade.status === "d" ? "Doubtful" : "Available"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 italic py-2">
                                    No clear upgrades found on waivers. Keep him!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
