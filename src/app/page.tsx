"use client";

import { useState, useEffect } from "react";
import { LeagueInput } from "@/components/LeagueInput";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [leagueId, setLeagueId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedId = localStorage.getItem("fpl_league_id");
    if (savedId) {
      setLeagueId(savedId);
    }
  }, []);

  const handleLogin = (id: string) => {
    setLeagueId(id);
    localStorage.setItem("fpl_league_id", id);
  };

  const handleLogout = () => {
    setLeagueId(null);
    localStorage.removeItem("fpl_league_id");
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="relative z-10">
        {leagueId ? (
          <Dashboard leagueId={leagueId} onLogout={handleLogout} />
        ) : (
          <LeagueInput onSubmit={handleLogin} />
        )}
      </div>
    </main>
  );
}
