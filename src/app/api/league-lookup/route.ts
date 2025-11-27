import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("entryId");

    if (!entryId) {
        return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://draft.premierleague.com/api/entry/${entryId}/public`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        const data = await res.json();

        // Check if user is in any leagues
        if (!data.entry.league_set || data.entry.league_set.length === 0) {
            return NextResponse.json({ error: "No leagues found for this team" }, { status: 404 });
        }

        // For now, just return the first league found
        // In a more complex version, we could return all and let user choose
        const leagueId = data.entry.league_set[0];

        return NextResponse.json({ leagueId });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to lookup league" }, { status: 500 });
    }
}
