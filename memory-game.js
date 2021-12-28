"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
"bamboo",
"cedar",
"cherry",
"maple",
"olive",
"pine",
"purpleheart",
"walnut",
"zebrawood",
"bamboo",
"cedar",
"cherry",
"maple",
"olive",
"pine",
"purpleheart",
"walnut",
"zebrawood",
];

const colors = shuffle(COLORS);
let highestScore = Infinity;


// Start button functionality
const startButton = document.querySelector('#startButton');
const gameBoard = document.querySelector(".game");
const header = document.querySelector("header");

startButton.addEventListener('click', function(event){
  startButton.remove();
  header.classList.add('top-header');
  setTimeout(function(){createCards(colors);},1000);
})





/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {

  for (let color of colors) {
    const card = document.createElement('div');

    card.classList.add('closed-card', color);

    card.addEventListener('click', function(event){
      handleCardClick(event);
    })

    gameBoard.append(card);
  }
}

/** Flip a card face-up. */


function flipCard(card) {
  card.classList.remove('closed-card');
  card.classList.add('flipped');
  card.innerText = card.classList[0];
  console.log('flipcard');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.remove('flipped');
  card.classList.add('closed-card');
  card.innerText = "";
  console.log('unflipcard')
}

/** Handle clicking on a card: this could be first-card or second-card. */
let score = 0;

function handleCardClick(evt) {

  let cards = document.querySelectorAll('.closed-card');
  let flippedCount = document.querySelectorAll('.flipped').length;  

  // conditions for flipping card
  if (!evt.target.classList.contains('flipped') && flippedCount < 2){
    flipCard(evt.target);
    score ++;
    const scoreVal = document.querySelector('#score');
    scoreVal.innerHTML = score;
  }

  flippedCount = document.querySelectorAll('.flipped').length;

  //conditions for unflipping cards
  if (flippedCount === 2) {
    setTimeout(function(){
        let flippedCards = document.querySelectorAll('.flipped');
        
        //checking for matching cards by matching the classes      
        let classSame = [];

        flippedCards[0].classList.forEach(function(className){
          if (flippedCards[1].classList.contains(className)){
            classSame.push(true);
          }
          else {
            classSame.push(false);
          }
        })

        // when the cards match

        if (!classSame.includes(false)){ 
          // flippedCount = 0;
          flippedCards.forEach(function(card){
            card.classList.remove('flipped');
            card.classList.add('matched');
          });
            // check for endstate
            if (document.querySelectorAll('.matched').length === COLORS.length){
              endState();
            }
  
        }
        // when cards don't match
        else {
          unFlipCard(flippedCards[0]);
          unFlipCard(flippedCards[1]);
          // flippedCount = 0;

        }
      },FOUND_MATCH_WAIT_MSECS); 
  }

}


// end state options
function endState(){
  // check whether beat the best score & update
  alert("you won!");
  if (score < highestScore) {
    highestScore = score;
    let topScore = document.querySelector('#topscore');
    topScore.innerHTML = highestScore;
  }

  // create reset button
  const header = document.querySelector('header');
  const resetButton = document.createElement('button');
  const resetSection = document.querySelector('.reset');
  
  resetButton.innerHTML = 'Try again?';
  setTimeout(function(){
    header.append(resetButton);
  },500);

  resetButton.addEventListener('click', function(){
    // wipe the board, score, reset button
    removeChildNodes(gameBoard);
    const scoreVal = document.querySelector('#score');
    score = 0;
    scoreVal.innerHTML = score;
    resetButton.remove();

    const colors = shuffle(COLORS);
    createCards(colors);
  })

}

function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

