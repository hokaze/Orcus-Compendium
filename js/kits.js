// load kit table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_kit_json_data, false ); // fires the get method on page load

var kitData = {};

// this function is in the event listener and will execute on page load
function get_kit_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/kits.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            kit_data = JSON.parse(this.responseText);
            append_kit_json(kit_data);
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
function append_kit_json(kit_data)
{
    var table = document.getElementById('kitTable');
    Object.keys(kit_data).forEach(key => {      

        // update table with new row
        var tr = document.createElement('tr');
        var kit_name = kit_data[key]["Name"];
        // open modal dialogue for kit info - opens html
        tr.innerHTML = '<td>' + '<a href="#" onclick="showKitInfo(\'' + kit_name + '\')">' + kit_name + '</a>' + '</td>' +
        '<td>' + kit_data[key]["Description"] + '</td>' +
        '<td>' + kit_data[key]["Requirements"] + '</td>' +
        '<td>' + kit_data[key]["Lv 1 Feature"] + '</td>' +
        '<td>' + kit_data[key]["Lv 5 Feature"] + '</td>' +
        '<td>' + kit_data[key]["Lv 10 Feature"] + '</td>' +
        '<td>' + kit_data[key]["Associated Discipline"] + '</td>';
        table.appendChild(tr);
    });
}

// search on kit table
function searchKitTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchKitName");
    var input_description = document.getElementById("searchKitDescription");
    var input_requirements = document.getElementById("searchKitRequirements");
    var input_feat1 = document.getElementById("searchKitFeat1");
    var input_feat5 = document.getElementById("searchKitFeat5");
    var input_feat10 = document.getElementById("searchKitFeat10");
    var input_discipline = document.getElementById("searchKitDiscipline");
    
    var table = document.getElementById("kitTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_description = input_description.value.toUpperCase();
    let filter_requirements = input_requirements.value.toUpperCase();
    let filter_feat1 = input_feat1.value.toUpperCase();
    let filter_feat5 = input_feat5.value.toUpperCase();
    let filter_feat10 = input_feat10.value.toUpperCase();
    let filter_discipline = input_discipline.value.toUpperCase();
    let tr = table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_description = td[1].innerText;
        td_requirements = td[2].innerText;
        td_feat1 = td[3].innerText;
        td_feat5 = td[4].innerText;
        td_feat10 = td[5].innerText;
        td_discipline = td[6].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_description.toUpperCase().indexOf(filter_description) > -1 && td_requirements.toUpperCase().indexOf(filter_requirements) > -1 && td_feat1.toUpperCase().indexOf(filter_feat1) > -1 && td_feat5.toUpperCase().indexOf(filter_feat5) > -1 && td_feat10.toUpperCase().indexOf(filter_feat10) > -1 && td_discipline.toUpperCase().indexOf(filter_discipline) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// like classes, show some html converted from markdown for the kit (this was the easiest way to show kit ancestry powers, as they're not included in the powers spreadsheet/table)
async function showKitInfo (kitName)
{
    let url = "data/markdown-to-html/kit/" + kitName + ".html";
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    contentDiv.innerHTML = await (await fetch(url)).text();
    
    modalDiv.style.display = "block";
}