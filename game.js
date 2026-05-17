const board = document.getElementById("gameBoard");
const timerText = document.getElementById("timer");
const startButton = document.getElementById("startBtn");

const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const timeInput = document.getElementById("time");

const allEmojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍒",
  "🍉",
  "🥝",
  "🍍",
  "🍑",
  "🥥",
  "🍋",
  "🍓",
  "🍈",
  "🍏",
  "🥕",
  "🌽",
  "🥔",
  "🍔",
  "🍕",
];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;

let countdown;

let timeLeft = 60;

startButton.addEventListener("click", startGame);

function startGame() {
  board.innerHTML = "";

  clearInterval(countdown);

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;

  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  timeLeft = parseInt(timeInput.value);

  // Validation

  if ((rows * cols) % 2 !== 0) {
    alert("Board size must be EVEN!");

    return;
  }

  if ((rows * cols) / 2 > allEmojis.length) {
    alert("Too many cards!");

    return;
  }

  // Dynamic Grid

  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  const totalCards = rows * cols;

  const pairs = totalCards / 2;

  let selectedEmojis = allEmojis.slice(0, pairs);

  let cardsArray = [...selectedEmojis, ...selectedEmojis];

  // Shuffle

  cardsArray.sort(() => Math.random() - 0.5);

  // Create Cards

  cardsArray.forEach((emoji) => {
    const card = document.createElement("div");

    card.classList.add("card");

    card.dataset.emoji = emoji;

    // Card HTML

    card.innerHTML = `
            <div class="front">?</div>
            <div class="back">${emoji}</div>
        `;

    board.appendChild(card);

    // Click Event

    card.addEventListener("click", () => {
      if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched") ||
        timeLeft <= 0
      ) {
        return;
      }

      // Flip

      card.classList.add("flip");

      // First Card

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;

        lockBoard = true;

        // MATCH

        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
          firstCard.classList.add("matched");

          secondCard.classList.add("matched");

          matchedPairs++;

          resetTurn();

          // WIN

          if (matchedPairs === pairs) {
            clearInterval(countdown);

            setTimeout(() => {
              timerText.innerHTML = "🎉 YOU WON!";

              timerText.classList.add("win-message");
            }, 500);
          }
        } else {
          // NOT MATCHED

          setTimeout(() => {
            firstCard.classList.remove("flip");

            secondCard.classList.remove("flip");

            resetTurn();
          }, 1000);
        }
      }
    });
  });

  timerText.innerText = `⏰ Time Left: ${timeLeft}`;

  countdown = setInterval(() => {
    timeLeft--;

    timerText.innerText = `⏰ Time Left: ${timeLeft}`;

    if (timeLeft <= 10) {
      timerText.style.color = "red";
    }

    // GAME OVER

    if (timeLeft <= 0) {
      clearInterval(countdown);

      timerText.innerHTML = "💀 GAME OVER";

      timerText.style.color = "red";

      disableAllCards();
    }
  }, 1000);
}

function resetTurn() {
  firstCard = null;

  secondCard = null;

  lockBoard = false;
}

function disableAllCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.style.pointerEvents = "none";
  });
}