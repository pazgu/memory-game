const images = [
    "img/cat_and_dog.jpg",
    "img/birds.jpg",
    "img/chick.jpg",
    "img/cat_cold.jpg",
    "img/dog.jpg",
    "img/dog_with_present.jpg",
    "img/duck.jpg",
    "img/erinaceidae.jpg",
    "img/guinea_pig_snow.jpg",
    "img/guinea_pig.jpg",
    "img/mouse.jpg",
    "img/parrot.jpg",
    "img/pig.jpg",
    "img/rabbit.jpg",
    "img/raccon.jpg",
    "img/squirrel_sweets.jpg",
    "img/squirrel_sweets.jpg",
    "img/tiny_cat.jpg",
    "img/cat.jpg",
    "img/cat_with_hat.jpg",
    "img/pig_with_hat.jpg",
    "img/dog_with_hat.jpg",
    "img/dog_white.jpg",
    "img/rabbit_brown.jpg"
];

let boardSize = {
    rows: 0,
    cols: 0
  };
  
let gameBoard = [];
let timerInterval;
let seconds = 0;
let timerRunning = false;
let movesCount = 0;

function startTimer() {
  timerRunning = true;
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').innerText = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById('timer').innerText = `Time: ${seconds}s`;
}

function startGame(rows, cols) {
  boardSize.rows = rows;
  boardSize.cols = cols;
  gameBoard = []; // Clear the game board array
  resetTimer(); // Reset timer when starting a new game
  startTimer(); // Start timer when starting a new game
  movesCount = 0; // Reset moves count when starting a new game
  document.getElementById('moves').innerText = `Moves: ${movesCount}`; // Update moves display
  createGameBoard();
}
  
function createGameBoard() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = ''; //so any previous game elements are removed
    const pairsAmount = (boardSize.rows * boardSize.cols) / 2;
    const selectedImages = images.slice(0, pairsAmount); //get the images to the new board
    const shuffledImages = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5); 
    // the line above ensures that each image appears twice by spreaading the elements twice.
    // each pair of elements compared during the sorting process has an equal chance of being placed in either order
    for (let i = 0; i < boardSize.rows * boardSize.cols; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-index', i);
      card.addEventListener('click', handleCardClick);
      gameBoard.push({ index: i, image: shuffledImages[i], matched: false, flipped: false});
      gameContainer.appendChild(card);
    }
}
  
function handleCardClick() {
    const clickedIndex = this.getAttribute('data-index'); //retrieves the value of the index attribute from the clicked card element 
    const clickedCard = gameBoard[clickedIndex];
    if (!clickedCard.matched && !clickedCard.flipped) { // checked if clicked card is not already matched and not already flipped 
      this.style.backgroundImage = `url(${clickedCard.image})`;
      clickedCard.flipped = true;
      const flippedCards = gameBoard.filter(card => card.flipped && !card.matched); //contains the flipped cards that are currently visible on the board.
      if (flippedCards.length === 2) {
        movesCount++; 
        document.getElementById('moves').innerText = `Moves: ${movesCount}`;
        const matchedImages = flippedCards.map(card => card.image); //contains the images of the two flipped cards
        if (matchedImages[0] === matchedImages[1]) {
          gameBoard.forEach(card => {
            if (matchedImages.includes(card.image)) {
              card.matched = true;
            }
          });
        } else {
          setTimeout(() => {
            flippedCards.forEach(card => {
              const cardElement = document.querySelector(`[data-index="${card.index}"]`);
              cardElement.style.backgroundImage = ""; //flips the card back if not matched
              card.flipped = false;
            });
          }, 1000);
        }
      }
      if (gameBoard.every(card => card.matched)) {
        stopTimer();
        alert('Congratulations! You won!');
      }
    }
}