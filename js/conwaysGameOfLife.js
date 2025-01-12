var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.cursor = "crosshair";
//var dimensions = [canvas.width, canvas.height];
var dimensions = [200, 200];
var cells = [];
var nextGen = [];
var generation = 0;
var scale = 5;
var paused = true;
var togx = -Infinity;
var togy = -Infinity;
var mousedown = false;
var toggle = true;
var speed = 100;

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("click", click);
document.addEventListener("keypress", keyPress);

function click(e){
    var x = e.clientX;
    var y = e.clientY;
    var i = Math.floor(x / scale);
    var j = Math.floor(y / scale);
    cells[i][j] = 1 - cells[i][j];
    //console.log(x + ", " + y + "\n" + i + ", " + j);
    drawGrid();
    grid.draw();
}

function keyPress(e){
    var char = e.which
    switch(char){
        case 32:
            paused = (paused) ? false : true;
    }
}

function mouseDown(e){
    var x = e.clientX;
    var y = e.clientY;
    togx = Math.floor(x / scale);
    togy = Math.floor(y / scale);
    mousedown = true;
}

function mouseMove(e){
    if(mousedown){
        var x = e.clientX;
        var y = e.clientY;
        if(toggle){
            //cell = cells[Math.floor(x / scale)][Math.floor(y / scale)];
            cells[Math.floor(x / scale)][Math.floor(y / scale)] = 1;//cell == 1? 0 : 1;
        }

        if(x == togx && y == togy){
            toggle = false;
        }
        else{
            toggle = true;
        }
        drawGrid();
        grid.draw();
    }
}

function mouseUp(){
    togx = -Infinity;
    togy = -Infinity;
    mousedown = false;
    toggle = true;
}

for(var i = 0; i < dimensions[0]; i++){
    cells[i] = [];
    nextGen[i] = [];
    for(var j = 0; j < dimensions[1]; j++){
        cells[i][j] = 0;//Math.round(Math.random());
        nextGen[i][j] = 0;
    }
}

function drawGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < dimensions[0]; i++){
        for(var j = 0; j < dimensions[1]; j++){
            if(cells[i][j]){
                ctx.fillRect(i*scale, j*scale, scale, scale);
            }
            else{
                ctx.clearRect(i*scale, j*scale, scale, scale);
            }
        }
    }
}

var grid = {
    draw() {
        // ctx.strokeStyle = "#000000";
        // ctx.lineWidth = 1;
        // ctx.beginPath();

        // for(var i = 0; i <= scale * dimensions[0]; i += scale) {
        //     ctx.moveTo(i, 0);
        //     ctx.lineTo(i, scale * dimensions[0]);
        // }
        // for(var j = 0; j <= scale * dimensions[1]; j += scale) {
        //     ctx.moveTo(0, j);
        //     ctx.lineTo(scale * dimensions[1], j)
        // }
        // ctx.stroke();
    }
}

function update(){
    if(!paused){
        for(var i = 0; i < dimensions[0]; i++){
            for(var j = 0; j < dimensions[1]; j++){
                neighbors = 0;
                for(var x = -1; x <= 1; x++){
                    for(var y = -1; y <= 1; y++){
                        if(i + x >= 0 && i + x < dimensions[0] && j + y >= 0 && j + y < dimensions[1] && !(x == 0 && y == 0)){
                            if(cells[i+x][j+y]){
                                neighbors++;
                            }
                        }
                    }
                }

                if(neighbors < 2 || neighbors > 3){
                    nextGen[i][j] = 0;
                }
                else if(neighbors == 2 && cells[i][j]){
                    nextGen[i][j] = 1;
                }
                else if(neighbors == 3){
                    nextGen[i][j] = 1;
                }
            }
        }

        for(var i = 0; i < dimensions[0]; i++){
            for(var j = 0; j < dimensions[1]; j++){
                cells[i][j] = nextGen[i][j]
            }
        }
        generation++;
        
        drawGrid();
    }
    grid.draw();
}

for(var i = 0; i < dimensions[0]; i++) {
    cells[i] = [];
    for(var j = 0; j < dimensions[1]; j++) {
        cells[i][j] = Math.round(Math.random());
    }
}
console.log("ready");
drawGrid();
var int = setInterval(update, speed);


/*
Bugs:
    - 



Fixes:
    - Instead of running several for loops, combine as many together as you can, for example draw cell after updating it, but that
would be hard to do since the cells are used to update the neighbors, so making another array for drawing cells would be necessary,
but that would defeat the point because then you would have to update that along with the cells array

*/