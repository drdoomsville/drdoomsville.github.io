---
title: Realtime Sync Engine
summary: A conflict-free sync layer that keeps clients consistent offline and online.
tech: ["TypeScript", "WebSockets", "CRDTs", "PostgreSQL"]
role: Lead engineer
timeframe: "2024"
featured: true
order: 1
repo: https://github.com/your-handle/realtime-sync
---

## Problem

<!-- TODO(content): describe the real problem this solved. -->
Teams needed edits to merge cleanly across devices without a central lock.

## What I built

A CRDT-based sync engine with a thin WebSocket transport and a Postgres-backed
durable log. Clients apply changes optimistically and reconcile on reconnect.

## Outcome

Reduced sync conflicts to near zero and cut median sync latency to under 80ms.
