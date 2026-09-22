---
icon: material/backup-restore
---

# Recover Your Take Organisation

When the tree has gone flat, or the panel is locked and asking you something.

1. Read the block at the top of the Takes panel. It is waiting for an answer.
2. Change nothing in the tree yet.
3. Click **{{ op('tks.restore_store_snapshot').bl_label }}** to put your groups, tags, rules and variants back.
4. Or click **{{ op('tks.dismiss_store_notice').bl_label }}** if you meant to lose them.

You now have your organisation back, and the panel unlocks.

!!! warning "Answer before you reorganise"
    Until you answer, the tree on screen is a rebuild. Anything you tidy up now
    gets replaced by the restore.

??? info "Why this happens"
    Your takes, groups, tags, rules and variants ride on a **World** inside the
    `.blend`, which keeps them with the file. Delete or purge that World — a
    cleanup, a script, a purge that takes the last one — and the organisation
    goes with it.

    Your takes themselves are View Layers, so they survive. It is the grouping
    you are recovering.

    Takes keeps a safety copy on disk as you work and usually puts it back on
    its own. It only asks when it cannot decide, or when **Confirm Before
    Restoring** is on under *Preferences ▸ Data*.

    Keep at least one World in the file and this never comes up.

## :material-cached: The panel is locked, with no question

That is a different lock. A file saved by an older add-on version holds the panels shut so nothing shows you stale data.

1. Open the lock card at the top of the panel.
2. Click **{{ op('tks.rebuild_cache').bl_label }}** to clear the caches and start fresh.
3. Or click **{{ op('tks.cache_unlock').bl_label }}** to carry on without rebuilding.

??? info "What Rebuild Cache touches"
    Only the add-on's own caches and the version stamp in the open file. Your
    scene data is never rewritten, and your preferences are untouched.

    It re-enables the add-on, so expanded panels reset. Unlocking without
    rebuilding leaves the file marked, so the warning returns next time.

Full reference: [Data Tab](../preferences/data.md#snapshots) · [Advanced](../preferences/advanced.md#rebuild-cache)
