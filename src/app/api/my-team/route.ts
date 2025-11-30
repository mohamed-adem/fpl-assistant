import { NextResponse } from "next/server";
import { getBootstrapStatic, getLeagueElementStatus, getLeagueDetails } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId");
    const teamId = searchParams.get("teamId");
    const sort = searchParams.get("sort") || "form"; // 'form' or 'ep_next'

    if (!leagueId || !teamId) {
        return NextResponse.json({ error: "League ID and Team ID are required" }, { status: 400 });
    }

    try {
        const [staticData, elementStatus, leagueDetails] = await Promise.all([
            getBootstrapStatic(),
            getLeagueElementStatus(leagueId),
            getLeagueDetails(leagueId)
        ]);

        // Map the received teamId (which is league_entry_id) to entry_id (which is used in element_status)
        const teamEntry = leagueDetails.league_entries.find((entry: any) => entry.id === parseInt(teamId));
        const realOwnerId = teamEntry ? teamEntry.entry_id : parseInt(teamId);

        // 1. Identify Owned Players
        const myPlayerIds = new Set(
            elementStatus
                .filter((status) => status.owner === realOwnerId)
                .map((status) => status.element)
        );

        const allOwnedPlayerIds = new Set(
            elementStatus
                .filter((status) => status.owner !== null)
                .map((status) => status.element)
        );

        // 2. Get My Squad Details
        const mySquad = staticData.elements.filter((p) => myPlayerIds.has(p.id));

        // 3. Find Free Agents
        const freeAgents = staticData.elements.filter(
            (p) => !allOwnedPlayerIds.has(p.id) && p.status !== "u"
        );

        // 4. Generate Recommendations
        const recommendations = mySquad.map((player) => {
            // Helper to get value based on sort criteria
            const getValue = (p: any) => sort === "ep_next" ? (parseFloat(p.ep_next) || 0) : parseFloat(p.form);

            // Find better free agents in same position
            const upgrades = freeAgents
                .filter((agent) =>
                    agent.element_type === player.element_type && // Same position
                    getValue(agent) > getValue(player) && // Better stats
                    agent.chance_of_playing_next_round !== 0 // Available
                )
                .sort((a, b) => getValue(b) - getValue(a)) // Sort by criteria
                .slice(0, 3); // Top 3

            return {
                player,
                upgrades,
            };
        });

        // Sort by "Weakest Link" (lowest value first)
        recommendations.sort((a, b) => {
            const valA = sort === "ep_next" ? (parseFloat(a.player.ep_next) || 0) : parseFloat(a.player.form);
            const valB = sort === "ep_next" ? (parseFloat(b.player.ep_next) || 0) : parseFloat(b.player.form);
            return valA - valB;
        });

        // 5. Lineup Optimizer
        // Sort squad by expected points (ep_next) descending
        const sortedSquad = [...mySquad].sort((a, b) => {
            const epA = parseFloat(a.ep_next) || 0;
            const epB = parseFloat(b.ep_next) || 0;
            return epB - epA;
        });

        // Separate by position
        const gks = sortedSquad.filter(p => p.element_type === 1);
        const defs = sortedSquad.filter(p => p.element_type === 2);
        const mids = sortedSquad.filter(p => p.element_type === 3);
        const fwds = sortedSquad.filter(p => p.element_type === 4);

        // Select Starting XI (1 GK, min 3 DEF, min 2 MID, min 1 FWD, max 11 total)
        const startingXI: typeof mySquad = [];

        // 1. Must have exactly 1 GK
        if (gks.length > 0) startingXI.push(gks[0]);

        // 2. Must have at least 3 Defenders
        const startingDefs = defs.slice(0, 3);
        startingXI.push(...startingDefs);

        // 3. Must have at least 2 Midfielders
        const startingMids = mids.slice(0, 2);
        startingXI.push(...startingMids);

        // 4. Must have at least 1 Forward
        const startingFwds = fwds.slice(0, 1);
        startingXI.push(...startingFwds);

        // 5. Fill remaining spots (11 - current count) with highest EP players
        // Exclude backup GKs from the pool
        const remainingPool = [
            ...defs.slice(3),
            ...mids.slice(2),
            ...fwds.slice(1)
        ].sort((a, b) => (parseFloat(b.ep_next) || 0) - (parseFloat(a.ep_next) || 0));

        const spotsRemaining = 11 - startingXI.length;
        startingXI.push(...remainingPool.slice(0, spotsRemaining));

        // Identify Captain and Vice Captain
        // Sort starting XI by EP to find captain
        const sortedXI = [...startingXI].sort((a, b) => (parseFloat(b.ep_next) || 0) - (parseFloat(a.ep_next) || 0));
        const captain = sortedXI[0];
        const viceCaptain = sortedXI[1];

        // Calculate Bench
        const startingXIIds = new Set(startingXI.map(p => p.id));
        const bench = mySquad.filter(p => !startingXIIds.has(p.id));

        // Sort bench: GK first, then by EP
        bench.sort((a, b) => {
            if (a.element_type === 1 && b.element_type !== 1) return -1;
            if (a.element_type !== 1 && b.element_type === 1) return 1;
            return (parseFloat(b.ep_next) || 0) - (parseFloat(a.ep_next) || 0);
        });

        return NextResponse.json({
            squad: recommendations,
            optimalLineup: {
                startingXI,
                bench,
                captain,
                viceCaptain
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
    }
}
