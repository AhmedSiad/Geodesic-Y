class Game {
    constructor(graph) {
        this.graph = graph;
        this.nodes = [];
        for (let i = 0; i < graph.length; i++) this.nodes.push(new Node(i, graph));

        this.bMoves = [];
        this.wMoves = [];
        this.legalMoves = [];
        for (let i = 0; i < graph.length; i++) this.legalMoves.push(i);
    }

    processMove(location, player) {
        let newStone = this.nodes[location];

        if (player == "black") {
            this.bMoves.push(location);
            newStone.color = "black";
        }
        else {
            this.wMoves.push(location);
            newStone.color = "white";
        }
        if (this.legalMoves.length == 0) console.log("bruh moment");
        this.legalMoves.splice(this.legalMoves.indexOf(location), 1);

        for (let i of newStone.neighbors) {
            let nb = this.nodes[i];
            nb.updateCircuitNeighbors(newStone);
            if (nb.color != newStone.color) continue;

            let nbRoot = this.findRoot(nb);
            nb.parent = newStone.id;
            nbRoot.parent = newStone.id;
            newStone.edges |= nbRoot.edges;
        }
    }

    findWinner(location) {
        if (this.nodes[location].edges == 0b111) return this.nodes[location].color;
        return "none";
    }

    findRoot(node) {
        if (node.parent != node.id) {
            node.parent = this.findRoot(this.nodes[node.parent]).id;
        }
        return this.nodes[node.parent];
    }

    copy() {
        let gm = new Game([...this.graph]);
        gm.bMoves = [...this.bMoves];
        gm.wMoves = [...this.wMoves];
        gm.legalMoves = [...this.legalMoves];
        for (let i = 0; i < this.nodes.length; i++) {
            gm.nodes[i].color = this.nodes[i].color;
            gm.nodes[i].parent = this.nodes[i].parent;
            gm.nodes[i].edges = this.nodes[i].edges;

            gm.nodes[i].circuitNeighbors.black = [...this.nodes[i].circuitNeighbors.black];
            gm.nodes[i].circuitNeighbors.white = [...this.nodes[i].circuitNeighbors.white];
        }
        return gm;
    }
}
