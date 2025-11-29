"use client";

import useSWR from "swr";
import { TeamLineup } from "./TeamLineup";
import { Loader2, AlertCircle, User } from "lucide-react";

interface LineupTabProps {
    leagueId: string;
    teamId: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LineupTab({ leagueId, teamId }: LineupTabProps) {
    const { data, error, isLoading } = useSWR(
        teamId ? `/api/my-team?leagueId=${leagueId}&teamId=${teamId}&sort=form` : null,
        fetcher
    );

    if (!teamId) {
        return (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No Team Selected</h3>
                <p className="text-slate-400 mt-2">Please select your team from the list above to see your optimal lineup.</p>
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
                <p>Failed to load team data.</p>
            </div>
        );
    }

    if (!data?.optimalLineup) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">No lineup data available.</p>
            </div>
        );
    }

    return <TeamLineup optimalLineup={data.optimalLineup} />;
}
