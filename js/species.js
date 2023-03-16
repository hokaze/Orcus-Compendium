// load species table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_species_json_data, false ); // fires the get method on page load

var species_table = document.getElementById("speciesTable");
var species_data = {};

var species_name_list = [];
var species_description_list = [];
var species_ability_list = [];
var species_feat1_list = [];
var species_feat2_list = [];
var species_feat3_list = [];
var species_darkvision_list = [];
var species_speed_list = [];

// this function is in the event listener and will execute on page load
function get_species_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/species.json';

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
            append_species_json(species_data);
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
function append_species_json(species_data)
{
    // note that Humanity isn't actually included in the xlsx or csv files, so we need to add a placeholder entry onto the json data for it here, as Humanity is supposed to use Cruxes and Heritages (which annoyingly aren't in any spreadsheets) instead as the two halves of their Ancestry
    
    // there IS no entry for humanity in the Advanced Options pdf/md intended to be used when species matters, in which case they get the following instead of using Cruxes and Heritages:
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
    
    Object.keys(species_data).forEach(key => {      
        // unlike class and powers, ALL the ancestries are not included in core and count as advanced options, as in core only humans are playable so we include them, but mark them as advanced
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "species_" + key;
        var species_name = species_data[key]["Name"];
        
        // show ALL ability scores in a single column, separated by a comma, so we can search all ability scores at once e.g. a search for CON species will list them all regardless of if CON is Ability 1 or Ability 2
        // note that you can pick any 2 of the 3 abilities, unlike 4e, which usually had 1st ability set in stone, then a choice of 1 of 2 for the 2nd ability
        var ability_scores = species_data[key]["Ability 1"];
        // push ability scores individually and NOT all of them as a list, so the dropdown suggests the individual Str/Con/Dex/Int/Wis/Cha options
        species_ability_list.push(species_data[key]["Ability 1"]);
        if (species_data[key]["Ability 2"])
        {
            // Human has a single ability score, so avoid trailing comma and undefined entry in dropdown
            ability_scores += ', ' + species_data[key]["Ability 2"];
            species_ability_list.push(species_data[key]["Ability 2"]);
        }
        if (species_data[key]["Ability 3"])
        {
            ability_scores += ', ' + species_data[key]["Ability 3"];
            species_ability_list.push(species_data[key]["Ability 3"]);
        }
        
        // display darkvision better than [blank] or 1, use Yes/No instead
        var darkvision = "No";
        if (species_data[key]["Darkvision"] == 1)
        {
            darkvision = "Yes";
        }
        
        // arrays used to enable search boxes to have dropdown lists
        species_name_list.push(species_data[key]["Name"]);
        species_description_list.push(species_data[key]["Description"]);
        // ability scores handled above, to avoid pushing [undefined] into the list for humans or any other options that don't have ability2 and ability3 options
        species_feat1_list.push(species_data[key]["Feat 1 Name"]);
        species_feat2_list.push(species_data[key]["Feat 2 Name"]);
        species_feat3_list.push(species_data[key]["Feat 3 Name"]);
        species_darkvision_list.push(darkvision);
        species_speed_list.push(species_data[key]["Speed"]);
        
        // in the csv, it goes speed then darkvision, but due to speed having longer text on some entries or no speed penalty in heavy armour, looks better to display speed as last/longest column
        tr.innerHTML = '<td>' + '<a href="#" onclick="showSpeciesInfo(' + key + ', 1' + ')">' + species_name + '</a>' + '</td>' +
        '<td>' + species_data[key]["Description"] + '</td>' +
        '<td>' + ability_scores + '</td>' +
        '<td>' + species_data[key]["Feat 1 Name"] + '</td>' +
        '<td>' + species_data[key]["Feat 2 Name"] + '</td>' +
        '<td>' + species_data[key]["Feat 3 Name"] + '</td>' +
        '<td>' + darkvision + '</td>' +
        '<td>' + species_data[key]["Speed"] + '</td>';
        species_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    species_name_list = [...new Set(species_name_list)].sort();
    species_description_list = [...new Set(species_description_list)].sort();
    species_ability_list = [...new Set(species_ability_list)].sort();
    species_feat1_list = [...new Set(species_feat1_list)].sort();
    species_feat2_list = [...new Set(species_feat2_list)].sort();
    species_feat3_list = [...new Set(species_feat3_list)].sort();
    species_darkvision_list = [...new Set(species_darkvision_list)].sort();
    species_speed_list = [...new Set(species_speed_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateSpeciesDatalist();
}

// search on species table
function searchSpeciesTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchSpeciesName");
    var input_description = document.getElementById("searchSpeciesDescription");
    var input_ability = document.getElementById("searchSpeciesAbility");
    var input_feat1 = document.getElementById("searchSpeciesFeat1");
    var input_feat2 = document.getElementById("searchSpeciesFeat2");
    var input_feat3 = document.getElementById("searchSpeciesFeat3");
    var input_darkvision = document.getElementById("searchSpeciesDarkvision");
    var input_speed = document.getElementById("searchSpeciesSpeed");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_description = input_description.value.toUpperCase();
    let filter_ability = input_ability.value.toUpperCase();
    let filter_feat1 = input_feat1.value.toUpperCase();
    let filter_feat2 = input_feat2.value.toUpperCase();
    let filter_feat3 = input_feat3.value.toUpperCase();
    let filter_darkvision = input_darkvision.value.toUpperCase();
    let filter_speed = input_speed.value.toUpperCase();
    
    let tr = species_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_description = td[1].innerText;
        td_ability = td[2].innerText;
        td_feat1 = td[3].innerText;
        td_feat2 = td[4].innerText;
        td_feat3 = td[5].innerText;
        td_darkvision = td[6].innerText;
        td_speed = td[7].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_description.toUpperCase().indexOf(filter_description) > -1 && td_ability.toUpperCase().indexOf(filter_ability) > -1 && td_feat1.toUpperCase().indexOf(filter_feat1) > -1 && td_feat2.toUpperCase().indexOf(filter_feat2) > -1 && td_feat3.toUpperCase().indexOf(filter_feat3) > -1 && td_darkvision.toUpperCase().indexOf(filter_darkvision) > -1 && td_speed.toUpperCase().indexOf(filter_speed) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}

// show some html converted from the advanced options markdown (in particular, the powers here don't exist on the powers spreadsheet or table, so this is the only way to view them currently)
async function showSpeciesInfo (key, enable_navigation)
{   
    // fetch species html file
    var species_name = species_data[key]["Name"];
    let url = "data/markdown-to-html/species/" + species_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();
    
    // only add navigation if enabled
    if (enable_navigation)
    {
        showModalNavigation ("species", key, species_name_list, "showSpeciesInfo", species_table, species_data);
    }
    
    modal_div.style.display = "block";
}

function updateSpeciesDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlSpeciesName");
    dl_description = document.getElementById("dlSpeciesDescription");
    dl_ability = document.getElementById("dlSpeciesAbility");
    dl_feat1 = document.getElementById("dlSpeciesFeat1");
    dl_feat2 = document.getElementById("dlSpeciesFeat2");
    dl_feat3 = document.getElementById("dlSpeciesFeat3");
    dl_darkvision = document.getElementById("dlSpeciesDarkvision");
    dl_speed = document.getElementById("dlSpeciesSpeed");

    // populate datalists
    updateDataList(dl_name, species_name_list);
    updateDataList(dl_description, species_description_list);
    updateDataList(dl_ability, species_ability_list);
    updateDataList(dl_feat1, species_feat1_list);
    updateDataList(dl_feat2, species_feat2_list);
    updateDataList(dl_feat3, species_feat3_list);
    updateDataList(dl_darkvision, species_darkvision_list);
    updateDataList(dl_speed, species_speed_list);
}