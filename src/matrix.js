class Matrix {
  constructor(A, level = 1) {
    this.A = this.toMatrix(A);
    this.points = A;
    this.level = level;
    console.log(A, this.A);
  }

  toArray = (A) => {
    let a = [];
    A.forEach((arr) => a.push(...arr));
    return A;
  }

  toMatrix = (A) => {
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

  toMatrix = (A) => {
    var arr = [];
    var rows = Math.sqrt(A.length);
    for (var i = 0; i < rows; i += rows/2) {
      arr[i] = [];
      for (var j = 0; j < rows; j++) {
        arr[i][j] = A[i * rows + j];
      }
    }
    return arr;
  }

  split = (l, chnk = 4) => {
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

  T = (A) => A[0].map((_r,j) => A.map((_c,i) => A[i][j] ) );

  iT = (A) => {
    let g = A.map((row) => row.reverse());
    g = T(g);
    g = g.map((row) => row.reverse());
    return g;
  }

  hilbertify = (A, lvl = this.level, q = 0) => {
    if (lvl > 1) {
      // let B = this.submatrices(A);
      // console.log(A);
      // console.log(B);
      return this.mergetrix(
        this.hilbertify(A[0], lvl - 1, 0),
        this.hilbertify(A[1], lvl - 1, 1),
        this.hilbertify(A[2], lvl - 1, 2),
        this.hilbertify(A[3], lvl - 1, 3),
      );
    }
    switch (q) {
      case 0:
        return this.T(A);
      case 1:
        return this.iT(A);
      default:
        return A;
    }
  }

  submatrices = (A) => {
    console.log(A);
    let res = []
    for(let i = 0; i < A.length; i += A.length/2){
      res.push([A[i].slice(0, 2), A[i + 1].slice(0, 2)]);
      res.push([A[i].slice(2), A[i + 1].slice(2)]);
    }
    return res;
  }

  mergetrix = (a,b,c,d) => {
    return [
      a[0] + b[0],
      a[1] + b[1],
      c[0] + d[0],
      c[1] + d[1]
    ]
  }

}