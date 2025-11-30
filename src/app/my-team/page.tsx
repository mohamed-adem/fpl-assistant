"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertCircle, ArrowUpRight, User } from "lucide-react";
import Link from "next/link";
import { Player } from "@/types/fpl";
import { cn } from "@/lib/utils";

interface Recommendation {
    player: Player;
    upgrades: Player[];
}

interface OptimalLineup {
    startingXI: Player[];
    captain: Player;
    viceCaptain: Player;
}

const PlayerCard = ({ player, captain, vice }: { player: Player, captain: Player, vice: Player }) => {
    const isCaptain = captain.id === player.id;
    const isVice = vice.id === player.id;

    return (
        <div className="flex flex-col items-center w-20 md:w-24">
            <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 shadow-lg relative mb-2",
                isCaptain ? "bg-yellow-500 text-black border-yellow-300" :
                    isVice ? "bg-slate-700 text-white border-slate-500" :
                        "bg-slate-800 text-slate-200 border-slate-600"
            )}>
                {player.ep_next || "-"}
                {isCaptain && <span className="absolute -top-2 -right-2 bg-black text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-500">C</span>}
                {isVice && <span className="absolute -top-2 -right-2 bg-black text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-500">V</span>}
            </div>
            <div className="bg-slate-900/90 px-2 py-1 rounded text-[10px] md:text-xs font-medium text-white text-center w-full truncate border border-slate-700">
                {player.web_name}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{player.team}</div>
        </div>
    );
};

export default function MyTeamPage() {
    const [squad, setSquad] = useState<Recommendation[]>([]);
    const [optimalLineup, setOptimalLineup] = useState<OptimalLineup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [teamName, setTeamName] = useState("");

    const [sort, setSort] = useState<"form" | "ep_next">("form");

    useEffect(() => {
        const fetchData = async () => {
            const leagueId = localStorage.getItem("fpl_league_id");
            const teamId = localStorage.getItem("fpl_team_id");
            const name = localStorage.getItem("fpl_team_name");

            if (name) setTeamName(name);

            if (!leagueId || !teamId) {
                setError("Please select your team from the Dashboard first.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/my-team?leagueId=${leagueId}&teamId=${teamId}&sort=${sort}`);
                if (!res.ok) throw new Error("Failed to fetch team data");
                const data = await res.json();
                setSquad(data.squad);
                setOptimalLineup(data.optimalLineup);
            } catch (err) {
                setError("Failed to load team analysis");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sort]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
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
                                <User className="h-6 w-6 text-emerald-400" />
                                {teamName || "My Team"} Analysis
                            </h1>
                            <p className="text-slate-400 text-sm">Smart transfer recommendations based on form.</p>
                        </div>
                    </div>
                </header>

                {error ? (
                    <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400">{error}</p>
                        <Link href="/" className="inline-block mt-4 text-emerald-400 hover:underline">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : squad.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">No players found for this team.</p>
                        <p className="text-sm text-slate-500 mt-2">Debug info: Team ID {typeof window !== 'undefined' && localStorage.getItem("fpl_team_id")}</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Optimal Lineup Section */}
                        {optimalLineup && (
                            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <ArrowUpRight className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Optimal Starting XI</h2>
                                        <p className="text-slate-400 text-sm">Based on predicted points for next Gameweek</p>
                                    </div>
                                </div>

                                <div className="relative bg-gradient-to-b from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 rounded-xl p-8 min-h-[600px] flex flex-col justify-between">
                                    {/* Pitch Lines */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500/10"></div>
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500/10"></div>
                                        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-emerald-500/10"></div>
                                    </div>

                                    {/* Goalkeeper */}
                                    <div className="flex justify-center relative z-10">
                                        {optimalLineup.startingXI.filter(p => p.element_type === 1).map(p => (
                                            <PlayerCard key={p.id} player={p} captain={optimalLineup.captain} vice={optimalLineup.viceCaptain} />
                                        ))}
                                    </div>

                                    {/* Defenders */}
                                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                                        {optimalLineup.startingXI.filter(p => p.element_type === 2).map(p => (
                                            <PlayerCard key={p.id} player={p} captain={optimalLineup.captain} vice={optimalLineup.viceCaptain} />
                                        ))}
                                    </div>

                                    {/* Midfielders */}
                                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                                        {optimalLineup.startingXI.filter(p => p.element_type === 3).map(p => (
                                            <PlayerCard key={p.id} player={p} captain={optimalLineup.captain} vice={optimalLineup.viceCaptain} />
                                        ))}
                                    </div>

                                    {/* Forwards */}
                                    <div className="flex justify-center gap-4 md:gap-8 relative z-10">
                                        {optimalLineup.startingXI.filter(p => p.element_type === 4).map(p => (
                                            <PlayerCard key={p.id} player={p} captain={optimalLineup.captain} vice={optimalLineup.viceCaptain} />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Transfer Recommendations</h3>
                                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                                    <button
                                        onClick={() => setSort("form")}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                            sort === "form" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Based on Form
                                    </button>
                                    <button
                                        onClick={() => setSort("ep_next")}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                            sort === "ep_next" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Based on Exp. Points
                                    </button>
                                </div>
                            </div>

                            {squad.map(({ player, upgrades }) => (
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
                                            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <ArrowUpRight className="h-4 w-4" />
                                                Recommended Upgrades (Free Agents)
                                            </div>

                                            {upgrades.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {upgrades.map((upgrade) => (
                                                        <div key={upgrade.id} className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3 hover:bg-emerald-900/20 transition-colors">
                                                            <div className="font-bold text-emerald-300">{upgrade.web_name}</div>
                                                            <div className="text-xs text-emerald-400/70 mt-1">
                                                                {sort === "form" ? "Form" : "EP"}: {sort === "form" ? upgrade.form : upgrade.ep_next}
                                                                <span className="text-emerald-500"> (+{
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
                    </div>
                )}
            </div>
        </div>
    );
}
