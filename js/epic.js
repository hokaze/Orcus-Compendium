// load epic table

// do NOT run on page load - append_epic_json depends on power_data and power_name_to_key already existing, so we have to ensure get_epic_json_data is called AFTER append_power_json_data
//document.addEventListener( "DOMContentLoaded", get_epic_json_data, false );

var epic_table = document.getElementById('epicTable');
var epic_data = {};

epic_name_list = [];
epic_description_list = [];
epic_requirements_list = [];
epic_feat21_list = [];
epic_feat24_list = [];
epic_feat30_list = [];
epic_power26_list = [];

// this function is in the event listener and will execute on page load
function get_epic_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/epic.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            epic_data = JSON.parse(this.responseText);
            append_epic_json(epic_data);
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
function append_epic_json(epic_data)
{
    Object.keys(epic_data).forEach(key => {
        
        // arrays used to enable search boxes to have dropdown lists (and required for prev/next buttons)
        epic_name_list.push(epic_data[key]["Name"]);
        epic_description_list.push(epic_data[key]["Description"]);
        epic_requirements_list.push(epic_data[key]["Requirements"]);
        epic_feat21_list.push(epic_data[key]["Lv 21 Feature"]);
        epic_feat24_list.push(epic_data[key]["Lv 24 Feature"]);
        epic_feat30_list.push(epic_data[key]["Lv 30 Feature"]);
        epic_power26_list.push(epic_data[key]["Lv 26 Power"]);
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "epic_" + key;
        var epic_name = epic_data[key]["Name"];
        var epic_power26 = epic_data[key]["Lv 26 Power"];
        
        // open modal dialogue for kit info - opens html
        tr.innerHTML = '<td>' + '<a href="#" onclick="showEpicInfo(' + key + ', 1' + ')">' + epic_name + '</a>' + '</td>' +
        '<td>' + epic_data[key]["Description"] + '</td>' +
        '<td>' + epic_data[key]["Requirements"] + '</td>' +
        '<td>' + epic_data[key]["Lv 21 Feature"] + '</td>' +
        '<td>' + epic_data[key]["Lv 24 Feature"] + '</td>' +
        '<td>' + epic_data[key]["Lv 30 Feature"] + '</td>';
        
        // make power in table showPowerInfo
        tr.innerHTML += '<td><a href="#" onclick="showPowerInfo(' + power_name_to_key.get(epic_power26) + ', 0)\">' + epic_power26 + '</a>' + '</td>';
        
        epic_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    epic_name_list = [...new Set(epic_name_list)].sort();
    epic_description_list = [...new Set(epic_description_list)].sort();
    epic_requirements_list = [...new Set(epic_requirements_list)].sort();
    epic_feat21_list = [... new Set(epic_feat21_list)].sort();
    epic_feat24_list  = [... new Set(epic_feat24_list )].sort();
    epic_feat30_list = [... new Set(epic_feat30_list)].sort();
    epic_power26_list = [... new Set(epic_power26_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateEpicDatalist();
    
    // record that we've finished loading data; once all *_data arrays are populated we can safely run showInfoFromParams if URL contains params
    data_ready.set(data_ready.get()+1);
}

// search on kit table
function searchEpicTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchEpicName");
    var input_description = document.getElementById("searchEpicDescription");
    var input_requirements = document.getElementById("searchEpicRequirements");
    var input_feat21 = document.getElementById("searchEpicFeat21");
    var input_feat24 = document.getElementById("searchEpicFeat24");
    var input_feat30 = document.getElementById("searchEpicFeat30");
    var input_power26 = document.getElementById("searchEpicPower26");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_description = input_description.value.toUpperCase();
    let filter_requirements = input_requirements.value.toUpperCase();
    let filter_feat21 = input_feat21.value.toUpperCase();
    let filter_feat24 = input_feat24.value.toUpperCase();
    let filter_feat30 = input_feat30.value.toUpperCase();
    let filter_power26 = input_power26.value.toUpperCase();
    let tr = epic_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_description = td[1].innerText;
        td_requirements = td[2].innerText;
        td_feat21 = td[3].innerText;
        td_feat24 = td[4].innerText;
        td_feat30 = td[5].innerText;
        td_power26 = td[6].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_description.toUpperCase().indexOf(filter_description) > -1 && td_requirements.toUpperCase().indexOf(filter_requirements) > -1 && td_feat21.toUpperCase().indexOf(filter_feat21) > -1 && td_feat24.toUpperCase().indexOf(filter_feat24) > -1 && td_feat30.toUpperCase().indexOf(filter_feat30) > -1 && td_power26.toUpperCase().indexOf(filter_power26) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// show html for epic paths from converted markdown
// TODO - some way to link to powers, either here or on the lv 26 power display on the table view
async function showEpicInfo (key, enable_navigation)
{
    var epic_name = epic_data[key]["Name"];
    let url = "data/markdown-to-html/epic/" + epic_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();

    if (enable_navigation)
    {
        showModalNavigation ("epic", key, epic_name_list, "showEpicInfo", epic_table, epic_data);
    }

    modal_div.style.display = "block";
    
    // set URL to reflect power we're showing via params, can then copy this URL to go straight to the show info modal for this power
    removeUrlSearchParamsExcept("epic");
    updateUrlSearchParams("epic", key);
}


function updateEpicDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlEpicName");
    dl_description = document.getElementById("dlEpicDescription");
    dl_requirements = document.getElementById("dlEpicRequirements");
    dl_feat21 = document.getElementById("dlEpicFeat21");
    dl_feat24 = document.getElementById("dlEpicFeat24");
    dl_feat30 = document.getElementById("dlEpicFeat30");
    dl_power26 = document.getElementById("dlEpicPower26");

    // populate datalists
    updateDataList(dl_name, epic_name_list);
    updateDataList(dl_description, epic_description_list);
    updateDataList(dl_requirements, epic_requirements_list);
    updateDataList(dl_feat21, epic_feat21_list);
    updateDataList(dl_feat24, epic_feat24_list);
    updateDataList(dl_feat30, epic_feat30_list);
    updateDataList(dl_power26, epic_power26_list);
}