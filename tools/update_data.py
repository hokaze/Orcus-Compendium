#!/usr/bin/python3
# update_data.py [--all OR --json OR --html, defaults to all]

# DEPENDENCY: python3-markdown
# PLEASE ONLY RUN THIS FROM THE tools FOLDER

# automates usage of csv_to_json and markdown_to_html to generate all the required json and html files for the compendium automatically from the converted Orcus source files

# currently the xlsx -> csv conversion is still done by hand, need to look into seeing if there's a module to 

# example for generating html for specific Classes, e.g. the Guardian:
# ./markdown_to_html.py -h "# Guardian" -i "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md" -o "../data/markdown-to-html/class/Guardian.html"

# example for generating json for a specific table, e.g. Classes:
# ./csv_to_json -i "../data/csv/classes.csv" -o "../data/classes.json"

# TODO - options to only update subsets of the json or html rather than all of it?

# TODO - maybe fix relative path usage so the script still works if ran outside the tools folder? wanting to do "tools/update_data.py" from the project's root dir seems reasonable, after all


import csv_to_json
import markdown_to_html
import sys, getopt

# set relative paths here so if file structure changes, only have to change them here rather than on dozens of lines
csv_path = "../data/csv/"
json_path = "../data/json/"
md_path = "../data/markdown-to-html/"
md_class_and_powers_path = md_path + "markdown/Orcus Classes and Powers - current.md"
md_player_options_path = md_path + "markdown/Orcus Player Options - current.md"
md_advanced_options_path = md_path + "markdown/Orcus Advanced Options - current.md"

# goes through all the current known CSVs and generates JSON - without the JSON files, the compendium cannot populate any of the tables
def update_json():

    print ("Updating JSON files from CSV...")
    
    csv_to_json.csv_to_json(csv_path + "arts.csv", json_path + "arts.json")
    csv_to_json.csv_to_json(csv_path + "classes.csv", json_path + "classes.json")
    csv_to_json.csv_to_json(csv_path + "cruxes.csv", json_path + "cruxes.json")
    csv_to_json.csv_to_json(csv_path + "feats.csv", json_path + "feats.json")
    csv_to_json.csv_to_json(csv_path + "heritages.csv", json_path + "heritages.json")
    csv_to_json.csv_to_json(csv_path + "kits.csv", json_path + "kits.json")
    csv_to_json.csv_to_json(csv_path + "powers.csv", json_path + "powers.json")
    csv_to_json.csv_to_json(csv_path + "prestige.csv", json_path + "prestige.json")
    
    # species.csv comes from "Orcus - Ancestries.xlsx, but swapped to calling it species to avoid confusion with standard ancestry option of Crux + Heritage
    csv_to_json.csv_to_json(csv_path + "species.csv", json_path + "species.json")
    
    print ("All JSON files updated")


