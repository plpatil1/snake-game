const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "UP") newHead.y -= box;
    if (direction === "RIGHT") newHead.x += box;
    if (direction === "DOWN") newHead.y += box;

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        saveScore(score);  // Save score & update GitHub contributions
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height || snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        clearInterval(game);
        alert(`Game Over! Score: ${score}`);
        saveScore(score); // Final save before reload
        location.reload();
    }

    snake.unshift(newHead);
}

function saveScore(score) {
    fetch("https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/score.txt", {
        method: "PUT",
        headers: {
            "Authorization": "token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update score",
            content: btoa(`Latest Score: ${score}`),
            sha: "SHA_OF_EXISTING_SCORE_FILE"
        })
    })
    .then(response => response.json())
    .then(data => console.log("Score updated!", data))
    .catch(error => console.error("Error updating score:", error));
}

let game = setInterval(drawGame, 100);
