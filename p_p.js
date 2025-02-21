const canvas = document.getElementById("table");
const ctx = canvas.getContext("2d");

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 4,
  velocityY: 4,
  color: "#00ffcc"
};

// Paddle properties
const paddleWidth = 10, paddleHeight = 100;
const user = { x: 0, y: canvas.height / 2 - paddleHeight / 2, color: "#ff7675", score: 0 };
const cpu = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, color: "#74b9ff", score: 0 };

// Draw rectangle (for paddles & net)
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Draw ball with glow effect
function drawBall(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0; // Reset shadow
}

// Draw net
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 20) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "#fff");
  }
}

// Draw scores
function drawScore(x, y, score) {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(score, x, y);
}

// Collision detection
function collision(b, p) {
  return b.x - b.radius < p.x + paddleWidth &&
         b.x + b.radius > p.x &&
         b.y < p.y + paddleHeight &&
         b.y > p.y;
}

// Update game logic
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Bounce off top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  // Move CPU paddle automatically
  cpu.y += ((ball.y - (cpu.y + paddleHeight / 2))) * 0.1;

  // User paddle collision
  const paddle = (ball.x < canvas.width / 2) ? user : cpu;
  if (collision(ball, paddle)) {
    const collidePoint = ball.y - (paddle.y + paddleHeight / 2);
    const angleRad = (Math.PI / 4) * (collidePoint / (paddleHeight / 2));
    const direction = (ball.x < canvas.width / 2) ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.2; // Increase speed after each hit
  }

  // Scoring logic
  if (ball.x - ball.radius < 0) {
    cpu.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

// Reset ball to center
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}

// Render visuals
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawScore(canvas.width / 4, 30, user.score);
  drawScore((3 * canvas.width) / 4, 30, cpu.score);
  drawRect(user.x, user.y, paddleWidth, paddleHeight, user.color);
  drawRect(cpu.x, cpu.y, paddleWidth, paddleHeight, cpu.color);
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

// Control user paddle with mouse
canvas.addEventListener("mousemove", (e) => {
  user.y = e.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
});

// Game loop
function game() {
  update();
  render();
}

setInterval(game, 1000 / 60); // 60 FPS
