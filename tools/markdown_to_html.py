#!/usr/bin/python3
# markdown_to_html.py -h [header] -i [input md] -o [output html]

# DEPENDENCY: python3-markdown

# quick and dirty script to search the Orcus markdown for specific headers (e.g. a class, power, ancestry) and chunk that specific portion into a standalone html page

# standard markdown library does the heavy lifting on markdown-to-html, just need some custom code to search for the specific headers, including all text and subheadings, but stopping on the next header of the same or higher type

# e.g. if we're searching for a ### or <h3>, we include #### / <h4>, but stop on encounter another ### / <h3> or a higher one like ## / <h2>

import markdown
import sys, getopt


def markdown_to_html(header, input_path, output_path):
    
    input_file = open(input_path, "r")
    
    found_header = 0;
    input_markdown = ""
    header_level = header.split(" ")[0]
    
    for line in input_file:
        # ignore leading and trailing whitespace + newlines when searching for header
        search_line = line.strip()
        search_line.rstrip("\n")
    
        if found_header == 0:
            if search_line == header:
                found_header = 1
                input_markdown = line
        
        else:
            # need to check to see if current line is a header and if so, whether it's a subheading of the current header_level or not
            if line[0] == "#":
                current_header_level = line.split(" ")[0]
                # we've found a header of the same level or higher (i.e. has equal or more #s, so we've copied the entire section of the searched header)
                if len(current_header_level) <= len(header_level):
                    found_header = 2
                    break
            
            # ignore lines with <figure> images as image support isn't planned yet
            if line.startswith("<figure>"):
                continue
            
            input_markdown += line
                
    input_file.close()
    
    # if markdown is empty we found no matches - chances are this is advanced/optional content that doesn't have a writeup yet, so display a placeholder instead of just generating an empty html file
    
    if input_markdown == '':
        input_markdown = header + "\n" + "**Placeholder** - there isn't a proper summary of this yet (usually means content is unfinished in Orcus itself, such as non-core, WIP or advanced options)"
    
    # need to use the tables extension, otherwise the table on roles showing all the classes against roles and traditions doesn't get converted to a html table
    html = markdown.markdown(input_markdown, extensions=['markdown.extensions.tables'])
    
    with open(output_path, "w") as output_file:
        output_file.write(html)


def main(argv):
    
    usage_string = "Usage: markdown_to_html.py -h <header> -i <input md> -o <output html>" + "\n" + "e.g. markdown_to_html.py -h '# Guardian' -i '../data/markdown-to-html/markdown/Orcus Classes and Powers - current.md' -o '../data/markdown-to-html/class/Guardian.html'"
    
    header = ""
    input_path = ""
    output_path = ""
   
    opts, args = getopt.getopt(argv, "h:i:o:", ["ifile=", "ofile="])
   
    for opt, arg in opts:
        if opt in ("-h", "--header"):
            header = arg
        elif opt in ("-i", "--ifile"):
            input_path = arg
        elif opt in ("-o", "--ofile"):
            output_path = arg
        
    if header and input_path and output_path:
        markdown_to_html(header, input_path, output_path)
       
    else:
        print ("Missing arguments")
        print (usage_string)


if __name__ == "__main__":
    main(sys.argv[1:])