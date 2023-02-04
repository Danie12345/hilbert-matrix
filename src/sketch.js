const width = 400, height = 400;
const coordDirs = { 0: [-1,-1], 1: [1,-1], 2: [-1, 1], 3: [1, 1] };
let points = [];

function setup() {
  createCanvas(width, height);
  stroke(255);
  frameRate(12);

  fill(0);
  textSize(16);
}

function draw() {
  background(0);

  hilbert(9, width, height);
  console.log(points.length);
  // points = rotate(points);
  // lines(points);
  noLoop();
}

// falta pasar la coordenada de cada sección
const hilbert = (lvl, w, h, x = width, y = height, c = 0, q = 0) => {
  let color = Math.pow(4, lvl - 1) + c + q;
  const [xoff, yoff] = coordDirs[q];
  x = x + (w/2) * xoff;
  y = y + (h/2) * yoff;
  if (lvl === 1) {
    strokeWeight(2);
    stroke(255,0,0)
    point(x, y);
    let dot1 = { point: createVector(x, y), color};
    noStroke();
    fill(255)
    textSize(12);
    // text(color, x + 3*color, y + 3*color);
    points.push(dot1)
  } else {
    let pospts = [0, 2, 3, 1];//.sort( () => .5 - Math.random() );
    pospts.forEach((pos) => {
      hilbert(lvl - 1, w/2, h/2, x, y, 4*c, pos);
    });
  }
};

const lines = (points) => {
  console.log(points);
  let p = points[0].point;
  for (let i = 0; i < points.length - 1; i++) {
    let p2 = points[i+1].point
    strokeWeight(1)
    stroke(255)
    line(p.x, p.y, p2.x, p2.y);
    p = p2;
  }
}

const rotate = (A, q = 0) => {
  console.log('enter rotate');
  let [a, b, c, d] = split(A);
  if (A.length == 4 && q == 0) {
    return [...rotate(a), ...rotate(c, 1), ...rotate(b, 2), ...rotate(d)];
  } else if (A.length == 4 && q == 2) {
    return [...rotate(d), ...rotate(b, 1), ...rotate(c, 2), ...rotate(a)];
  } else if (Array.isArray(a)) { 
    return [...a, ...b, ...c, ...d];
  }
  return [a, b, c, d];
}


const split = (l, chnk = 4) => {
  return [...Array(Math.ceil(l.length / chnk))].map(_ => l.splice(0, chnk));
}
