var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 70;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 6;
var brickColumnCount = 16;
var brickWidth = 30;
var brickHeight = 40;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    
    for(r=0; r<brickRowCount; r++) {
       
    }
}
var fillStyle = "#0095DD";
var fillTextStyle = "#6495ED";
var setOpen = 0;
var paused = 0;
var score = 0;
var iLives = lives = 3;
var bx = 1-0.2;

function resetVars() {
	paused = 0;
	x = canvas.width/2;
	y = canvas.height-paddleHeight-ballRadius;
	dx = 1;
	dy = -2;
	paddleX = (canvas.width-paddleWidth)/2;
}

function initBricks() {
    score = 0;
	brickOffsetLeft = (canvas.width - brickColumnCount*brickWidth - brickPadding*(brickColumnCount-1))/2;
    if (brickOffsetLeft < 0 - brickWidth / 2) {document.getElementById("overlapWarnText").classList.add("show");} else {document.getElementById("overlapWarnText").classList.remove("show");}
    for(c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x:0, y:0, status:1};
            bricks[c][r].x = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            bricks[c][r].y = (r*(brickHeight+brickPadding))+brickOffsetTop;
        }
    }
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
            	if (!paused) {
            		if(r%2==1){
            			bricks[c][r].x += bx;
            			if(bricks[c][r].x+brickWidth > canvas.width + brickWidth) {
            				bricks[c][r].x -= (canvas.width + brickWidth);
            			}
            		} else {
            			bricks[c][r].x -= bx;
            			if(bricks[c][r].x < 0 - brickWidth) {
            				bricks[c][r].x += (canvas.width + brickWidth);
            			}
            		}
            	}	
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = fillStyle;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius+1, 0, Math.PI*2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
}

function drawWin() {
	pause();
	document.getElementById("winText").classList.add("show");
}

function drawLose() {
	pause();
	document.getElementById("loseText").classList.add("show");
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            var d = [x-ballRadius,x+ballRadius,x,x,x-(ballRadius*Math.sqrt(2)/2),x-(ballRadius*Math.sqrt(2)/2),x+(ballRadius*Math.sqrt(2)/2),x+(ballRadius*Math.sqrt(2)/2)];
            var e = [y,y,y-ballRadius,y+ballRadius,y-(ballRadius*Math.sqrt(2)/2),y+(ballRadius*Math.sqrt(2)/2),y-(ballRadius*Math.sqrt(2)/2),y+(ballRadius*Math.sqrt(2)/2)];
            if(b.status == 1) {
            	for(var i = 0; i < d.length; i++){
                	if(d[i] > b.x && d[i] < b.x+brickWidth && e[i] > b.y && e[i] < b.y+brickHeight) {
                		if(d[i]-dx <= b.x+bx || d[i]-dx >= b.x+brickWidth-bx) {
                			dx = -dx;
                		} else {
                			dy = -dy;
                		}
                    	b.status = 0;
                   		score++;
                    	if(score == brickRowCount*brickColumnCount) {
                        	drawWin();
                    	}
                    	return;
                	}
            	}
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = fillTextStyle;
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = fillTextStyle;
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    	dx = -dx;
	}
	if(y + dy < ballRadius) {
    	dy = -dy;
	} else if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius && y + dy > canvas.height-ballRadius-paddleHeight+2) {
		dx = dx + (x - (paddleX + (paddleWidth / 2))) / (paddleWidth / 6); 
        dy = -dy-0.2;
	} else if(y + dy > canvas.height-ballRadius) {
		if(score == brickRowCount*brickColumnCount) {
        	dy = -dy;
		} else {
			lives--;
			if(!lives) {
                rightPressed = leftPressed = false;
    			drawLose();
			}
			else {
    			resetVars();
			}
		}
	}
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 4;
	}
	else if(leftPressed && paddleX > 0) {
    	paddleX -= 4;
	}
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

document.getElementById("pBtn").onclick = function() {pause()};

function pause() {
	paused = (paused == false) ? true : false;
    if (!lives || setOpen) {paused = true;}
	if(paused) {
        if(dx != 0 || dy != 0) {
		  bkdx = dx; bkdy = dy;
		  dx = dy = 0;
        }
	} else {
		dx = bkdx; dy = bkdy;
	}
}

document.getElementById("setBtn").onclick = function() {settings()};

function settings() {
    setOpen = (setOpen == false) ? true : false;
    pause();
    document.getElementById("setDropdown").classList.toggle("show");
}

var ballRadSlider = document.getElementById("ballRadSlider");
var ballRadOutput = document.getElementById("radValue");
ballRadOutput.innerHTML = ballRadSlider.value;

ballRadSlider.oninput = function() {
    ballRadius = parseInt(this.value);
    ballRadOutput.innerHTML = this.value;
}

var paddleWidthSlider = document.getElementById("paddleWidthSlider");
var paddleWidthOutput = document.getElementById("pwValue");
paddleWidthOutput.innerHTML = paddleWidthSlider.value;

paddleWidthSlider.oninput = function() {
    paddleX += (paddleWidth - parseInt(this.value)) / 2;
    paddleWidth = parseInt(this.value);
    paddleWidthOutput.innerHTML = this.value;
}

var brickWidthSlider = document.getElementById("brickWidthSlider");
var brickWidthOutput = document.getElementById("bwValue");
brickWidthOutput.innerHTML = brickWidthSlider.value;

brickWidthSlider.oninput = function() {
    brickWidth = parseInt(this.value);
    brickWidthOutput.innerHTML = this.value;
    initBricks();
}

var columnCountSlider = document.getElementById("columnCountSlider");
var columnCountOutput = document.getElementById("ccValue");
columnCountOutput.innerHTML = columnCountSlider.value;

columnCountSlider.oninput = function() {
    brickColumnCount = parseInt(this.value);
    columnCountOutput.innerHTML = this.value;
    initBricks();
}

var brickXSlider = document.getElementById("brickXSlider");
var brickXOutput = document.getElementById("bxValue");
brickXOutput.innerHTML = brickXSlider.value;

brickXSlider.oninput = function() {
    bx = parseInt(this.value) / 10;
    brickXOutput.innerHTML = this.value;
}

document.getElementById("resBtn").onclick = function() {restart()};

function restart() {
	lives = iLives;
	score = 0;
    setOpen = 0;
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    document.getElementById("setDropdown").classList.remove("show");
	document.getElementById("winText").classList.remove("show");
	document.getElementById("loseText").classList.remove("show");
	resetVars();
	initBricks();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(!paused && relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(!paused && e.keyCode == 39) {
        rightPressed = true;
    }
    else if(!paused && e.keyCode == 37) {
        leftPressed = true;
    }
    else if(e.keyCode == 32) {
    	pause();
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

resetVars();
initBricks();
draw();
