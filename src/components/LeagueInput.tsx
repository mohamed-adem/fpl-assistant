"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";

interface LeagueInputProps {
    onSubmit: (leagueId: string) => void;
}

export function LeagueInput({ onSubmit }: LeagueInputProps) {
    const [inputId, setInputId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputId.trim()) return;

        setIsLoading(true);
        setError("");

        try {
            // Always lookup League ID from Team ID
            const res = await fetch(`/api/league-lookup?entryId=${inputId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to find league");
            }

            onSubmit(data.leagueId.toString());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    FPL Draft Assistant
                </h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                    Dominate your league with advanced analytics and waiver wire intelligence.
                </p>
            </div>

            <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="teamId" className="text-sm font-medium text-slate-300 ml-1">
                            Enter your Team ID
                        </label>
                        <div className="relative">
                            <input
                                id="teamId"
                                type="text"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder="e.g. 16486"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                autoFocus
                            />
                            <Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-500" />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !inputId}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span>Find League</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="text-sm text-slate-500 bg-slate-800/50 p-4 rounded-lg max-w-sm text-left space-y-2 border border-slate-700">
                <p className="font-semibold text-emerald-400">
                    How to find Team ID:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://draft.premierleague.com" target="_blank" className="underline hover:text-emerald-400">FPL Draft</a>.</li>
                    <li>Click "Pick Team" then "View Transactions".</li>
                    <li>Look at URL: <code>.../entry/16486/transactions</code></li>
                    <li>The number is your Team ID.</li>
                </ol>
            </div>
        </div>
    );
}
