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

// this function appends the json data to the table 'speciesTable'
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

// search on species table
function searchSpeciesTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchSpeciesName");
    var input_description = document.getElementById("searchSpeciesDescription");
    var input_ability1 = document.getElementById("searchSpeciesAbility1");
    var input_ability2 = document.getElementById("searchSpeciesAbility2");
    var input_speed = document.getElementById("searchSpeciesSpeed");
    var input_darkvision = document.getElementById("searchSpeciesDarkvision");
    
    var table = document.getElementById("speciesTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_description = input_description.value.toUpperCase();
    let filter_ability1 = input_ability1.value.toUpperCase();
    let filter_ability2 = input_ability2.value.toUpperCase();
    let filter_speed = input_speed.value.toUpperCase();
    let filter_darkvision = input_darkvision.value.toUpperCase();
    let tr = table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_description = td[1].innerText;
        td_ability1 = td[2].innerText;
        td_ability2 = td[3].innerText;
        td_speed = td[4].innerText;
        td_darkvision = td[5].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_description.toUpperCase().indexOf(filter_description) > -1 && td_ability1.toUpperCase().indexOf(filter_ability1) > -1 && td_ability2.toUpperCase().indexOf(filter_ability2) > -1 && td_speed.toUpperCase().indexOf(filter_speed) > -1 && td_darkvision.toUpperCase().indexOf(filter_darkvision) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}