import {fieldSize, sec, min, numberOfMoves, field} from "./script.js";
import {emptyLeftStartInit, emptyTopStartInit} from "./init.js";
export const oldStylesLeft = {}; // offset cells to the right
export const oldStylesTop = {}; // offset cells to the bottom
export let leftSum;
export let topSum;

export function saveGame() { 
    localStorage.fieldSize = fieldSize;
    localStorage.sec = sec;
    localStorage.min = min;
    localStorage.moves = numberOfMoves;
    
    for (let i = 0; i < field.childNodes.length; i++) {
        oldStylesLeft[String(+field.childNodes[i].textContent)] = field.childNodes[i].style.left;
        oldStylesTop[String(+field.childNodes[i].textContent)] = field.childNodes[i].style.top;
    }
    
    localStorage.oldStylesLeft = JSON.stringify(oldStylesLeft);
    localStorage.oldStylesTop = JSON.stringify(oldStylesTop);
    leftSum = 0;
    topSum = 0;
    
    for (let i = 0; i < field.children.length; i++) {
        topSum  += parseInt(field.children[i].style.top);
        leftSum += parseInt(field.children[i].style.left);
    }

    leftSum -= emptyLeftStartInit * 100;
    topSum -= emptyTopStartInit * 100;
    localStorage.leftSum = leftSum;
    localStorage.topSum = topSum; 
}