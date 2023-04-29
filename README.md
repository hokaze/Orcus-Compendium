# Orcus-Compendium
[Searchable online compendium usable here](https://hokaze.github.io/Orcus-Compendium/compendium.html) for the Orcus retroclone of D&D 4e.

Started as an early proof-of-concept and a side project to learn a little html, css and js along the way.

Currently supports (as of v0.11):
- Searchable tables for: Classes, Powers, Feats, Cruxes, Heritages, Kits, Prestige Paths, Epic Paths and Companions from the Orcus Heroes' Handbook...
- ...plus Arts and Species as Advanced Options from the Orcus Game Master's Guide
- Multicolumn searching, sorting, search dropdowns
- Display Powers as Power Cards (can toggle between Orcus and 4e styling)
- Modding/Homebrew (advanced users only!): if running a copy of compendium on your own server, easy to just update existing csv + markdown files with new powers, classes, etc, or pull newer files from the Orcus project (will need to run update_data.py to generate json + html from source csv + markdown - TODO: proper documentation on custom data)

Done Recently:
- Prestige Paths
- Performance optimisation
- Companions
- Epic Paths
- bugfixes and more cross-reference linking (e.g. powers can link to summoned companion statblocks, the sources that grant their discipline, any listing of a discipline includes a link to a summary, most listings of powers link to power cards, etc)
- updated to be in line with upstream changes to Orcus made between 2023-02-27 and 2023-04-16

Planned Soon(™):
- Powers table, more links on list - e.g. Class, Prestige Path and Epic Path should link to relevant displays
- more links, even more quality of life improvements

Will maybe do eventually:
- Missing powers for Cruxes and Species - not included in the core powers spreadsheet, but they deserve power cards too
- Option to toggle now-core / advanced options on (such as the Warrior class)
- Equipment: split into Adventuring Gear, Weapons, Armour, Focuses, Magic Items, etc
- Rules glossary? (skills, conditions, etc)


The Orcus Compendium is licensed under the MIT License, but resources taken from the [Orcus SRD](https://github.com/Sanglorian/orcus) fall under the OGL v1.0a
