import { Vector2 } from "three";

export function isPointOnGeometryPoint(point: [number, number], geometry: [number, number][]): boolean {
  // 与顶点重合
  for (const p of geometry) {
    if (Math.abs(p[0] - point[0]) <= Number.EPSILON
      && Math.abs(p[1] - point[1]) <= Number.EPSILON) {
      return true;
    }
  }
  return false;
} 

export function isPointInGeometry(point: [number, number], geometry: [number, number][]): boolean {
  if (geometry.length <= 2) { return false; }
  // 暂不考虑在边上

  // 凸多边形内部
  const p = new Vector2(point[0], point[1]);
  let p0 = new Vector2(geometry[0][0], geometry[0][1]);
  let p1 = new Vector2(geometry[1][0], geometry[1][1]);
  let vAB = p1.clone().sub(p0);
  let vAP = p.clone().sub(p0);
  const flag = Math.sign(vAB.cross(vAP));
  const testPoints = [ ...geometry, point ];
  for (let i = 1; i < testPoints.length - 1; i++) {
    p0 = new Vector2(geometry[0][0], geometry[0][1]);
    p1 = new Vector2(geometry[1][0], geometry[1][1]);
    vAB = p1.clone().sub(p0);
    vAP = p.clone().sub(p0);
    const flag = Math.sign(vAB.cross(vAP));
    if (Math.sign(vAB.cross(vAP)) !== flag) { return false; }
  }
  return true;
}
