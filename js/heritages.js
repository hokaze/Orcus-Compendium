// load heritage table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_heritage_json_data, false ); // fires the get method on page load

var heritageData = {};

// this function is in the event listener and will execute on page load
function get_heritage_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/heritages.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            heritage_data = JSON.parse(this.responseText);
            append_heritage_json(heritage_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'heritageTable'
function append_heritage_json(heritage_data)
{
    var table = document.getElementById('heritageTable');
    Object.keys(heritage_data).forEach(key => {      

        // update table with new row
        var tr = document.createElement('tr');
        var heritage_name = heritage_data[key]["Name"];
        // open modal dialogue for Crux info - similar to power display
        tr.innerHTML =  '<td>' + '<a href="#" onclick="showHeritageInfo(\'' + key + '\')">' + heritage_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + heritage_data[key]["Skill Bonus"] + '</td>' +
        '<td>' + heritage_data[key]["Feature Name"] + '</td>' +
        '<td>' + heritage_data[key]["Feature Description"] + '</td>';
        table.appendChild(tr)
    });
}

// search on heritage table
function searchHeritageTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchHeritageName");
    var input_skill = document.getElementById("searchHeritageSkill");
    var input_feat1 = document.getElementById("searchHeritageFeatName");
    var input_feat2 = document.getElementById("searchHeritageFeatDesc");
    
    var table = document.getElementById("heritageTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_skill = input_skill.value.toUpperCase();
    let filter_feat_name = input_feat_name.value.toUpperCase();
    let filter_feat_desc = input_feat_desc.value.toUpperCase();
    let tr = table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_skill = td[1].innerText;
        td_feat_name = td[2].innerText;
        td_feat_desc = td[3].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_skill.toUpperCase().indexOf(filter_skill) > -1 && td_featName.toUpperCase().indexOf(filter_feat_name) > -1 && td_feat_desc.toUpperCase().indexOf(filter_feat_desc) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// like powers, quick and dirty, just print json info in the modal popup
function showHeritageInfo (heritageID)
{
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    contentDiv.innerHTML = "<h3>" + heritage_data[heritageID]["Name"] + "</h3>" +
    "<p><i>" + heritage_data[heritageID]["Flavor"] + "</i>" + "<br/>" +
    "<br/><strong>Skill Bonus:</strong> " + heritage_data[heritageID]["Skill Bonus"] +
    "<br/><strong>" + heritage_data[heritageID]["Feature Name"] + ":</strong> " + heritage_data[heritageID]["Feature Description"] +
    "</p>";
    
    modalDiv.style.display = "block";
}