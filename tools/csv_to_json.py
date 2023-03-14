#!/usr/bin/python3
# csv_to_json.py -i [input csv] -o [output json]

# quick and dirty script to convert csv from orcus project xlsx into json so we can load into the web page directly as running html locally forbids direct filesystem access

# long-term, might need a way for user to supply xlsx or csv files into the compendium so they can provide updates themselves?

import csv
import json
import sys, getopt


def csv_to_json(inputCSV, outputJSON):
     
    data = {}
    key = 0;
     
    # Open a csv reader called DictReader
    with open(inputCSV, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
         
        # Convert each row into a dictionary and add it to data
        for index, rows in enumerate(csvReader):
            
            # ignore "junk data" rows like the "aaaaa..." in classes,
            # or the "chapter" headings in powers, skip to next row
            if rows ["Name"] == "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa":
                continue;
            if rows ["Name"] == "Chapter":
                continue;
            
            # no primary key in csv, so just use the number of non-junk lines as the key
            # (previously we used index, but this led to some json files starting at index 0 and others at 1 or higher, and while I've fixed the known issues which assumed one way or the other, want to play it safe and ensure everything is always 0-indexed for now)
            data[key] = rows
            key += 1
 
    # Open a json writer, and dump data
    with open(outputJSON, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))
 
 
def main(argv):
    
    usage_string = "Usage: csv_to_json.py -i [input csv] -o [output json]"
    
    inputCSV = ""
    outputJSON = ""
   
    opts, args = getopt.getopt(argv, "hi:o:", ["ifile=", "ofile="])
   
    for opt, arg in opts:
        if opt == '-h':
            print (usage_string)
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputCSV = arg
        elif opt in ("-o", "--ofile"):
            outputJSON = arg
        
    if inputCSV and outputJSON:
        csv_to_json(inputCSV, outputJSON)
       
    else:
        print ("Missing arguments")
        print (usage_string)


if __name__ == "__main__":
    main(sys.argv[1:])