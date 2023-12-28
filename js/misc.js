// ---- MISC STUFF TO LOAD FIRST ---- //

// some vars that are useful to all the scripts, so I'm not redeclaring them constantly in literally every other .js file
var content_div = document.getElementById("showInfoContent");
var modal_div = document.getElementById("modalShowInfo");

// if loading a showInfo from a different table, this var can be set so that on closeModal returns to the original showInfo instead of hiding
// e.g. the Channel Divinity power on the Blessing of the God feat links to the showPowerInfo for that power, closing it then returns you to the feat instead of closing
var modal_div_showinfo_on_close = "";

// set width of all SEARCH inputs (to avoid grabbing radiobuttons) to be sized based on placeholder text, as this is a rough aproximation of how long each needs to be for longer ones, otherwise use min size of 10 chars
var all_inputs = document.querySelectorAll('input[type=search]');
for (i = 0; i < all_inputs.length; i++)
{
    // length + 2 so we have a bit of wiggle space
    var placeholder_length = all_inputs[i].getAttribute('placeholder').length + 2;
    var input_length = 10;
    if (placeholder_length > input_length)
    {
        input_length = placeholder_length;
    }
    all_inputs[i].setAttribute('size', input_length);
}

// needed for url searchParam stuff
const url = new URL(window.location.href);

data_ready = new data_ready();


// ---- UTILITY FUNCTIONS ---- //

// Tab Switcher for classes, ancestries, powers, etc
function selectTab(evt, tab_name)
{
    // is tab already active?
    var active = 0;
    if ( document.getElementById(tab_name).style.display == "block" )
    { active = 1; }
    
    // make all tables/buttons inactive
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++)
    {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++)
    {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // if tab is already selected, clicking hides it and removes param
    if ( active )
    {
        deleteUrlSearchParams("tab");
    }
    
    // otherwise switch to that tab and highlight the button
    else
    {
        document.getElementById(tab_name).style.display = "block";
        evt.currentTarget.className += " active";
        
        updateUrlSearchParams("tab", evt.currentTarget.id);
    }
}


// helper functions for sortTable: sortTableGetCellValue, sortTableComparer
// https://stackoverflow.com/a/49041392
const sortTableGetCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

// Returns a function responsible for sorting a specific column index 
// (idx = columnIndex, asc = ascending order)
const sortTableComparer = function(idx, asc)
{ 
    // This is used by the array.sort() function...
    return function(a, b)
    { 
        // This is a transient function that is called straight away. 
        // It allows passing in different order of args, based on 
        // the ascending/descending order
        return function(v1, v2)
        {
            // sort based on a numeric or localeCompare, based on type...
            return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) 
                ? v1 - v2 
                : v1.toString().localeCompare(v2);
        }
        (sortTableGetCellValue(asc ? a : b, idx), sortTableGetCellValue(asc ? b : a, idx));
    }
};

// much faster sort by single column, per https://stackoverflow.com/a/49041392
function sortTable(evt, table_name, column)
{
    let table = document.getElementById(table_name);
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(sortTableComparer(column, this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr) );
    
    // if we've hit a sort button, we're no longer sorting by the other columns, so we should reset them to the default unsorted icon - this selects all the sortbuttons on the current table, so sort icon state on other tables is preserved
    let sortButtons = event.currentTarget.parentElement.parentElement.querySelectorAll("button.sortbutton");
    sortButtons.forEach((sortButton) => {
        sortButton.textContent = "Sort ⇅";
    });
    
    // update the sort button with up/down arrow to indicate current order is asc (abc) or desc (zxy)
    if (this.asc)
    {
        event.currentTarget.textContent = "Sort ↑";
    }
    else
    {
        event.currentTarget.textContent = "Sort ↓";
    }
}


// for closing the modal dialogue, or returning to previous, if nested
function closeModal()
{   
    // remove param from URL if closing modal, e.g. only want "?power=13" showing in the URL when the power is showing, should go back to regular URL when not showing modal anymore
    removeUrlSearchParamsExcept('');
    
    // return to previous showInfo modal if nested (e.g. viewing powers from a different showInfo)
    if (modal_div_showinfo_on_close)
    {
        // eval is bad, but easiest way to run string as function
        eval(modal_div_showinfo_on_close);
        modal_div_showinfo_on_close = "";
        return;
    }
    
    // hide modal
    modal_div.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event)
{   
    if (event.target == modal_div)
    {
        closeModal();
    }
}

