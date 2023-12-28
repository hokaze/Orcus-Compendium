// load companions table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_companion_json_data, false ); // fires the get method on page load

var companion_table = document.getElementById('companionTable');
var companion_data = {};

companion_name_list = [];
companion_level_list = [];
companion_source_list = [];
companion_size_list = [];
companion_role_list = [];
companion_language_list = [];
companion_senses_list = [];
companion_speed_list = [];

const companion_name_to_key = new Map();

// this function is in the event listener and will execute on page load
function get_companion_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/companions.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            companion_data = JSON.parse(this.responseText);
            append_companion_json(companion_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'kitTable'
function append_companion_json(companion_data)
{
    Object.keys(companion_data).forEach(key => {
        
        // ignore the Chapter headers (not to be confused with the Chapter field, which is actually the source of the companion, e.g. Cup of Brimstone)
        if ( companion_data[key]["Name"] == "Chapter")
        {
            return;
        }
        
        // these two are in the xslx / csv, but don't appear in core pdf or markdown and have no corresponding html to load, so skip them
        if (companion_data[key]["Name"] == "Minor Dream Figment" || companion_data[key]["Name"] == "Man-at-Arms")
        {
            return;
        }
        
        // for fields with empty values, we still want to search on them and find ones where a companion/summon lacks a trait, so replace empty level, language and senses with "[none]"
        if (companion_data[key]["Level"] == "") {companion_data[key]["Level"] = "[none]";}
        if (companion_data[key]["Language"] == "") {companion_data[key]["Language"] = "[none]";}
        if (companion_data[key]["Senses"] == "") {companion_data[key]["Senses"] = "[none]";}
        
        // arrays used to enable search boxes to have dropdown lists (and required for prev/next buttons)
        companion_name_list.push(companion_data[key]["Name"]);
        companion_level_list.push(companion_data[key]["Level"]);
        companion_source_list.push(companion_data[key]["Chapter"]);
        companion_size_list.push(companion_data[key]["Size"]);
        companion_role_list.push(companion_data[key]["Role"]);
        
        // special handling for field with comma-seperated list of values so we can search on individual ones
        companion_language_list.push(... companion_data[key]["Language"].split(", "));
        companion_senses_list.push(... companion_data[key]["Senses"].split(", "));
        companion_speed_list.push(... companion_data[key]["Spd"].split(", "));
        
        // hashmap for looking up key from companion name, useful for running showCompanionInfo from other tabs/tables, e.g. from a Summons power to show the summons then let the user flick back to powers
        companion_name_to_key.set(companion_data[key]["Name"], key);
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "companion_" + key;
        var companion_name = companion_data[key]["Name"];
        // open modal dialogue for companion info - opens html
        tr.innerHTML = '<td>' + '<a href="#" onclick="showCompanionInfo(' + key + ', 1' + ')">' + companion_name + '</a>' + '</td>' +
        '<td>' + companion_data[key]["Level"] + '</td>' +
        '<td>' + companion_data[key]["Chapter"] + '</td>' +
        '<td>' + companion_data[key]["Size"] + '</td>' +
        '<td>' + companion_data[key]["Role"] + '</td>' +
        '<td>' + companion_data[key]["Language"] + '</td>' +
        '<td>' + companion_data[key]["Senses"] + '</td>' +
        '<td>' + companion_data[key]["Spd"] + '</td>';
        companion_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    companion_name_list = [...new Set(companion_name_list)].sort();
    companion_level_list = [...new Set(companion_level_list)].sort();
    companion_source_list  = [...new Set(companion_source_list )].sort();
    companion_size_list  = [...new Set(companion_size_list )].sort();
    companion_role_list  = [...new Set(companion_role_list )].sort();
    companion_language_list  = [...new Set(companion_language_list )].sort();
    companion_senses_list  = [...new Set(companion_senses_list )].sort();
    companion_speed_list  = [...new Set(companion_speed_list )].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateCompanionDatalist();
    
    // record that we've finished loading data; once all *_data arrays are populated we can safely run showInfoFromParams if URL contains params
    data_ready.set(data_ready.get()+1);
}

// search on companion table
function searchCompanionTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchCompanionName");
    var input_level = document.getElementById("searchCompanionLevel");
    var input_source = document.getElementById("searchCompanionSource");
    var input_size = document.getElementById("searchCompanionSize");
    var input_role = document.getElementById("searchCompanionRole");
    var input_language = document.getElementById("searchCompanionLanguage");
    var input_senses = document.getElementById("searchCompanionSenses");
    var input_speed = document.getElementById("searchCompanionSpeed");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_level = input_level.value.toUpperCase();
    let filter_source = input_source.value.toUpperCase();
    let filter_size = input_size.value.toUpperCase();
    let filter_role = input_role.value.toUpperCase();
    let filter_language = input_language.value.toUpperCase();
    let filter_senses = input_senses.value.toUpperCase();
    let filter_speed = input_speed.value.toUpperCase();
    
    let tr = companion_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_level = td[1].innerText;
        td_source = td[2].innerText;
        td_size = td[3].innerText;
        td_role = td[4].innerText;
        td_language = td[5].innerText;
        td_senses = td[6].innerText;
        td_speed = td[7].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_level.toUpperCase().indexOf(filter_level) > -1 && td_source.toUpperCase().indexOf(filter_source) > -1 && td_size.toUpperCase().indexOf(filter_size) > -1 && td_role.toUpperCase().indexOf(filter_role) > -1 && td_language.toUpperCase().indexOf(filter_language) > -1 && td_senses.toUpperCase().indexOf(filter_senses) > -1 && td_speed.toUpperCase().indexOf(filter_speed) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// like classes, show some html converted from markdown for the companion
async function showCompanionInfo (key, enable_navigation, close_showinfo)
{
    var companion_name = companion_data[key]["Name"];
    let url = "data/markdown-to-html/companions/" + companion_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();

    if (enable_navigation)
    {
        showModalNavigation ("companion", key, companion_name_list, "showCompanionInfo", companion_table, companion_data);
    }
    
    // return to the power if viewing a companion from a summoning power
    this.modal_div_showinfo_on_close = close_showinfo;

    modal_div.style.display = "block";
    
    // set URL to reflect power we're showing via params, can then copy this URL to go straight to the show info modal for this power
    removeUrlSearchParamsExcept("companion");
    updateUrlSearchParams("companion", key);
}


function updateCompanionDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlCompanionName");
    dl_level = document.getElementById("dlCompanionLevel");
    dl_source = document.getElementById("dlCompanionSource");
    dl_size = document.getElementById("dlCompanionSize");
    dl_role = document.getElementById("dlCompanionRole");
    dl_language = document.getElementById("dlCompanionLanguage");
    dl_senses = document.getElementById("dlCompanionSenses");
    dl_speed = document.getElementById("dlCompanionSpeed");

    // populate datalists
    updateDataList(dl_name, companion_name_list);
    updateDataList(dl_level, companion_level_list);
    updateDataList(dl_source, companion_source_list);
    updateDataList(dl_size, companion_size_list);
    updateDataList(dl_role, companion_role_list);
    updateDataList(dl_language, companion_language_list);
    updateDataList(dl_senses, companion_senses_list);
    updateDataList(dl_speed, companion_speed_list);
}