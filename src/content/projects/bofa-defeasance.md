---
title: Commercial Loan Defeasance Engine
summary: Two-person build (with a former Lockheed Skunk Works engineer) of a recursive bond-optimization engine that swaps commercial-loan collateral for a precisely structured portfolio of T-bills, notes, and bonds — holding payment coverage inside a narrow threshold across a $236B loan portfolio.
tech: ["Recursive Optimization", "MVC Architecture", "U.S. Treasury Securities", "Financial Algorithms"]
role: Software Engineer (Contract)
timeframe: "Mid-2000s"
order: 9
---

## Problem

When a bank holds a large commercial loan, it sometimes wants to free the capital
backing it without paying it off — by swapping the collateral for a stream of
guaranteed government income (T-bills, notes, bonds) structured so the interest
covers each monthly payment *exactly*. Too little coverage means penalties; too
much triggers tax and admin cost. And it isn't static: principal amortizes,
interest accrues daily, and the security mix must be rebalanced for the life of
the loan.

## What I built

The team was two people. George Russell — a former Lockheed Skunk Works engineer
— owned the financial model and optimization logic; I built the lean MVC codebase
and the recursive optimizer at its core, which explored security combinations
200–300 levels deep to find the mix that covered a loan's schedule within
threshold. It ran against a $236B commercial-loan portfolio. At contract end I
did a full knowledge transfer of the code, architecture, and algorithm.

## Outcome

A clean handoff with the Bank of America team fully equipped to run it — proof
that a small team with complementary skills and a clear problem can move
nine-figure complexity without layers of process in between.
