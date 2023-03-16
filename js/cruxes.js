// load crux table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_crux_json_data, false ); // fires the get method on page load

var crux_table = document.getElementById('cruxTable');
var crux_data = {};

var crux_name_list = [];
var crux_skill_list = [];
var crux_feat1_list = [];
var crux_feat2_list = [];
var crux_power_list = [];

// this function is in the event listener and will execute on page load
function get_crux_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/cruxes.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            crux_data = JSON.parse(this.responseText);
            append_crux_json(crux_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'cruxTable'
function append_crux_json(crux_data)
{
    Object.keys(crux_data).forEach(key => {      
        
        crux_name_list.push(crux_data[key]["Name"]);
        crux_skill_list.push(crux_data[key]["Skill Bonus"]);
        crux_feat1_list.push(crux_data[key]["Feature 1 Name"]);
        crux_feat2_list.push(crux_data[key]["Feature 2 Name"]);
        crux_power_list.push(crux_data[key]["Power"]);
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "crux_" + key;
        var crux_name = crux_data[key]["Name"];
        // open modal dialogue for Crux info - opens html
        tr.innerHTML = '<td>' + '<a href="#" onclick="showCruxInfo(' + key + ', 1' + ')">' + crux_name + '</a>' + '</td>' +
        '<td>' + crux_data[key]["Skill Bonus"] + '</td>' +
        '<td>' + crux_data[key]["Feature 1 Name"] + '</td>' +
        '<td>' + crux_data[key]["Feature 2 Name"] + '</td>' +
        '<td>' + crux_data[key]["Power"] + '</td>';
        crux_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    crux_name_list = [...new Set(crux_name_list)].sort();
    crux_skill_list = [...new Set(crux_skill_list)].sort();
    crux_feat1_list = [...new Set(crux_feat1_list)].sort();
    crux_feat2_list = [...new Set(crux_feat2_list)].sort();
    crux_power_list = [...new Set(crux_power_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateCruxDatalist();
}

// search on crux table
function searchCruxTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchCruxName");
    var input_skill = document.getElementById("searchCruxSkill");
    var input_feat1 = document.getElementById("searchCruxFeat1");
    var input_feat2 = document.getElementById("searchCruxFeat2");
    var input_power = document.getElementById("searchCruxPower");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_skill = input_skill.value.toUpperCase();
    let filter_feat1 = input_feat1.value.toUpperCase();
    let filter_feat2 = input_feat2.value.toUpperCase();
    let filter_power = input_power.value.toUpperCase();
    let tr = crux_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_skill = td[1].innerText;
        td_feat1 = td[2].innerText;
        td_feat2 = td[3].innerText;
        td_power = td[4].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_skill.toUpperCase().indexOf(filter_skill) > -1 && td_feat1.toUpperCase().indexOf(filter_feat1) > -1 && td_feat2.toUpperCase().indexOf(filter_feat2) > -1 && td_power.toUpperCase().indexOf(filter_power) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}

// like classes, show some html converted from markdown for the crux (this was the easiest way to show crux ancestry powers, as they're not included in the powers spreadsheet/table)
async function showCruxInfo (key, enable_navigation)
{
    var crux_name = crux_data[key]["Name"];
    let url = "data/markdown-to-html/crux/" + crux_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();
    
    if (enable_navigation)
    {
        showModalNavigation ("crux", key, crux_name_list, "showCruxInfo", crux_table, crux_data);
    }
    
    modal_div.style.display = "block";
}

function updateCruxDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlCruxName");
    dl_skill = document.getElementById("dlCruxSkill");
    dl_feat1 = document.getElementById("dlCruxFeat1");
    dl_feat2 = document.getElementById("dlCruxFeat2");
    dl_power = document.getElementById("dlCruxPower");

    // populate datalists
    updateDataList(dl_name, crux_name_list);
    updateDataList(dl_skill, crux_skill_list);
    updateDataList(dl_feat1, crux_feat1_list);
    updateDataList(dl_feat2, crux_feat2_list);
    updateDataList(dl_power, crux_power_list);
}