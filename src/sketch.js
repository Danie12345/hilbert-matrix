const width = 400, height = 400;
const coordDirs = { 0: [-1,-1], 1: [1,-1], 2: [-1, 1], 3: [1, 1] };
let points = [];
let points2 = [];
let level = 5;

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

  points = rotate(points).filter((e) => e !== undefined);
  
  points.forEach((pt, i) => {
    pt.color = points2[i].color;
  });
  console.log(points);
  lines(points);
  
  points.forEach((pt) => {
    noStroke();
    fill(255);
    textSize(8);
    // text(pt.color, pt.point.x + 2, pt.point.y + 7);
  });

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
  let p = points[0].point;
  for (let i = 0; i < points.length - 1; i++) {
    let p2 = points[i+1].point
    strokeWeight(1)
    stroke(255)
    line(p.x, p.y, p2.x, p2.y);
    p = p2;
  }
}

// const rotate = (A, lvl = level, q = 0) => {
//   let res = [];
//   if (lvl > 1) {
//     let B = toMatrix(split(A, 4));
//     if (B[0] instanceof Array) {
//       B.forEach((b, i) => {
//         if (b instanceof Array) {
//           rotate(b, lvl-1, i).forEach((el) => {
//             res.push(el);
//           });
//           // res.push(...rotate(b, lvl-1, i));
//         }
//       });
//     } else {
//       return toArray(B);
//     }
//   } else {
//     if (q == 0) {
//       return toArray(T(A));
//     } else if (q == 1) {
//       return toArray(iT(A));
//     } else {
//       return toArray(A);
//     }
//   }
//   console.log(res);
//   return res;
// }

const rotate = (A, lvl = level, q = 2) => {
  if (lvl == 1) {
    return A;
  }
  let B = split(A);
  if (q == 0) {
    B = [
      ...toArray(T(split(rotate(B[0], lvl-1, 0)))),
      ...rotate(B[1], lvl-1, 1),
      ...rotate(B[3], lvl-1, 3),
      ...toArray(iT(split(rotate(B[2], lvl-1, 2)))),
    ];
  } else if (q == 1) {
    B = [
      ...toArray(T(split(rotate(B[3], lvl-1, 3)))),
      ...rotate(B[2], lvl-1, 2),
      ...rotate(B[0], lvl-1, 0),
      ...toArray(iT(split(rotate(B[1], lvl-1, 1)))),
    ];
  } else {
    B = [
      ...rotate(B[0], lvl-1, 0),
      ...rotate(B[2], lvl-1, 2),
      ...rotate(B[3], lvl-1, 3),
      ...rotate(B[1], lvl-1, 1),
    ];
  }
  return B;
}


// const split = (l, chnk = 4) => {
//   return [...Array(Math.ceil(l.length / chnk))].map(_ => l.splice(0, chnk));
// }


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
