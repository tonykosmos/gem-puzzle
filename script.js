import {init} from "./init.js";
import {leftSum, topSum} from "./saveGame.js"; // sum of coordinates along the axes X & Y
import {saveGame} from "./saveGame.js";
import {endGame} from "./endGame.js";
import {fieldSizeMin, fieldSizeMax, cellSize} from "./constants.js"

export const bodyShadow = document.createElement("div"),
soundEffect = document.createElement("audio"),
field = document.createElement("div"),
endGameMessage = document.createElement("div"),
endGameMessageText = document.createElement("p"),
scoreData = document.createElement("div"),
errorRandomMessage = document.createElement("p");

const askMessageWindow = document.createElement("div"),
body = document.querySelector("body"),
fieldContainer = document.createElement("div"),
menuOptions = document.createElement("div"),
contentArea = document.createElement("div"),
gameData = document.createElement("div"),
currentGameTime = document.createElement("div"),
movesCounter = document.createElement("div"),
bottomMenu = document.createElement("div"),
questionText = document.createElement("p");

askMessageWindow.className = "ask-message";
errorRandomMessage.className = "error-random-message";
endGameMessage.className = "end-game-message";
fieldContainer.className = "field-container";
soundEffect.setAttribute("src", "./sound/sound.mp3");
bottomMenu.className = "bottom-menu";
menuOptions.className = "options";
bodyShadow.className = "shadow";
gameData.className = "parameters";
contentArea.className = "content-area";
field.className = "field";

body.append(contentArea);
contentArea.prepend(errorRandomMessage);
body.append(bodyShadow);
body.append(soundEffect);
contentArea.append(menuOptions);
contentArea.append(gameData);
contentArea.append(fieldContainer);
fieldContainer.append(field);
contentArea.append(bottomMenu);

export let fieldSize = 4, // size of game field
    soundActive = false, // flag, that controls sound is enable for moving cells
    soundValid = true,// flag, that controls sound playing only for moving cells
    loaded = false, // flag, that defines if it loaded game or new 
    numberOfMoves = 0, 
    sec = 0,
    min = 0;


export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

init();

function createEndGameWindow() {
    const endGameMessageContent = document.createElement("div");
    const closeModalButton = document.createElement("div");
    closeModalButton.className = "close-modal";
    endGameMessageContent.className = "content";
    closeModalButton.innerHTML = `<i class="material-icons">close</i>`;
    body.append(endGameMessage);
    endGameMessage.append(endGameMessageContent);
    endGameMessageContent.append(endGameMessageText);
    endGameMessageContent.append(closeModalButton);
    
    closeModalButton.addEventListener("click", () => {
        endGameMessage.classList.toggle("active");
        createNewGame(); 
        bodyShadow.style.visibility = "hidden";
        clockTime = setInterval(tick, 1000);
    })
}

createEndGameWindow();

function createAskWindow() {
    const answers = document.createElement("div");
    const answerYes = document.createElement("div");
    const answerNo = document.createElement("div");
    questionText.className = "question";
    answers.className = "answers";
    answerYes.className = "answers__item";
    answerNo.className = "answers__item";
    answerYes.innerHTML = "Yes";
    answerNo.innerHTML = "No";
    body.append(askMessageWindow);
    askMessageWindow.append(questionText);
    askMessageWindow.append(answers);
    answers.append(answerYes);
    answers.append(answerNo);
    
    answerYes.addEventListener("click", () => {
        if (questionText.innerHTML === "Do you want to load saved game?") {
            if (localStorage.fieldSize) {
               loadGame(); 
            } else {
                return;
            }
            
        } else {
            saveGame();
        }
    
        bodyShadow.style.visibility = "hidden";
        askMessageWindow.classList.remove("active");
        clockTime = setInterval(tick, 1000);
    });

    answerNo.addEventListener("click", () => {
        bodyShadow.style.visibility = "hidden";
        askMessageWindow.classList.remove("active");
        clockTime = setInterval(tick, 1000);
    })
}

createAskWindow();

function createNewGameButton() {
    const newGameButton = document.createElement("div");
    newGameButton.className = "new-game"
    newGameButton.innerHTML = "New game";
    menuOptions.append(newGameButton);
    newGameButton.addEventListener("click", createNewGame);
}

createNewGameButton();

function createLoadGameButton() {
    const loadGameButton = document.createElement("div");
    loadGameButton.className = "load-game";
    loadGameButton.innerHTML = "Load game";
    menuOptions.append(loadGameButton);
    
    loadGameButton.addEventListener("click", () => {
        bodyShadow.style.visibility = "visible";
        askMessageWindow.classList.add("active");
        questionText.innerHTML = "Do you want to load saved game?";
        clearInterval(clockTime);
    });
}

createLoadGameButton();

function createSaveGameButton() {
    const saveGameButton = document.createElement("div");
    saveGameButton.className = "save-game";
    saveGameButton.innerHTML = "Save game";
    menuOptions.append(saveGameButton);
    
    saveGameButton.addEventListener("click", () => {
        bodyShadow.style.visibility = "visible";
        askMessageWindow.classList.add("active");
        questionText.innerHTML = "Do you want to save this game?";
        clearInterval(clockTime);
    })
}

