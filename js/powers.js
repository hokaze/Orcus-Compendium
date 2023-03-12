// load powers table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_power_json_data, false ); // fires the get method on page load

var powerData = {};

// this function is in the event listener and will execute on page load
function get_power_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/powers.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            power_data = JSON.parse(this.responseText);
            append_power_json(power_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'powerTable'
function append_power_json(power_data)
{
    var table = document.getElementById('powerTable');
    Object.keys(power_data).forEach(key => {      
        // ignore the Chapter headers
        if ( power_data[key]["Name"] == "Chapter")
        {
            return;
        }

        // ignore options explicitly marked as non-core for now
        // TODO - later give an option to toggle this and mark an asterisk by them?
        if ( power_data[key]["Not in Core"] == "1")
        {
            return;
        }
        
        // ignore Warrior class powers as we're not including Warrior as a class yet
        if ( power_data[key]["Source"] == "Class" && power_data[key]["List"] == "Warrior")
        {
            return;
        }
        
        // ignore Advanced Combat, Bond and Ancestry power options for now
        if ( power_data[key]["List"] == "Advanced Combat" || power_data[key]["Source"] == "Bonds" || power_data[key]["List"] == "Ancestries")
        {
            return;
        }

        // update table with new row
        var tr = document.createElement('tr');
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML =  '<td>' + '<a href="#" onclick="showPowerInfo(\'' + key + '\')">' + power_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + power_data[key]["Source"] + '</td>' +
        '<td>' + power_data[key]["List"] + '</td>' +
        '<td>' + power_data[key]["Category"] + '</td>' +
        '<td>' + power_data[key]["Frequency"] + '</td>' +
        '<td>' + power_data[key]["Tier"] + '</td>' +
        '<td>' + power_data[key]["Tags"] + '</td>';
        table.appendChild(tr);
    });
}

// search on Power table by name, role, tradition, etc
function searchPowerTable(searchInput, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchPowerName");
    var input_source = document.getElementById("searchPowerSource");
    var input_list = document.getElementById("searchPowerList");
    var input_category = document.getElementById("searchPowerCategory");
    var input_frequency = document.getElementById("searchPowerFrequency");
    var input_tier = document.getElementById("searchPowerTier");
    var input_tags = document.getElementById("searchPowerTags");
    
    var table = document.getElementById("powerTable");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_source = input_source.value.toUpperCase();
    let filter_list = input_list.value.toUpperCase();
    let filter_category = input_category.value.toUpperCase();
    let filter_frequency = input_frequency.value.toUpperCase();
    let filter_tier = input_tier.value.toUpperCase();
    let filter_tags = input_tags.value.toUpperCase();
    let tr = table.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_source = td[1].innerText;
        td_list = td[2].innerText;
        td_category = td[3].innerText;
        td_frequency = td[4].innerText;
        td_tier = td[5].innerText;
        td_tags = td[6].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_source.toUpperCase().indexOf(filter_source) > -1 && td_list.toUpperCase().indexOf(filter_list) > -1 && td_category.toUpperCase().indexOf(filter_category) > -1 && td_frequency.toUpperCase().indexOf(filter_frequency) > -1 && td_tier.toUpperCase().indexOf(filter_tier) > -1 && td_tags.toUpperCase().indexOf(filter_tags) > -1)
        {
            tr[i].style.display = "";
        }
        else
        {
            tr[i].style.display = "none";
        }
    }
}


// WIP - quick and dirty power display, just prints json info, no nice formatting, no html or markdown, reuses modalShowInfo
// modal popup that loads markdown-to-html class summaries with the github markdown css, appears on top of the page and can be dismissed
function showPowerInfo (powerID)
{
    var modalDiv = document.getElementById("modalShowInfo");
    var contentDiv = document.getElementById("showInfoContent");
    
    contentDiv.innerHTML = "<h3>" + power_data[powerID]["Name"] + "</h3>" +
    "<h4>" + power_data[powerID]["List"] + "</h4>" +
    "<p><i>" + power_data[powerID]["Flavor"] + "</i>" + "<br/>" +
    "<br/><strong>" + power_data[powerID]["Frequency"] + " " + power_data[powerID]["Category"] + " " + power_data[powerID]["Tier"] + " (" + power_data[powerID]["Action"] + ") - " + power_data[powerID]["Tags"] + "</strong>" +
    "<br/><strong>" + power_data[powerID]["Range"] + "</strong> " + power_data[powerID]["Range Details"] +
    "<br/><strong>Trigger:</strong> " + power_data[powerID]["Trigger"] +
    "<br/><strong>Attack:</strong> " + power_data[powerID]["Attack"] + " vs " + power_data[powerID]["Defense"] +
    "<br/><strong>Hit:</strong> " + power_data[powerID]["Hit"] +
    "<br/><strong>Miss:</strong> " + power_data[powerID]["Miss"] +
    "<br/><strong>Effect:</strong> " + power_data[powerID]["Effect"] +
    "<br/><strong>Special:</strong> " + power_data[powerID]["Special"] +
    "</p>";
    
    modalDiv.style.display = "block";
}