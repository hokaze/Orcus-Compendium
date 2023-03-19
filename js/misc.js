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

// Sort SINGLE COLUMN alphabetically ascending, then toggle descending
// TODO: add option to then go back to initial order (i.e. key, not alphabetical)?
function sortTableByColumn(evt, sort_type, table, column)
{
    var table, rows, switching, i, x, y, should_switch, dir, switchcount = 0;
    table = document.getElementById(table);
    
    switching = true;

    // Set the sorting direction to ascending:
    dir = "asc";
    
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching)
    {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++)
        {
            // Start by saying there should be no switching:
            should_switch = false;
            
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[column];
            y = rows[i + 1].getElementsByTagName("TD")[column];
            
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc")
            {
                // alphabetical, numerical or mixed sort?
                if (sort_type == "alpha")
                {
                    if (x.textContent.toLowerCase() > y.textContent.toLowerCase())
                    {
                        // If so, mark as a switch and break the loop:
                        should_switch = true;
                        break;
                    }
                }
                else if (sort_type == "num")
                {
                    if (Number(x.textContent) > Number(y.textContent.toLowerCase()))
                    {
                        should_switch = true;
                        break;
                    }
                }
                // mixed does numbers numerically, then strings alphabetically
                else if (sort_type == "mixed")
                {
                    var x1 = x.textContent.toLowerCase(), y1 = y.textContent.toLowerCase();
                    var x_n = Number(x1), y_n = Number(y1);
                    if (isNaN(x_n) == false)
                    {
                        x1 = x_n;
                    }
                    if (isNaN(y.textContent) == false)
                    {
                        y1 = y_n;
                    }
                    var x2 = typeof x1, y2 = typeof y1;
                    if (x2 > y2 || x1 > y1)
                    {
                        should_switch = true;
                        break;
                    }
                }
            }
            else if (dir == "desc")
            {
                // alphabetical, numerical or mixed sort?
                if (sort_type == "alpha")
                {
                    if (x.textContent.toLowerCase() < y.textContent.toLowerCase())
                    {
                        // If so, mark as a switch and break the loop:
                        should_switch = true;
                        break;
                    }
                }
                else if (sort_type == "num")
                {
                    if (Number(x.textContent) < Number(y.textContent.toLowerCase()))
                    {
                        should_switch = true;
                        break;
                    }
                }
                // mixed does numbers numerically, then strings alphabetically
                else if (sort_type == "mixed")
                {
                    var x1 = x.textContent.toLowerCase(), y1 = y.textContent.toLowerCase();
                    var x_n = Number(x1), y_n = Number(y1);
                    if (isNaN(x_n) == false)
                    {
                        x1 = x_n;
                    }
                    if (isNaN(y.textContent) == false)
                    {
                        y1 = y_n;
                    }
                    var x2 = typeof x1, y2 = typeof y1;
                    if (x2 < y2 || x1 < y1)
                    {
                        should_switch = true;
                        break;
                    }
                }
            }
        }
        if (should_switch)
        {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        }
        else
        {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc")
            {
                dir = "desc";
                switching = true;
            }
        }
    }
    
    // reset the arrow on the other sort buttons on this table, as we can only sort by one column and need to make it visually clear which column is currently being sorted
    var sort_buttons = table.getElementsByClassName("sortbutton");
    for (i = 0; i < sort_buttons.length; i++) {
        sort_buttons[i].textContent = "Sort ⇅"
    } 
    
    // update the sort button with up/down arrow to indicate current order is asc (abc) or desc (zxy)
    if (dir == "asc")
    {
        event.currentTarget.textContent = "Sort ↑";
    }
    else if (dir == "desc")
    {
        event.currentTarget.textContent = "Sort ↓";
    }
}

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