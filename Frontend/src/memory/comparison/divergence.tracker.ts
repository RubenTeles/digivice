import type { Divergence } from "@/memory/comparison/state.comparator";

export interface DivergenceChanges {
  reported: Divergence[];
  resolved: string[];
}

export class DivergenceTracker {
  private readonly threshold: number;
  private readonly consecutiveCounts = new Map<string, number>();
  private readonly reportedPaths = new Set<string>();

  public constructor(threshold: number) {
    if (!Number.isInteger(threshold) || threshold < 1) {
      throw new RangeError(`Threshold must be a positive integer. Got ${threshold}.`);
    }

    this.threshold = threshold;
  }

  public update(divergences: Divergence[]): DivergenceChanges {
    const reported: Divergence[] = [];
    const currentPaths = new Set<string>();

    for (const divergence of divergences) {
      currentPaths.add(divergence.path);
      const count = (this.consecutiveCounts.get(divergence.path) ?? 0) + 1;
      this.consecutiveCounts.set(divergence.path, count);

      if (count === this.threshold) {
        this.reportedPaths.add(divergence.path);
        reported.push(divergence);
      }
    }

    const resolved: string[] = [];
    for (const path of this.consecutiveCounts.keys()) {
      if (currentPaths.has(path)) {
        continue;
      }

      this.consecutiveCounts.delete(path);
      if (this.reportedPaths.delete(path)) {
        resolved.push(path);
      }
    }

    return { reported, resolved };
  }
}
