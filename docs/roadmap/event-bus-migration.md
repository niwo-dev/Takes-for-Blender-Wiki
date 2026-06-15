# Event-Bus Migration

!!! note "Planned"
    On the roadmap, not started yet.

**Theme:** Architecture · **Area:** Core

Decouple modules through the shared event bus, and add test coverage. _(Partly done — bus built, cascade → inspector already moved.)_

## Phases
- ✓ Build the event bus
- ✓ Move cascade → inspector onto the bus
- Migrate the remaining direct refresh calls
- Finish or remove 2 half-migrated signals
- Add bus tests
