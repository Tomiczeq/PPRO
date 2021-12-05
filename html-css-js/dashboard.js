var chart1 = document.querySelector("#chart1");
var offsets = chart1.getBoundingClientRect();
console.log("top: " + offsets.top +
            " left: " + offsets.left + 
            " bottom: " + offsets.bottom + 
            " right: " + offsets.right
);

var $grid = $('.dashboard_content').packery({
    itemSelector: '.dashboard_item',
    columnWidth: 10
});

var charts = document.querySelectorAll(".dashboard_item");
var draggies = [];
charts.forEach((chart) => {
    var draggie = new Draggabilly(chart);
    draggies.push(draggie);
    $grid.packery('bindDraggabillyEvents', draggie );
})

var explore_btn = document.querySelector("#explore_btn"); 
var move_btn = document.querySelector("#move_btn"); 
var timerange_btn = document.querySelector("#timerange_btn"); 

explore_btn.addEventListener('click', () => {
    draggies.forEach((draggie) => {
        draggie.disable();
    })
})

move_btn.addEventListener('click', () => {
    $grid = $('.dashboard_content').packery({
        itemSelector: '.dashboard_item',
        columnWidth: 10
    });

    draggies.forEach((draggie) => {
        draggie.enable();
    })
})

var view_btns = document.querySelectorAll(".dashboard_views .icon")
view_btns.forEach((view_btn) => {
    view_btn.addEventListener("click", () => {

        view_btns.forEach((item) => {
            item.classList.remove("selected_view");
        })
        view_btn.classList.add("selected_view");
    })
})

explore_btn.click();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function sl() {
    await delay(1000);
    $grid.packery('shiftLayout');
}
sl();