document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.querySelector('.game-area');
    const food = document.getElementById('food');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    let snakeBody = [{x: 200, y: 200}];
    let foodX, foodY;
    let dx = 0;
    let dy = 0;
    const snakeSize = 20;
    const gridSize = 400;
    let changingDirection = false;
    let score = 0;
    let record = localStorage.getItem('record') || 0;
    let snakeParts = [];

    function placeFood() {
        foodX = Math.floor(Math.random() * 20) * 20;
        foodY = Math.floor(Math.random() * 20) * 20;
        food.style.left = foodX + 'px';
        food.style.top = foodY + 'px';
    }

    function moveSnake() {
        let newHead = {x: snakeBody[0].x + dx, y: snakeBody[0].y + dy};

        if (newHead.x >= gridSize || newHead.x < 0 || newHead.y >= gridSize || newHead.y < 0) {
            gameOver();
            return;
        }

        for (let i = 1; i < snakeBody.length; i++) {
            if (newHead.x === snakeBody[i].x && newHead.y === snakeBody[i].y) {
                gameOver();
                return;
            }
        }

        snakeBody.unshift(newHead);

        if (newHead.x === foodX && newHead.y === foodY) {
            score++;
            if (score > record) {
                record = score;
                localStorage.setItem('record', record);
            }
            scoreDisplay.textContent = `Pontuação: ${score} | Recorde: ${record}`;
            placeFood();
        } else {
            snakeBody.pop();
        }

        updateSnakeVisual();
        changingDirection = false;
    }

    function updateSnakeVisual() {
        for (let part of snakeParts) {
            part.remove();
        }
        snakeParts = [];

        for (let i = 0; i < snakeBody.length; i++) {
            let snakePart = document.createElement('div');
            snakePart.className = 'snake';
            snakePart.style.left = snakeBody[i].x + 'px';
            snakePart.style.top = snakeBody[i].y + 'px';
            gameArea.appendChild(snakePart);
            snakeParts.push(snakePart);
        }
    }

    function controlSnake(event) {
        if (changingDirection) return;
        changingDirection = true;

        const key = event.keyCode;
        if (key === 37 && dx === 0) { // left arrow
            dx = -snakeSize;
            dy = 0;
        } else if (key === 38 && dy === 0) { // up arrow
            dx = 0;
            dy = -snakeSize;
        } else if (key === 39 && dx === 0) { // right arrow
            dx = snakeSize;
            dy = 0;
        } else if (key === 40 && dy === 0) { // down arrow
            dx = 0;
            dy = snakeSize;
        }
    }

    function gameOver() {
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
    }

    function restartGame() {
        score = 0;
        snakeBody = [{x: 200, y: 200}];
        dx = 0;
        dy = 0;
        placeFood();
        updateSnakeVisual();
        scoreDisplay.textContent = `Pontuação: ${score} | Recorde: ${record}`;
        gameOverScreen.style.display = 'none';
    }

    placeFood();
    scoreDisplay.textContent = `Pontuação: ${score} | Recorde: ${record}`;
    document.addEventListener('keydown', controlSnake);
    restartButton.addEventListener('click', restartGame);
    setInterval(moveSnake, 200);
});
