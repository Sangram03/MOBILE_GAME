// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 500;

// Spaceship variables
let spaceshipWidth = 40;
let spaceshipHeight = 20;
let spaceshipX = (canvas.width - spaceshipWidth) / 2;
let spaceshipY = canvas.height - spaceshipHeight - 10;

// Movement controls
let rightPressed = false;
let leftPressed = false;

// Bullets and enemies
let bullets = [];
let enemies = [];
let bulletSpeed = 5;
let enemySpeed = 2;
let enemySpawnInterval = 1000;  // Spawn an enemy every second

let score = 0;
let lives = 3;
let gameOver = false;

// Event listeners for keyboard controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click", shootBullet, false);
canvas.addEventListener("touchstart", shootBullet, false);

// Event listeners for touch-based control panel
document.getElementById('leftBtn').addEventListener('touchstart', () => leftPressed = true);
document.getElementById('leftBtn').addEventListener('touchend', () => leftPressed = false);

document.getElementById('rightBtn').addEventListener('touchstart', () => rightPressed = true);
document.getElementById('rightBtn').addEventListener('touchend', () => rightPressed = false);

document.getElementById('shootBtn').addEventListener('touchstart', shootBullet);

// Desktop control panel (click listeners)
document.getElementById('leftBtn').addEventListener('mousedown', () => leftPressed = true);
document.getElementById('leftBtn').addEventListener('mouseup', () => leftPressed = false);

document.getElementById('rightBtn').addEventListener('mousedown', () => rightPressed = true);
document.getElementById('rightBtn').addEventListener('mouseup', () => rightPressed = false);

document.getElementById('shootBtn').addEventListener('mousedown', shootBullet);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Draw the spaceship
function drawSpaceship() {
    ctx.beginPath();
    ctx.rect(spaceshipX, spaceshipY, spaceshipWidth, spaceshipHeight);
    ctx.fillStyle = "#00ff00";
    ctx.fill();
    ctx.closePath();
}

// Shoot bullets
function shootBullet() {
    bullets.push({
        x: spaceshipX + spaceshipWidth / 2 - 2,
        y: spaceshipY,
        width: 4,
        height: 10
    });
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fillStyle = "#ff0";
        ctx.fill();
        ctx.closePath();

        // Move bullets
        bullet.y -= bulletSpeed;

        // Remove off-screen bullets
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Spawn enemies
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: 0,
        width: 30,
        height: 30
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.beginPath();
        ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.closePath();

        // Move enemies
        enemy.y += enemySpeed;

        // Check if the enemy reaches the bottom
        if (enemy.y + enemy.height > canvas.height) {
            lives--;
            document.getElementById("lives").textContent = `Lives: ${lives}`;
            enemies.splice(index, 1);

            if (lives <= 0) {
                endGame();
            }
        }

        // Check for collisions with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {

                // Remove the enemy and the bullet
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                score++;
                document.getElementById("score").textContent = `Score: ${score}`;
            }
        });
    });
}

// End the game
function endGame() {
    gameOver = true;
    document.getElementById("game-over").classList.remove('hidden');
    document.getElementById("final-score").textContent = score;
    document.getElementById("score").classList.add('hidden');
    document.getElementById("lives").classList.add('hidden');
}

// Game loop
function draw() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and move spaceship
        drawSpaceship();
        if (rightPressed && spaceshipX < canvas.width - spaceshipWidth) {
            spaceshipX += 7;
        } else if (leftPressed && spaceshipX > 0) {
            spaceshipX -= 7;
        }

        // Draw bullets and enemies
        drawBullets();
        drawEnemies();

        requestAnimationFrame(draw);
    }
}

// Spawn enemies periodically
setInterval(() => {
    if (!gameOver) {
        spawnEnemy();
    }
}, enemySpawnInterval);

draw();
