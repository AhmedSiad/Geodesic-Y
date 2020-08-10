class MCTSNode {
    constructor(gameState, color, parent, move) {
        this.gameState = gameState;
        this.color = color;
        this.parent = parent;
        this.children = [];
        this.move = move;

        this.wins = 0;
        this.trials = 0;

        this.isTerminal = false;
    }

    expand_node() {
        if (this.move != null) {
            this.gameState = this.gameState.copy();
            if (this.gameState.findWinner(this.move) != "none") {
                this.isTerminal = true;
                return;
            }
            this.gameState.processMove(this.move, this.parent.color);
            if (this.gameState.findWinner(this.move) != "none") {
                this.isTerminal = true;
                return;
            }
        }

        let color = (this.color == "black" ? "white" : "black");
        for (let i of this.gameState.legalMoves) {
            let nc = new MCTSNode(this.gameState, color, this, i);
            this.children.push(nc);
        }
    }

    simulate() {
        let state = this.gameState.copy();
        let winner = state.findWinner(this.move);
        let color = (this.color == "black" ? "white" : "black");
        while (winner == "none") {
            let pick = state.legalMoves[Math.floor(Math.random() * state.legalMoves.length)];
            state.processMove(pick, color);
            color = (this.color == "black" ? "white" : "black");
            winner = state.findWinner(pick);
        }
        if (!this.isTerminal) delete this.gameState;
        return winner;
    }
}


