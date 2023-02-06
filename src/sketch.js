const width = 400, height = 400;
const coordDirs = { 0: [-1,-1], 1: [1,-1], 2: [-1, 1], 3: [1, 1] };
let points = [];
let level = 3;

function setup() {
  createCanvas(width, height);
  stroke(255);
  frameRate(12);

  fill(0);
  textSize(12);
}

function draw() {
  background(0);

  hilbert(level, width, height);
  // points = rotate(points);
  lines(points);
  noLoop();
}

// falta pasar la coordenada de cada sección
const hilbert = (lvl, w, h, x = width, y = height, q = 0, pq = 0) => {
  let count = points.length;
  const [xoff, yoff] = coordDirs[q];
  x = x + (w/2) * xoff;
  y = y + (h/2) * yoff;
  if (lvl === 0) {
    strokeWeight(2);
    stroke(255,0,0)
    point(x, y);
    let dot1 = { point: createVector(x, y), count};
    noStroke();
    fill(255)
    textSize(8);
    text(count, x - 1, y + 7);
    points.push(dot1)
  } else {
    let pospts = [0,2,3,1];//.sort( () => .5 - Math.random() );
    if (pq == 0 && q != 0) {
      pospts = [0,1,3,2];
    } else if (pq == 1 && q != 1) {
      pospts = [3,2,0,1]
    } else if (pq == 0 && q == 0) {
      pospts = pospts.reverse()
    } else if (pq == 1 && q == 1) {
      pospts = pospts.reverse()
    }
    console.log(pq, q)
    pospts.forEach((pos) => {
      hilbert(lvl - 1, w/2, h/2, x, y, pos, q);
    });
  }
};

const lines = (points) => {
  let p = points[0].point;
  for (let i = 0; i < points.length - 1; i++) {
    let p2 = points[i+1].point;
    strokeWeight(.5);
    stroke(255);
    line(p.x, p.y, p2.x, p2.y);
    p = p2;
  }
}

const rotate = (A, q = 0) => {
  let [a, b, c, d] = split(A);
  if (A.length == 4 && q == 0) {
    return [...rotate(a), ...rotate(c, 1), ...rotate(b, 2), ...rotate(d)];
  } else if (A.length == 4 && q == 2) {
    return [...rotate(d), ...rotate(b, 1), ...rotate(c, 2), ...rotate(a)];
  } else if (Array.isArray(a)) { 
    console.log('enter rotate');
    return [...a, ...b, ...c, ...d];
  }
  return [a, b, c, d];
}


const split = (l, chnk = 4) => {
  return [...Array(Math.ceil(l.length / chnk))].map(_ => l.splice(0, chnk));
}