createSaveGameButton();

function createTimer() {
    currentGameTime.className = "timer";
    currentGameTime.innerHTML = `00 : 00`;
    gameData.append(currentGameTime);
}

createTimer();

function createSoundSwitch() {
    const soundSwitch = document.createElement("button");
    soundSwitch.className = "sound-switch";
    soundSwitch.innerHTML = `<i class="material-icons">volume_up</i>`;
    gameData.append(soundSwitch);
    
    soundSwitch.addEventListener("click", () => {
        soundActive = !soundActive;
        soundSwitch.classList.toggle("active");
    })
}

createSoundSwitch();

function createMovesCounter() {
    movesCounter.className = "moves";
    movesCounter.innerHTML = `Moves: 0`;
    gameData.append(movesCounter);
}

createMovesCounter();

function createFieldSizeMenu() {
    const fieldSizeBlock = document.createElement("div");
    const fieldSizeButton = document.createElement("div");
    const fieldSizeMenu = document.createElement("div");
    fieldSizeBlock.className = "field-size";
    fieldSizeButton.className = "field-size-button";
    fieldSizeMenu.className = "field-size-menu";
    fieldSizeButton.innerHTML = "Field size";
    bottomMenu.append(fieldSizeBlock);
    fieldSizeBlock.append(fieldSizeButton);
    fieldSizeBlock.append(fieldSizeMenu);

    // create a field where variable i matches the size of field i x i
    for (let i = fieldSizeMin; i <= fieldSizeMax; i++) { 
        const fieldSizeMenuItem = document.createElement("div");
        fieldSizeMenuItem.className = "field-size-menu__item";
        fieldSizeMenuItem.innerHTML = `${i}x${i}`;
        fieldSizeMenu.append(fieldSizeMenuItem);
    
        fieldSizeMenuItem.addEventListener("click", () => {
            loaded = false;
            fieldSize = +fieldSizeMenuItem.innerHTML[0];

            while (field.firstChild) {
                field.removeChild(field.firstChild);
            }

            field.style.width = `${i*100}px`;
            field.style.height = `${i*100}px`;
            numberOfMoves = 0;
            sec = 0;
            min = 0;
            movesCounter.innerHTML = `Moves: 0`;
            currentGameTime.innerHTML = `00 : 00`;
            init();
            addSpecialStyles();
        })
    }

    fieldSizeButton.addEventListener("click", () => {
        fieldSizeMenu.classList.toggle("active");
    })
}

createFieldSizeMenu();

function addSpecialStyles() {
    // special styles for big fields
    if (fieldSize >= 6) {
        menuOptions.style.transform = "scale(1.3)";
        gameData.style.transform = "scale(1.3)"; 

        if (fieldSize === 6) { 
            contentArea.style.height = `850px`;
        }

        if (fieldSize === 7) { 
            contentArea.style.height = `950px`;
        }
  
        if (fieldSize === 8) {  
            contentArea.style.height = `1050px`;
        }
    
        if (window.innerWidth >= 500) {
            contentArea.style.transform = 'translate(-50%, -50%) scale(0.6)';
        } else {
            contentArea.style.transform = 'translate(-50%, -50%) scale(0.38)';
        }  
    }

    // if size of the field less than 6x6, for that field using classic styles
    if (fieldSize < 6) { 
        contentArea.style.height = "";
        contentArea.style.transform = '';
        menuOptions.style.transform = "";
        gameData.style.transform = "";
    }
}

function createBestScoresList() {
    const bestScoresButton = document.createElement("div");
    const bestScores = document.createElement("div");
    const scoresContent = document.createElement("div");
    const scoreHead = document.createElement("div");
    const scoreFieldSize = document.createElement("p");
    const scoreTime = document.createElement("p");
    const scoreMoves = document.createElement("p");
    const closeScoresButton = document.createElement("div");
    bestScores.className = "best-scores";
    scoresContent.className = "content";
    bestScoresButton.className = "best-scores-button";
    scoreData.className = "score-data";
    scoreHead.className = "new-record-head";
    closeScoresButton.className = "close-modal";
    bestScoresButton.innerHTML = "Best scores";
    scoreFieldSize.innerHTML = "Field Size";
    scoreTime.innerHTML = "Time";
    scoreMoves.innerHTML = "Moves";
    closeScoresButton.innerHTML = `<i class="material-icons">close</i>`;
    body.append(bestScores);
    bottomMenu.append(bestScoresButton);
    bestScores.append(scoresContent);
    bestScores.append(closeScoresButton);
    scoreData.append(scoreHead);
    scoresContent.append(scoreData);
    scoreHead.append(scoreFieldSize, scoreTime, scoreMoves);
    
    bestScoresButton.addEventListener("click", () => {
        bestScores.classList.toggle("active");
        clearInterval(clockTime);
    })

    closeScoresButton.addEventListener("click", () => {
        bestScores.classList.toggle("active");
        clockTime = setInterval(tick, 1000);
    })
}

createBestScoresList();
 
