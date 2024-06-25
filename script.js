// Hangman Game Logic
let categories = [];
let score = 0;
let maxAttempts = 6; // Maximum wrong attempts allowed

// Fetch categories from data.json
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    categories = data.categories;
    initializeGame();
  })
  .catch((error) => console.error("Error fetching data:", error));

let selectedCategory = {};
let selectedWord = "";
let guessedLetters = [];
let wrongAttempts = 0;

const hangmanCanvas = document.getElementById("hangmanCanvas");
const ctx = hangmanCanvas.getContext("2d");

// Function to choose a random word from selected category
function chooseWord() {
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  selectedCategory = randomCategory.type;
  selectedWord =
    randomCategory.value[
      Math.floor(Math.random() * randomCategory.value.length)
    ].toUpperCase();
  console.log("Correct word:", selectedWord); // Log the correct word to the console
  displayCategoryHint(); // Display category hint
}

// Function to initialize the game
function initializeGame() {
  chooseWord();
  guessedLetters = [];
  wrongAttempts = 0;
  updateWordToGuess();
  drawHangman();
  updateKeyboard();
  document.getElementById("gameOverMessage").textContent = "";
  score = 0; // Initialize score at the start of each game
  updateScore(); // Update score display
}

// Function to update the word to guess
function updateWordToGuess() {
  const wordToGuessContainer = document.getElementById("wordToGuess");
  let displayWord = "";
  for (let letter of selectedWord) {
    if (guessedLetters.includes(letter)) {
      displayWord += letter + " ";
    } else {
      displayWord += "_ ";
    }
  }
  wordToGuessContainer.textContent = displayWord;
  checkGameStatus();
}

// Function to update the keyboard
function updateKeyboard() {
  const qwertyContainer = document.querySelector(".qwerty");
  qwertyContainer.innerHTML = "";
  for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");
    keyElement.textContent = letter;
    keyElement.addEventListener("click", () => handleLetterClick(letter));
    qwertyContainer.appendChild(keyElement);
  }
}

// Function to handle letter clicks
function handleLetterClick(letter) {
  if (!guessedLetters.includes(letter)) {
    guessedLetters.push(letter);
    if (!selectedWord.includes(letter)) {
      wrongAttempts++;
      drawHangman();
    } else {
      score += 10; // Increase score on correct guess
      updateScore();
    }
    updateWordToGuess();
  }
}

// Function to handle keyboard input
document.addEventListener("keydown", function (event) {
  const key = event.key.toUpperCase();
  if (/^[A-Z]$/.test(key) && !guessedLetters.includes(key)) {
    guessedLetters.push(key);
    if (!selectedWord.includes(key)) {
      wrongAttempts++;
      drawHangman();
    } else {
      score += 10; // Increase score on correct guess
      updateScore();
    }
    updateWordToGuess();
  }
});

// Function to draw hangman based on wrong attempts
function drawHangman() {
  ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
  // Draw hangman based on wrongAttempts
  // Example of basic stick figure hangman (you can replace with your own style)
  if (wrongAttempts >= 1) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(20, 190);
    ctx.lineTo(80, 190);
    ctx.stroke();
  }
  if (wrongAttempts >= 2) {
    ctx.beginPath();
    ctx.moveTo(50, 190);
    ctx.lineTo(50, 20);
    ctx.stroke();
  }
  if (wrongAttempts >= 3) {
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(120, 20);
    ctx.stroke();
  }
  if (wrongAttempts >= 4) {
    ctx.beginPath();
    ctx.moveTo(120, 20);
    ctx.lineTo(120, 40);
    ctx.stroke();
  }
  if (wrongAttempts >= 5) {
    ctx.beginPath();
    ctx.arc(120, 55, 15, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (wrongAttempts >= 6) {
    ctx.beginPath();
    ctx.moveTo(120, 70);
    ctx.lineTo(120, 130);
    ctx.stroke();
  }
}

// Function to check game status (win/lose)
function checkGameStatus() {
  if (wrongAttempts >= maxAttempts) {
    endGame("You lose! The word was: " + selectedWord);
  } else if (
    !document.getElementById("wordToGuess").textContent.includes("_")
  ) {
    endGame("Congratulations! You win!");
  }
}

// Function to update the score display
function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

// Function to end the game
function endGame(message) {
  document.getElementById("gameOverMessage").textContent = message;
  updateKeyboard(); // Disable keyboard after game ends
}

// Function to display category hint
function displayCategoryHint() {
  const categoryHintContainer = document.getElementById("categoryHint");
  if (categoryHintContainer) {
    categoryHintContainer.textContent = "Category: " + selectedCategory;
  } else {
    console.error("Category hint container not found.");
  }
}

// Reset button functionality
document.getElementById("resetButton").addEventListener("click", () => {
  initializeGame();
});
