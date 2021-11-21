var playingArea;
var paddle;
var ball;
var score;

var availableWidth;
var availableHeight;
var playingAreaWidth;
var playingAreaHeight;
var horizontalSpeed = 2;
var verticalSpeed = 2;
var paddleSpeed = 48;
var currentsScore = 0;
var timer;
var paddleLeft = 228;
var ballLeft = 100;
var ballTop = 8;

var isDragging = false;

const layoutPage = () => {
  availableWidth = window.innerWidth;
  availableHeight = window.innerHeight;

  playingAreaWidth = availableWidth - 22;
  playingAreaHeight = availableHeight - 22;

  playingArea.style.width = playingAreaWidth + 'px';
  playingArea.style.height = playingAreaHeight + 'px';
}

const keyListener = (e) => {
  const keyCode = e.keyCode;
  if ((keyCode === 37 || keyCode === 65) && paddleLeft > 0) {
    paddleLeft -= paddleSpeed;

    if (paddleLeft < 0) {
      paddleLeft = 0;
    }
  } else if ((keyCode === 39 || keyCode === 68) && paddleLeft < playingAreaWidth - 64) {
    paddleLeft += paddleSpeed;

    if (paddleLeft > playingAreaWidth - 64) {
      paddleLeft = playingAreaWidth - 64;
    }
  }

  paddle.style.left = paddleLeft + 'px';
}

const moveBall = () => {
  ballLeft += horizontalSpeed;
  ballTop += verticalSpeed;
  ball.style.left = ballLeft + 'px';
  ball.style.top = ballTop + 'px';
}

const updateScore = () => {
  currentsScore += 5;
  score.innerHTML = `Score: ${currentsScore}`;
}

const render = () => {
  moveBall();
  updateScore();
}

const collisionX = () => {
  if (ballLeft < 4 || ballLeft > playingAreaWidth - 20) {
    return true;
  }

  return false;
}

const collisionY = () => {
  if (ballTop < 4) {
    return true;
  }

  if (ballTop > playingAreaHeight - 64) {
    if (ballLeft >= paddleLeft + 16 && ballLeft <= paddleLeft + 48) {
      if (horizontalSpeed < 0)
        horizontalSpeed = -2;
      else
        horizontalSpeed = 2;
      return true;
    } else if (ballLeft >= paddleLeft && ballLeft < paddleLeft + 16) {
      if (horizontalSpeed < 0)
        horizontalSpeed = -8;
      else
        horizontalSpeed = 8;
      return true;
    } else if (ballLeft > paddleLeft + 48 && ballLeft <= paddleLeft + 64) {
      if (horizontalSpeed < 0)
        horizontalSpeed = -8;
      else
        horizontalSpeed = 8;
      return true;
    }
  }

  return false;
}


const detectCollision = () => {
  if (collisionX()) {
    horizontalSpeed *= -1;
  }
  if (collisionY()) {
    verticalSpeed *= -1;
  }
}

const difficulty = () => {
  if (currentsScore % 1000 === 0) {
    if (verticalSpeed > 0) {
      verticalSpeed += 2;
    } else {
      verticalSpeed -= 2;
    }
  }
}

const gameOver = () => {
  cancelAnimationFrame(timer);
  score.innerHTML = `Score: ${currentsScore}   Game Over!`;
  score.style.backgroundColor = 'rgb(128,0,0)';
}

const start = () => {
  render();
  detectCollision();
  difficulty();

  if (ballTop < playingAreaHeight - 32) {
    timer = requestAnimationFrame(start);
  } else {
    gameOver();
  }
}

const mouseDown = (e) => {
  isDragging = true;
}

const mouseMove = (e) => {
  if (isDragging) {
    e.preventDefault();
    paddleLeft = e.clientX - 32 || e.targetTouches[0].pageX - 32;

    if (paddleLeft < 0) {
      paddleLeft = 0;
    } else if (paddleLeft > playingAreaWidth - 64) {
      paddleLeft = playingAreaWidth - 64;
    }

    paddle.style.left = paddleLeft + 'px';
  }
}

const mouseUp = (e) => {
  isDragging = false;
}

const init = () => {
  playingArea = document.querySelector('#playingArea');
  paddle = document.querySelector('#paddle');
  ball = document.querySelector('#ball');
  score = document.querySelector('#score');

  document.addEventListener('keydown', keyListener, false);

  playingArea.addEventListener('mousedown', mouseDown, false);
  playingArea.addEventListener('mousemove', mouseMove, false);
  playingArea.addEventListener('mouseup', mouseUp, false);

  playingArea.addEventListener('touchstart', mouseDown, false);
  playingArea.addEventListener('touchmove', mouseMove, false);
  playingArea.addEventListener('touchend', mouseUp, false);

  layoutPage();

  timer = requestAnimationFrame(start);
}

window.onload = init;
window.onresize = layoutPage;