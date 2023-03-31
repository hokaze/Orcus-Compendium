# Orcus-Compendium
[Searchable online compendium usable here](https://hokaze.github.io/Orcus-Compendium/compendium.html) for the Orcus retroclone of D&D 4e.

Started as an early proof-of-concept and a side project to learn a little html, css and js along the way.

Currently supports (as of v0.09):
- Searchable tables for: Classes, Powers, Feats, Cruxes, Heritages, Kits and Prestige Paths from the Orcus Heroes' Handbook...
- ...plus Arts and Species as Advanced Options from the Orcus Game Master's Guide
- Multicolumn searching, sorting, search dropdowns
- Display Powers as Power Cards (can toggle between Orcus and 4e styling)
- Modding/Homebrew (advanced users only!): if running a copy of compendium on your own server, easy to just update existing csv + markdown files with new powers, classes, etc, or pull newer files from the Orcus project (will need to run update_data.py to generate json + html from source csv + markdown - TODO: proper documentation on custom data)

Done Recently:
- Prestige Paths
- Performance optimisation

Planned Soon(™):
- Epic Paths
- misc quality of life improvements (e.g. more cross-linking between sections - currently certain Feats can take you to the specific Power they reference without you having to go to the Powers tab to search for it, hoping this can be expanded to other areas)

Will maybe do eventually:
- Option to toggle now-core / advanced options on (such as the Warrior class)
- Equipment: split into Adventuring Gear, Weapons, Armour, Focuses, Magic Items, etc
- Rules glossary? (skills, conditions, etc)


The Orcus Compendium is licensed under the MIT, but resources taken from the [Orcus SRD](https://github.com/Sanglorian/orcus) fall under the OGL v1.0a