// Helper function for the various update[X]DataList functions used by classes, arts, etc to populate the searchbox dropdown lists
function updateDataList(datalist_element, array_list)
{
    for (i = 0; i < array_list.length; i += 1)
    {
        var option = document.createElement("option");
        option.value = array_list[i];
        datalist_element.appendChild(option);
    }
}

// helper function to display prev and next buttons on show info, and link to prev / next VISIBLE record
function showModalNavigation (tr_id_prefix, key, name_list, show_info_method_name, item_table, item_data)
{
    // use key passed in to determine what row we're on so we can grab the next VISIBLE table rows for LEFT and RIGHT navigation arrows, letting us "flip pages" rather than having to close the modal to view the next
    
    // grab the current row index - this is not always the same as the key, as some data is 0-index, rows at 1-index due to headers being on 0, etc - best to be absolutely certain of actual row index
    var row_id = tr_id_prefix + "_" + key;
    var current_row = document.getElementById(row_id).rowIndex;
    var prev_row = '';
    var next_row = '';
    var looking_for_prev = 1;
    var button_html = "";
    
    // loop over table rows (starting from index 1 NOT 0, so we skip the header row) to try and find the previous and next VISIBLE rows (and if first/last, do NOT generate the prev/next buttons)
    // TODO - refactor this to be faster, maybe two loops, both starting from the actual row index in the table, backwards and forwards. Slight performance loss if near the start of the table, but should be faster on large tables if near the middle or end?
    for (var i = 1, row; row = item_table.rows[i]; i++)
    {
        if (row.style.display == 'none')
        {
            continue;
        }
        if (looking_for_prev)
        {
            if (row.rowIndex == current_row)
            {
                looking_for_prev = 0;
            }
            else
            {
                prev_row = row.id;
            }
        }
        else
        {
            next_row = row.id;
            break;
        }
    }
    
    // row id takes format of class_key, so anything after the _ is the key and from there we can lookup the class name and setup a new call to showClassInfo to replace this page with the prev/next page
    var prev_key = prev_row.split("_")[1];
    var next_key = next_row.split("_")[1];
    var prev_item = '';
    var next_item = '';
    if (prev_key)
    {
        prev_item = ' onclick="' + show_info_method_name + '(' + prev_key + ', 1' + ')"';
    }
    if (next_key)
    {
        next_item = ' onclick="' + show_info_method_name + '(' + next_key + ', 1' + ')"';
    }
    
    // prev button
    button_html += '<button id="modal_nav_left"' + prev_item + ' style="position:fixed; top: 25%; left:0%;font-size:50px; float:left; background-color:white; border-radius:100px; margin:5%; padding:20px; border-width:0px;'
    // if we don't create the prev button the next button gets offset, so if there is no prev_row we still make the button, but hide it
    if (prev_row == '')
    {
        button_html += 'display: none;';
    }
    button_html += '">&lt;--</button>';
    
    // next button
    button_html += '<button id="modal_nav_right"' + next_item + ' style="position:fixed; top: 25%; right:0%;font-size:50px; float:left; background-color:white; border-radius:100px; margin:5%; padding:20px; border-width:0px;'
    // next button is also hidden if there's no next_row
    if (next_row == '')
    {
        button_html += 'display: none;';
    }
    button_html += '">--&gt;</button></div>';
    
    content_div.innerHTML += button_html;
}

// need to handle url search params AFTER we've loaded everything, otherwise if we do it in compendium.html or misc.js we get a race condition and potentially lookup a power or feat before power_data and feat_data are fully populated
function data_ready(callback)
{
    var data_ready = 0;
    
    this.set = function(v)
    {
        data_ready = v;
        
        // can't just load at the end of species.js loading json, or even when document is fully finished loading, as we need to know all the *_data arrays are populated, so we use a callback function on a var that tracks how many of the *_data arrays are loaded and when ready, will run showInfoFromParams
        if (data_ready == 11)
        {
            showInfoFromParams();
        }
    }
    
    this.get =  function()
    {
        return data_ready;
    }
}

