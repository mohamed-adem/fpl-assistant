import { NextResponse } from "next/server";
import { getBootstrapStatic, getLeagueElementStatus } from "@/lib/api";
import { Player } from "@/types/fpl";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId");

    if (!leagueId) {
        return NextResponse.json({ error: "League ID is required" }, { status: 400 });
    }

    try {
        // Fetch League Details, Static Data, and Element Status in parallel
        const [leagueDetailsRes, staticData, elementStatus] = await Promise.all([
            fetch(`https://draft.premierleague.com/api/league/${leagueId}/details`),
            getBootstrapStatic(),
            getLeagueElementStatus(leagueId),
        ]);

        if (!leagueDetailsRes.ok) {
            throw new Error("Invalid League ID");
        }

        const leagueDetails = await leagueDetailsRes.json();

        // Create a Set of owned player IDs for O(1) lookup
        // Only include players who have an owner (owner !== null)
        const ownedPlayerIds = new Set(
            elementStatus
                .filter((status) => status.owner !== null)
                .map((status) => status.element)
        );

        // Filter out owned players
        const freeAgents = staticData.elements.filter(
            (player) => !ownedPlayerIds.has(player.id) && player.status !== "u"
        );

        // Calculate "Watchdog Score"
        // Formula: (Form * 10) + (ICT Index * 1) + (Points Per Game * 5)
        const scoredAgents = freeAgents.map((player) => {
            const form = parseFloat(player.form) || 0;
            const ict = parseFloat(player.ict_index) || 0;
            const ppg = parseFloat(player.points_per_game) || 0;

            // Boost players who are actually playing
            const minutesPoints = player.chance_of_playing_next_round === 100 ? 5 : 0;

            const score = (form * 10) + (ict * 1) + (ppg * 5) + minutesPoints;

            return { ...player, watchdog_score: score };
        });

        // Sort by Score Descending
        scoredAgents.sort((a, b) => b.watchdog_score - a.watchdog_score);

        return NextResponse.json({
            league: {
                name: leagueDetails.league.name,
                teams: leagueDetails.league_entries.map((entry: any) => ({
                    id: entry.id,
                    name: entry.entry_name,
                    manager: entry.player_first_name + " " + entry.player_last_name
                }))
            },
            players: scoredAgents.slice(0, 50)
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            error: "Failed to fetch waiver data",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
