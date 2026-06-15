# CRASH-06 v2 — More Crash Checks

!!! note "Planned"
    On the roadmap, not started yet.

**Theme:** Quality · **Area:** Audit

Static-analysis checks that catch six more crash-prone code patterns before release.

## Phases
- Depsgraph reentrancy detector
- Binding-owner refinement (fewer false alarms)
- Msgbus notify detector
- Area-type context detector
- Operator-override detector
- Undo/redo teardown detector
- Runtime smoke-test harness