// helper method for handling url params to make sure we show the correct modal - make sure this is called only AFTER all the JSON is loaded, using the data_ready callback wrapper to ensure everything is loaded first (each append_x_data increments it by 1, when it hits 11, then everything is loaded and we can safely produce the modal show info)
function showInfoFromParams()
{   
    // TODO - add in a state param so it knows to open on Classes, Powers, Feats, etc tabs; maybe even add in ability to add params for searches, as even the 4e offline compendium doesn't do that
    
    // easiest way to handle tab selection is to just mimic the button being clicked
    var tab_button = url.searchParams.get("tab");
    if ( tab_button ) { document.getElementById(tab_button).click(); }
    
    // handle all the showXInfo modals here
    
    var power_key = url.searchParams.get("power");
    if ( power_key )
    {
        // there's also params for whether to use Orcus or 4e style on power cards (colour and horizontal vs vertical design) so set those first if present BEFORE showing the power
        var power_colour = url.searchParams.get("power_colour");
        var power_style = url.searchParams.get("power_style");
        
        // only need to check for 4e style, as default without params is Orcus/Compendium style, and selecting those styles resets the params
        if ( power_colour == "4e" ) { document.getElementById("power_style_colour_4e").checked = true; }
        if ( power_style == "4e" ) { document.getElementById("power_style_card_4e").checked = true; }
        
        showPowerInfo(power_key, 1);
    }
    
    var class_key = url.searchParams.get("class");
    if ( class_key ) { showClassInfo(class_key, 1); }
    
    // used for role and tradition, uses a name rather than a number key
    var class_misc = url.searchParams.get("class_misc");
    if ( class_misc ) { showClassMiscInfo(class_misc); }
    
    var discipline_name = url.searchParams.get("discipline_name");
    if ( discipline_name ) { showDisciplineInfo(discipline_name); }
    
    var feat_key = url.searchParams.get("feat");
    if ( feat_key ) { showFeatInfo(feat_key, 1); }
    
    var crux_key = url.searchParams.get("crux");
    if ( crux_key ) { showCruxInfo(crux_key, 1); }
    
    var heritage_key = url.searchParams.get("heritage");
    if ( heritage_key ) { showHeritageInfo(heritage_key, 1); }
    
    var kit_key = url.searchParams.get("kit");
    if ( kit_key ) { showKitInfo(kit_key, 1); }
    
    var prestige_key = url.searchParams.get("prestige");
    if ( prestige_key ) { showPrestigeInfo(prestige_key, 1); }
    
    var epic_key = url.searchParams.get("epic");
    if ( epic_key ) { showEpicInfo(epic_key, 1); }
    
    var companion_key = url.searchParams.get("companion");
    if ( companion_key ) { showCompanionInfo(companion_key, 1); }
    
    var art_key = url.searchParams.get("art");
    if ( art_key ) { showArtInfo(art_key, 1); }
    
    var species_key = url.searchParams.get("species");
    if ( species_key ) { showSpeciesInfo(species_key, 1); }
}

// update individual param
function updateUrlSearchParams(param, value)
{
    url.searchParams.set(param, value);
    window.history.replaceState(null, null, url);
}

// delete individual param
function deleteUrlSearchParams(param)
{
    url.searchParams.delete(param);
    window.history.replaceState(null, null, url);
}

// helper function, removes all the modal-specific params except the except_param (useful for cleaning up everything if nesting modals), and also doesn't delete non-modal params like the tab and power card style
function removeUrlSearchParamsExcept(except_param)
{
    // remove power, class, class_misc, etc - but retain non-modal params like tab/state, if those are ever implemented
    if (except_param != "power") { url.searchParams.delete("power"); }
    if (except_param != "class") { url.searchParams.delete("class"); }
    if (except_param != "class_misc") { url.searchParams.delete("class_misc"); }
    if (except_param != "discipline_name") { url.searchParams.delete("discipline_name"); }
    if (except_param != "feat") { url.searchParams.delete("feat"); }
    if (except_param != "crux") { url.searchParams.delete("crux"); }
    if (except_param != "crux") { url.searchParams.delete("heritage"); }
    if (except_param != "kit") { url.searchParams.delete("kit"); }
    if (except_param != "prestige") { url.searchParams.delete("prestige"); }
    if (except_param != "epic") { url.searchParams.delete("epic"); }
    if (except_param != "companion") { url.searchParams.delete("companion"); }
    if (except_param != "art") { url.searchParams.delete("art"); }
    if (except_param != "species") { url.searchParams.delete("species"); }
    window.history.replaceState(null, null, url);
}