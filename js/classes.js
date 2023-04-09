// load class table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_class_json_data, false ); // fires the get method on page load

var class_table = document.getElementById('classTable');
var class_data = {};

var class_name_list = [];
var class_tradition_list = [];
var class_role_list = [];
var class_key_ability_list = [];
var class_disciplines_list = [];

const class_name_to_key = new Map();

// this function is in the event listener and will execute on page load
function get_class_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/classes.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            class_data = JSON.parse(this.responseText);
            append_class_json(class_data);
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
function append_class_json(class_data)
{
    // loop over data
    Object.keys(class_data).forEach(key => {      
        // only include Completed classes, not experimental ones
        if ( class_data[key]["Completed"] != "1")
        {
            // JS forEach is a function and not a normal loop so we can't use continue, break, etc, but in this case an early return functions as a "continue"
            return;
        }

        // the Warrior has Completed set but isn't actually in core book, doesn't have key ability or disicplines set, so ignore this class too if still actually unfinished
        if ( class_data[key]["Name"] == "Warrior" & class_data[key]["Key Ability"] == "")
        {
            return;
        }
        
        // arrays used to enable search boxes to have dropdown lists
        class_name_list.push(class_data[key]["Name"]);
        class_tradition_list.push(class_data[key]["Tradition"]);
        class_role_list.push(class_data[key]["Role"]);
        class_key_ability_list.push(class_data[key]["Key Ability"]);
        
        // for class disciplines we want the dropdown suggestions to suggest individual disciplines, not the comma-separated list each class has, so we need to split it so something like Commander's "Angel’s Trumpet, Golden Lion" is instead recorded as "Angel’s Trumpet" and "Golden Lion" as distinct entries
        class_disciplines_list.push(... class_data[key]["Class Disciplines - List"].split(", "));
        
        // Priest csv data indicates they only get Angel's Trumpet, which is misleading, as they also gain an additional Discipline based on the domain they take, based on their free "Worships the [X]" kit. We add a note to the display here so users know they get multiple Disciplines like the other classes
        // IMPORTANT! - this is added to the discipline AFTER we populate the class_disciplines_list so it ONLY appears on the table and NOT in the datalist dropdown
        if ( class_data[key]["Name"] == "Priest" & class_data[key]["Class Disciplines - List"] == "Angel’s Trumpet")
        {
            class_data[key]["Class Disciplines - List"] += ', <i>plus one other discipline from your free "Worships the [X]" Kit from this class</i>';
        }
        
        // hashmap for looking up key from class name, useful for running showClassInfo from other tabs/tables
        class_name_to_key.set(class_data[key]["Name"], key);

        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "class_" + key;
        var class_name = class_data[key]["Name"];
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML = '<td>' + '<a href="#" onclick="showClassInfo(' + key + ', 1' + ')">' + class_name + '</a>' + '</td>' +
        '<td>' + '<a href="#" onclick="showClassMiscInfo(\'Tradition\')">' + class_data[key]["Tradition"] + '</a>' + '</td>' +
        '<td>' + '<a href="#" onclick="showClassMiscInfo(\'Role\')">' + class_data[key]["Role"] + '</a>' + '</td>' +
        '<td>' + class_data[key]["Key Ability"] + '</td>' +
        '<td>' + class_data[key]["Class Disciplines - List"] + '</td>';
        class_table.appendChild(tr);
    });
    
    // turn the lists into unique sets to avoid having the same dropdown option multiple times (e.g. multiple Leader classes normally means multiple Leader entries on class_role_list)
    // additionally, sort alphabetically
    class_name_list = [...new Set(class_name_list)].sort();
    class_tradition_list = [...new Set(class_tradition_list)].sort();
    class_role_list = [...new Set(class_role_list)].sort();
    class_key_ability_list = [...new Set(class_key_ability_list)].sort();
    class_disciplines_list = [...new Set(class_disciplines_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateClassDatalist();
}

// search on class table by name, role, tradition, etc
function searchClassTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchClassName");
    var input_tradition = document.getElementById("searchClassTradition");
    var input_role = document.getElementById("searchClassRole");
    var input_key_ability = document.getElementById("searchClassKeyAbility");
    var input_class_disciplines = document.getElementById("searchClassDisciplines");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_tradition = input_tradition.value.toUpperCase();
    let filter_role = input_role.value.toUpperCase();
    let filter_key_ability = input_key_ability.value.toUpperCase();
    let filter_class_disciplines = input_class_disciplines.value.toUpperCase();
    
    // disabled cloning - it's slightly slower than just editing the table directly for smaller tables, only really sees benefit on Powers and Feats
    //class_table = document.getElementById('classTable');
    //let class_table_copy = class_table.cloneNode(true);
    //let tr = class_table_copy.rows;
    
    let tr = class_table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_tradition = td[1].innerText;
        td_role = td[2].innerText;
        td_key_ability = td[3].innerText;
        td_class_disciplines = td[4].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_tradition.toUpperCase().indexOf(filter_tradition) > -1 && td_role.toUpperCase().indexOf(filter_role) > -1 && td_key_ability.toUpperCase().indexOf(filter_key_ability) > -1 && td_class_disciplines.toUpperCase().indexOf(filter_class_disciplines) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
    
    // clone + replace disabled as it's slightly slower for this table
    //class_table.replaceWith(class_table_copy);
}

// modal popup that loads markdown-to-html class summaries with the github markdown css, appears on top of the page and can be dismissed
async function showClassInfo (key, enable_navigation, close_showinfo)
{   
    // fetch class html file
    var class_name = class_data[key]["Name"];
    let url = "data/markdown-to-html/class/" + class_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();
    
    // only add navigation if enabled, as we have this disabled when showing Tradition.html and Role.html as they error otherwise, as they have no next/prev items to display!
    if (enable_navigation)
    {
        showModalNavigation ("class", key, class_name_list, "showClassInfo", class_table, class_data);
    }
    
    // return to the previous showInfo if viewing from another context
    this.modal_div_showinfo_on_close = close_showinfo;
    
    modal_div.style.display = "block";
}

// handling misc html files in class folder, like Tradition and Role that do NOT use keys or navigation buttons
async function showClassMiscInfo (misc_name)
{   
    // fetch class html file
    let url = "data/markdown-to-html/class/misc/" + misc_name + ".html";
    content_div.innerHTML = await (await fetch(url)).text();
    
    modal_div.style.display = "block";
}


function updateClassDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlClassName");
    dl_tradition = document.getElementById("dlClassTradition");
    dl_role = document.getElementById("dlClassRole");
    dl_key_ability = document.getElementById("dlClassKeyAbility");
    dl_class_disciplines = document.getElementById("dlClassDisciplines");

    // populate datalists
    updateDataList(dl_name, class_name_list);
    updateDataList(dl_tradition, class_tradition_list);
    updateDataList(dl_role, class_role_list);
    updateDataList(dl_key_ability, class_key_ability_list);
    updateDataList(dl_class_disciplines, class_disciplines_list);
}