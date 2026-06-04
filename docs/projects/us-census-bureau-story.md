# Washington, DC: Counting America

The most consequential project of the Pega years — maybe of Sonny's career to that point — was in Washington, DC, starting around 2016.

The client was the United States Census Bureau. The mission was to build the technology that would power the 2020 census.

The census is, at its core, a logistics problem of staggering scale: identify every property in the United States that might have people living in it, then find a way to reach every one of them. The Bureau's starting point was their 2010 data — maps, property lists, geographic zones — and the first task was figuring out what had changed. New construction, demolitions, rezoning. About eighty to ninety percent of properties stay static over a decade, but the remaining ten to twenty percent represents millions of addresses that need to be verified.

The team built software that used Google Maps comparison to automate that verification — visually and programmatically assessing which properties had changed, which were new, and which could be carried forward unchanged from the last census. It cut the manual review workload dramatically before a single canvasser hit the street.

Once the property list was locked, the next challenge was outreach. The Bureau had historically relied on armies of contractors going door to door. The 2020 approach was different: go digital first. The system sent physical mailers with survey links, distributed email invitations, and provided an automated phone survey option. Citizens could respond online, over the phone, or on paper. The software tracked response status by address, by neighborhood, by region — and flagged the gaps.

For those who didn't respond — or couldn't — the canvassing system took over.

Managers sat in offices using a desktop application to divide their regions into sections and neighborhoods, assign canvassers, and monitor coverage in real time. Canvassers in the field carried tablets and phones loaded with a mobile application that combined GPS tracking, address mapping, and a structured interview workflow. When a canvasser arrived at a property, they could log whether someone was home, whether the property was occupied, whether it was approachable — sometimes it wasn't, due to dogs, unsafe conditions, or unresponsive occupants. If contact was made, the app guided the survey in whatever language the resident spoke, removing the language barrier that had historically blocked response from non-English-speaking households.

For the most difficult or sensitive situations, the Bureau sent its own employees instead of contractors.

The result was historic. The previous census required between five hundred thousand and six hundred thousand contractors to canvass the country. The 2020 system brought that number to under three hundred thousand — a reduction of more than fifty percent. And because the system was built to be extensible, the Bureau would carry it forward into future censuses rather than rebuilding from scratch every decade.
