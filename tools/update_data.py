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
    
    print ("All JSON files updated")


# some info popups show data from the JSON, while others (like Classes and Cruxes) use little html mini pages derived from the Orcus markdown. this updates those files for everything that currently uses this
# (currently this is just Classes and Cruxes, nothing else)
def update_html():

    print ("Updating HTML files from MARKDOWN...")
    
    # TODO - rather than manually updating the list of known classes, cruxes, etc, couldn't we load from the relevant json files? mostly thinking this might be useful if we ended up generating html files from markdown from an especially large list like powers or disciplines or items where that might make more sense than copy-pasting this over and over?
    
    # Classes
    markdown_to_html.markdown_to_html("# Commander", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Commander.html")
    markdown_to_html.markdown_to_html("# Exemplar", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Exemplar.html")
    markdown_to_html.markdown_to_html("# Guardian", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Guardian.html")
    markdown_to_html.markdown_to_html("# Harlequin", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Harlequin.html")
    markdown_to_html.markdown_to_html("# Mageblade", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Mageblade.html")
    markdown_to_html.markdown_to_html("# Magician", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Magician.html")
    markdown_to_html.markdown_to_html("# Priest", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Priest.html")
    markdown_to_html.markdown_to_html("# Reaper", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Reaper.html")
    markdown_to_html.markdown_to_html("# Sylvan", "../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md", "../data/markdown-to-html/class/Sylvan.html")
    
    # Cruxes
    markdown_to_html.markdown_to_html("### Betrayer", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Betrayer.html")
    markdown_to_html.markdown_to_html("### Cut Off", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Cut Off.html")
    markdown_to_html.markdown_to_html("### Destined", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Destined.html")
    markdown_to_html.markdown_to_html("### Escaped", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Escaped.html")
    markdown_to_html.markdown_to_html("### Heir", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Heir.html")
    markdown_to_html.markdown_to_html("### Hero", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Hero.html")
    markdown_to_html.markdown_to_html("### Ninth Life", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Ninth Life.html")
    markdown_to_html.markdown_to_html("### Otherworldly", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Otherworldly.html")
    markdown_to_html.markdown_to_html("### Returned", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Returned.html")
    markdown_to_html.markdown_to_html("### Sage", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Sage.html")
    markdown_to_html.markdown_to_html("### Third Eyed", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Third Eyed.html")
    markdown_to_html.markdown_to_html("### Wild Child", "../data/markdown-to-html/markdown/Orcus Player Options - current.md", "../data/markdown-to-html/class/Wild Child.html")
    
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