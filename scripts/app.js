function init() {
    let level = 1;
    let score = 0;
    let correctTiles = [];
    let selectedTiles = [];
    let clickable = false;
    let gameTimeLeft = 30;
    let gameTimerId = null;
    let gameActive = true;
    let tiles;

    function createGrid() {
        const grid = document.querySelector("#grid");
        grid.innerHTML = "";
        for(let i=0; i<36; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.addEventListener("click", handleTileClick);
            grid.appendChild(tile);
        }
    }

    function startLevel() {
        correctTiles = [];
        selectedTiles = [];
        document.querySelector(".level").textContent = "Level: "+level;
        document.querySelector(".score").textContent = "Score: "+score;
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.remove("highlight");
            tiles[i].classList.remove("selected");
            tiles[i].classList.remove("wrong");
            tiles[i].classList.remove("missed");
            tiles[i].classList.remove("correct");
            tiles[i].classList.remove("disabled");
        }
        let count = Math.min(level+1, 7);
        let highlighted = [];
        while(highlighted.length < count) {
            let randomTile = tiles[Math.floor(Math.random()*tiles.length)];
            if(!highlighted.includes(randomTile)) {
                highlighted.push(randomTile);
                correctTiles.push(randomTile);
                randomTile.classList.add("highlight");
            }
        }
        clickable = false;
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.add("disabled");
        }
        setTimeout(function() {
            for(let i=0; i<correctTiles.length; i++) {
                correctTiles[i].classList.remove("highlight");
            }
            clickable = true;
            for(let i=0; i<tiles.length; i++) {
                tiles[i].classList.remove("disabled");
            }
        }, 800);
    }

    function handleTileClick(event) {
        const clickSound = document.querySelector("#clickSound");
        clickSound.currentTime = 0; 
        clickSound.play();

        if(!clickable || !gameActive) {
            return;
        }
        const tile = event.target;
        if(selectedTiles.includes(tile)) {
            return;
        }
        selectedTiles.push(tile);
        if(correctTiles.includes(tile)) {
            tile.classList.add("selected");
        } else {
            tile.classList.add("wrong");
            for(let i=0; i<correctTiles.length; i++) {
                if(!selectedTiles.includes(correctTiles[i])) {
                    correctTiles[i].classList.add("missed");
                }
                correctTiles[i].classList.add("disabled");
            }
            clickable = false;
            setTimeout(endGame, 1000);
            return;
        }
        if(selectedTiles.length === correctTiles.length) {
            for(let i=0; i<correctTiles.length; i++) {
                correctTiles[i].classList.add("correct");
                correctTiles[i].classList.add("disabled");
            }
            clickable = false;
            score += 100;
            setTimeout(() => {
                for(let i=0; i<tiles.length; i++) {
                    tiles[i].classList.remove("correct");
                }

                if(level===7) {
                    gameActive = false;
                    showWinPopup();
                    return;
                }
                level++;
                startLevel();
            }, 600);
        }
    }

    function startGameTimer() {
        document.querySelector(".timer").textContent = "Time: " + gameTimeLeft;
        gameTimerId = setInterval(function() {
            gameTimeLeft--;
            document.querySelector(".timer").textContent = "Time: " + gameTimeLeft;
            if (gameTimeLeft <= 0) {
                clearInterval(gameTimerId);
                gameActive = false;
                
                if(gameTimeLeft<=0) {
                    clearInterval(gameTimerId);
                    gameActive = false;

                    if(level<7) {
                        endGame();
                    } else {
                        showWinPopup();
                    }
                }
            }
        }, 1000);
    }

    function restartGame() {
        clearInterval(gameTimerId);
        gameTimeLeft = 30;
        gameActive = true;
        level = 1;
        score = 0;
        selectedTiles = [];
        correctTiles = [];
        clickable = false;

        document.querySelector(".gameover-popup").classList.add("popup-hidden");

        createGrid();
        tiles = document.querySelectorAll(".tile");
        startLevel();
        startGameTimer();
    }

    function endGame() {
        // const gameOverSound = document.querySelector("#gameOverSound)");
        // gameOverSound.currentTime = 0; 
        // gameOverSound.play();
        
        clickable = false;
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.add("disabled");
        }

        const gameoverPopup = document.querySelector(".gameover-popup");
        gameoverPopup.classList.remove("popup-hidden");

        document.querySelector(".finalScore").textContent = "Final Score: " + score;
        const playAgainBtn = document.querySelector(".playAgainBtn");
        playAgainBtn.addEventListener("click", function() {
        gameoverPopup.classList.add("popup-hidden");
        restartGame();
    });
    }

    function showWinPopup() {
        const gameoverPopup = document.querySelector(".gameover-popup");
        gameoverPopup.classList.remove("popup-hidden");
        document.querySelector(".gameOverText").textContent = "You Win!";
        document.querySelector(".finalScore").textContent = "Final Score: " + score;
        const playAgainBtn = document.querySelector(".playAgainBtn");
        playAgainBtn.addEventListener("click", function () {
        gameoverPopup.classList.add("popup-hidden");
        restartGame();
    });
    }

    createGrid();
    tiles = document.querySelectorAll(".tile");
    startLevel();
    startGameTimer();

    const restartBtn = document.querySelector(".restartBtn");
    if(restartBtn) {
        restartBtn.addEventListener("click", restartGame);
    }
}

function showInstructions() {
    const popup = document.querySelector('.popup');
    const instructionsBtn = document.querySelector('.instructionsBtn');
    const closeBtn = document.querySelector('.closePopup');
    instructionsBtn.addEventListener('click', function() {
        popup.classList.remove('popup-hidden');
    });
    closeBtn.addEventListener('click', function() {
        popup.classList.add('popup-hidden');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    init();
    showInstructions();

    const restartBtn = document.querySelector(".restartBtn");
    if(restartBtn) {
        restartBtn.addEventListener("click", init);
    }
});