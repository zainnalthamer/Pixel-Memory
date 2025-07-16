// PSEUDOCODE FOR PIXEL MEMORY

/* 
Game Flow:
1. On page load, the game starts.
2. User can view the instructions by clicking the instructions button.
3. User can click the restart button to re-start the game.
4. At each level:
    a. A grid of tiles is generated.
    b. A few tiles are randomly highlighted and shown for a short period.
    c. Tiles return to normal, and the user clicks tiles they remember.
    d. If all selections are correct:
        - Level increases
        - Score increases
        - Feedback and sound play
        - Next level starts
    e. If the user clicks a wrong tile:
        - Game over popup is displayed
        - Sound effect plays
5. If the user reaches level 7 before time runs out, a win popup is shown.
6. A timer counts down from 45 seconds, if it hits 0, the game ends with 'Game Over'.
7. After game ends, user can click the 'play again' button to restart from level 1.
*/

/* VARIABLES USED
- level: current level (starts at 1)
- score: total score
- correctTiles: array of correct tile elements for current level
- selectedTiles: array of tiles the user has clicked
- clickable: flag to prevent clicks during animation
- gameTimeLeft: time left for the whole game
- gameTimerId: interval timer ID for countdown
- gameActive: flag for whether the game is in progress
- tiles: NodeList of all tile elements
*/

/* EVENTS
- On DOMContentLoaded: init() + showInstructions()
- Instructions button: opens instructions popup
- Close button: hides instructions popup
- Restart button: calls restartGame()
- Play Again button: hides popup and restarts game
- Each tile: on click, runs handleTileClick()
*/

/* MAIN FUNCTIONS
init()
- Initializes variables and UI
- Creates the grid
- Starts the first level
- Starts the countdown timer

createGrid()
- Creates 36 clickable tiles in the grid

startLevel()
- Clears previous tile states
- Highlights random correct tiles based on level
- Temporarily disables clicking
- After delay, hides highlights and allows user interaction

handleTileClick(tile)
- If tile is correct: add selected class and play click sound
- If tile is incorrect: add wrong class, disable all, endGame()
- If all correct tiles selected: highlight success, increase score, move to next level or showWinPopup()

startGameTimer()
- Decrements gameTimeLeft every second
- If time reaches 0, ends game

restartGame()
- Resets all game state
- Starts from level 1 with score 0 and 45 seconds

endGame()
- Stops timer
- Plays game over sound
- Shows game over popup and final score

showWinPopup()
- Stops timer
- Plays win sound
- Shows final score and win message

showInstructions()
- Toggles visibility of instructions popup
*/

function init() {
    let level = 1; 
    let score = 0;
    let correctTiles = [];
    let selectedTiles = [];
    let clickable = false;
    let gameTimeLeft = 45;
    let gameTimerId = null;
    let gameActive = true;
    let tiles;

    // function to create the grid of tiles
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
            tiles[i].classList.remove("disabled");
        }
        let count = Math.min(level+1, 7); // limit to 7 tiles max
        let highlighted = [];
        while(highlighted.length < count) {
            let randomTile = tiles[Math.floor(Math.random()*tiles.length)]; // get a random tile
            if(!highlighted.includes(randomTile)) { // ensure tile is not already highlighted

                // add the tile to the highlighted list and correct tiles
                highlighted.push(randomTile);
                correctTiles.push(randomTile);
                randomTile.classList.add("highlight");
            }
        }
        clickable = false;
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.add("disabled"); // disable all tiles
        }
        setTimeout(function() { // after 800ms, remove highlights and enable tiles
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
        if(!clickable || !gameActive) {
            return;
        }
        const tile = event.target;
        if(selectedTiles.includes(tile)) {
            return;
        }
        selectedTiles.push(tile);
        if(correctTiles.includes(tile)) { // if the tile is correct
            const clickSound = document.querySelector("#clickSound");
            clickSound.currentTime = 0; 
            clickSound.play();
            tile.classList.add("selected"); // add selected class
        } else {
            tile.classList.add("wrong"); // add wrong class
            for(let i=0; i<correctTiles.length; i++) {
                correctTiles[i].classList.add("disabled");
            }
            clickable = false;
            endGame();
            return;
        }
        // check if all correct tiles have been selected
        if(selectedTiles.length === correctTiles.length) {
            for(let i=0; i<correctTiles.length; i++) {
                correctTiles[i].classList.add("correct"); // add correct class
                correctTiles[i].classList.add("disabled"); // disable correct tiles
            }
            clickable = false;
            score += 100;
            setTimeout(() => {
                for(let i=0; i<tiles.length; i++) {
                    tiles[i].classList.remove("correct");
                }

                if(level===7) { // if level 7 is reached
                    gameActive = false;
                    showWinPopup();
                    return;
                }
                level++;
                const nextLevelSound = document.querySelector("#nextLevelSound");
                nextLevelSound.currentTime = 0;
                nextLevelSound.play();
                startLevel();
            }, 600);
        }
    }

    function startGameTimer() {
        document.querySelector(".timer").textContent = "Time: " + gameTimeLeft;
        gameTimerId = setInterval(function() { // decrement the game time every second
            gameTimeLeft--;
            document.querySelector(".timer").textContent = "Time: " + gameTimeLeft;
            if (gameTimeLeft <= 0) {
                clearInterval(gameTimerId);
                gameActive = false;

                    if(level<=7) { // if the user has not reached level 7
                        endGame();
                    } else { // if the user has reached level 7
                        showWinPopup();
                    }
            }
        }, 1000);
    }

    function restartGame() {
        // reset all game state
        clearInterval(gameTimerId); // clear the timer
        gameTimeLeft = 40;
        gameActive = true;
        level = 1;
        score = 0;
        selectedTiles = [];
        correctTiles = [];
        clickable = false;

        document.querySelector(".gameover-popup").classList.add("popup-hidden");
        document.querySelector(".gameOverText").textContent = "Game Over";

        createGrid();
        tiles = document.querySelectorAll(".tile");
        startLevel();
        startGameTimer();
    }

    function endGame() {
        clearInterval(gameTimerId); // stop the timer

        document.querySelector("#gameOverSound").play();

        clickable = false; // prevent further clicks
        for(let i=0; i<tiles.length; i++) {
            tiles[i].classList.add("disabled");
        }

        // show game over popup
        const gameoverPopup = document.querySelector(".gameover-popup");
        gameoverPopup.classList.remove("popup-hidden");

        document.querySelector(".finalScore").textContent = "Final Score: " + score;
    }

    // function to show the win popup
    function showWinPopup() {
        clearInterval(gameTimerId);

        document.querySelector("#winSound").play();
        
        const gameoverPopup = document.querySelector(".gameover-popup");
        gameoverPopup.classList.remove("popup-hidden");
        document.querySelector(".gameOverText").textContent = "You Win!";
        document.querySelector(".finalScore").textContent = "Final Score: " + score;
    }

    createGrid();

    const playAgainBtn = document.querySelector(".playAgainBtn");
    playAgainBtn.addEventListener("click", function() {
        document.querySelector(".gameover-popup").classList.add("popup-hidden");
        restartGame();
    });
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
    instructionsBtn.addEventListener('click', function() { // show the instructions popup
        popup.classList.remove('popup-hidden');
    });
    closeBtn.addEventListener('click', function() {
        popup.classList.add('popup-hidden');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    init();
    showInstructions();

    // add event listener for restart button
    const restartBtn = document.querySelector(".restartBtn");
    if(restartBtn) {
        restartBtn.addEventListener("click", init);
    }
});