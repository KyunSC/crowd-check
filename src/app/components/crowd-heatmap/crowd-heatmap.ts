import { Component, computed, Input } from '@angular/core';
import { HistoryBucket, HeatmapRange } from '../../models/history-bucket';

export interface HeatmapCell {
  label: string;
  level: number;       // 0 = no data, 1/2/3
  hasData: boolean;
  tooltipText: string;
}

@Component({
  selector: 'app-crowd-heatmap',
  imports: [],
  templateUrl: './crowd-heatmap.html',
})
export class CrowdHeatmap {
  @Input() data: HistoryBucket[] = [];
  @Input() range: HeatmapRange = 'week';

  // Lookup map: "2026-03-01T14" (UTC hour prefix) → bucket
  private bucketMap = computed(() => {
    const map = new Map<string, HistoryBucket>();
    for (const b of this.data) {
      map.set(b.bucketStart.slice(0, 13), b);
    }
    return map;
  });

  cells = computed<HeatmapCell[]>(() => {
    const map = this.bucketMap();
    if (this.range === 'today') return this.buildTodayCells(map);
    if (this.range === 'week') return this.buildWeekCells(map);
    return this.buildMonthCells(map);
  });

  // Day labels: Monday → Sunday
  weekDayLabels = computed(() => {
    const labels: string[] = [];
    const now = new Date();
    const mondayOffset = -((now.getUTCDay() + 6) % 7); // offset from today to this week's Monday
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setUTCDate(now.getUTCDate() + mondayOffset + i);
      labels.push(d.toLocaleDateString([], { weekday: 'short' }));
    }
    return labels;
  });

  // Hour labels for the sidebar (06:00–23:00)
  hourLabels = Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

  // Number of columns for the CSS grid
  gridCols = computed(() => {
    if (this.range === 'today') return 24;
    if (this.range === 'week') return 7;
    return 10; // month: 10 cols × 3 rows = 30 cells
  });

  cellColor(cell: HeatmapCell): string {
    if (!cell.hasData) return 'bg-base-300';
    if (cell.level === 1) return 'bg-success';
    if (cell.level === 2) return 'bg-warning';
    if (cell.level === 3) return 'bg-error';
    return 'bg-base-300';
  }

  // Today: 24 hourly cells, from 23h ago to now (UTC)
  private buildTodayCells(map: Map<string, HistoryBucket>): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const d = new Date(now);
      d.setUTCHours(now.getUTCHours() - 23 + i, 0, 0, 0);
      const key = d.toISOString().slice(0, 13);
      const bucket = map.get(key);
      const hourLabel = `${String(d.getUTCHours()).padStart(2, '0')}:00`;
      cells.push({
        label: hourLabel,
        level: bucket ? Math.round(bucket.averageLevel) : 0,
        hasData: !!bucket,
        tooltipText: bucket
          ? `${hourLabel} UTC — Level ${Math.round(bucket.averageLevel)} (${bucket.voteCount} votes)`
          : `${hourLabel} UTC — No data`,
      });
    }
    return cells;
  }

  // Week: Monday→Sunday columns × hour rows (06:00–23:00)
  private buildWeekCells(map: Map<string, HistoryBucket>): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const now = new Date();
    const mondayOffset = -((now.getUTCDay() + 6) % 7);
    for (let h = 6; h < 24; h++) {
      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setUTCDate(now.getUTCDate() + mondayOffset + i);
        d.setUTCHours(h, 0, 0, 0);
        const key = d.toISOString().slice(0, 13);
        const bucket = map.get(key);
        const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
        const hourLabel = `${String(h).padStart(2, '0')}:00`;
        cells.push({
          label: hourLabel,
          level: bucket ? Math.round(bucket.averageLevel) : 0,
          hasData: !!bucket,
          tooltipText: bucket
            ? `${dayLabel} ${hourLabel} — Level ${Math.round(bucket.averageLevel)} (${bucket.voteCount} votes)`
            : `${dayLabel} ${hourLabel} — No data`,
        });
      }
    }
    return cells;
  }

  // Month: 30 daily cells, aggregate hourly buckets per day on the client
  private buildMonthCells(map: Map<string, HistoryBucket>): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const now = new Date();
    for (let dayOffset = -29; dayOffset <= 0; dayOffset++) {
      const d = new Date(now);
      d.setUTCDate(now.getUTCDate() + dayOffset);
      const dayPrefix = d.toISOString().slice(0, 10); // "2026-03-01"
      let sum = 0;
      let count = 0;
      let totalVotes = 0;
      for (let h = 0; h < 24; h++) {
        const key = `${dayPrefix}T${String(h).padStart(2, '0')}`;
        const bucket = map.get(key);
        if (bucket) {
          sum += bucket.averageLevel;
          count++;
          totalVotes += bucket.voteCount;
        }
      }
      const dayLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const avgLevel = count > 0 ? Math.round(sum / count) : 0;
      cells.push({
        label: dayLabel,
        level: avgLevel,
        hasData: count > 0,
        tooltipText: count > 0
          ? `${dayLabel} — Avg level ${avgLevel} (${totalVotes} votes)`
          : `${dayLabel} — No data`,
      });
    }
    return cells;
  }
}
