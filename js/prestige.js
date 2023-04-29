// load prestige table

// do NOT run on page load - append_prestige_json depends on power_data and power_name_to_key already existing, so we have to ensure get_prestige_json_data is called AFTER append_power_json_data
//document.addEventListener( "DOMContentLoaded", get_prestige_json_data, false );

var prestige_table = document.getElementById('prestigeTable');
var prestige_data = {};

prestige_name_list = [];
prestige_requirements_list = [];
prestige_feat11_1_list = [];
prestige_feat11_2_list = [];
prestige_feat16_list = [];
prestige_power11_list = [];
prestige_power12_list = [];
prestige_power20_list = [];

// this function is in the event listener and will execute on page load
function get_prestige_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/prestige.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            prestige_data = JSON.parse(this.responseText);
            append_prestige_json(prestige_data);
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
function append_prestige_json(prestige_data)
{
    Object.keys(prestige_data).forEach(key => {
        
        // arrays used to enable search boxes to have dropdown lists (and required for prev/next buttons)
        prestige_name_list.push(prestige_data[key]["Name"]);
        prestige_requirements_list.push(prestige_data[key]["Requirements"]);
        prestige_feat11_1_list.push(prestige_data[key]["Lv 11 Feature 1"]);
        prestige_feat11_2_list.push(prestige_data[key]["Lv 11 Feature 2"]);
        prestige_feat16_list.push(prestige_data[key]["Lv 16 Feature"]);
        prestige_power11_list.push(prestige_data[key]["Lv 11 Power"]);
        prestige_power12_list.push(prestige_data[key]["Lv 12 Power"]);
        prestige_power20_list.push(prestige_data[key]["Lv 20 Power"]);
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "prestige_" + key;
        var prestige_name = prestige_data[key]["Name"];
        var prestige_power11 = prestige_data[key]["Lv 11 Power"];
        var prestige_power12 = prestige_data[key]["Lv 12 Power"];
        var prestige_power20 = prestige_data[key]["Lv 20 Power"];
        
        // open modal dialogue for kit info - opens html
        tr.innerHTML = '<td>' + '<a href="#" onclick="showPrestigeInfo(' + key + ', 1' + ')">' + prestige_name + '</a>' + '</td>' +
        '<td>' + prestige_data[key]["Requirements"] + '</td>' +
        '<td>' + prestige_data[key]["Lv 11 Feature 1"] + '</td>' +
        '<td>' + prestige_data[key]["Lv 11 Feature 2"] + '</td>' +
        '<td>' + prestige_data[key]["Lv 16 Feature"] + '</td>';
        
        // make powers in table showPowerInfo
        tr.innerHTML += '<td><a href="#" onclick="showPowerInfo(' + power_name_to_key.get(prestige_power11) + ', 0)\">' + prestige_power11 + '</a>' + '</td>' +
        '<td><a href="#" onclick="showPowerInfo(' + power_name_to_key.get(prestige_power12) + ', 0)\">' + prestige_power12 + '</a>' + '</td>' +
        '<td><a href="#" onclick="showPowerInfo(' + power_name_to_key.get(prestige_power20) + ', 0)\">' + prestige_power20 + '</a>' + '</td>';
        
        prestige_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    prestige_name_list = [...new Set(prestige_name_list)].sort();
    prestige_requirements_list = [...new Set(prestige_requirements_list)].sort();
    prestige_feat11_1_list = [...new Set(prestige_feat11_1_list)].sort();
    prestige_feat11_2_list = [...new Set(prestige_feat11_2_list)].sort();
    prestige_feat16_list = [...new Set(prestige_feat16_list)].sort();
    prestige_power11_list = [...new Set(prestige_power11_list)].sort();
    prestige_power12_list = [...new Set(prestige_power12_list)].sort();
    prestige_power20_list = [...new Set(prestige_power20_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updatePrestigeDatalist();
}

// search on kit table
function searchPrestigeTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchPrestigeName");
    var input_requirements = document.getElementById("searchPrestigeRequirements");
    var input_feat11_1 = document.getElementById("searchPrestigeFeat11-1");
    var input_feat11_2 = document.getElementById("searchPrestigeFeat11-2");
    var input_feat16 = document.getElementById("searchPrestigeFeat16");
    var input_power11 = document.getElementById("searchPrestigePower11");
    var input_power12 = document.getElementById("searchPrestigePower12");
    var input_power20 = document.getElementById("searchPrestigePower20");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_requirements = input_requirements.value.toUpperCase();
    let filter_feat11_1 = input_feat11_1.value.toUpperCase();
    let filter_feat11_2 = input_feat11_2.value.toUpperCase();
    let filter_feat16 = input_feat16.value.toUpperCase();
    let filter_power11 = input_power11.value.toUpperCase();
    let filter_power12 = input_power12.value.toUpperCase();
    let filter_power20 = input_power20.value.toUpperCase();
    let tr = prestige_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_requirements = td[1].innerText;
        td_feat11_1 = td[2].innerText;
        td_feat11_2 = td[3].innerText;
        td_feat16 = td[4].innerText;
        td_power11 = td[5].innerText;
        td_power12 = td[6].innerText;
        td_power20 = td[7].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_requirements.toUpperCase().indexOf(filter_requirements) > -1 && td_feat11_1.toUpperCase().indexOf(filter_feat11_1) > -1 && td_feat11_2.toUpperCase().indexOf(filter_feat11_2) > -1 && td_feat16.toUpperCase().indexOf(filter_feat16) > -1 && td_power11.toUpperCase().indexOf(filter_power11) > -1 && td_power12.toUpperCase().indexOf(filter_power12) > -1 && td_power20.toUpperCase().indexOf(filter_power20) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// show html for prestige paths from converted markdown
// TODO - some way to link to powers, either here or on the power11, power12, power20 display on the table view
async function showPrestigeInfo (key, enable_navigation)
{
    var prestige_name = prestige_data[key]["Name"];
    let url = "data/markdown-to-html/prestige/" + prestige_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();

    if (enable_navigation)
    {
        showModalNavigation ("prestige", key, prestige_name_list, "showPrestigeInfo", prestige_table, prestige_data);
    }

    modal_div.style.display = "block";
}


function updatePrestigeDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlPrestigeName");
    dl_requirements = document.getElementById("dlPrestigeRequirements");
    dl_feat11_1 = document.getElementById("dlPrestigeFeat11-1");
    dl_feat11_2 = document.getElementById("dlPrestigeFeat11-1");
    dl_feat16 = document.getElementById("dlPrestigeFeat16");
    dl_power11 = document.getElementById("dlPrestigePower11");
    dl_power12 = document.getElementById("dlPrestigePower12");
    dl_power20 = document.getElementById("dlPrestigePower20");

    // populate datalists
    updateDataList(dl_name, prestige_name_list);
    updateDataList(dl_requirements, prestige_requirements_list);
    updateDataList(dl_feat11_1, prestige_feat11_1_list);
    updateDataList(dl_feat11_2, prestige_feat11_2_list);
    updateDataList(dl_feat16, prestige_feat16_list);
    updateDataList(dl_power11, prestige_power11_list);
    updateDataList(dl_power12, prestige_power12_list);
    updateDataList(dl_power20, prestige_power20_list);
}