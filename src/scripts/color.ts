import { Color } from 'three';

function average(nums: number[]) {
  return nums.reduce((a, b) => a + b) / nums.length;
}

function colorDistance(c1: Color, c2: Color) {
  const rmean = (c1.r + c2.r) / 2;
  const R = c1.r - c2.r;
  const G = c1.g - c2.g;
  const B = c1.b - c2.b;
  return Math.sqrt((2+rmean/256)*(R**2)+4*(G**2)+(2+(255-rmean)/256)*(B**2));
}

// const p = [
//   new Color(203,163,52),
//   new Color(207,164,57),
//   new Color(213,169,64),

//   new Color(198,101,109),

//   new Color(2,120,52),

//   new Color(2,45,130),
//   new Color(2,47,131),
//   new Color(2,42,128),

//   new Color(187,4,17),
//   new Color(181,5,26),
//   new Color(193,13,26),
// ]

const p = [
  new Color(231,229,91),
  new Color(235,229,89),
  new Color(134,228,103),

  new Color(227,153,152),

  new Color(3,134,66),

  new Color(15,34,144),
  new Color(7,31,144),
  new Color(7,31,147),

  new Color(220,73,65),
  new Color(217,74,67),
  new Color(227,82,61),
]

const p0 = [
  //yellow
  new Color(187,153,9),
  new Color(187,153,9),
  new Color(187,153,9),
  //pink
  new Color(171,69,100),
  //green
  new Color(1,146,29),
  //blue
  new Color(70,70,180),
  new Color(70,70,180),
  new Color(70,70,180),
  //red
  new Color(162,23,21),
  new Color(162,23,21),
  new Color(162,23,21),
]

const dists = [];
for (let i = 0; i < p.length; i++) {
  const dist = colorDistance(p[i], p0[i]);
  dists.push(dist);
}
console.log(dists);
console.log(average(dists));

console.log(colorDistance(new Color(255,255,255), new Color(255,255,255)))
