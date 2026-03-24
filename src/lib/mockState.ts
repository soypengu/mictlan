import type { PublicState } from "@/lib/types";

export const mockState: PublicState = {
  updatedAt: new Date().toISOString(),
  activeTournament: {
    id: "t-2025-01",
    name: "Torneo Mictlán 2025",
    season: "Temporada 1",
    status: "active",
    startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    standings: [
      {
        pos: 1,
        team: "Kukulcán",
        players: "Náhuatl, Citlali, Tecpatl, Xihuitl",
        played: 6,
        wins: 5,
        losses: 1,
        points: 48,
        kills: 92,
      },
      { pos: 2, team: "Xólotl", players: "Tecuani, Metztli, Atl, Yaotl", played: 6, wins: 4, losses: 2, points: 41, kills: 80 },
      { pos: 3, team: "Quetzal", players: "Ixchel, Olin, Tlaloc, Itzel", played: 6, wins: 3, losses: 3, points: 35, kills: 70 },
      { pos: 4, team: "Mictlán", played: 6, wins: 2, losses: 4, points: 28, kills: 58 },
      { pos: 5, team: "Jaguar", played: 6, wins: 1, losses: 5, points: 19, kills: 44 },
    ],
  },
  activeScrim: {
    id: "s-2025-07",
    name: "Scrims Semana 7",
    status: "active",
    startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    standings: [
      { pos: 1, team: "Kukulcán", players: "Náhuatl, Citlali, Tecpatl, Xihuitl", played: 4, points: 32, kills: 61 },
      { pos: 2, team: "Xólotl", players: "Tecuani, Metztli, Atl, Yaotl", played: 4, points: 29, kills: 54 },
      { pos: 3, team: "Quetzal", players: "Ixchel, Olin, Tlaloc, Itzel", played: 4, points: 25, kills: 49 },
      { pos: 4, team: "Mictlán", played: 4, points: 21, kills: 42 },
      { pos: 5, team: "Jaguar", played: 4, points: 18, kills: 35 },
    ],
  },
  topPlayerKills: [
    { pos: 1, player: "Náhuatl", team: "Kukulcán", kills: 42, matches: 6 },
    { pos: 2, player: "Tecuani", team: "Xólotl", kills: 39, matches: 6 },
    { pos: 3, player: "Ixchel", team: "Quetzal", kills: 33, matches: 6 },
    { pos: 4, player: "Chicome", team: "Mictlán", kills: 28, matches: 6 },
    { pos: 5, player: "Ocelotl", team: "Jaguar", kills: 25, matches: 6 },
  ],
  topTeams: [
    { pos: 1, team: "Kukulcán", players: "Náhuatl, Citlali, Tecpatl, Xihuitl", points: 48, kills: 92, matches: 6 },
    { pos: 2, team: "Xólotl", players: "Tecuani, Metztli, Atl, Yaotl", points: 41, kills: 80, matches: 6 },
    { pos: 3, team: "Quetzal", players: "Ixchel, Olin, Tlaloc, Itzel", points: 35, kills: 70, matches: 6 },
    { pos: 4, team: "Mictlán", points: 28, kills: 58, matches: 6 },
    { pos: 5, team: "Jaguar", points: 19, kills: 44, matches: 6 },
  ],
  upcomingScrims: [
    {
      id: "us-1",
      title: "Scrims Noche",
      subtitle: "Bo6 · Lobby competitivo",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: "us-2",
      title: "Scrims Fin de Semana",
      subtitle: "Bo8 · Open",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 74).toISOString(),
    },
  ],
  upcomingTournaments: [
    {
      id: "ut-1",
      title: "Copa Ancestral",
      subtitle: "Clasificatorio",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: "ut-2",
      title: "MICTLAN Masters",
      subtitle: "Main event",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    },
  ],
  upcomingVersus: [{ id: "pv-1", teamA: "Equipo A", teamB: "Equipo B" }],
  clanes: [
    { id: "c-1", name: "Kukulcán" },
    { id: "c-2", name: "Xólotl" },
  ],
};

