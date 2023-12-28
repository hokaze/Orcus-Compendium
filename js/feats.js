// load feats table

// do NOT run on page load - append_feat_json depends on power_data and power_name_to_key already existing, so we have to ensure get_feat_json_data is called AFTER append_power_json_data
//document.addEventListener( "DOMContentLoaded", get_feat_json_data, false ); 

var feat_table = document.getElementById('featTable');
var feat_data = {};

var feat_name_list = [];
var feat_type_list = [];
var feat_prerequisite_list = [];
var feat_benefit_list = [];
var feat_special_list = [];
var feat_power_list = [];

const feat_name_to_key = new Map();

// this function is in the event listener and will execute on page load
function get_feat_json_data()
{
    // Relative URL of external json file
    var json_url = 'data/json/feats.json';

    // Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { 
        // when a good response is given do this
        if (this.readyState == 4 && this.status == 200)
        {
            // convert the response to a json object
            // pass the json object to the append_json function
            feat_data = JSON.parse(this.responseText);
            append_feat_json(feat_data);
        }
    }
    // set the request destination and type
    xmlhttp.open("GET", json_url, true);
    // set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send() // executed in onreadystatechange section on request completion
}

// this function appends the json data to the table 'featTable'
function append_feat_json(feat_data)
{
    Object.keys(feat_data).forEach(key => {      
        
        feat_name_list.push(feat_data[key]["Name"]);
        feat_type_list.push(feat_data[key]["Feat Type"]);
        feat_prerequisite_list.push(feat_data[key]["Prerequisite"]);
        feat_benefit_list.push(feat_data[key]["Benefit"]);
        feat_special_list.push(feat_data[key]["Special"]);
        feat_power_list.push(feat_data[key]["Power"]);
        
        // hashmap for looking up key from class name, useful for running showFeatInfo from other tabs/tables
        feat_name_to_key.set(feat_data[key]["Name"], key);
        
        // update table with new row
        var tr = document.createElement('tr');
        tr.id = "feat_" + key;
        var feat_name = feat_data[key]["Name"];
        var feat_power = feat_data[key]["Power"];
        
        // open modal dialogue for Feat info - similar to power display
        tr.innerHTML =  '<td>' + '<a href="#" onclick="showFeatInfo(' + key + ', 1' + ')">' + feat_data[key]["Name"] + '</a>' + '</td>' +
        '<td>' + feat_data[key]["Feat Type"] + '</td>' +
        '<td>' + feat_data[key]["Prerequisite"] + '</td>' +
        '<td>' + feat_data[key]["Benefit"] + '</td>' +
        '<td>' + feat_data[key]["Special"] + '</td>';
        
        // make power in table showPowerInfo, but only if a power is actually set against the feat!
        if (feat_power == "None" || feat_power == "")
        {
            tr.innerHTML += '<td>' + feat_power + '</td>';
        }
        else
        {
            tr.innerHTML += '<td><a href="#" onclick="showPowerInfo(' + power_name_to_key.get(feat_power) + ', 0)\">' + feat_power + '</a>' + '</td>';
        }
        
        feat_table.appendChild(tr)
    });
    
    // lists used to populate datalists so search boxes have dropdown suggestions (using set to enforce uniqueness, so no dupe entries)
    // additionally, sort alphabetically
    feat_name_list = [...new Set(feat_name_list)].sort();
    feat_type_list = [...new Set(feat_type_list)].sort();
    feat_prerequisite_list = [...new Set(feat_prerequisite_list)].sort();
    feat_benefit_list = [...new Set(feat_benefit_list)].sort();
    feat_special_list = [...new Set(feat_special_list)].sort();
    feat_power_list = [...new Set(feat_power_list)].sort();
    
    // create + attach datalist to enable dropdown on search boxes
    updateFeatDatalist();
    
    // record that we've finished loading data; once all *_data arrays are populated we can safely run showInfoFromParams if URL contains params
    data_ready.set(data_ready.get()+1);
}

