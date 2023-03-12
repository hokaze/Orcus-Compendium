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


# goes through all the current known CSVs and generates JSON - without the JSON files, the compendium cannot populate any of the tables
def update_json():

    print ("Updating JSON files from CSV...")
    
    csv_to_json.csv_to_json("../data/csv/ancestries.csv", "../data/ancestries.json")
    csv_to_json.csv_to_json("../data/csv/arts.csv", "../data/arts.json")
    csv_to_json.csv_to_json("../data/csv/classes.csv", "../data/classes.json")
    csv_to_json.csv_to_json("../data/csv/cruxes.csv", "../data/cruxes.json")
    csv_to_json.csv_to_json("../data/csv/heritages.csv", "../data/heritages.json")
    csv_to_json.csv_to_json("../data/csv/powers.csv", "../data/powers.json")
    csv_to_json.csv_to_json("../data/csv/kits.csv", "../data/kits.json")
    
    print ("All JSON files updated")


# some info popups show data from the JSON, while others (like Classes and Cruxes) use little html mini pages derived from the Orcus markdown. this updates those files for everything that currently uses this
# (currently this is just Classes and Cruxes, nothing else)
def update_html():

    print ("Updating HTML files from MARKDOWN...")
    
    # TODO - rather than manually updating the list of known classes, cruxes, etc, couldn't we load from the relevant json files? mostly thinking this might be useful if we ended up generating html files from markdown from an especially large list like powers or disciplines or items where that might make more sense than copy-pasting this over and over? --> currently implemented for Kits alone
    
    # set markdown filepaths so if these change names / location can just change them here rather than every markdown_to_html call
    md_class_and_powers_path = "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md"
    md_player_options_path = "../data/markdown-to-html/markdown/Orcus Player Options - current.md"
    
    # Classes
    markdown_to_html.markdown_to_html("# Commander", md_class_and_powers_path, "../data/markdown-to-html/class/Commander.html")
    markdown_to_html.markdown_to_html("# Exemplar", md_class_and_powers_path, "../data/markdown-to-html/class/Exemplar.html")
    markdown_to_html.markdown_to_html("# Guardian", md_class_and_powers_path, "../data/markdown-to-html/class/Guardian.html")
    markdown_to_html.markdown_to_html("# Harlequin", md_class_and_powers_path, "../data/markdown-to-html/class/Harlequin.html")
    markdown_to_html.markdown_to_html("# Mageblade", md_class_and_powers_path, "../data/markdown-to-html/class/Mageblade.html")
    markdown_to_html.markdown_to_html("# Magician", md_class_and_powers_path, "../data/markdown-to-html/class/Magician.html")
    markdown_to_html.markdown_to_html("# Priest", md_class_and_powers_path, "../data/markdown-to-html/class/Priest.html")
    markdown_to_html.markdown_to_html("# Reaper", md_class_and_powers_path, "../data/markdown-to-html/class/Reaper.html")
    markdown_to_html.markdown_to_html("# Sylvan", md_class_and_powers_path, "../data/markdown-to-html/class/Sylvan.html")
    
    # Traditions and Roles are also stored in the class folder, under misc
    # need to use the tables extension, otherwise the table on roles showing all the classes against roles and traditions doesn't get converted to a html table
    markdown_to_html.markdown_to_html("### Tradition", md_class_and_powers_path, "../data/markdown-to-html/class/misc/Tradition.html")
    markdown_to_html.markdown_to_html("### Role", md_class_and_powers_path, "../data/markdown-to-html/class/misc/Role.html")
    
    # Cruxes
    markdown_to_html.markdown_to_html("### Betrayer", md_player_options_path, "../data/markdown-to-html/crux/Betrayer.html")
    markdown_to_html.markdown_to_html("### Cut Off", md_player_options_path, "../data/markdown-to-html/crux/Cut Off.html")
    markdown_to_html.markdown_to_html("### Destined", md_player_options_path, "../data/markdown-to-html/crux/Destined.html")
    markdown_to_html.markdown_to_html("### Escaped", md_player_options_path, "../data/markdown-to-html/crux/Escaped.html")
    markdown_to_html.markdown_to_html("### Heir", md_player_options_path, "../data/markdown-to-html/crux/Heir.html")
    markdown_to_html.markdown_to_html("### Hero", md_player_options_path, "../data/markdown-to-html/crux/Hero.html")
    markdown_to_html.markdown_to_html("### Ninth Life", md_player_options_path, "../data/markdown-to-html/crux/Ninth Life.html")
    markdown_to_html.markdown_to_html("### Otherworldly", md_player_options_path, "../data/markdown-to-html/crux/Otherworldly.html")
    markdown_to_html.markdown_to_html("### Returned", md_player_options_path, "../data/markdown-to-html/crux/Returned.html")
    markdown_to_html.markdown_to_html("### Sage", md_player_options_path, "../data/markdown-to-html/crux/Sage.html")
    markdown_to_html.markdown_to_html("### Third Eyed", md_player_options_path, "../data/markdown-to-html/crux/Third Eyed.html")
    markdown_to_html.markdown_to_html("### Wild Child", md_player_options_path, "../data/markdown-to-html/crux/Wild Child.html")
    
    # Kits
    # grabbing these from kits.csv rather than manually entering all the markdown_to_html calls required
    kits_list = []
    kits_file = open("../data/csv/kits.csv", "r")
    for line in kits_file:
        kits_list.append(line.split(",")[0])
    kits_file.close()
    
    for kit_name in kits_list:
        kit_header = "## " + kit_name
        kit_html_path = "../data/markdown-to-html/kit/" + kit_name + ".html"
        markdown_to_html.markdown_to_html(kit_header, md_class_and_powers_path, kit_html_path)
    
    
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