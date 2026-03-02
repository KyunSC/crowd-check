export type HeatmapRange = 'today' | 'week' | 'month';

export interface HistoryBucket {
  // ISO UTC string WITHOUT trailing Z (as serialized by .NET System.Text.Json)
  // e.g. "2026-03-01T14:00:00" — use .slice(0, 13) as map key to avoid timezone issues
  bucketStart: string;
  averageLevel: number; // raw float 1.0–3.0, not rounded
  voteCount: number;
}
