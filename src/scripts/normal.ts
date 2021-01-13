import { Vector3 } from 'three';

function average(nums: number[]) {
  return nums.reduce((a, b) => a + b) / nums.length;
}

// const p = [
//   new Vector3(0.819928,0.929465,-6.159542),
//   new Vector3(0.768242,0.862069,-6.176117),
//   new Vector3(0.771282,0.969493,-6.159835),
//   new Vector3(0.836006,0.855507,-6.168261),
//   new Vector3(0.646467,0.788145,-6.198515),
//   new Vector3(0.881856,0.658656,-6.185970),
// ];

const p =[
  new Vector3(-0.509768,0.330794,-6.252052),
  new Vector3(-0.418484,-0.919587,-6.195171),
  new Vector3(-0.315761,-0.952407,-6.202169),
  new Vector3(-0.179811,0.403165,-6.266208),
  new Vector3(-0.668560,-1.010941,-6.160503),
  new Vector3(-0.229879,0.497875,-6.259036),
];

const averageV = new Vector3();
for (const v of p) {
  v.normalize();
  averageV.add(v);
}
averageV.divideScalar(p.length);
const coses = [];
const angles = [];
for (const v of p) {
  const cos = v.dot(averageV);
  coses.push(cos);
  angles.push(Math.acos(cos));
}
console.log(coses)
console.log(angles)
console.log(average(angles))
