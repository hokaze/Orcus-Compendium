// load art table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_art_json_data, false ); // fires the get method on page load

var artData = {};

// this function is in the event listener and will execute on page load
function get_art_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/arts.json';

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

// this function appends the json data to the table 'classTable'
function append_art_json(art_data)
{
    var table = document.getElementById('artTable');
    Object.keys(art_data).forEach(key => {      
        // ignore the Chapter headers
        if ( art_data[key]["Name"] == "Chapter")
        {
            return;
        }

        // update table with new row
        var tr = document.createElement('tr');
        var art_name = art_data[key]["Name"];
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML = '<td>' + '<a href="#" onclick="showArtInfo(\'' + key + '\')">' + art_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + art_data[key]["Level"] + '</td>' +
        '<td>' + art_data[key]["Type"] + '</td>' +
        '<td>' + art_data[key]["Category"] + '</td>' +
        '<td>' + art_data[key]["Skill"] + '</td>' +
        '<td>' + art_data[key]["Completion Time"] + '</td>';
        table.appendChild(tr);
    });
}

// search on class table by name, role, tradition, etc
function searchArtTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchArtName");
    var input_level = document.getElementById("searchArtLevel");
    var input_type = document.getElementById("searchArtType");
    var input_category = document.getElementById("searchArtCategory");
    var input_skill = document.getElementById("searchArtSkill");
    var input_time = document.getElementById("searchArtTime");
    var table = document.getElementById("artTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_level = input_level.value.toUpperCase();
    let filter_type = input_type.value.toUpperCase();
    let filter_category = input_category.value.toUpperCase();
    let filter_skill = input_skill.value.toUpperCase();
    let filter_time = input_time.value.toUpperCase();
    let tr = table.rows;
    
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


// WIP - quick and dirty art display, using basic power display as starting point
function showArtInfo (artID)
{
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    contentDiv.innerHTML = "<h3>" + art_data[artID]["Name"] + "</h3>" +
    "<h4>" + art_data[artID]["Type"] + "</h4>" +
    "<p><strong>Level:</strong> " + art_data[artID]["Level"] +
    "<br/><strong>Category:</strong> " + art_data[artID]["Category"] +
    "<br/><strong>Skill:</strong> " + art_data[artID]["Skill"] +
    "<br/><strong>Completion Time:</strong> " + art_data[artID]["Completion Time"] +
    "<br/><strong>Components:</strong> " + art_data[artID]["Components"] +
    "<br/><strong>Cost to Learn:</strong> " + art_data[artID]["Cost to Learn"] +
    "<br/><strong>Duration:</strong> " + art_data[artID]["Duration"] +
    "<br/><br/><i>" + art_data[artID]["Description"] + "</i></p>";
    
    modalDiv.style.display = "block";
}