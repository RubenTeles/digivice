export interface Divergence {
  path: string;
  expected: unknown;
  actual: unknown;
}

export class StateComparator {
  private static isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private static collect(
    expected: unknown,
    actual: unknown,
    path: string,
    divergences: Divergence[],
  ): void {
    if (Object.is(expected, actual)) {
      return;
    }

    if (Array.isArray(expected) && Array.isArray(actual)) {
      if (expected.length !== actual.length) {
        divergences.push({
          path: `${path}.length`,
          expected: expected.length,
          actual: actual.length,
        });
      }

      const sharedLength = Math.min(expected.length, actual.length);
      for (let index = 0; index < sharedLength; index++) {
        StateComparator.collect(expected[index], actual[index], `${path}[${index}]`, divergences);
      }
      return;
    }

    if (StateComparator.isObject(expected) && StateComparator.isObject(actual)) {
      const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
      for (const key of keys) {
        StateComparator.collect(expected[key], actual[key], `${path}.${key}`, divergences);
      }
      return;
    }

    divergences.push({ path, expected, actual });
  }

  public static compare(expected: unknown, actual: unknown, rootPath: string): Divergence[] {
    const divergences: Divergence[] = [];
    StateComparator.collect(expected, actual, rootPath, divergences);
    return divergences;
  }
}
