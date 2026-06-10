---
title: 2020 Census Technology Platform
summary: Senior Pega architect on the technology stack behind the 2020 U.S. Census — Google Maps property-change detection, multi-channel (online/mail/IVR) survey delivery, and a manager-plus-canvasser mobile platform with GPS, address mapping, and multilingual interviews — cutting the field workforce from 500–600K to under 300K.
tech: ["Pega", "Google Maps API", "Mobile (GPS / Tablet)", "Multi-Channel Survey", "Geospatial"]
role: Senior Pega Architect
timeframe: "2016 – 2018"
order: 6
---

## Problem

The 2020 census had to locate every U.S. property where people might live and
then reach every household — a logistics problem at national scale. Historically
it took an army of 500,000–600,000 contractors going door to door, and roughly
10–20% of properties change over a decade (new construction, demolitions,
rezoning), so the address list itself had to be re-verified first.

## What I built

Starting in 2016 in Washington, DC, I worked as a Pega architect on the platform
that powered the count. The system used Google Maps comparison against the 2010
data to flag which properties were new, changed, or unchanged — cutting manual
review before a canvasser hit the street. Outreach went digital-first: mailers
with survey links, email invitations, and an automated phone option, with
response tracked by address, neighborhood, and region. For non-responders, a
manager desktop app divided regions and assigned work while a field mobile app
combined GPS, address mapping, and a structured, multilingual interview workflow.

## Outcome

The field workforce dropped from 500,000–600,000 to under 300,000 — a more than
50% reduction — and the platform was built to be extensible enough to carry into
future censuses instead of being rebuilt each decade.
