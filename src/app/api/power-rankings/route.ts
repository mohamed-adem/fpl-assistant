import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId");

    if (!leagueId) {
        return NextResponse.json({ error: "League ID is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://draft.premierleague.com/api/league/${leagueId}/details`);

        if (!res.ok) {
            throw new Error("Failed to fetch league details");
        }

        const data = await res.json();
        const { league_entries, matches } = data;

        // Initialize stats for each team
        const teamStats: Record<number, any> = {};
        league_entries.forEach((entry: any) => {
            teamStats[entry.id] = {
                id: entry.id,
                name: entry.entry_name,
                manager: entry.player_first_name + " " + entry.player_last_name,
                actualWins: 0,
                actualDraws: 0,
                actualLosses: 0,
                actualPoints: 0,
                allPlayWins: 0,
                allPlayDraws: 0,
                allPlayLosses: 0,
                totalPointsScored: 0,
            };
        });

        // Process matches to get actual records and build per-gameweek scores
        const gameweekScores: Record<number, { teamId: number; points: number }[]> = {};

        matches.forEach((match: any) => {
            if (!match.finished) return;

            const gw = match.event;
            if (!gameweekScores[gw]) gameweekScores[gw] = [];

            // Add scores for All-Play calculation
            gameweekScores[gw].push({ teamId: match.league_entry_1, points: match.league_entry_1_points });
            gameweekScores[gw].push({ teamId: match.league_entry_2, points: match.league_entry_2_points });

            // Update Actual Records
            const team1 = teamStats[match.league_entry_1];
            const team2 = teamStats[match.league_entry_2];

            team1.totalPointsScored += match.league_entry_1_points;
            team2.totalPointsScored += match.league_entry_2_points;

            if (match.league_entry_1_points > match.league_entry_2_points) {
                team1.actualWins++;
                team1.actualPoints += 3;
                team2.actualLosses++;
            } else if (match.league_entry_1_points < match.league_entry_2_points) {
                team2.actualWins++;
                team2.actualPoints += 3;
                team1.actualLosses++;
            } else {
                team1.actualDraws++;
                team1.actualPoints += 1;
                team2.actualDraws++;
                team2.actualPoints += 1;
            }
        });

        // Calculate All-Play Record
        Object.values(gameweekScores).forEach((scores) => {
            scores.forEach((teamA) => {
                scores.forEach((teamB) => {
                    if (teamA.teamId === teamB.teamId) return;

                    const stats = teamStats[teamA.teamId];
                    if (teamA.points > teamB.points) {
                        stats.allPlayWins++;
                    } else if (teamA.points < teamB.points) {
                        stats.allPlayLosses++;
                    } else {
                        stats.allPlayDraws++;
                    }
                });
            });
        });

        // Convert to array and calculate ranks
        let rankings = Object.values(teamStats);

        // Sort by Actual Points for Actual Rank
        rankings.sort((a: any, b: any) => b.actualPoints - a.actualPoints || b.totalPointsScored - a.totalPointsScored);
        rankings.forEach((team: any, index) => {
            team.actualRank = index + 1;
        });

        // Sort by All-Play Wins for Power Rank
        rankings.sort((a: any, b: any) => b.allPlayWins - a.allPlayWins || b.totalPointsScored - a.totalPointsScored);
        rankings.forEach((team: any, index) => {
            team.powerRank = index + 1;
            team.luckRating = team.actualRank - team.powerRank; // Positive = Lucky (Actual is better than Power), Negative = Unlucky
        });

        return NextResponse.json({ rankings });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to calculate power rankings" }, { status: 500 });
    }
}
