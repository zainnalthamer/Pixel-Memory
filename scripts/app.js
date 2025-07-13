function init() {

function handleTileClick() {
    
}

    function createGrid() {
        const grid = document.querySelector("#grid");
        for(let i=0; i<36; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.addEventListener("click", handleTileClick);
            grid.appendChild(tile);
        }
    }

    createGrid();
}

document.addEventListener("DOMContentLoaded", init);