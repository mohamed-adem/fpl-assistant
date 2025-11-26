"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Player } from "@/types/fpl";
import { cn } from "@/lib/utils";

interface PlayerSearchInputProps {
    label: string;
    onSelect: (player: Player) => void;
    selectedPlayer?: Player | null;
    onClear?: () => void;
}

export function PlayerSearchInput({ label, onSelect, selectedPlayer, onClear }: PlayerSearchInputProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const searchPlayers = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/players?search=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.slice(0, 10)); // Limit to 10 results
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Failed to search players", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(searchPlayers, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    if (selectedPlayer) {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
                <div className="relative bg-slate-800 border border-emerald-500/50 rounded-xl p-4 flex items-center justify-between group">
                    <div>
                        <div className="font-bold text-white">{selectedPlayer.web_name}</div>
                        <div className="text-xs text-slate-400">{selectedPlayer.team} • {selectedPlayer.element_type === 1 ? "GK" : selectedPlayer.element_type === 2 ? "DEF" : selectedPlayer.element_type === 3 ? "MID" : "FWD"}</div>
                    </div>
                    <button
                        onClick={onClear}
                        className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full" ref={wrapperRef}>
            <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
            <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search player..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-3.5 h-5 w-5 text-emerald-500 animate-spin" />
                )}

                {isOpen && results.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        {results.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => {
                                    onSelect(player);
                                    setQuery("");
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex justify-between items-center border-b border-slate-700/50 last:border-0"
                            >
                                <div>
                                    <div className="font-medium text-slate-200">{player.web_name}</div>
                                    <div className="text-xs text-slate-500">{player.first_name} {player.second_name}</div>
                                </div>
                                <div className="text-xs font-mono text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                                    {player.total_points} pts
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