function createNewGame() {
    loaded = false;
    numberOfMoves = 0;
    sec = 0;
    min = 0;
    movesCounter.innerHTML = `Moves: 0`;
    currentGameTime.innerHTML = `00 : 00`;
    
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
    init();
}

function loadGame() {
    loaded = true;
    sec = localStorage.sec;
    min = localStorage.min;
    numberOfMoves = localStorage.moves;
    movesCounter.innerHTML = `Moves: ${numberOfMoves}`;
    let emptyDiff = 0;
    
    for (let i = 0; i < localStorage.fieldSize; i++) {
        emptyDiff += (i*100) * localStorage.fieldSize; 
    }

    const empty = {
        top: Math.abs((localStorage.topSum - emptyDiff) / 100),
        left: Math.abs((localStorage.leftSum - emptyDiff) / 100),
    }

    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }

    function move(index) {
        const cell = cells[index];
        const leftDiff = Math.abs(empty.left - cell.left);
        const topDiff = Math.abs(empty.top - cell.top);
    
        if (leftDiff + topDiff > 1) {
            soundValid = false;
            return;
        } else {
            soundValid = true;
            cell.element.style.left = `${empty.left * cellSize}px`;
            cell.element.style.top = `${empty.top * cellSize}px`; 
            
            countMoves();

            const emptyLeft = empty.left;
            const emptyTop = empty.top;
            empty.left = cell.left;
            empty.top = cell.top;
            cell.left = emptyLeft;
            cell.top = emptyTop; 
        }   
    }
    
    const cells = [];
    
    for (let i = 0; i <= localStorage.fieldSize**2 - 1; i++) {
        const left = parseInt(JSON.parse(localStorage.oldStylesLeft)[i]) / 100; 
        const top = parseInt(JSON.parse(localStorage.oldStylesTop)[i]) / 100;
        const cell = document.createElement("div");
        
        if (i === 0)  {
            cell.style.display = "none";
            cells.push({
                left: Math.abs((leftSum - emptyDiff) / 100),
                top: Math.abs((topSum - emptyDiff) / 100),
                element: cell
            });

            cell.className = "cell";
            cell.style.left = `${Math.abs(localStorage.leftSum - emptyDiff)}px`;
            cell.style.top =  `${Math.abs(localStorage.topSum - emptyDiff)}px`;
            field.append(cell);
            continue;
        }

        cell.className = "cell";
        cell.innerHTML = i; 
        cells.push({
            left: left,
            top: top,
            element: cell
        });
        
        cell.style.left = JSON.parse(localStorage.oldStylesLeft)[i];
        cell.style.top =  JSON.parse(localStorage.oldStylesTop)[i];
        field.append(cell);
        cell.style.backgroundImage = `url(./assets/${localStorage.fieldSize}/${cell.innerHTML}.jpg)`;
        cell.style.backgroundSize = "100px 100px";
        
        cell.addEventListener("click", () => {
            move(i);
            if (soundValid && soundActive) {
                soundEffect.play();
            }
        })
        field.style.width = `${localStorage.fieldSize*100}px`;
        field.style.height = `${localStorage.fieldSize*100}px`;
    }
    fieldSize = localStorage.fieldSize;
    addSpecialStyles();
}


export function countMoves() {
    numberOfMoves++;
    movesCounter.innerHTML = `Moves: ${numberOfMoves}`;
}

export function addZero(n) {
    if (parseInt(n, 10) < 10) {
        return "0" + n;
    } else {
        return n;
    }  
}
           
function tick() {
    sec++;

    if (sec === 60)  {
        sec = 0;
        min++;
    }

    currentGameTime.innerHTML = `${addZero(min)} : ${addZero(sec)}`;
}
export let clockTime = setInterval(tick, 1000);


field.addEventListener("click", endGame);


function addResults() {
    if (JSON.parse(localStorage.records).length !== 0) {
        for (let i = 0; i < JSON.parse(localStorage.records).length; i++) {
            const newRecord = document.createElement("div");
            newRecord.className = "new-record"
            const lastGameSize = document.createElement("p");
            lastGameSize.innerHTML = JSON.parse(localStorage.records)[i][0]
            const lastGameTime = document.createElement("p");
            lastGameTime.innerHTML = JSON.parse(localStorage.records)[i][1]
            const lastGameMoves = document.createElement("p");
            lastGameMoves.innerHTML = JSON.parse(localStorage.records)[i][2]
            newRecord.append(lastGameSize, lastGameTime, lastGameMoves);
            scoreData.append(newRecord);
        }  
    }
}
addResults();

// changing sizes if screen size less than 500px for field with size 6x6 and more
function resizeBigField() {
    if (window.innerWidth >= 500 && fieldSize >= 6) {
        contentArea.style.transform = 'translate(-50%, -50%) scale(0.6)';
    } else if (window.innerWidth < 500 && fieldSize >= 6 ) {
        contentArea.style.transform = 'translate(-50%, -50%) scale(0.38)';
    } else if (fieldSize < 6) {
        contentArea.style.transform = "";
    }  
}

window.addEventListener("resize", resizeBigField);