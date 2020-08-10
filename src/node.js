class Node {
    constructor(key, graph) {
        this.id = key;
        this.color = "empty";
        this.neighbors = graph[key];
        this.parent = this.id;

        this.circuitNeighbors = { black: [...this.neighbors], white: [...this.neighbors]};
        let n = Math.floor((1 / 6) * (Math.sqrt(24 * graph.length + 9) + 3));
        this.edges = getEdge(this.id, n);
    }

    updateCircuitNeighbors(nd) {
        let oppositeColor = (nd.color == "black" ? "white" : "black");
        this.circuitNeighbors[nd.color].splice(this.circuitNeighbors[nd.color].indexOf(nd.id), 1);
        for (let i of nd.circuitNeighbors[nd.color]) {
            if (i == this.id) continue;
            if (!this.circuitNeighbors[nd.color].includes(i)) this.circuitNeighbors[nd.color].push(i);
        }
        this.circuitNeighbors[oppositeColor].splice(this.circuitNeighbors[oppositeColor].indexOf(nd.id), 1);
    }
}


