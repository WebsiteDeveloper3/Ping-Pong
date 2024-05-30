const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedMofifier = 0;
    this.score = 0;
    this.hasCollidedWith = function(ball) {
        const paddleLeftWall = this.x;
        const paddleRightWall = this.x + this.width;
        const paddleTopWall = this.y;
        const paddleBottomWall = this.y + this.height;
        if (ball.x > paddleLeftWall && ball.x < paddleRightWall
            && ball.y > paddleTopWall && ball.y < paddleBottomWall) {
            return true;
        }
        return false;
    }
    this.move = function(keyCode) {
        let nextY = this.y;
        if (keyCode == 40) {
            nextY += 5;
            this.speedMofifier = 1.5;
        } else if(keyCode == 38) {
            nextY -= 5;
            this.speedMofifier = 1.5;
        } else {
            this.speedMofifier = 0;
        }
        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
        this.y = nextY;
    }
}
let player = new paddle(5, 200, 25, 100);
let ai = new paddle(610, 200, 25, 100);
let ball = {
    x: 320, y: 240, radius: 3, xSpeed: 2, ySpeed: 0,
    reverseX: function() {
        this.xSpeed *= -1;
    },
    reverseY: function() {
        this.ySpeed *= -1;
    },
    reset: function() {
        this.x = 320;
        this.y = 240;
        this.xSpeed = 2;
        this.ySpeed = 0;
    },
    isBouncing: function() {
        return ball.ySpeed != 0;
    },
    modifyXSpeedBy: function(modification) {
        modification = this.xSpeed < 0 ? modification * -1 : modification;
        let nextValue = this.xSpeed + modification;
        nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;
        this.xSpeed = nextValue;
    },
    modifyYSpeedBy: function(modification) {
        modification = this.ySpeed < 0 ? modification * -1 : modification;
        this.ySpeed += modification;
    }
};

function renderPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function renderBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
}

function renderText() {
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(`${player.score} : ${ai.score}`, 300, 40);
}

function tick() {
    updateGame();
    draw();
    window.setTimeout("tick()", 1000/60);
}

function updateGame() {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
    if (ball.x < 0) {
        ai.score++;
        ball.reset();
    } else if (ball.x > 640) {
        player.score++;
        ball.reset();
    }
    if (ball.y <= 0 || ball.y >= 480) {
        ball.reverseY();
    }
    if (player.hasCollidedWith(ball) || ai.hasCollidedWith(ball)) {
        ball.reverseX();
        ball.modifyXSpeedBy(0.25);
        const speedUpValue = player.hasCollidedWith(ball) ? player.speedMofifier : ai.speedMofifier;
        ball.modifyYSpeedBy(speedUpValue);
    }

    for (const keyCode in heldDown) {
        player.move(keyCode);
    }

    const aiMiddle = ai.y + (ai.height / 2);
    if (aiMiddle < ball.y) {
        ai.move(40);
    }
    if (aiMiddle > ball.y) {
        ai.move(38);
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 640, 480);
    renderPaddle(player);
    renderPaddle(ai);
    renderBall(ball);
    renderText();
}
let heldDown = {}
window.addEventListener("keydown", function(keyInfo) {heldDown[event.keyCode] = true;}, false);
window.addEventListener("keyup", function(keyInfo) {delete heldDown[event.keyCode];}, false);

tick();