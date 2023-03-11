// load class table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_class_json_data, false ); // fires the get method on page load

var class_data = {};

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
    var table = document.getElementById('classTable');
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
        var class_name = class_data[key]["Name"];
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML = '<td>' + '<a href="#" onclick="showClassInfo(\'' + class_name + '\')">' + class_name + '</a>' + '</td>' +
        '<td>' + class_data[key]["Tradition"] + '</td>' +
        '<td>' + class_data[key]["Role"] + '</td>' +
        '<td>' + class_data[key]["Key Ability"] + '</td>' +
        '<td>' + class_data[key]["Class Disciplines - List"] + '</td>';
        table.appendChild(tr);
    });
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
async function showClassInfo (className)
{
    let url = "data/markdown-to-html/class/" + className + ".html";
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    contentDiv.innerHTML = await (await fetch(url)).text();
    
    modalDiv.style.display = "block";
}

function hideModal ()
{
    var modalDiv = document.getElementById("modalShowInfo");
    modalDiv.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event)
{
    var modalDiv = document.getElementById("modalShowInfo");
    
    if (event.target == modalDiv)
    {
        modalDiv.style.display = "none";
    }
}