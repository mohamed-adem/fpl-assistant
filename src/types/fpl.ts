export interface LeagueDetails {
  league: {
    id: number;
    name: string;
    scoring: string;
    size: number;
    type: string;
  };
  standings: {
    league_id: number;
    matches_played: number;
    matches_won: number;
    matches_drawn: number;
    matches_lost: number;
    points_for: number;
    points_against: number;
    points_total: number;
    rank: number;
    rank_sort: number;
    total: number;
    entry_id: number;
    entry_name: string;
    player_name: string;
  }[];
  league_entries: {
    id: number;
    entry_id: number;
    entry_name: string;
    player_first_name: string;
    player_last_name: string;
    short_name: string;
    waiver_pick: number;
  }[];
}

export interface Player {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  status: string; // "a" = available, "d" = doubtful, "i" = injured
  now_cost: number;
  total_points: number;
  points_per_game: string;
  form: string;
  ep_next: string; // Expected points next gameweek
  ict_index: string;
  influence: string;
  creativity: string;
  threat: string;
  news: string;
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
}

export interface BootstrapStatic {
  elements: Player[];
  teams: {
    id: number;
    name: string;
    short_name: string;
  }[];
  events: {
    id: number;
    name: string;
    deadline_time: string;
    is_current: boolean;
    is_next: boolean;
  }[];
}

export interface ElementStatus {
  status: string; // "a" = available, "u" = unavailable (owned)
  owner: number | null; // entry_id of owner
  element: number; // player_id
}

export interface Recommendation {
  player: Player;
  upgrades: Player[];
}

export interface OptimalLineup {
  startingXI: Player[];
  bench: Player[];
  captain: Player;
  viceCaptain: Player;
}
