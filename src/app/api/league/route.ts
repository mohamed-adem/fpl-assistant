import { NextResponse } from "next/server";
import { getLeagueDetails } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId");

    if (!leagueId) {
        return NextResponse.json({ error: "League ID is required" }, { status: 400 });
    }

    try {
        const leagueDetails = await getLeagueDetails(leagueId);

        // Transform to match the expected format for Dashboard
        const teams = leagueDetails.league_entries.map((entry: any) => ({
            id: entry.id,
            name: entry.entry_name,
            manager: entry.player_first_name + " " + entry.player_last_name,
        }));

        return NextResponse.json({
            league: {
                name: leagueDetails.league.name,
                teams: teams
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch league details" }, { status: 500 });
    }
}
