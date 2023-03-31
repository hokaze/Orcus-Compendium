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

const power_name_to_key = new Map();

// this function is in the event listener and will execute on page load
function get_power_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/powers.json';

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
        var power_name = power_data[key]["Name"];
        
        // ignore the Chapter headers
        if ( power_data[key]["Name"] == "Chapter")
        {
            return;
        }
        
        // ignore powers with no name set (one such power exists on the Spellwright Prestige Path and has no other data for category, tags, etc, so seems to be an error in "Orcus - Powers.xlsx")
        if (power_name == "")
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
        power_name_list.push(power_name);
        power_source_list.push(power_data[key]["Source"]);
        power_list_list.push(power_data[key]["List"]);
        power_category_list.push(power_data[key]["Category"]);
        power_frequency_list.push(power_data[key]["Frequency"]);
        power_tier_list.push(power_data[key]["Tier"]);
        
        // like handling of class disciplines, split on comma so we can search by individual tags
        power_tags_list.push(... power_data[key]["Tags"].split(", "));
        
        // hashmap for looking up key from power name, useful for running showPowerCardInfo from other tabs/tables where we only have a power name, not a key, and don't use navigation
        power_name_to_key.set(power_name, key);

        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "power_" + key;
        // for the class, we add a modal dialogue to show more details on the class that opens the markdown-to-html file with appropriate css
        tr.innerHTML =  '<td>' + '<a href="#" onclick="showPowerInfo(' + key + ', 1' + ')">' + power_name + '</a>' + '</td>' +
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
function searchPowerTable()
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
    
    // updating the table row elements is painfully slow and makes the browser have to re-render the whole table at an absurd performance hit, so we instead clone the DOM element of the table that has NOT been attached to the document (and thus isn't rendered), update THAT, then replace the old table with the new one
    power_table = document.getElementById('powerTable'); // required, as otherwise the power_table global var still points to the old version of the element and everything breaks after the first search
    let power_table_copy = power_table.cloneNode(true);
    let tr = power_table_copy.rows;
    
    // all tables are theoretically vulnerable to this rendering performance hit, but in practice the Powers table is the most obvious and hit hard enough to make cloning aprox 10-20x faster, while other tables, end up around the same on timings, or slightly slower - as such only implementing on Powers and Feats (which has a very tiny speed boost) as the two biggest tables, and not elsewhere
    
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
    
    // we lose focus when we replace the table DOM with the clone, need to refocus on the right input (this avoids the bug where you type a single letter then lose focus, if typing a search instead of using dropdowns)
    let focused_id = document.activeElement.id;
    
    // replace the table with the clone/copy, forcing it to re-render the table only once
    power_table.replaceWith(power_table_copy);
    
    // re-apply focus to the new version of the active element
    if (focused_id)
    {
        let focused_element = document.getElementById(focused_id);
        focused_element.focus();
        
        // annoyingly, focusing on an input puts the cursor at the start, not the end, so we need to move to the end to allow further typing
        const length = focused_element.value.length;
        focused_element.setSelectionRange(length, length);
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
// = arguments =
// key (required): power key
// enable_navigation (optional): whether to show prev/next buttons
// close_showinfo (optional): on closing the showInfo modal, run this showInfo function instead - used when displaying a Power from another table to return to whatever dialogue prompted it (e.g. clicking a Domain Power on the Blessing of the God feat will showPowerInfo, then return to that feat)
function showPowerInfo (key, enable_navigation, close_showinfo)
{   
    // Experimental display, makes powers look more like 4e power cards
    
    // use Orcus or 4e power card colours?
    var power_style = document.querySelector('input[name="power_style"]:checked').value;
    var colour_header, colour_atwill, colour_encounter, colour_daily, colour_highlight;
    
    // mimic the Orcus Heroes' Handbook power cards by default
    if (power_style == "Orcus")
    {
        colour_header = "#7030a0"; // fallback colour, currently just using the colour shown in the Orcus Game Master's Guide for Poisons, as the only example of item powers with the "Consumable" frequency, as permanent magic items do not have power cards
        colour_atwill = "#9bbb59";
        colour_encounter = "#e36c0a";
        colour_daily = "#17365d";
        colour_highlight = "#dddccc"; // used for flavour text and on alternating lines after the attack line for increased readability
    }
    // 4e-style power card colours
    else
    {
        colour_header = "#dba513"; // fallback if power type not recognised (so probably an item power), using the colour of magic item cards
        colour_atwill = "#619769";
        colour_encounter = "#961334";
        colour_daily = "#4d4d4f";
        colour_highlight = "#dddccc"; // used for flavour text and on alternating lines after the attack line for increased readability
    }
    
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
        // need to regrab if power_table has been replaced by clone so we get current table, not initial table
        var power_table = document.getElementById('powerTable');
        
        showModalNavigation ("power", key, power_name_list, "showPowerInfo", power_table, power_data);
    }
    
    // if we're displaying the power from a source besides the powers table, the user probably wants to return to the previous showInfo on closing the power, rather than just close the modal entirely
    this.modal_div_showinfo_on_close = close_showinfo;

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