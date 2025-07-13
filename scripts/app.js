function init() {
    let level = 1;
    let score = 0;
    let timer = null;
    let timerId = null;

    let correctTiles = [];
    let selectedTiles = [];

    let clickable = false;

    function createGrid() {
        const grid = document.querySelector("#grid");
        for(let i=0; i<36; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.addEventListener("click", handleTileClick);
            grid.appendChild(tile);
        }
    }

    function startLevel() {
    // reset correct and selected tiles
    correctTiles = [];
    selectedTiles = [];

    document.querySelector(".level").textContent = "Level: "+level;
    document.querySelector(".score").textContent = "Score: "+score;

    // loop through each tile and remove the highlight, selected, and wrong classes
    for(let i=0; i<tiles.length; i++) {
        tiles[i].classList.remove("highlight");
        tiles[i].classList.remove("selected");
        tiles[i].classList.remove("wrong");
    }

    let count = Math.min(level+1, 7); // number of tiles to highlight (l1:3, l2: 5, l3: 7, l4: 9)
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

    clickable = false;

    // disable all tiles
    for(let i=0; i<tiles.length; i++) {
        tiles[i].classList.add("disabled");
    }

    setTimeout(function() {
        for(let i=0; i<correctTiles.length; i++) {
            correctTiles[i].classList.remove("highlight");
        }
        clickable = true; // allow clicks
        
        // enable interaction
        for(let i=0; i<tiles.length; i++) {
        tiles[i].classList.remove("disabled");
    }

    }, 2000);

    startTimer();
    }

    function startTimer() {
        let timeLeft = 20;
        document.querySelector(".timer").textContent = "Time: "+timeLeft;

        // start a countdown that runs every second
        timerId = setInterval(function() {
            timeLeft = timeLeft-1; // decrease time by 1 every second

            // update timer
            const timerDisplay = document.querySelector(".timer");
            timerDisplay.textContent = "Time: "+timeLeft;

            if(timeLeft===0) { // when time is up
                clearInterval(timerId); // stop counting at 0
                restartLevel();
            }
        }, 1000);
    }

    function handleTileClick(event) {
        if(!clickable) {
            return; // block clicks during preview
        }

        const tile = event.target;

        // prevent double clicks
        if(selectedTiles.includes(tile)) {
            return;
        }

        selectedTiles.push(tile); // add tile to the selected tiles array

        if(correctTiles.includes(tile)) { // if this tile exists in the correct tiles array
            tile.classList.add("selected"); // highlight (cyan)
        } else {
            tile.classList.add("wrong"); // highlight (red)
            clearInterval(timerId); // stop timer
            clickable = false;
            setTimeout(restartLevel, 1000); 
            return;
        }

        if(selectedTiles.length === correctTiles.length) {
            nextLevel();
        }
    }

    function restartLevel() {
        clearInterval(timerId);
        startLevel();
    }

    function nextLevel() {
        clearInterval(timerId);

        score = score+100;
        level = level+1;

        setTimeout(startLevel, 1000); 
    }

    createGrid();
    let tiles = document.querySelectorAll(".tile");
    startLevel();
}

document.addEventListener("DOMContentLoaded", init);