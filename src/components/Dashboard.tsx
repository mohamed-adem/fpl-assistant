"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Users, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { DashboardTabs, Tab } from "./DashboardTabs";
import { LineupTab } from "./LineupTab";
import { WaiversTab } from "./WaiversTab";
import { TransfersTab } from "./TransfersTab";
import { TradeTab } from "./TradeTab";
import { RankingsTab } from "./RankingsTab";
import { cn } from "@/lib/utils";

interface DashboardProps {
    leagueId: string;
    onLogout: () => void;
}

interface LeagueData {
    league: {
        name: string;
        teams: {
            id: number;
            name: string;
            manager: string;
        }[];
    };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Dashboard({ leagueId, onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>("lineup");
    const [teamId, setTeamId] = useState<string | null>(null);

    // Fetch League Details
    const { data: leagueData, error: leagueError, isLoading: isLeagueLoading } = useSWR<LeagueData>(
        `/api/league?leagueId=${leagueId}`,
        fetcher
    );

    useEffect(() => {
        const storedTeamId = localStorage.getItem("fpl_team_id");
        if (storedTeamId) {
            setTeamId(storedTeamId);
        }
    }, []);

    const handleTeamSelect = (id: string, name: string) => {
        setTeamId(id);
        localStorage.setItem("fpl_team_id", id);
        localStorage.setItem("fpl_team_name", name);
    };

    if (leagueError) {
        return (
            <div className="text-center text-red-400 p-10">
                <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                <p>Failed to load league data. Check your League ID.</p>
                <button onClick={onLogout} className="mt-4 underline hover:text-red-300">
                    Try different ID
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-slate-800 pb-6">
                <div>
                    {isLeagueLoading ? (
                        <div className="h-8 w-48 bg-slate-800 animate-pulse rounded"></div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-white">{leagueData?.league.name}</h1>
                            <div className="flex items-center space-x-2 text-slate-400 text-sm mt-1">
                                <span>ID: {leagueId}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {leagueData?.league.teams.length} Teams
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={onLogout}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                >
                    Change League
                </button>
            </header>

            {/* Team Selection */}
            {!isLeagueLoading && (
                <section className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Select Active Team</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {leagueData?.league.teams.map((team) => (
                            <button
                                key={team.id}
                                onClick={() => handleTeamSelect(team.id.toString(), team.name)}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-all text-left w-full",
                                    teamId === team.id.toString()
                                        ? "bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/50"
                                        : "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-emerald-500/30"
                                )}
                            >
                                <div className="truncate">
                                    <div className={cn(
                                        "font-bold text-sm truncate",
                                        teamId === team.id.toString() ? "text-emerald-500" : "text-white"
                                    )}>{team.name}</div>
                                    <div className="text-xs text-slate-500 truncate">{team.manager}</div>
                                </div>
                                {teamId === team.id.toString() && (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Tabs */}
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <main className="min-h-[500px]">
                {activeTab === "lineup" && <LineupTab leagueId={leagueId} teamId={teamId} />}
                {activeTab === "waivers" && <WaiversTab leagueId={leagueId} />}
                {activeTab === "transfers" && <TransfersTab leagueId={leagueId} teamId={teamId} />}
                {activeTab === "trades" && <TradeTab />}
                {activeTab === "rankings" && <RankingsTab />}
            </main>
        </div>
    );
}
