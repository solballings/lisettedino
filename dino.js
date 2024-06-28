// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// dino 
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
    vy: 0,
    jumpStrength: -12,
    gravity: 0.5,
    isJumping: false
};

// obstacles
let obstacles = [];
let obstacleWidth = 50;
let obstacleHeight = 50;
let obstacleSpeed = 5;
let obstacleFrequency = 1500; // milliseconds

// game
let score = 0;
let gameOver = true; // Start met game over status

// Functie om het spel te starten
function startGame() {
    // Reset het spel
    obstacles = [];
    score = 0;
    gameOver = false;

    // Verberg startscherm en toon canvas
    document.getElementById("startScreen").style.display = "none";
    board.style.display = "block";

    // Speel het geluidje af
    let winSound = document.getElementById("winSound");
    winSound.play();

    // Event listener voor sprong
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space" && !dino.isJumping) {
            dino.vy = dino.jumpStrength;
            dino.isJumping = true;
        }
    });

    // Start de game loop
    update();
    spawnObstacle();
}

// Game loop
function update() {
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "30px Courier New";
        context.fillText("Dat kan beter lisette!", boardWidth / 2 - 80, boardHeight / 2);
        return;
    }

    // maak het canvas leeg 
    context.clearRect(0, 0, boardWidth, boardHeight);

    // Update dino na het laden van een nieuw canvas
    updateDino();
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Update en teken obstakels
    updateObstacles();
    drawObstacles();

    // Tekenen van de score
    context.fillStyle = "black";
    context.font = "20px Courier New";
    context.fillText("Score: " + score, 10, 20);

    // Vraag de volgende frame aan
    requestAnimationFrame(update);
}

// Functie om de dino te updaten
function updateDino() {
    dino.vy += dino.gravity;
    dino.y += dino.vy;
    if (dino.y + dino.height >= boardHeight) {
        dino.y = boardHeight - dino.height;
        dino.vy = 0;
        dino.isJumping = false;
    }
}

// Functie om obstakels te updaten
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;

        // Check voor botsing met dino
        if (collision(dino, obstacles[i])) {
            gameOver = true;
        }

        // Verwijder obstakels buiten het scherm
        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
            score++;
            i--;
        }
    }
}

// Functie om obstakels te tekenen
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        context.fillStyle = "black";
        context.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    }
}

// Functie om obstakels te spawnen
function spawnObstacle() {
    if (!gameOver) {
        let obstacle = {
            x: boardWidth,
            y: boardHeight - obstacleHeight,
            width: obstacleWidth,
            height: obstacleHeight
        };
        obstacles.push(obstacle);

        // Plan het volgende obstakel
        setTimeout(spawnObstacle, obstacleFrequency);
    }
}

// Functie voor het controleren van botsingen
function collision(dino, obs) {
    return dino.x < obs.x + obs.width &&
           dino.x + dino.width > obs.x &&
           dino.y < obs.y + obs.height &&
           dino.y + dino.height > obs.y;
}

// Initialisatie bij het laden van het venster
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Laden van dino afbeelding
    dinoImg = new Image();
    dinoImg.src = "images/lisette.png";
    dinoImg.onload = function() {
        // Toon startscherm bij het begin
        showStartScreen();
    };
};

// Functie om startscherm te tonen
function showStartScreen() {
    document.getElementById("startScreen").style.display = "block";
    board.style.display = "none";
}

// Voeg event listener toe voor startknop
document.getElementById("startButton").addEventListener("click", startGame);

// Bronnen die zijn toegepast voor verschillende onderdelen van de code:
// 1. **HTML en CSS Basis**:
//    - **MDN Web Docs - HTML**: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
//    - **MDN Web Docs - CSS**: [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
// 2. **Canvas API**:
//    - **MDN Web Docs - Canvas API**: [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
// 3. **Afbeeldingen laden en tekenen**:
//    - **W3Schools - HTML Canvas drawImage() Method**: [drawImage](https://www.w3schools.com/tags/canvas_drawimage.asp)
// 4. **Spel logica en animatie**:
//    - **MDN Web Docs - Using requestAnimationFrame**: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
// 5. **Gebeurtenisafhandeling**:
//    - **MDN Web Docs - Document: keydown event**: [keydown event](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event)
// 6. **Collision Detection**:
//    - **MDN Web Docs - 2D collision detection**: [2D collision detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
// ik snap niet waarom het niet lukt, heb echt zo veel geprobeerd om het geluid er in te krijgen, aan chat gevraagd nog maar het lukte gewoon niet. ik heb de code er wel ingelaten voor feedback. 
