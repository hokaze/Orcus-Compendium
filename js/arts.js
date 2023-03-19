// load art table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_art_json_data, false ); // fires the get method on page load

var art_table = document.getElementById('artTable');
var art_data = {};

var art_name_list = [];
var art_level_list = [];
var art_type_list = [];
var art_category_list = [];
var art_skill_list = [];
var art_time_list = [];

// this function is in the event listener and will execute on page load
function get_art_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/arts.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            art_data = JSON.parse(this.responseText);
            append_art_json(art_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table
function append_art_json(art_data)
{   
    // loop over data
    Object.keys(art_data).forEach(key => {      
        // ignore the Chapter headers
        if ( art_data[key]["Name"] == "Chapter")
        {
            return;
        }
        
        // arrays used to enable search boxes to have dropdown lists
        art_name_list.push(art_data[key]["Name"]);
        art_level_list.push(art_data[key]["Level"]);
        art_type_list.push(art_data[key]["Type"]);
        art_category_list.push(art_data[key]["Category"]);
        art_skill_list.push(art_data[key]["Skill"]);
        art_time_list.push(art_data[key]["Completion Time"]);

        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "art_" + key;
        // open modal dialogue for Art info
        tr.innerHTML = '<td>' + '<a href="#" onclick="showArtInfo(' + key + ', 1' + ')">' + art_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + art_data[key]["Level"] + '</td>' +
        '<td>' + art_data[key]["Type"] + '</td>' +
        '<td>' + art_data[key]["Category"] + '</td>' +
        '<td>' + art_data[key]["Skill"] + '</td>' +
        '<td>' + art_data[key]["Completion Time"] + '</td>';
        art_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    art_name_list = [...new Set(art_name_list)].sort();
    // additionally, sort alphabetically, except Level, which is sorted numerically in ascending order
    art_level_list = [...new Set(art_level_list)].sort(function(a,b){return a-b});
    art_type_list = [...new Set(art_type_list)].sort();
    art_category_list = [...new Set(art_category_list)].sort();
    art_skill_list = [...new Set(art_skill_list)].sort();
    art_time_list = [...new Set(art_time_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateArtDatalist();
}

// search on art table by name, role, tradition, etc
function searchArtTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchArtName");
    var input_level = document.getElementById("searchArtLevel");
    var input_type = document.getElementById("searchArtType");
    var input_category = document.getElementById("searchArtCategory");
    var input_skill = document.getElementById("searchArtSkill");
    var input_time = document.getElementById("searchArtTime");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_level = input_level.value.toUpperCase();
    let filter_type = input_type.value.toUpperCase();
    let filter_category = input_category.value.toUpperCase();
    let filter_skill = input_skill.value.toUpperCase();
    let filter_time = input_time.value.toUpperCase();
    let tr = art_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_level = td[1].innerText;
        td_type = td[2].innerText;
        td_category = td[3].innerText;
        td_skill = td[4].innerText;
        td_time = td[5].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_level.toUpperCase().indexOf(filter_level) > -1 && td_type.toUpperCase().indexOf(filter_type) > -1 && td_category.toUpperCase().indexOf(filter_category) > -1 && td_skill.toUpperCase().indexOf(filter_skill) > -1 && td_time.toUpperCase().indexOf(filter_time) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// quick and dirty arts display from json data
function showArtInfo (key, enable_navigation)
{   
    content_div.innerHTML = "<h3>" + art_data[key]["Name"] + "</h3>" +
    "<h4>" + art_data[key]["Type"] + "</h4>" +
    "<p><strong>Level:</strong> " + art_data[key]["Level"] +
    "<br/><strong>Category:</strong> " + art_data[key]["Category"] +
    "<br/><strong>Skill:</strong> " + art_data[key]["Skill"] +
    "<br/><strong>Completion Time:</strong> " + art_data[key]["Completion Time"] +
    "<br/><strong>Components:</strong> " + art_data[key]["Components"] +
    "<br/><strong>Cost to Learn:</strong> " + art_data[key]["Cost to Learn"] +
    "<br/><strong>Duration:</strong> " + art_data[key]["Duration"] +
    "<br/><br/><i>" + art_data[key]["Description"] + "</i></p>";

    if (enable_navigation)
    {
        showModalNavigation ("art", key, art_name_list, "showArtInfo", art_table, art_data);
    }

    modal_div.style.display = "block";
}

function updateArtDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlArtName");
    dl_level = document.getElementById("dlArtLevel");
    dl_type = document.getElementById("dlArtType");
    dl_category = document.getElementById("dlArtCategory");
    dl_skill = document.getElementById("dlArtSkill");
    dl_time = document.getElementById("dlArtTime");

    // populate datalists
    updateDataList(dl_name, art_name_list);
    updateDataList(dl_level, art_level_list);
    updateDataList(dl_type, art_type_list);
    updateDataList(dl_category, art_category_list);
    updateDataList(dl_skill, art_skill_list);
    updateDataList(dl_time, art_time_list);
}