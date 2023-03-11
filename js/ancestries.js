// load ancestries table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_ancestry_json_data, false ); // fires the get method on page load

var species_data = {};

// this function is in the event listener and will execute on page load
function get_ancestry_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/ancestries.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
        { 
            // when a good response is given do this
            if (this.readyState == 4 && this.status == 200)
            {
            // convert the response to a json object
            // pass the json object to the append_json function
            species_data = JSON.parse(this.responseText);
            append_ancestry_json(species_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'classTable'
function append_ancestry_json(species_data)
{
    // note that Humanity isn't actually included in the xlsx or csv files, so we need to add a placeholder entry onto the json data for it here, as Humanity is supposed to use Cruxes and Heritages (which annoyingly aren't in any spreadsheets) instead as the two halves of their Ancestry
    
    // there IS n entry for humanity in the Advanced Options pdf/md intended to be used when species matters, in which case they get the following instead of using Cruxes and Heritages:
    species_data["0"] =
    {
        Name: "Human",
        Description: "Medium natural humanoid",
        Details: "It's hard to make generalizations about humans. Humans reach adulthood in their late teens and live less than a century. Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Humans typically learn the languages of other peoples they deal with, including obscure dialects. They are fond of sprinkling their speech with words borrowed from other tongues: Giant curses, Elvish musical expressions, Dwarvish military phrases, and so on.",
        Power: "Dabbler - Choose a level 1 at-will attack power from your class. You gain this power in addition to the those normally granted by your class.",
        Powerlc: "dabbler",
        "Ability 1": "+2 to any one ability score",
        "Ability 2": "",
        Speed: "6 squares",
        Languages: "Common and one extra language of your choice.",
        LLV: "",
        Darkvision: "",
        "Skill Bonus 1": "",
        "Skill Bonus 2": "",
        "Feat 1 Name" : "Bonus Feat",
        "Feat 1 Description" : "Choose one feat. You gain that feat.",
        "Feat 2 Name" : "Bonus Skill",
        "Feat 2 Description" : "Choose one class skill. You become trained in that skill.",
        "Feat 3 Name" : "Hardy Stock",
        "Feat 3 Description" : "+1 ancestry bonus to Fortitude, Reflex and Will defenses",
    };
    
    var table = document.getElementById('speciesTable');
    Object.keys(species_data).forEach(key => {      
        // unlike class and powers, ALL the ancestries are not included in core and count as advanced options, as in core only humans are playable so we include them, but mark them as advanced
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + species_data[key]["Name"] + '</td>' +
        '<td>' + species_data[key]["Description"] + '</td>' +
        '<td>' + species_data[key]["Ability 1"] + '</td>' +
        '<td>' + species_data[key]["Ability 2"] + '</td>' +
        '<td>' + species_data[key]["Speed"] + '</td>' +
        '<td>' + species_data[key]["Darkvision"] + '</td>';
        table.appendChild(tr);
    });
}

// search on species table by name, description (origin), ability scores, speed, dark vision
function searchSpeciesTable(searchInput, column)
{
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(searchInput);
    filter = input.value.toUpperCase();
    table = document.getElementById("speciesTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++)
    {
        td = tr[i].getElementsByTagName("td")[column];
        if (td)
        {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1)
            {
                tr[i].style.display = "";
            }
            else
            {
                tr[i].style.display = "none";
            }
        }       
    }
}