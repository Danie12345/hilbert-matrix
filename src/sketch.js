const width =800, height = 800;
const coordDirs = { 0: [-1,-1], 1: [1,-1], 2: [-1, 1], 3: [1, 1] };
let points = [];
let points2 = [];
let level = 4;
let M;

function setup() {
  createCanvas(width, height);
  stroke(255);
  frameRate(12);

  fill(0);
  textSize(16);
}

function draw() {
  background(0);

  hilbert(level, width, height);

  points = rotates(points).filter(e => e != undefined);//rotate(points).filter((e) => e !== undefined);
  console.log(points);
  
  points.forEach((pt, i) => {
    pt.color = points2[i].color;
  });
  lines(points);

  // M = new Matrix(points, level);
  // const f = toArray(M.hilbertify(M.A, level));
  // console.log(f);
  // lines(f);
  
  points.forEach((pt) => {
    noStroke();
    fill(255);
    textSize(8);
    text(pt.color, pt.point.x + 2, pt.point.y + 7);
  });
  console.log('Efficiency:',(400 * points.length/Math.pow(4, level)).toFixed(2));
  noLoop();
}

// falta pasar la coordenada de cada sección
const hilbert = (lvl, w, h, x = width, y = height, c = 0, q = 0) => {
  let color = points.length;
  const [xoff, yoff] = coordDirs[q];
  x = x + (w/2) * xoff;
  y = y + (h/2) * yoff;
  if (lvl === 1) {
    strokeWeight(1);
    stroke(255,0,0);
    point(x, y);
    let dot = { point: createVector(x, y), color};
    points.push(dot);
    points2.push({ point: createVector(x, y), color});
  } else {
    let pospts = [0, 1, 2, 3];
    pospts.forEach((pos) => {
      hilbert(lvl - 1, w/2, h/2, x, y, 4*c, pos);
    });
  }
};

const lines = (points) => {
  let pt = points[0].point;
  for (let i = 0; i < points.length - 1; i++) {
    let p2 = points[i+1].point
    strokeWeight(1)
    stroke(255)
    line(pt.x, pt.y, p2.x, p2.y);
    pt = p2;
  }
}

const rotate = (A, lvl = level, q = 2) => {
  if (lvl == 1) {
    if (q == 0) {
      return toArray(T(toMatrix(A)));
    } else if (q == 1) {
      return toArray(iT(toMatrix(A)));
    } else {
      return A;
    }
  }
  let B = split(A);
  if (q == 0) {
    B = [
      ...rotate(B[0], lvl-1, 2),
      ...rotate(B[1], lvl-1, 0),
      ...toArray(split(rotate(B[3], lvl-1, 0))),
      ...toArray(flipH(translate(split(rotate(B[2], lvl-1, 2)),2))),
    ];
  } else if (q == 1) {
    B = [
      ...toArray(T(split(rotate(B[3], lvl-1, 4)))),
      ...toArray(translate(iT(T(split(rotate(B[2], lvl-1, 5)))), 2)),
      ...rotate(B[0], lvl-1, 5),
      ...rotate(B[1], lvl-1, 2),
    ];
  } else if (q == 2) {
    B = [
      ...rotate(B[0], lvl-1, 0),
      ...rotate(B[2], lvl-1, 2),
      ...rotate(B[3], lvl-1, 3),
      ...rotate(B[1], lvl-1, 1),
    ];
  } else if (q == 3) {
    B = [
      ...rotate(B[0], lvl-1, 0),
      ...rotate(B[2], lvl-1, 2),
      ...rotate(B[3], lvl-1, 3),
      ...rotate(B[1], lvl-1, 1),
    ];
  } else if (q == 4) {
    B = [
      ...rotate(B[3], lvl-1, 3),
      ...rotate(B[1], lvl-1, 1),
      ...rotate(B[0], lvl-1, 0),
      ...rotate(B[2], lvl-1, 2),
    ];
  } else if (q == 5) {
    B = [
      ...rotate(B[3], lvl-1, 3),
      ...rotate(B[2], lvl-1, 2),
      ...rotate(B[0], lvl-1, 0),
      ...rotate(B[1], lvl-1, 1),
    ];
  }
  return B;
}

const split = (l, chnk = 4) => {
  let cnt = Math.ceil(l.length/chnk);
  let arrays = new Array();
  for (let i = 0; i < chnk; i++) {
    arrays.push(new Array());
  }
  let j = 0;
  l.forEach((el) => {
    if (cnt == 0) {
      cnt = Math.ceil(l.length/chnk);
      j++;
    }
    arrays[j].push(el);
    cnt--;
  });
  return arrays;
}

const toMatrix = (A) => {
  var arr = [];
  var rows = Math.sqrt(A.length);
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
    for (var j = 0; j < rows; j++) {
      arr[i][j] = A[i * rows + j];
    }
  }
  return arr;
}

const toArray = (A) => {
  let a = [];
  A.forEach((arr) => a.push(...arr));
  return a;
}

const T = (A) => A[0].map((_r,j) => A.map((_c,i) => A[i][j] ) );

const iT = (A) => {
  let g = A.map((row) => row.reverse());
  g = T(g);
  g = g.map((row) => row.reverse());
  return g;
}

const flipV = (A) => A.reverse();

const flipH = (A) => A.map((row) => row.reverse());

const translate = (A, q = 0) => {
  if (q > 0) {
    let [a,b,c,d] = toArray(A);
    return translate([[b,d],[a,c]], q - 1);
  }
  return A;
}


const rotates = (A, l = level) => {
  if (l == 1) {
    return A;
  } else {
    let len = A.length/4;
    let q = (level - l)%4;
    console.log(q);
    let [a,b,c,d] = [A.slice(0, len), A.slice(len, 2*len), A.slice(2*len, 3*len), A.slice(3*len, 4*len)];
    return [...rotates(toArray(T(toMatrix(a))),l-1),...rotates(toArray(T(T(toMatrix(b)))),l-1),...rotates(d,l-1),...rotates(toArray(iT(toMatrix(c))),l-1)];
    if (q == 0) {
    } else if (q == 1) {
      return toArray(iT(iT(toMatrix([...rotates(a,l-1),...rotates(c,l-1),...rotates(d,l-1),...rotates(b,l-1)]))));
    } else if (q == 2) {
      return toArray(T(T(toMatrix([...rotates(a,l-1),...rotates(c,l-1),...rotates(d,l-1),...rotates(b,l-1)]))));
    } else if (q == 3) {
      return [...rotates(toArray(T(toMatrix(b))),l-1),...rotates(toArray(T(T(toMatrix(d)))),l-1),...rotates(c,l-1),...rotates(toArray(iT(toMatrix(a))),l-1)];
    }
  }
}


