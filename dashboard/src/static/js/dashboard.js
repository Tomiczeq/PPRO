function init_dashboard() {
    // enable user to move rows
    $( function() {
        $(".rows_container").sortable();
    })

    // Add row button
    var addRowBtn = document.querySelector("#add_row_btn");
    addRowBtn.addEventListener("click", () => {
        window.dashboard.addNewRow();
    }); 

    // save dashboard button
    var saveBtn = document.querySelector("#save_dashboard_btn");
    saveBtn.addEventListener("click", () => {
        window.dashboard.save();
    }); 

    // get dashboard rows and chart and render them
    window.dashboard.init();
}