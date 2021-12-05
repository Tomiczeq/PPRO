var chosen = document.querySelector("#chosen");
var $grid = $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: 10
});
var draggie = new Draggabilly(chosen);
$grid.packery('bindDraggabillyEvents', draggie );

chosen.addEventListener("resize", () => {
    console.log("resize");
})
  
resize_btn = document.querySelector("#resize_btn");
resize_btn.addEventListener("click", () => {
    chosen = document.querySelector("#chosen");
    var newwidth = document.querySelector("#width");
    chosen.style.width = newwidth.value.trim();
    var newheight = document.querySelector("#height");
    chosen.style.height = newheight.value.trim();
    $grid.packery('shiftLayout');
})

shift_btn = document.querySelector("#shift_btn");
shift_btn.addEventListener("click", () => {
    $grid.packery('shiftLayout')
})

dragg_on_btn = document.querySelector("#dragg_on_btn");
dragg_on_btn.addEventListener("click", () => {
    draggie.enable();
})

dragg_off_btn = document.querySelector("#dragg_off_btn");
dragg_off_btn.addEventListener("click", () => {
    draggie.disable();
})

resize_on_btn = document.querySelector("#resize_on_btn");
resize_on_btn.addEventListener("click", () => {
    grid_items = document.querySelectorAll(".grid-item");
    grid_items.forEach((grid_item) => {
        grid_item.style.resize = "both";
        grid_item.style.overflow = "auto";
    })
    window.addEventListener("mouseup", handler);
})

resize_off_btn = document.querySelector("#resize_off_btn");
resize_off_btn.addEventListener("click", () => {
    grid_items = document.querySelectorAll(".grid-item");
    grid_items.forEach((grid_item) => {
        grid_item.style.resize = "none";
        grid_item.style.overflow = "visible";
    })
    window.removeEventListener("mouseup", handler);
})

function handler() {
    $grid.packery('shiftLayout')
}

