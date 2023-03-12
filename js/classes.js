// load class table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_class_json_data, false ); // fires the get method on page load

var table = document.getElementById('classTable');
var class_data = {};

var class_name_list = [];
var class_tradition_list = [];
var class_role_list = [];
var class_key_ability_list = [];
var class_disciplines_list = [];

// this function is in the event listener and will execute on page load
function get_class_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/classes.json';

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

        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "class_" + key;
        var class_name = class_data[key]["Name"];
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML = '<td>' + '<a href="#" onclick="showClassInfo(\'' + class_name + '\',' + key + ')">' + class_name + '</a>' + '</td>' +
        '<td>' + '<a href="#" onclick="showClassInfo(\'misc/Tradition\')">' + class_data[key]["Tradition"] + '</a>' + '</td>' +
        '<td>' + '<a href="#" onclick="showClassInfo(\'misc/Role\')">' + class_data[key]["Role"] + '</a>' + '</td>' +
        '<td>' + class_data[key]["Key Ability"] + '</td>' +
        '<td>' + class_data[key]["Class Disciplines - List"] + '</td>';
        table.appendChild(tr);
        
        // arrays used to enable search boxes to have dropdown lists
        class_name_list.push(class_data[key]["Name"]);
        class_tradition_list.push(class_data[key]["Tradition"]);
        class_role_list.push(class_data[key]["Role"]);
        class_key_ability_list.push(class_data[key]["Key Ability"]);
        
        // for class disciplines we want the dropdown suggestions to suggest individual disciplines, not the comma-separated list each class has, so we need to split it so something like Commander's "Angel’s Trumpet, Golden Lion" is instead recorded as "Angel’s Trumpet" and "Golden Lion" as distinct entries
        class_disciplines_list.push(... class_data[key]["Class Disciplines - List"].split(", "));
    });
    
    // turn the lists into unique sets to avoid having the same dropdown option multiple times (e.g. multiple Leader classes normally means multiple Leader entries on class_role_list)
    class_name_list = [...new Set(class_name_list)];
    class_tradition_list = [...new Set(class_tradition_list)];
    class_role_list = [...new Set(class_role_list)];
    class_key_ability_list = [...new Set(class_key_ability_list)];
    class_disciplines_list = [...new Set(class_disciplines_list)];
    
    // create + attach datalist to enable dropdown on search boxes
    updateClassDatalist();
}

// search on class table by name, role, tradition, etc
function searchClassTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchClassName");
    var input_tradition = document.getElementById("searchClassTradition");
    var input_role = document.getElementById("searchClassRole");
    var input_key_ability = document.getElementById("searchClassKeyAbility");
    var input_class_disciplines = document.getElementById("searchClassDisciplines");
    
    var table = document.getElementById("classTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_tradition = input_tradition.value.toUpperCase();
    let filter_role = input_role.value.toUpperCase();
    let filter_key_ability = input_key_ability.value.toUpperCase();
    let filter_class_disciplines = input_class_disciplines.value.toUpperCase();
    let tr = table.rows;
    
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
}

// modal popup that loads markdown-to-html class summaries with the github markdown css, appears on top of the page and can be dismissed
async function showClassInfo (className, key)
{   
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    // remove the navigation buttons, otherwise each call of this method produces additional buttons stacked atop each other
    var modalLeftDiv = document.getElementById("modal_nav_left");
    var modalRightDiv = document.getElementById("modal_nav_right");
    if (modalLeftDiv)
    {
        modalLeftDiv.remove();
    }
    if (modalRightDiv)
    {
        modalRightDiv.remove();
    }
    
    // fetch class html file
    let url = "data/markdown-to-html/class/" + className + ".html";
    contentDiv.innerHTML = await (await fetch(url)).text();
    
    // use key passed in to determine what row we're on so we can grab the next VISIBLE table rows for LEFT and RIGHT navigation arrows, letting us "flip pages" rather than having to close the modal to view the next
    
    // grab the current row index - this is not always the same as the key, as some data is 0-index, rows at 1-index due to headers being on 0, etc - best to be absoltuely certain of actual row index
    var rowID = "class_" + key;
    var currentRow = document.getElementById(rowID).rowIndex;
    var prevRow = '';
    var nextRow = '';
    var lookingForPrev = 1;
    var buttonHTML = "";
    
    // loop over table rows (starting from index 1 NOT 0, so we skip the header row) to try and find the previous and next VISIBLE rows (and if first/last, do NOT generate the prev/next buttons)
    for (var i = 1, row; row = table.rows[i]; i++)
    {
        if (row.style.display == 'none')
        {
            continue;
        }
        if (lookingForPrev)
        {
            if (row.rowIndex == currentRow)
            {
                lookingForPrev = 0;
            }
            else
            {
                prevRow = row.id;
            }
        }
        else
        {
            nextRow = row.id;
            break;
        }
    }
    
    // row id takes format of class_key, so anything after the _ is the key and from there we can lookup the class name and setup a new call to showClassInfo to replace this page with the prev/next page
    var prevKey = prevRow.split("_")[1];
    var nextKey = nextRow.split("_")[1];
    var prevClass = '';
    var nextClass = '';
    if (prevKey)
    {
        // row ids are 1-index, name list is 0-index, need to -1
        var class_name = class_name_list[prevKey-1];
        prevClass = ' onclick="showClassInfo(\'' + class_name + '\',' + prevKey + ')"';
    }
    if (nextKey)
    {
        var class_name = class_name_list[nextKey-1];
        nextClass = ' onclick="showClassInfo(\'' + class_name + '\',' + nextKey + ')"';
    }
    
    // prev button
    buttonHTML += '<button id="modal_nav_left"' + prevClass + ' style="position:fixed; top: 25%; left:0%;font-size:50px; float:left; background-color:white; border-radius:100px; margin:5%; padding:20px; border-width:0px;'
    // if we don't create the prev button the next button gets offset, so if there is no prevRow we still make the button, but hide it
    if (prevRow == '')
    {
        buttonHTML += 'display: none;';
    }
    buttonHTML += '">&lt;--</button>';
    
    // next button
    buttonHTML += '<button id="modal_nav_right"' + nextClass + ' style="position:fixed; top: 25%; right:0%;font-size:50px; float:left; background-color:white; border-radius:100px; margin:5%; padding:20px; border-width:0px;'
    // next button is also hidden if there's no nextRow
    if (nextRow == '')
    {
        buttonHTML += 'display: none;';
    }
    buttonHTML += '">--&gt;</button></div>';
    
    modalDiv.innerHTML += buttonHTML;
    
    modalDiv.style.display = "block";
}

function updateClassDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlClassName");
    dl_tradition = document.getElementById("dlClassTradition");
    dl_role = document.getElementById("dlClassRole");
    dl_key_ability = document.getElementById("dlClassKeyAbility");
    dl_class_disciplines = document.getElementById("dlClassDisciplines");
    
    // loop over lists, add to datalist elements
    for (i = 0; i < class_name_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = class_name_list[i];
        dl_name.appendChild(option);
    }
    for (i = 0; i < class_tradition_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = class_tradition_list[i];
        dl_tradition.appendChild(option);
    }
    for (i = 0; i < class_role_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = class_role_list[i];
        dl_role.appendChild(option);
    }
    for (i = 0; i < class_key_ability_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = class_key_ability_list[i];
        dl_key_ability.appendChild(option);
    }
    for (i = 0; i < class_disciplines_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = class_disciplines_list[i];
        dl_class_disciplines.appendChild(option);
    }
}