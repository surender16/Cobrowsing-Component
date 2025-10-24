# ASSUMPTIONS_SYNC

This document records assumptions made while integrating the new unified `syncManager`.

1. Existing granular managers (ScrollSyncManager, PackageDetailsCoBrowseManager, ComparisonSyncService) remain for backward compatibility; new syncManager augments rather than fully replacing them in this iteration.
2. Agent is always first authoritative participant; if agent absent the customer state becomes optimistic but non-authoritative until snapshot arrives.
3. Only agent broadcasts scroll & cursor to minimize traffic. Customers can still maintain local scroll/cursor but not broadcast.
4. Package comparison selection simplified to a single `compareSet` array in shared state; conflict resolution uses last writer wins (agent authoritative on navigation fields).
5. Tests run under Node environment; React hook helper in `syncManager` guarded to avoid Node require errors.
6. Playwright e2e skeleton does not simulate actual OpenTok signaling yet; future work to inject mock session for multi-client browser contexts.
7. Sequence gap detection triggers snapshot request but snapshot response in tests is emulated manually.
8. Telemetry logs are console-only; no external metrics sink.
9. `sessionId` provided from higher level when available; if undefined actions still proceed using null sessionId for envelope until set.
10. Large payload compression omitted (optional spec) due to current payload sizes staying < 8KB.
