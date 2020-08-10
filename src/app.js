let n = 5;

const rulesText = "Two players, black and white, take turns placing each of their respective colored stones on the board. Once a player has formed a path that connects all three sides of the board (top, left, right), that player wins the game."

let coords = getCoordinates(n);
let polygons = coords.polygons;
let centers = coords.centers;

let g = generateNSizedGraph(n);
let gm = new Game(g);

let bAgent = new Agent("black", "random");
let wAgent = new Agent("white", "negamax");

let games = 0;
let wins = { black: 0, white: 0 };
while (games < 0) {
    let gam = new Game(g);
    let winner = "none";
    let col = "black"
    while (winner == "none") {
        let decision;
        if (col == "black") decision = bAgent.decisionFunction(gam);
        else decision = wAgent.decisionFunction(gam);

        gam.processMove(decision, col);
        winner = gam.findWinner(decision);
        col = (col == "black" ? "white" : "black");
    }
    bAgent.root = null;
    wAgent.root = null;

    wins[col] += 1;
    games += 1;
    if (games % 10 == 0) console.log(wins.black, wins.white);
}
console.log(wins);

let gamePlaying = false;
let gameFinished = false;
let turn = "black";
let finalDecision = null;

let winningPath = [];

function setup() {
    let cnv = createCanvas(windowWidth - 100, windowHeight - 300);
    cnv.parent("container");
    cnv.style("display", "block");

    frameRate(60);
}

function draw() {
    background(255);
    if (gamePlaying) update();
    else titleScreen();
}


function startGame() {
    let baseSize = parseInt(document.getElementById("boardSize").value);

    g = generateNSizedGraph(baseSize);
    gm = new Game(g);

    coords = getCoordinates(baseSize);
    polygons = coords.polygons;
    centers = coords.centers;

    let ptb = document.getElementById("player1Type").value;
    let ptw = document.getElementById("player2Type").value;

    bAgent = new Agent("black", ptb);
    wAgent = new Agent("white", ptw);

    document.getElementById("play").style.visibility = "hidden";

    gamePlaying = true;
    finalDecision = null;
    turn = "black";
}


function titleScreen() {
    fill(0, 102, 153);
    textSize(48);
    textAlign(CENTER);
    textFont("PressStart2P");
    text("Welcome to Geodesic Y!", width / 2, height / 2 - 100);

    textSize(40);
    text("Rules:", width / 2, height / 2);

    textSize(16);
    rectMode(CENTER);
    text(rulesText, width / 2, height - 50, 600, 500);

    textSize(20);
    text("Enter your settings below, and when ready, press play to play the game.", width / 2, height - 80);
}

function update() {
    for (let poly of polygons) {
        push();
        translate(width / 2, height / 2);
        strokeWeight(5);

        let index = polygons.indexOf(poly);
        let c;
        if (gm.nodes[index].color == "black") c = color(255, 0, 0);
        else if (gm.nodes[index].color == "white") c = color(0, 255, 0);
        else c = color(255);

        if (winningPath.includes(index)) {
            c.setAlpha(150);
        }

        fill(c);
        beginShape();
        for (let i = 0; i < poly.length; i++) {
            vertex(poly[i][0], poly[i][1]);
        }
        endShape(CLOSE);
        pop();
    }


    if (!gameFinished) {
        if (finalDecision != null) {
            gm.processMove(finalDecision, turn);
            let winner = gm.findWinner(finalDecision);
            if (winner != "none") {
                gameFinished = true;

                for (let nd of gm.nodes) {
                    if (nd.color != gm.nodes[finalDecision].color) continue;
                    if (gm.findRoot(nd).id == finalDecision) winningPath.push(nd.id);
                }
            }

            turn = (turn == "black" ? "white" : "black");
            finalDecision = null;
        }
        else {
            if (turn == "black") finalDecision = bAgent.decisionFunction(gm);
            else finalDecision = wAgent.decisionFunction(gm);
        }
    }
}

function mousePressed() {
    if (gamePlaying && !gameFinished) {
        if (turn == "black" && bAgent.type == "human" || turn == "white" && wAgent.type == "human") {
            let shortest = Infinity;
            let closest;
            for (let c of centers) {
                let d = dist(c[0], c[1], mouseX - width / 2, mouseY - height / 2);
                if (d < shortest && d < 100) {
                    shortest = d;
                    closest = centers.indexOf(c);
                }
            }
            if (gm.legalMoves.includes(closest)) finalDecision = closest;
        }
    }
}

function keyPressed() {
    if (gameFinished) {
        gamePlaying = false;
        gameFinished = false;
        document.getElementById("play").style.visibility = "visible";
        winningPath = [];
    }
}

function windowResized() {
    resizeCanvas(windowWidth - 100, windowHeight - 300);
}



function updateSelect(element) {
    if (element.id == "player1Type") {
        if (element.value != "human" && element.value != "random") {
            document.getElementById("player1Level").style.visibility = "visible";
        }
        else {
            document.getElementById("player1Level").style.visibility = "hidden";
        }
    }
    else {
        if (element.value != "human" && element.value != "random") {
            document.getElementById("player2Level").style.visibility = "visible";
        }
        else {
            document.getElementById("player2Level").style.visibility = "hidden";
        }
    }
}