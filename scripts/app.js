function init() {
    let level = 1;
    let score = 0;
    let timer = null;
    let timerId = null;

    let tiles = document.querySelectorAll(".tile");
    let correctTiles = [];
    let selectedTiles = [];

    function startLevel() {
        document.querySelector(".level").textContent = "Level: "+level;
        document.querySelector(".score").textContent = "Score: "+score;

        // loop through each tile and remove the highlight, selected, and wrong classes
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.remove("highlight");
            tiles[i].classList.remove("selected");
            tiles[i].classList.remove("wrong");
        }

        let count = level*2+1; // number of tiles to highlight (l1:3, l2: 5, l3: 7, l4: 9)
        let highlighted = []; // tiles that will be highlighted

        // keep picking random tiles until we reach the required number
        while(highlighted.length < count) {
            // pick a random tile from the grid
            let randomTile = tiles[Math.floor(Math.random()*tiles.length)];

            // only highlight the tile if its not already chosen
            if(!highlighted.includes(randomTile)) {
                highlighted.push(randomTile); // store in highlighted tiles array
                correctTiles.push(randomTile); // also store it as a correct tile
                randomTile.classList.add("highlight"); // highlight the tile
            }
        }

        // make tiles highlights fade after 4 seconds
        setTimeout(function() {
            for(let i=0; i<highlighted.length; i++) {
                highlighted[i].classList.remove("highlight");
            }
            startTimer(); // start the countdown
        }, 4000);
    }

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
    startLevel();
}

document.addEventListener("DOMContentLoaded", init);