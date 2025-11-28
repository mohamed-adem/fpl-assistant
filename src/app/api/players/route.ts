import { NextResponse } from "next/server";
import { getBootstrapStatic } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search")?.toLowerCase();

    try {
        const staticData = await getBootstrapStatic();

        let players = staticData.elements.map(p => ({
            id: p.id,
            web_name: p.web_name,
            first_name: p.first_name,
            second_name: p.second_name,
            team: p.team,
            element_type: p.element_type,
            form: p.form,
            total_points: p.total_points,
            points_per_game: p.points_per_game,
            ict_index: p.ict_index,
            influence: p.influence,
            creativity: p.creativity,
            threat: p.threat,
            ep_next: p.ep_next,
            chance_of_playing_next_round: p.chance_of_playing_next_round,
            news: p.news,
        }));

        if (query) {
            players = players.filter(p =>
                p.web_name.toLowerCase().includes(query) ||
                p.first_name.toLowerCase().includes(query) ||
                p.second_name.toLowerCase().includes(query)
            );
        }

        // Limit results if no query to avoid massive payload, or return all if needed for client-side filtering
        // For now, let's return top 50 by total points if no query, or all matches if query exists
        if (!query) {
            players.sort((a, b) => b.total_points - a.total_points);
            players = players.slice(0, 50);
        }

        return NextResponse.json(players);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
    }
}
