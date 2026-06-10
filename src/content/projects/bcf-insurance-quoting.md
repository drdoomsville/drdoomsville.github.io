---
title: Real-Time Comparative Insurance Quoting
summary: Engineer at a 35-person startup (10 developers) building real-time multi-carrier insurance comparison years before Progressive popularized it — one customer entry, simultaneous quotes from many carriers via ACORD-standard XML integrations and resilient screen-scraping connectors for carriers without APIs.
tech: ["ACORD XML", "REST / XML Web Services", "Screen Scraping", "Carrier Integrations"]
role: Software Engineer
timeframe: "2005"
---

## Problem

To compare insurance quotes, brokers re-entered a customer's full profile into
each carrier's system, one at a time — the same data, by hand, for every carrier,
just to produce a comparison.

## What I built

At BCF — 35 people, 10 of them developers — I built connectors that took the
customer's information once and pulled real-time quotes from many carriers at
once. Where carriers were cooperative, integrations spoke the insurance
industry's ACORD XML standard over REST/XML web services for clean, structured
quotes. Where they weren't, the only option was screen scraping — programmatically
driving the carrier's site and extracting quotes from the returned HTML — which
broke whenever a carrier changed their front end and demanded constant vigilance
to keep alive.

## Outcome

A 35-person team shipped real-time comparative quoting before it was a mainstream
idea — compelling enough that a larger player (believed to be Vertafore) acquired
it. A few years later, Progressive made the same idea famous.
