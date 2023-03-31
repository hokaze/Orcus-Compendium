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

// open the class tab by default
document.getElementById("classTab").click();


// ---- UTILITY FUNCTIONS ---- //

// Tab Switcher for classes, ancestries, powers, etc
function selectTab(evt, tab_name)
{
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
    document.getElementById(tab_name).style.display = "block";
    evt.currentTarget.className += " active";
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