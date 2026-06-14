import { worldCup2026Matches } from "./fixtures";
import { worldCup2026SeedRuntimeSnapshot } from "./runtimeSnapshotSeed";
import { buildPublicSafeBoundedWorldState } from "./worldStateBuilder";
import type { BoundedWorldState, WorldModelRuntime } from "./worldModelTypes";

export const worldCup2026SeedWorldState: BoundedWorldState =
  buildPublicSafeBoundedWorldState({
    fixtures: worldCup2026Matches,
    snapshot: worldCup2026SeedRuntimeSnapshot,
    fallbackSnapshot: worldCup2026SeedRuntimeSnapshot,
  });

export const worldCup2026SeedRuntime: WorldModelRuntime = worldCup2026SeedWorldState.runtime;
