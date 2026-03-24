export type ISODateTime = string;

export type StandingRow = {
  pos: number;
  team: string;
  players?: string;
  played?: number;
  wins?: number;
  losses?: number;
  points?: number;
  kills?: number;
};

export type Tournament = {
  id: string;
  name: string;
  season?: string;
  status: "active" | "upcoming" | "finished";
  startsAt?: ISODateTime;
  standings: StandingRow[];
};

export type Scrim = {
  id: string;
  name: string;
  status: "active" | "upcoming" | "finished";
  startsAt?: ISODateTime;
  standings: StandingRow[];
};

export type PlayerKillsRow = {
  pos: number;
  player: string;
  team?: string;
  kills: number;
  matches?: number;
};

export type TeamRankingRow = {
  pos: number;
  team: string;
  players?: string;
  points?: number;
  kills?: number;
  matches?: number;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  startsAt: ISODateTime;
  subtitle?: string;
};

export type UpcomingVersus = {
  id: string;
  teamA: string;
  teamB: string;
  startsAt?: ISODateTime;
};

export type Clan = {
  id: string;
  name: string;
};

export type PublicState = {
  updatedAt: ISODateTime;
  activeTournament?: Tournament;
  activeScrim?: Scrim;
  topPlayerKills: PlayerKillsRow[];
  topTeams: TeamRankingRow[];
  upcomingScrims: UpcomingEvent[];
  upcomingTournaments: UpcomingEvent[];
  upcomingVersus: UpcomingVersus[];
  clanes: Clan[];
};

