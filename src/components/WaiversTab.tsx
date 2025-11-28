"use client";

import useSWR from "swr";
import { Player } from "@/types/fpl";
import { WaiverList } from "./WaiverList";
import { Loader2, AlertCircle } from "lucide-react";

interface WaiversTabProps {
    leagueId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WaiversTab({ leagueId }: WaiversTabProps) {
    const { data, error, isLoading } = useSWR<{ players: Player[] }>(
        `/api/waivers?leagueId=${leagueId}`,
        fetcher
    );

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
                <p>Failed to load waivers.</p>
            </div>
        );
    }

    return <WaiverList players={data?.players || []} />;
}
