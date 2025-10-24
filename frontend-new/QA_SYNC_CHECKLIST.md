# QA Sync Checklist

Manual verification steps for synchronization stability.

1. Call Establishment
   - Start agent page, accept call. Confirm `[sync] Agent syncManager initialized` in console.
   - Start customer page, join call. Confirm snapshot request followed by snapshot application log.
2. Navigation
   - Agent navigates between catalog/detail/compare/payment views. Customer mirrors view each time.
3. Scroll Sync
   - In a scrollable list (catalog), scroll as agent; customer position matches approximate region.
4. Cursor Presence
   - Agent moves cursor rapidly; customer sees cursor updates without jitter (<=30fps). Stop movement; cursor disappears after ~5s.
5. Package Selection
   - Agent selects packages for comparison; compareSet identical on customer. Customer attempts selection; local UI updates but authoritative compareSet reflects agent decisions after next delta.
6. Comparison Modal
   - Open comparison on agent; customer auto-opens within snapshot/delta cycle.
7. Detail Actions
   - Agent performs detail metadata changes (e.g., tab change). Customer metadata updates.
8. Payment Step
   - Agent advances payment step; customer payment view updates. Customer attempt to change step is ignored.
9. Reconnect
   - Simulate customer network drop (offline in dev tools) then restore. Customer requests snapshot and state realigns.
10. Sequence Gap
   - Using dev tools, throttle network to cause dropped delta; verify `[sync-telemetry] seq_gap` and subsequent snapshot request.
11. Telemetry
   - Observe `[sync-telemetry] delta_retry` logs when temporarily blocking ACK (simulate by blocking customer console processing).
12. Cleanup
   - End call; verify `syncManager.shutdown()` executed (no further heartbeat logs).

Record any deviations with timestamp and console excerpts for triage.
