---
title: "Before Progressive Thought of It"
---

# Before Progressive Thought of It

Every insurance broker knows the drill. A customer walks in wanting a quote. You take down their information — name, address, vehicle, coverage history, policy preferences — and then you do it again for the next carrier. And again. And again. The same data, entered by hand, into every insurance company's system, one at a time, just to give the customer a comparison they could have used ten minutes ago.

BCF looked at that problem and saw a business.

The company was small — 35 people, 10 of them developers — but what they were building was years ahead of where the industry thought it was going. Their software would take a customer's information once, and then go get quotes from multiple insurance carriers simultaneously, returning real-time comparisons in a single interface. One entry. Many quotes. Instant comparison.

A few years later, Progressive would make this idea famous. BCF was already working on it.

---

## The Wild West of Web Integration

The technical challenge wasn't the concept — it was the reality of connecting to insurance carriers in an era when "web standards" was still more aspiration than fact.

The lucky integrations had XML web services. BCF's software would send a structured REST or XML call, get a structured response back, and parse the quote cleanly. The ACORD standard — the insurance industry's XML specification for policy and customer data — gave the team a common language to work with. Once Sonny and the team became fluent in ACORD's structure, they could build connectors systematically, mapping customer information to the fields each carrier needed and pulling quotes back in a consistent format.

But not every carrier was that cooperative.

Some were still running websites built with what could generously be called a Wild West approach to front-end development — inconsistent markup, unpredictable layouts, no API in sight. For those, the only option was screen scraping: programmatically navigating the carrier's website, filling in form fields, and extracting the quote from whatever HTML came back.

Screen scraping works until the website changes. And websites always change.

The instability was constant. A carrier would update their front end, and an integration that worked perfectly yesterday would silently break overnight. The team had to maintain connectors that were, by nature, fragile — dependent on implementation details the carriers had no obligation to keep stable. Some scrapers were straightforward. Others were genuinely complex puzzles that required reverse-engineering the structure of pages built by developers who'd never imagined anyone would be reading their HTML programmatically.

It required both technical discipline and relentless vigilance.

---

## What a Small Team Feels Like

There's something different about a 35-person company. The energy moves faster. Decisions get made in a hallway conversation instead of a three-week approval chain. Everyone knows what everyone else is working on. When something ships, the whole room feels it.

Sonny had worked at larger shops before. The intimacy of BCF was a contrast he noticed — and valued. Ten developers, all close, all moving in the same direction toward a product that genuinely hadn't existed before. There's a particular kind of momentum that only a small, tight team can generate. It's harder to manufacture at scale, and it's easy to take for granted until it's gone.

---

## The Acquisition

It didn't take long for the industry to notice what BCF had built.

A larger company — believed to be Vertafore — came calling. Thirty-five people had built real-time comparative insurance quoting before it was a mainstream idea, and the product was compelling enough that an acquisition made sense. Bob, Chuck, and Fred — the three founders — negotiated the deal, and they were well taken care of.

Everyone else was offered a choice: take a pay cut and stay, or leave.

Most left.

It's a familiar story in the startup world, and it doesn't make the technical achievement any less real. BCF had identified a genuine gap, built something that worked, and validated the idea well enough that a bigger player wanted to own it. That's the definition of a successful product.

What it wasn't was a team outcome. The people who built it didn't share in what it was worth.

---

*BCF taught Sonny what a startup at its best could feel like — fast, energetic, and close. And what an acquisition without equity looks like for the people who did the work.*
