import {loaded, field, fieldSize, endGameMessage, bodyShadow, endGameMessageText, scoreData, clockTime, 
    addZero, min, sec, numberOfMoves} from "./script.js";

export function endGame() {
    if (loaded) {
        for(let i = 1; i < fieldSize**2; i++) {
            if (field.children[i].style.left === `${((i - 1) % fieldSize) * 100}px` && 
                field.children[i].style.top === `${Math.floor((i - 1) / fieldSize) * 100}px`) {
                continue;
            } else {
                return;
            }
        } 
    } else {
        for(let i = 0; i < fieldSize**2; i++) {
            if ((field.children[i].style.left === `${((+field.children[i].textContent - 1) % fieldSize) * 100}px` && 
                field.children[i].style.top === `${Math.floor((+field.children[i].textContent - 1) / fieldSize) * 100}px`) || 
                field.children[i].style.display === "none") {
                continue;
            } else {
                return;
            }
        }   
    }
    
    const records = JSON.parse(localStorage.records);
    endGameMessage.classList.toggle("active");
    bodyShadow.style.visibility = "visible";
    clearInterval(clockTime);
    endGameMessageText.innerHTML = `Ура! Вы решили головоломку за ${addZero(min)} : ${addZero(sec)} и ${numberOfMoves} хода`;
    records.push([`${fieldSize}x${fieldSize}`, `${addZero(min)} : ${addZero(sec)}`, `${numberOfMoves}`]);
    localStorage.records = JSON.stringify(records);
    addCurrentResult();
}

function addCurrentResult() {
    const records = JSON.parse(localStorage.records);
    const lastGameFieldSize = records[records.length - 1][0];
    const lastGameTime = records[records.length - 1][1];
    const lastGameMoves = records[records.length - 1][2];
    const newRecord = document.createElement("div");
    newRecord.className = "new-record";
    const gameSize = document.createElement("p");
    gameSize.innerHTML = lastGameFieldSize;
    const gameTime = document.createElement("p");
    gameTime.innerHTML = lastGameTime;
    const gameMoves = document.createElement("p");
    gameMoves.innerHTML = lastGameMoves;
    newRecord.append(gameSize, gameTime, gameMoves);
    scoreData.append(newRecord);
    localStorage.records = JSON.stringify(records);

    if (records.length > 10) {
        removeExcessResult();
    }
}

function removeExcessResult() {
    const records = JSON.parse(localStorage.records);
    const movesDiff = [];

    for (let i = 0; i < records.length; i++) {
        movesDiff.push(+records[i][2]);
    }
    const maxResult = Math.max(...movesDiff);

    for (let i = 0; i < records.length; i++) {
        if (maxResult === records[i][2]) {
            records.splice(i, 1); 
            let removedResult = document.querySelector(`.score-data .new-record:nth-child(${i+1})`);
            removedResult.remove();  
        }
    }
    localStorage.records = JSON.stringify(records);
}