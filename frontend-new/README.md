# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Synchronization Architecture (POC)

The application uses OpenTok signals as the sole realtime transport. A unified `syncManager` (`src/sync/syncManager.js`) maintains an authoritative agent-owned shared state and delivers ordered deltas to the customer. Key points:

### State Model

```javascript
sharedState = {
  sessionId, seq, lastUpdatedBy,
  view, viewParams,
  sharedPackages: [],
  selection: { userSelections: {agent:[], customer:[]}, compareSet: [] },
  scrollPositions: { containerId: { percentY, percentX } },
  cursors: { userId: { xPercent, yPercent, lastSeenSeq, ts } },
  metadata: { paymentStep, detail: {...} }
}
```

### Message Envelope

`{ type:"SYNC", op:"DELTA|SNAPSHOT|ACK|REQ_SNAPSHOT|HEARTBEAT|CURSOR|SCROLL", sessionId, seq, payload, timestamp, clientId }`

### Reliability

Agent assigns increasing `seq` per DELTA, expects ACK; missing ACK triggers exponential retry (1.5s base, 3 max). Customer detects gaps and requests `REQ_SNAPSHOT`. Agent periodically broadcasts `SNAPSHOT` every 30s for resilience & late joiners.

### Scroll & Cursor

Positions normalized to percentages; agent broadcasts throttled scroll (~10/sec) and cursor (up to 30fps via rAF). Presence prunes cursors older than 5s.

### Actions

Typed action constants (NAVIGATE, SELECT/UNSELECT, COMPARE_SELECT, DETAIL_ACTION, PAYMENT_STEP, SHARE_PACKAGES, SCROLL, CURSOR). Agent-only modifications are blocked on customer.

### Testing

Run unit tests: `npm run test:sync`
Run e2e skeleton: `npm run e2e:local` (ensure `npm run dev` running first)

### QA Checklist

1. Start agent & customer sessions; customer should auto request snapshot and align view.
2. Navigate catalog->detail->compare on agent; verify customer tracks view each time.
3. Scroll a long list on agent; observe mirrored scroll position (percentage) on customer.
4. Move agent cursor; presence dot appears and fades after inactivity.
5. Select packages for comparison; compareSet stays identical on both sides.
6. Simulate disconnect (network offline) then reconnect; customer requests snapshot and resyncs.
7. Force gap (skip seq) by temporarily throttling network (dev tools) – customer requests snapshot.
8. Payment step progression reflects instantly for customer; customer attempt to change step is rejected silently (log shows warning).

### Telemetry

Console events prefixed `[sync-telemetry]` report retries, drops, gaps.

### Consolidation Status

Legacy managers (ComparisonSyncService, PackageDetailsCoBrowseManager, ScrollSyncManager, signal-based comparison/package detail handlers) have been consolidated into the unified `syncManager`. Remaining legacy classes now act only as thin compatibility wrappers or are bypassed entirely. All new realtime features should use `syncManager.applyLocalAction` or the convenience wrappers (navigate, selectPackage, toggleCompare, detailAction, scroll, cursor). Direct `session.signal` usage for UI sync should be considered deprecated and removed in future cleanup.
