// load powers table

// first add an event listener for page load
document.addEventListener( "DOMContentLoaded", get_power_json_data, false ); // fires the get method on page load

var power_table = document.getElementById('powerTable');
var power_data = {};

var power_name_list = [];
var power_source_list = [];
var power_list_list = [];
var power_category_list = [];
var power_frequency_list = [];
var power_tier_list = [];
var power_tags_list = [];

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
        
        // arrays used to enable search boxes to have dropdown lists
        power_name_list.push(power_data[key]["Name"]);
        power_source_list.push(power_data[key]["Source"]);
        power_list_list.push(power_data[key]["List"]);
        power_category_list.push(power_data[key]["Category"]);
        power_frequency_list.push(power_data[key]["Frequency"]);
        power_tier_list.push(power_data[key]["Tier"]);
        
        // like handling of class disciplines, split on comma so we can search by individual tags
        power_tags_list.push(... power_data[key]["Tags"].split(", "));

        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "power_" + key;
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML =  '<td>' + '<a href="#" onclick="showPowerInfo(' + key + ', 1' + ')">' + power_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + power_data[key]["Source"] + '</td>' +
        '<td>' + power_data[key]["List"] + '</td>' +
        '<td>' + power_data[key]["Category"] + '</td>' +
        '<td>' + power_data[key]["Frequency"] + '</td>' +
        '<td>' + power_data[key]["Tier"] + '</td>' +
        '<td>' + power_data[key]["Tags"] + '</td>';
        power_table.appendChild(tr);
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    power_name_list = [...new Set(power_name_list)].sort();
    power_source_list = [...new Set(power_source_list)].sort();
    power_list_list = [...new Set(power_list_list)].sort();
    power_category_list = [...new Set(power_category_list)].sort();
    power_frequency_list = [...new Set(power_frequency_list)].sort();
    
    // additionally, sort alphabetically, except Tier, which has a mix of numbered levels and text (e.g. "Feature"), so is sorted by data type then value, so numbers numerically, then letters alphabetically
    power_tier_list = [...new Set(power_tier_list)].sort(function(a,b){
        // incoming data from json has both numbered levels and non-numbers as strings, so need to try and convert to numbers while keeping non-numbers intact
        var a_n = Number(a), b_n = Number(b);
        if (isNaN(a) == false)
        {
            a = a_n;
        }
        if (isNaN(b) == false)
        {
            b = b_n;
        }
        var a1 = typeof a, b1 = typeof b;
        return a1 < b1 ? -1 : a1 > b1 ? 1 : a < b ? -1 : a > b ? 1 : 0;
    });
    
    power_tags_list = [...new Set(power_tags_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updatePowerDatalist();
}

// search on Power table
function searchPowerTable(search_input, column)
{    
    // revised for multiple search
    var input_name = document.getElementById("searchPowerName");
    var input_source = document.getElementById("searchPowerSource");
    var input_list = document.getElementById("searchPowerList");
    var input_category = document.getElementById("searchPowerCategory");
    var input_frequency = document.getElementById("searchPowerFrequency");
    var input_tier = document.getElementById("searchPowerTier");
    var input_tags = document.getElementById("searchPowerTags");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_source = input_source.value.toUpperCase();
    let filter_list = input_list.value.toUpperCase();
    let filter_category = input_category.value.toUpperCase();
    let filter_frequency = input_frequency.value.toUpperCase();
    let filter_tier = input_tier.value.toUpperCase();
    let filter_tags = input_tags.value.toUpperCase();
    let tr = power_table.rows;
    
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

function updatePowerDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlPowerName");
    dl_source = document.getElementById("dlPowerSource");
    dl_list = document.getElementById("dlPowerList");
    dl_category = document.getElementById("dlPowerCategory");
    dl_frequency = document.getElementById("dlPowerFrequency");
    dl_tier = document.getElementById("dlPowerTier");
    dl_tags = document.getElementById("dlPowerTags");

    // populate datalists
    updateDataList(dl_name, power_name_list);
    updateDataList(dl_source, power_source_list);
    updateDataList(dl_list, power_list_list);
    updateDataList(dl_category, power_category_list);
    updateDataList(dl_frequency, power_frequency_list);
    updateDataList(dl_tier, power_tier_list);
    updateDataList(dl_tags, power_tags_list);
}

// modal popup that displays powers from the json data and formats them like 4e-style power cards
function showPowerInfo (key, enable_navigation)
{
    var modal_div = document.getElementById("modalShowInfo");
    var content_div = document.getElementById("showInfoContent");
    
    // Experimental display, make powers look more like 4e power cards
    
    // set power card colours
    var colour_header = "Gold"; // fallback if power type not recognised, usually used for item powers/cards
    const colour_atwill = "#619769";
    const colour_encounter = "#961334";
    const colour_daily = "#4d4d4f";
    const colour_highlight = "#dddccc"; // used for flavour text and on alternating lines after the attack line for increased readability
    
    if (power_data[key]["Frequency"] == "At-Will")
    {
        colour_header = colour_atwill;
    }
    else if (power_data[key]["Frequency"] == "Encounter")
    {
        colour_header = colour_encounter;
    }
    else if (power_data[key]["Frequency"] == "Daily")
    {
        colour_header = colour_daily;
    }
    
    // header (power name on left, class and level/tier on right)
    content_div.innerHTML = '<div style="background-color:' + colour_header +';color:#FFFFFF;padding:1px 5px 0px 5px;min-height:40px;">' + '<div style="font-weight:bold;font-size:20px;float:left;">' + power_data[key]["Name"] + '</div>' + '<div style="font-size:20px;float:right;">' + power_data[key]["List"] + ' ' + power_data[key]["Tier"] + '</div></div>';
    
    // flavour line - show placeholder if no flavour text yet
    var flavour_text = power_data[key]["Flavor"] || '(no flavour text for this power yet)';
    content_div.innerHTML += '<div style="background-color:' + colour_highlight + ';font-style:italic;padding: 1px 0px 3px 5px;min-height:20px">' + flavour_text + '</div>';
    
    // power type/frequency, keywords/tags, action and range lines
    content_div.innerHTML += '<div style="padding-left:5px;"><span style="font-weight:bold;">'
    + power_data[key]["Frequency"] + '</span> - <span style="font-weight:bold;">' + power_data[key]["Tags"] +
    '</span><br><span style="font-weight:bold;">' + power_data[key]["Action"] + '</span> - <span style="font-weight:bold;">' + power_data[key]["Range"] + ' ' + '</span>' + power_data[key]["Range Details"] + '</div>';
    
    // conditional lines, only print if power has Trigger, Hit, Miss, Effect, Special lines, and alternate background colour for readability
    var alt_bg = 1;
    if (power_data[key]["Trigger"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Trigger", power_data[key]["Trigger"]);
    }
    if (power_data[key]["Attack"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Attack", power_data[key]["Attack"] + " vs " + power_data[key]["Defense"]);
    }
    if (power_data[key]["Hit"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Hit", power_data[key]["Hit"]);
    }
    if (power_data[key]["Miss"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Miss", power_data[key]["Miss"]);
    }
    if (power_data[key]["Effect"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Effect", power_data[key]["Effect"]);
    }
    if (power_data[key]["Special"])
    {
        alt_bg = powerCardLines (content_div, alt_bg, colour_highlight, "Special", power_data[key]["Special"]);
    }

    if (enable_navigation)
    {
        showModalNavigation ("power", key, power_name_list, "showPowerInfo", power_table, power_data);
    }

    modal_div.style.display = "block";
}

// helper function to print power card lines + alternate background colours for readability
function powerCardLines (content_div, alt_bg, colour_highlight, label, details)
{
    if (alt_bg)
    {
        content_div.innerHTML += '<div style="background-color:' + colour_highlight + ';padding:0px 0px 0px 5px;"><span style="font-weight:bold;">'  + label + ': ' + '</span>' + details + '</div>';
        
        alt_bg = 0;
    }
    else
    {
        content_div.innerHTML += '<div style="padding:0px 0px 0px 5px;"><span style="font-weight:bold;">' + label + ': ' + '</span>' + details + '</div>';
        
        alt_bg = 1;
    }
    
    return alt_bg;
}