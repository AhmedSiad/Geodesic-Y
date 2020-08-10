class Agent {
    constructor(color, type) {
        this.color = color;
        this.type = type;

        this.decisionFunction = null;
        if (type == "human") this.decisionFunction = this.human;
        if (type == "random") this.decisionFunction = this.random;
        if (type == "negamax") this.decisionFunction = this.minimax;
        if (type == "montecarlo") this.decisionFunction = this.mcts;


        this.maxDepth = 4;
        this.maxTrials = 1000;
        this.expC = 1;

        this.root = null;
    }

    random(gameState) {
        let pick = Math.floor(Math.random() * gameState.legalMoves.length);
        pick = gameState.legalMoves[pick];
        return gameState.nodes[pick].id;
    }

    human(gameState) {
        return null;
    }


    minimax(gameState) {
        let bestMove = this.negamax(gameState, this.maxDepth, -Infinity, Infinity, this.color, null);
        return bestMove;
    }

    negamax(gameState, depth, alpha, beta, color, move) {
        if (move != null) {
            let initialVal = this.evaluateGameState(gameState, color, move);
            if (initialVal == Infinity || initialVal == -Infinity || depth == 0) return initialVal;
        }

        let value = -Infinity;
        let bestMove = gameState.legalMoves[0];
        for (let i of gameState.legalMoves) {
            let currentGameState = gameState.copy();
            currentGameState.processMove(i, color);

            let oppositeColor = (color == "black" ? "white" : "black");
            let oppositeVal = this.negamax(currentGameState, depth - 1, -beta, -alpha, oppositeColor, i);
            let childVal = -oppositeVal;
            bestMove = (childVal > value ? i : bestMove);
            value = Math.max(value, childVal);
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break;
        }
        if (depth == this.maxDepth) return bestMove;
        return value;
    }

    evaluateGameState(gameState, color, move) {
        let winner = gameState.findWinner(move);
        if (winner == color) return Infinity;
        else if (winner == "none") {
            let score = 0;
            for (let i of gameState.nodes) {
                score += i.circuitNeighbors[color].length;
            }
            return score;
        }
        return -Infinity;
    }

    mcts(gameState) {
        //let root = new MCTSNode(gameState.copy(), this.color, null, null);
        //root.expand_node()

        if (this.root == null) {
            this.root = new MCTSNode(gameState.copy(), this.color, null, null);
            this.root.expand_node();
        }
        else {
            let lastMove;
            if (this.color == "black") lastMove = gameState.wMoves[gameState.wMoves.length - 1];
            else lastMove = gameState.bMoves[gameState.bMoves.length - 1];
            let ch = this.root.children.filter((c) => c.move == lastMove)[0];
            this.root = ch;
        }

        let trials = 0;
        while (trials < this.maxTrials) {
            // SELECTION + EXPANSION
            let pick = this.root;
            while (pick.children.length > 0) {
                let bestScore = 0;
                let bestChild = pick.children[0];
                for (let child of pick.children) {
                    let res = 0.5;
                    if (child.trials >= 5) {
                        res = child.wins / child.trials * Math.sqrt(this.expC * Math.log(pick.trials) / child.trials);
                    }
                    if (res > bestScore) {
                        bestScore = res;
                        bestChild = child;
                    }
                    else if (res == bestScore) {
                        if (Math.floor(Math.random() * 2) == 1) {
                            bestScore = res;
                            bestChild = child;
                        }
                    }
                }
                pick = bestChild;
            }
            pick.expand_node();

            // Simulation
            let winner = pick.simulate();

            // Backpropagation
            while (pick.parent != null) {
                pick.trials += 1;
                if (winner != pick.color) pick.wins += 1;
                pick = pick.parent;
            }
            trials += 1;
            pick.trials += 1;
        }

        let bestWinPercentage = 0;
        let bestMove = gameState.legalMoves[0];
        for (let child of this.root.children) {
            let winpercent = (child.trials == 0 ? 0 : child.wins / child.trials);
            //console.log(child.wins, child.trials);
            if (winpercent > bestWinPercentage) {
                bestMove = child.move;
                bestWinPercentage = winpercent;
                this.root = child;
            }
        }
        this.root.parent = null;
        return bestMove;
    }
}



