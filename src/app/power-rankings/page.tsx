"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RankingTeam {
    id: number;
    name: string;
    manager: string;
    actualRank: number;
    powerRank: number;
    actualWins: number;
    actualDraws: number;
    actualLosses: number;
    allPlayWins: number;
    allPlayDraws: number;
    allPlayLosses: number;
    luckRating: number;
}

export default function PowerRankingsPage() {
    const [rankings, setRankings] = useState<RankingTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRankings = async () => {
            const leagueId = localStorage.getItem("fpl_league_id");
            if (!leagueId) {
                setError("No League ID found");
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/power-rankings?leagueId=${leagueId}`);
                if (!res.ok) throw new Error("Failed to fetch rankings");
                const data = await res.json();
                setRankings(data.rankings);
            } catch (err) {
                setError("Failed to load power rankings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankings();
    }, []);

    const getLuckBadge = (rating: number) => {
        if (rating > 2) return <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/50">VERY LUCKY</span>;
        if (rating > 0) return <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/50">LUCKY</span>;
        if (rating < -2) return <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/50">VERY UNLUCKY</span>;
        if (rating < 0) return <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/50">UNLUCKY</span>;
        return <span className="px-2 py-1 rounded bg-slate-700 text-slate-400 text-xs font-bold border border-slate-600">FAIR</span>;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

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
                                <Trophy className="h-6 w-6 text-yellow-400" />
                                Power Rankings
                            </h1>
                            <p className="text-slate-400 text-sm">True standings based on "All-Play" record (vs every team, every week).</p>
                        </div>
                    </div>
                </header>

                {error ? (
                    <div className="text-center text-red-400 py-10">{error}</div>
                ) : (
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-800">
                                        <th className="p-4 font-medium text-center w-16">Rank</th>
                                        <th className="p-4 font-medium">Team</th>
                                        <th className="p-4 font-medium text-center">Actual Record</th>
                                        <th className="p-4 font-medium text-center">All-Play Record</th>
                                        <th className="p-4 font-medium text-center">Luck</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {rankings.map((team) => (
                                        <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-center font-mono text-xl font-bold text-white">
                                                {team.powerRank}
                                                {team.powerRank < team.actualRank && <TrendingUp className="inline-block ml-1 h-4 w-4 text-emerald-400" />}
                                                {team.powerRank > team.actualRank && <TrendingDown className="inline-block ml-1 h-4 w-4 text-red-400" />}
                                                {team.powerRank === team.actualRank && <Minus className="inline-block ml-1 h-4 w-4 text-slate-600" />}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{team.name}</div>
                                                <div className="text-xs text-slate-500">{team.manager}</div>
                                            </td>
                                            <td className="p-4 text-center font-mono text-slate-300">
                                                {team.actualWins}-{team.actualDraws}-{team.actualLosses}
                                            </td>
                                            <td className="p-4 text-center font-mono text-emerald-400 font-bold">
                                                {team.allPlayWins}-{team.allPlayDraws}-{team.allPlayLosses}
                                            </td>
                                            <td className="p-4 text-center">
                                                {getLuckBadge(team.luckRating)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