# some info popups show data from the JSON, while others (like Classes and Cruxes) use little html mini pages derived from the Orcus markdown. this updates those files for everything that currently uses this
# (currently this is just Classes and Cruxes, nothing else)
def update_html():

    print ("Updating HTML files from MARKDOWN...")
    
    # TODO - rather than manually updating the list of known classes, cruxes, etc, couldn't we load from the relevant json files? mostly thinking this might be useful if we ended up generating html files from markdown from an especially large list like powers or disciplines or items where that might make more sense than copy-pasting this over and over? --> currently implemented for Kits alone
    
    # Classes
    markdown_to_html.markdown_to_html("# Commander", md_class_and_powers_path, md_path + "class/Commander.html")
    markdown_to_html.markdown_to_html("# Exemplar", md_class_and_powers_path, md_path + "class/Exemplar.html")
    markdown_to_html.markdown_to_html("# Guardian", md_class_and_powers_path, md_path + "class/Guardian.html")
    markdown_to_html.markdown_to_html("# Harlequin", md_class_and_powers_path, md_path + "class/Harlequin.html")
    markdown_to_html.markdown_to_html("# Mageblade", md_class_and_powers_path, md_path + "class/Mageblade.html")
    markdown_to_html.markdown_to_html("# Magician", md_class_and_powers_path, md_path + "class/Magician.html")
    markdown_to_html.markdown_to_html("# Priest", md_class_and_powers_path, md_path + "class/Priest.html")
    markdown_to_html.markdown_to_html("# Reaper", md_class_and_powers_path, md_path + "class/Reaper.html")
    markdown_to_html.markdown_to_html("# Sylvan", md_class_and_powers_path, md_path + "class/Sylvan.html")
    
    # Traditions and Roles are also stored in the class folder, under misc
    # need to use the tables extension, otherwise the table on roles showing all the classes against roles and traditions doesn't get converted to a html table
    markdown_to_html.markdown_to_html("### Tradition", md_class_and_powers_path, md_path + "class/misc/Tradition.html")
    markdown_to_html.markdown_to_html("### Role", md_class_and_powers_path, md_path + "class/misc/Role.html")
    
    # Cruxes
    markdown_to_html.markdown_to_html("### Betrayer", md_player_options_path, md_path + "crux/Betrayer.html")
    markdown_to_html.markdown_to_html("### Cut Off", md_player_options_path, md_path + "crux/Cut Off.html")
    markdown_to_html.markdown_to_html("### Destined", md_player_options_path, md_path + "crux/Destined.html")
    markdown_to_html.markdown_to_html("### Escaped", md_player_options_path, md_path + "crux/Escaped.html")
    markdown_to_html.markdown_to_html("### Heir", md_player_options_path, md_path + "crux/Heir.html")
    markdown_to_html.markdown_to_html("### Hero", md_player_options_path, md_path + "crux/Hero.html")
    markdown_to_html.markdown_to_html("### Ninth Life", md_player_options_path, md_path + "crux/Ninth Life.html")
    markdown_to_html.markdown_to_html("### Otherworldly", md_player_options_path, md_path + "crux/Otherworldly.html")
    markdown_to_html.markdown_to_html("### Returned", md_player_options_path, md_path + "crux/Returned.html")
    markdown_to_html.markdown_to_html("### Sage", md_player_options_path, md_path + "crux/Sage.html")
    markdown_to_html.markdown_to_html("### Third Eyed", md_player_options_path, md_path + "crux/Third Eyed.html")
    markdown_to_html.markdown_to_html("### Wild Child", md_player_options_path, md_path + "crux/Wild Child.html")
    
    # Kits
    # grabbing these from kits.csv rather than manually entering all the markdown_to_html calls required
    kits_list = []
    kits_file = open(csv_path + "kits.csv", "r")
    for line in kits_file:
        kits_list.append(line.split(",")[0])
    kits_file.close()
    
    for kit_name in kits_list:
        kit_header = "## " + kit_name
        kit_html_path = md_path + "kit/" + kit_name + ".html"
        markdown_to_html.markdown_to_html(kit_header, md_class_and_powers_path, kit_html_path)
    
    # Species
    # lazily grabbing species names from csv
    species_list = []
    species_file = open(csv_path + "species.csv", "r")
    for line in species_file:
        species_list.append(line.split(",")[0])
    species_file.close()
    
    for species_name in species_list:
        species_header = "## " + species_name
        species_html_path = md_path + "species/" + species_name + ".html"
        markdown_to_html.markdown_to_html(species_header, md_advanced_options_path, species_html_path)
    
    # Humans aren't in spreadsheet so need special case to generate
    markdown_to_html.markdown_to_html("## Human", md_advanced_options_path, md_path + "species/Human.html")
    
    # Prestige paths
    # grabbing from prestige.csv
    prestige_list = []
    prestige_file = open(csv_path + "prestige.csv", "r")
    for line in prestige_file:
        prestige_list.append(line.split(",")[0])
    prestige_file.close()
    
    for prestige_name in prestige_list:
        prestige_header = "## " + prestige_name
        prestige_html_path = md_path + "prestige/" + prestige_name + ".html"
        markdown_to_html.markdown_to_html(prestige_header, md_class_and_powers_path, prestige_html_path)
    
    print ("All HTML files updated")


def main(argv):
    
    usage_string = "Usage: update_data.py [--all OR --json OR --html, defaults to all]" + "\n" + "e.g. 'update_data.py' or 'update_data.py all' updates all data files, 'update_data.py json' and 'update_data.py html' just updates the json and html, respectively" + "\n" + "when in doubt, use all"
    
    update_type = "all"
   
    opts, args = getopt.getopt(argv, "ajh", ["all", "json", "html"])
   
    for opt, arg in opts:
        if opt in ("-a", "--all"):
            update_type = "all"
        elif opt in ("-j", "--json"):
            update_type = "json"
        elif opt in ("-h", "--html"):
            update_type = "html"
        else:
            print ("Unrecognised argument")
            print (usage_string)
            sys.exit()
            
    if update_type == "all" or update_type == "json":
        update_json()
    if update_type == "all" or update_type == "html":
        update_html()

if __name__ == "__main__":
    main(sys.argv[1:])