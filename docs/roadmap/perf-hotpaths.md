# Hot-Path Performance

!!! note "Planned"
    On the roadmap, not started yet.

**Theme:** Performance · **Area:** Core

Performance pass — large-scene overrides, lazy module loading, dead-code cleanup. _(Partly done — overrides already instrumented.)_

## Phases
- Delete the old V1 view-layer-switch backup (quick win, unblocks the rest)
- Profile overrides on 100+ object scenes and optimise
- Lazy-load the batch-render and variant-switch modules on first use
