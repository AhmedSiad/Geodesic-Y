
function getCoords(n) {
    let params = [];
    
    for (let i = 0; i < n; i++) {
        params.push([i + 1, 20 + (i * 40), 32 + (i * 40)]);
    }

    let angles = [210, 90, 330];
    let offsets = [30, 270, 150];
    let cords = [];

    let v = 0;

    for (let i = 0; i < params.length; i++) {
        let l = params[i][0];
        let n1 = params[i][1];
        let n2 = params[i][2];
        let n3 = Math.sqrt((n1 ** 2) + (n2 ** 2) - (2 * n1 * n2 * Math.cos(2 * Math.PI/3)));
        let o1 = Math.asin(n2 * Math.sqrt(3)/2 / n3) * 180 / Math.PI;

        for (let j = 0; j < 3; j++) {
            let o2 = o1 + offsets[j];
            let x1 = n1 * Math.cos(angles[j] * Math.PI / 180);
            let y1 = n1 * Math.sin(angles[j] * Math.PI / 180);

            for (let k = 0; k < l; k++) {
                let o3 = o2 - (k * o1 * 2 / l);
                let x2 = x1 + (n3 * Math.cos(o3 * Math.PI / 180));
                let y2 = y1 + (n3 * Math.sin(o3 * Math.PI / 180));

                cords.push([x2, -y2]);
                v += 1;
            }            
        }
    }

    let max = 0;
    for (let cord of cords) {
        if (max < Math.abs(cord[1])) max = Math.abs(cord[1]);
    }
    console.log(max);
    for (let cord of cords) {
        cord[0] = cord[0] / max * 300;
        cord[1] = cord[1] / max * 300;
    }

    return cords;
}



function getCoordinates(baseSize) {
    let g = generateNSizedGraph(baseSize + 1);
    let centers = getCoords(baseSize);

    let vertices = [];
    let polygons = [];
    for (let i = 0; i < getSmallestCellNumber(baseSize + 1); i++) polygons[i] = [];

    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if (i > g[i][j]) continue;

            let nb = g[i][j];
            let junctions = g[nb].filter((x) => x > nb && g[i].includes(x));

            for (junc of junctions) {
                let vertex = { junction: [i, nb, junc], position: [] };
                let xpos = (centers[i][0] + centers[nb][0] + centers[junc][0])/3;
                let ypos = (centers[i][1] + centers[nb][1] + centers[junc][1])/3;
                vertex.position = [xpos, ypos];
                vertices.push(vertex);
            }
        }
    }

    for (let i = 0; i < getSmallestCellNumber(baseSize + 1); i++) {
        let firstNb = g[i][0];
        let twoJunctions = vertices.filter((x) => x.junction.includes(i) && x.junction.includes(firstNb));
        let cp = [...twoJunctions[1].junction];
        cp.splice(cp.indexOf(i), 1);
        let cr = [...cp];
        polygons[i].push([twoJunctions[1].position[0], twoJunctions[1].position[1]]);
        
        while (true) {
            let nx = g[i].filter((nb) => g[nb].includes(cr[0]) && !g[nb].includes(cr[1]) && cr[1] != nb)[0];
            [cr[0], cr[1]] = [nx, cr[0]];

            if (cr[0] == cp[0]) break;

            let v = vertices.filter((x) => x.junction.includes(i) && x.junction.includes(cr[0]) && x.junction.includes(cr[1]))[0];
            polygons[i].push([v.position[0], v.position[1]])
        }
    }
    centers = centers.slice(0, getSmallestCellNumber(baseSize + 1));
    let result = {};
    result.vertices = vertices;
    result.centers = centers;
    result.polygons = polygons;
    return result;
}

