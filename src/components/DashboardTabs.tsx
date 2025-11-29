"use client";

import { cn } from "@/lib/utils";
import { Users, TrendingUp, ArrowRightLeft, ArrowUpRight, Trophy } from "lucide-react";

export type Tab = "lineup" | "waivers" | "transfers" | "trades" | "rankings";

interface DashboardTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "lineup", label: "Lineup", icon: Users },
        { id: "waivers", label: "Waivers", icon: TrendingUp },
        { id: "transfers", label: "Transfers", icon: ArrowUpRight },
        { id: "trades", label: "Trades", icon: ArrowRightLeft },
        { id: "rankings", label: "Rankings", icon: Trophy },
    ];

    return (
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            isActive
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
