import { BootstrapStatic, ElementStatus, LeagueDetails } from "@/types/fpl";

const BASE_URL = "https://draft.premierleague.com/api";

export async function getLeagueDetails(leagueId: string): Promise<LeagueDetails> {
    const res = await fetch(`${BASE_URL}/league/${leagueId}/details`, {
        next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) throw new Error("Failed to fetch league details");
    return res.json();
}

export async function getLeagueElementStatus(leagueId: string): Promise<ElementStatus[]> {
    const res = await fetch(`${BASE_URL}/league/${leagueId}/element-status`, {
        next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) throw new Error("Failed to fetch element status");
    const data = await res.json();
    return data.element_status;
}

// In-memory cache for bootstrap static data
let bootstrapCache: { data: BootstrapStatic; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export async function getBootstrapStatic(): Promise<BootstrapStatic> {
    const now = Date.now();

    // Return cached data if valid
    if (bootstrapCache && (now - bootstrapCache.timestamp < CACHE_DURATION)) {
        return bootstrapCache.data;
    }

    const res = await fetch(`${BASE_URL}/bootstrap-static`, {
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to fetch bootstrap static");

    const data = await res.json();

    // Update cache
    bootstrapCache = {
        data,
        timestamp: now
    };

    return data;
}
