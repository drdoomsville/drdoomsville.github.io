---
title: Payments API
summary: A resilient payments service handling settlement, retries, and reconciliation.
tech: ["Java", "Kafka", "PostgreSQL"]
role: Backend engineer
timeframe: "2022"
featured: false
order: 3
---

## Problem

<!-- TODO(content): describe the real problem this solved. -->
Payment settlement was slow and occasionally double-charged on retries.

## What I built

An idempotent settlement pipeline with an event log, exactly-once processing
guarantees, and automated reconciliation reports.

## Outcome

Eliminated double-charges and cut p99 settlement time by 40%.
