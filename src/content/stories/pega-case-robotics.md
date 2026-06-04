---
title: "The Situational Layer Cake"
---

# The Situational Layer Cake

There's a particular kind of professional who thrives in consulting: someone who can walk into a room of strangers, earn their trust fast, understand a problem they've never seen before, and start building a solution before the jet lag wears off. Someone who can be the developer, the analyst, the requirements manager, the sales voice, and the support desk — sometimes in the same afternoon.

That's what Pegasystems needed. That's what Sonny became.

---

## Certification and the Layered Cake

Pegasystems — Pega, to anyone who's worked with it — is a Boston-based consulting and software firm built around a powerful idea: enterprise workflow automation, low-code and highly configurable, designed to let large organizations model and manage complex business processes without rebuilding from scratch every time. They called their architecture the "situational layered cake" — a system of reusable, composable layers where configuration sat on top of configuration, and consultants with the right expertise could shape it to almost any business problem.

The first stop was Boston. Weeks of training, certification exams, immersion in the Pega platform's logic and tooling. Once certified, you were a Pega Systems Architect — and then they pointed you at a client.

---

## Toronto: A Hundred Consultants and a Bank to Onboard

The first client was CIBC — one of Canada's largest banks, headquartered in Toronto. Sonny flew there every week for a year.

The project was enormous. Over a hundred consultants on-site at peak, all working on a single mission: rebuild the software that onboarded new customers. Whether a customer walked into a branch, called on the phone, or landed on the website, the system had to meet them there — collecting personal, financial, and account information through a unified, seamless experience and getting them from prospect to customer without friction.

Underneath the onboarding flow ran something more sophisticated: AI-driven decisioning and predictive analytics. Which customers were most likely to churn? Which offers should appear at the moment of onboarding? Which campaigns should be triggered based on a customer's profile? The system wasn't just collecting information — it was making real-time recommendations designed to increase retention and revenue from the first interaction.

A hundred consultants. A major bank. A workflow so large it required an army to build it.

---

## Seattle: Turning Excel Into Accountability

T-Mobile brought a different kind of problem.

When a T-Mobile customer returned a damaged phone at a store, a complex logistics chain kicked off: the phone shipped to a triage center, where it was disassembled and assessed. A refurbished replacement — same model or comparable — shipped back to the customer. The original phone was then evaluated for salvage, repair, or disposal, and routed to one of roughly twenty vendors capable of handling the work.

T-Mobile was managing all of this with Excel spreadsheets.

The challenge wasn't just the volume — it was traceability. Every phone has an IMEI number, a unique hardware identifier that follows the device through its entire life. As phones moved through triage, repair, refurbishment, and redistribution across dozens of vendors and hundreds of locations, that IMEI had to be tracked accurately at every step. Spreadsheets couldn't hold that complexity reliably. Things fell through the cracks.

Pega could — and did. The new system turned a fragile manual tracking process into structured, auditable vendor management that could scale with T-Mobile's repair volume.

---

## Kansas: Sprint and the Campaign Machine

Sprint needed help with campaigns — the promotional offers and new customer incentives that drove phone sales. Pega's decisioning capabilities fit the problem cleanly, and Sonny and the team built the workflow infrastructure to manage how those campaigns were structured, triggered, and delivered.

It was a focused engagement: a specific problem, a specific solution, and on to the next.

---

## The RPA Chapter: Promise, Misuse, and a Foot in the Door

Around this time, Pega acquired an RPA company — Robotic Process Automation — and added it to their platform. The product was built on .NET, which was notable given that everything else in the Pega ecosystem ran on Java. It looked and felt like Visual Studio: code-adjacent, structured, precise.

RPA's genuine strength was in the gaps. Large enterprises are riddled with legacy systems, small vendors, and internal tools that never got APIs or SDKs. Before the era of universal web services, getting data out of these systems programmatically ranged from difficult to impossible. RPA filled that gap by interacting with applications at the object level — reading properties and methods from UI controls rather than scraping raw screen pixels. It was more reliable than old-school screen scraping, though it carried the same fundamental brittleness: when the underlying application changed, the automation broke.

Used appropriately — for targeted, bounded tasks where no better integration path existed — RPA was genuinely valuable.

The problem was that corporations rarely used it appropriately.

Companies saw "no-code automation" and heard "replace developers with cheaper resources." RPA implementations were handed to people without engineering fundamentals: no logging, no error handling, no validation, no understanding of data types or edge cases. Automations that worked in a demo failed quietly in production. And Pega had its own agenda: RPA was a wedge. Buy the RPA product, get pulled into a conversation about how you were only using fifty percent of your investment, and find yourself purchasing licenses for PRPC — Pega's flagship, expensive workflow platform — before you'd fully processed how you got there.

It was a sales strategy disguised as a technology offering.

---

## The RPA Engagements

Under the RPA banner, Sonny moved through several more clients.

A stint at Bank of America — this time in a project management capacity, no actual RPA work. A Philadelphia shipping company, BFD, tracking shipping containers in real time. The BFD team was technically capable — solid data scientists, sharp people — but the Pega engagement style didn't land well with them. They'd signed on for a partner and felt like they were getting proof-of-concept drops and consultants who were never quite all the way in. They weren't wrong. It was a fair critique of how Pega operated.

Then Blue Cross Blue Shield, working with Jeff Badger.

Healthcare claims processing is one of the most complex workflow problems in existence. A single claim — for a hospital stay, a procedure, a specialist visit — might move through thirty, forty, fifty, even sixty distinct steps before resolution. Each step branches based on policy rules, member history, provider type, coverage conditions. The decision trees are enormous. The edge cases multiply faster than documentation can keep up.

It was exactly the kind of problem Pega was designed for — and exactly the kind of problem that demands extreme discipline in process documentation before a single line of configuration gets written.

The team lead had a bold vision: instead of building claim automations case by case, build a tool that would let non-technical users script workflows in Excel, then automatically translate those scripts into functional RPA. Abstract away the complexity entirely. Let the business own the automation.

It was an ambitious idea. Genuinely creative. And it worked — for simple models, in demo conditions.

As the process trees grew, the Excel scripts grew with them, and the translation logic buckled under the weight. What was scoped as a months-long effort stretched past a year. Sonny departed the engagement before it concluded. By all accounts, it never fully shipped.

Some ideas are correct in principle and impossible in practice at scale. This was one of them.

---

## What the Consulting Life Teaches

Across CIBC's banking halls, T-Mobile's repair depots, Sprint's campaign infrastructure, the Census Bureau's canvassing operations, and the RPA trenches of insurance and shipping — the through-line wasn't a technology or a platform. It was a way of operating.

A Pega Systems Architect on an enterprise consulting engagement is never just one thing. On any given day, Sonny might be the requirements analyst translating a client's business process into Pega's configuration model, the developer actually building it, the change request manager tracking what was agreed versus what was being asked for, the support desk fielding questions from client teams, and the face in the room that had to hold confidence even when the project was harder than the proposal suggested.

The consulting life is fast, exposed, and unrelenting. You land somewhere new, learn the domain fast, build trust faster, and deliver before the engagement runs out. The travel is constant. The context-switching is total.

What it builds — if you let it — is an unusual kind of adaptability. A fluency in problem types that transcend any single industry. And a clear-eyed view of when a technology is being used for what it's genuinely good at, and when it's being pushed past its limits by people who have reasons to push it there.

---

*The Pega years were a graduate education in enterprise software, organizational complexity, and the distance between what technology promises and what it actually delivers — taught in Toronto, Seattle, Kansas, Washington, Philadelphia, and the offices of Blue Cross Blue Shield, one engagement at a time.*
