---
title: Testing Visual Basic 4.0 at Microsoft
summary: Software Engineer in Test on the VB 4.0 forms/UI layer, building a self-healing distributed test lab that ran thousands of automated cases.
tech: ["Visual Basic 4.0", "Test Automation", "Distributed Test Harness", "Windows 95"]
role: Software Engineer in Test
timeframe: "1993 – 1995"
order: 8
---

## Problem

Microsoft was preparing to ship Visual Basic 4.0 — a flagship product meant to bring
Windows development to a new generation. A 50+ developer team needed certainty that the
forms and UI layer, the part developers touch every day, worked across thousands of
conditions. Manual testing couldn't cover that surface or survive the crashes of the
Windows 95 era.

## What I built

As one of a 10–15 person test team, I built and ran automated tests for the VB 4.0
forms/UI layer — written in Visual Basic 4.0 itself, so the product was its own proof of
concept. The lab ran like a classroom: a central "teacher" server enrolled idle client
machines, distributed a curriculum of 30+ suites and thousands of cases (regression,
boundary, and negative tests), and collected pass/fail scores. When a client hung or
blue-screened, the teacher detected the silence, hard-rebooted and reimaged it, and kept
going — failures absorbed by design.

## Outcome

Visual Basic 4.0 shipped on time and became a commercial success that helped cement
Microsoft's lead in developer tools through the late 1990s. The work set the foundation
for how I think about testing and scale: structured test plans, rigorous documentation,
and systems built to absorb failure and keep moving.
