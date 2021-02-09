import {soundValid, soundActive, fieldSize, errorRandomMessage, field, getRandomInt, 
    soundEffect, countMoves} from "./script.js";

import {cellSize} from "./constants.js";

export let emptyLeftStartInit;
export let emptyTopStartInit;
let soundValidInit, empty, number;
const cells = [];

export function init() {
    
    if (!localStorage.records) {
        localStorage.records = "[]";  
    }

    soundValidInit = soundValid;
    empty = {
        top: getRandomInt(0, fieldSize - 1),
        left: getRandomInt(0, fieldSize - 1),
    }
    emptyLeftStartInit = empty.left;
    emptyTopStartInit = empty.top;
    const set = new Set();

    while (set.size < fieldSize**2 - 1) {
        set.add(getRandomInt(1,(fieldSize**2 - 1)));
    }
    
    number = Array.from(set);
    number[fieldSize**2 - 1] = number[empty.top * fieldSize + empty.left];
    
    createField();
    checkIfSolvable();
}

function createField() {
    cells.length = 0;
    
    for (let i = 0; i <= fieldSize**2 - 1; i++) {
        const left = i % fieldSize
        const top = (i - left) / fieldSize;
        const cell = document.createElement("div");
        if (i === empty.top * fieldSize + empty.left)  cell.style = "display: none"
        cell.className = "cell";
        cell.innerHTML = number[i];
        cells.push({
            left: left,
            top: top,
            element: cell
        });
        
        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;
        field.append(cell);
        cell.style.backgroundImage = `url(./assets/${fieldSize}/${cell.innerHTML}.jpg)`;
        cell.style.backgroundSize = "100px 100px";
    
        cell.addEventListener("click", () => {
            move(i);
    
            if (soundValidInit && soundActive) {
                soundEffect.play();
            }
        })
    }
}

function move(index) {
    const cell = cells[index];
    const leftDiff = Math.abs(empty.left - cell.left);
    const topDiff = Math.abs(empty.top - cell.top);
    
    if (leftDiff + topDiff > 1) {
        soundValidInit = false;
        return;
    } else {
        soundValidInit = true;
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

function checkIfSolvable() {
    let combinationEvenity = 0;

    for (let i = 0; i < field.children.length; i++) {
        for (let j = i; j < field.children.length; j++) {
            if ((+field.children[j].textContent < +field.children[i].textContent) && field.children[j].style.display !== "none" && field.children[i].style.display !== "none") {
                combinationEvenity++;
            }
        }
    }

    if (fieldSize % 2 === 0) {
        combinationEvenity += empty.top + 1;
    }

    if (combinationEvenity % 2 !== 0) {
        errorRandomMessage.innerHTML = "This combination is unsolvable, mix again this one";
    } else {
        errorRandomMessage.innerHTML = "";
    }          
}