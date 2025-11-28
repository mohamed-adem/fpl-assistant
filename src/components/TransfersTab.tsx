"use client";

import { useState } from "react";
import useSWR from "swr";
import { TransferRecommendations } from "./TransferRecommendations";
import { Loader2, AlertCircle, User } from "lucide-react";

interface TransfersTabProps {
    leagueId: string;
    teamId: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TransfersTab({ leagueId, teamId }: TransfersTabProps) {
    const [sort, setSort] = useState<"form" | "ep_next">("form");

    const { data, error, isLoading } = useSWR(
        teamId ? `/api/my-team?leagueId=${leagueId}&teamId=${teamId}&sort=${sort}` : null,
        fetcher
    );

    if (!teamId) {
        return (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No Team Selected</h3>
                <p className="text-slate-400 mt-2">Please select your team from the list above to see transfer recommendations.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-10">
                <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                <p>Failed to load transfer data.</p>
            </div>
        );
    }

    return (
        <TransferRecommendations
            recommendations={data?.squad || []}
            sort={sort}
            onSortChange={setSort}
        />
    );
}
