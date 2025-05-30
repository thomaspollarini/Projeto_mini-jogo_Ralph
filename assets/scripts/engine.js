const state = {
  view: {
    squares: document.querySelectorAll(".panel-square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },
  values: {
    timerId: null,
    gameSpeed: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  actions: {
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function resetGame() {
  state.values.hitPosition = 0;
  state.values.result = 0;
  state.values.currentTime = 60;
  state.values.lives = 3;

  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.result;
  state.view.lives.textContent = `x${state.values.lives}`;

  state.actions.countDownTimerId = setInterval(countDown, 1000);

  moveEnemy();
}

function playSound(audioName) {
  const audio = new Audio(`./assets/audio/${audioName}`);
  audio.volume = 0.1;
  audio.play();
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.values.timerId);
    playSound("time-out.mp3");
    setTimeout(() => {
      alert(`Game Over! Your score is ${state.values.result}`);
      state.view.timeLeft.textContent = 0;
    }, 300);

    resetGame();
    return;
  }
}

function moveEnemy() {
  state.values.timerId = setInterval(randowSquare, state.values.gameSpeed);
}

function randowSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * state.view.squares.length);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenersHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit.m4a");
        randowSquare();
      } else {
        playSound("miss.mp3");
        state.values.lives--;
        state.view.lives.textContent = `x${state.values.lives}`;
        if (state.values.lives <= 0) {
          playSound("game-over.mp3");
          clearInterval(state.actions.countDownTimerId);
          clearInterval(state.values.timerId);
          setTimeout(() => {
            alert(`Game Over! Your score is ${state.values.result}`);
            state.view.timeLeft.textContent = 0;
          }, 300);
          resetGame();
          return;
        }
      }
    });
  });
}

function init() {
  moveEnemy();
  addListenersHitBox();
}

init();