// search on feat table
function searchFeatTable()
{    
    // revised for multiple search
    var input_name = document.getElementById("searchFeatName");
    var input_type = document.getElementById("searchFeatType");
    var input_prerequisite = document.getElementById("searchFeatPrerequisite");
    var input_benefit = document.getElementById("searchFeatBenefit");
    var input_special = document.getElementById("searchFeatSpecial");
    var input_power = document.getElementById("searchFeatPower");
    
    let filter_name = input_name.value.toUpperCase();
    let filter_type = input_type.value.toUpperCase();
    let filter_prerequisite = input_prerequisite.value.toUpperCase();
    let filter_benefit = input_benefit.value.toUpperCase();
    let filter_special = input_special.value.toUpperCase();
    let filter_power = input_power.value.toUpperCase();
    
    // cloning the table to update table row display is *slightly* faster than editing the original due to it reducing browser render time - this nets 10-20x performance on Powers table, a negligible ~10ms on Feats table as the next largest and a small performance hit on the smaller tables (where it's not done)
    feat_table = document.getElementById('featTable');
    let feat_table_copy = feat_table.cloneNode(true);
    let tr = feat_table_copy.rows;
    
    // start at row 1, not row 0, as otherwise we can filter out the search headers, not just the actual data rows!
    for (let i = 1; i < tr.length; i++)
    {
        td = tr[i].cells;
        td_name = td[0].innerText;
        td_type = td[1].innerText;
        td_prerequisite = td[2].innerText;
        td_benefit = td[3].innerText;
        td_special = td[4].innerText;
        td_power = td[5].innerText;
        
        if (td_name.toUpperCase().indexOf(filter_name) > -1 && td_type.toUpperCase().indexOf(filter_type) > -1 && td_prerequisite.toUpperCase().indexOf(filter_prerequisite) > -1 && td_benefit.toUpperCase().indexOf(filter_benefit) > -1 && td_special.toUpperCase().indexOf(filter_special) > -1 && td_power.toUpperCase().indexOf(filter_power) > -1)
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
    feat_table.replaceWith(feat_table_copy);
    
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

// like heritages, just print json info in the modal popup - we have all the data we need in the csv/json, so no need to display markdown-to-html
function showFeatInfo (key, enable_navigation, close_showinfo)
{
    var html = "<h3>" + feat_data[key]["Name"] + "</h3>" +
    "<p><i>" + feat_data[key]["Feat Type"] + " Feat" + "</i>" + "</p>" +
    "<p><strong>Prerequisite:</strong> " + feat_data[key]["Prerequisite"] + "</p>" +
    "<p><strong>Benefit:</strong> " + feat_data[key]["Benefit"] + "</p>" +
    "<p><strong>Special:</strong> " + feat_data[key]["Special"] + "</p>";
    
    // add link to showPowerInfo if feat grants a power
    var feat_power = feat_data[key]["Power"];
    if (feat_power != "None")
    {
        html += '<p><strong>Granted Power:</strong> <a href="#" onclick="showPowerInfo(' + power_name_to_key.get(feat_power) +', 0, \'showFeatInfo(' + key + ', 1' + ')\')\">' + feat_power + '</a></p>';
    }
    
    // special case for Blessing of the God - show the table of Domain, God, Power here, as we don't store it in the csv (tried storing it in csv earlier, but resulted in an unreadable mess formatting-wise)
    if (feat_data[key]["Name"] == "Blessing of the God")
    {
        // array of arrays for table contents
        var domain_power_rows = [
            ["Domain","Outlaw Kingdoms god","Channel Divinity power"],
            ["Destruction","Valkon, Vogg","Explosive Item"],
            ["Family","Yaheine","Wrath of the She-Bear"],
            ["Feasting","Chavalar","Shared Bite"],
            ["Greed","Chavalar, Thoin","I'll Have That"],
            ["Life","Yaheine","Guidance"],
            ["Light","Shehaan","Light Shadow"],
            ["Love","Thalander","Easy Charm"],
            ["Mischief","Vaath","Death Defying"],
            ["Murder","Larhoon, Vogg","Blood Tracer"],
            ["Mystery","Larhoon, Shehaan","Slip Between Worlds"],
            ["Peace","Thalander","Light Ward"],
            ["Protection","Korven, Kain","Negate Critical"],
            ["Revenge","Enoran","Biteback"],
            ["Sky","Vaath, Valkon","Skyfall"],
            ["Spiders","Kurzana","Throw Web"],
            ["Stone","Kurzana, Thoin","Stoneblood"],
            ["Time","Enoran","The Weight of Time"],
            ["Tyranny","Kain","Spur On"],
            ["War","Korven","Shielded Soul"],
        ];
        
        // table header
        html += "<table><thead><tr><th>Domain</th><th>Outlaw Kingdoms god</th><th>Channel Divinity power</th></tr></thead><tbody>";
        
        // table contents - includes special link on domain power that displays the actual showPowerInfo details of that power despite that being from the Powers table, not the Feats table
        // additionally, when this power is closed, we return to this feat instead of closing the showInfo modal entirely!
        for (let i = 1; i < domain_power_rows.length; i++)
        {
            html += "<tr><td>" + domain_power_rows[i][0] + 
            "<td>" + domain_power_rows[i][1] + "</td>" +
            "<td>" + '<a href="#" onclick="showPowerInfo(' + power_name_to_key.get(domain_power_rows[i][2]) +', 0, \'showFeatInfo(' + key + ', 1' + ')\')\">' + domain_power_rows[i][2] + "</a></td></tr>";
        }
        
        html += "</tbody></table>";
    }
    
    content_div.innerHTML = html;
    
    if (enable_navigation)
    {
        // need to regrab if feat_table has been replaced by clone so we get current table, not initial table
        var feat_table = document.getElementById('featTable');
        
        showModalNavigation ("feat", key, feat_name_list, "showFeatInfo", feat_table, feat_data);
    }
    
    // return to the previous showInfo if viewing from another context
    this.modal_div_showinfo_on_close = close_showinfo;
    
    modal_div.style.display = "block";
    
    // set URL to reflect power we're showing via params, can then copy this URL to go straight to the show info modal for this power
    removeUrlSearchParamsExcept("feat");
    updateUrlSearchParams("feat", key);
}

function updateFeatDatalist ()
{   
    // grab datalist elements used by search inputs
    dl_name = document.getElementById("dlFeatName");
    dl_type = document.getElementById("dlFeatType");
    dl_prerequisite = document.getElementById("dlFeatPrerequisite");
    dl_benefit = document.getElementById("dlFeatBenefit");
    dl_special = document.getElementById("dlFeatSpecial");
    dl_power = document.getElementById("dlFeatPower");

    // populate datalists
    updateDataList(dl_name, feat_name_list);
    updateDataList(dl_type, feat_type_list);
    updateDataList(dl_prerequisite, feat_prerequisite_list);
    updateDataList(dl_benefit, feat_benefit_list);
    updateDataList(dl_special, feat_benefit_list);
    updateDataList(dl_power, feat_power_list);
}