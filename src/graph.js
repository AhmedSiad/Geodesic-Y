


function generateNSizedGraph(n) {
    if (n <= 2) {
        let graph = [];
        graph[0] = [1, 2];
        graph[1] = [0, 2];
        graph[2] = [0, 1];
        return graph;
    }

    let graph = [];
    for (let i = 0; i < getSmallestCellNumber(n + 1); i++) graph[i] = [];

    graph[0] = [1, 2, 3, 4, 8];
    graph[1] = [0, 2, 4, 5, 6];
    graph[2] = [0, 1, 6, 7, 8];

    let depth = 3;
    while (depth <= n) {
        let smallest = getSmallestCellNumber(depth);
        let biggest = getSmallestCellNumber(depth + 1);

        for (let i = smallest; i < biggest; i++) {
            if (i != biggest - 1) graph[i].push(i + 1);
            else graph[i].push(smallest);

            if (i != smallest) graph[i].push(i - 1);
            else graph[i].push(biggest - 1);

            if (isCorner(i, depth) && depth != n) {
                let cornerNum = getCornerPlace(i, depth);
                let nextCornerUp = getCorner(cornerNum, depth + 1);
                graph[i].push(nextCornerUp);
                graph[i].push(nextCornerUp + 1);

                if (nextCornerUp == biggest) {
                    graph[i].push(getSmallestCellNumber(depth + 2) - 1);
                }
                else {
                    graph[i].push(nextCornerUp - 1);
                }
            }
            else if (depth != n) {
                let c = getCornerPlace(lastCorner(i, depth), depth);
                let multiple = (depth - 1) * 3;
                graph[i].push(i + multiple + c);
                graph[i].push(i + multiple + c + 1);
            }
        }
        depth += 1;
    }
    pairUpGraph(graph);
    return graph;
}


function pairUpGraph(graph) {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            let res = graph[i][j];
            if (graph[res].includes(i) == false) graph[res].push(i);
        }
        graph[i].sort((a, b) => a - b);
    }
}

function getSmallestCellNumber(n) {
    return 3 * (n - 1) * (n - 2) / 2;
}

function isCorner(x, depth) {
    let smallestCell = getSmallestCellNumber(depth);
    let arr = [smallestCell, smallestCell + depth - 1, smallestCell + depth * 2 - 2];
    return arr.includes(x);
}

function getCornerPlace(x, depth) {
    let smallestCell = getSmallestCellNumber(depth);
    if (x == smallestCell) return 0;
    if (x == smallestCell + depth - 1) return 1;
    if (x == smallestCell + depth * 2 - 2) return 2;
}

function getCorner(num, depth) {
    let smallestCell = getSmallestCellNumber(depth);
    return smallestCell + (depth - 1) * num;
}

function lastCorner(x, depth) {
    let f = getCorner(0, depth);
    let s = getCorner(1, depth);
    let t = getCorner(2, depth);

    if (x < s) return f;
    if (x < t) return s;
    return t;
}

function getEdge(x, depth) {
    let f = getCorner(0, depth);
    let s = getCorner(1, depth);
    let t = getCorner(2, depth);

    let edge = 0b0;
    if (f <= x && x <= s) edge |= 0b01;
    if (s <= x && x <= t) edge |= 0b10;
    if (x >= t || x == f) edge |= 0b100;
    return edge;
}


