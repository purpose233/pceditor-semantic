import { isPointInGeometry } from "./common";

function unitOverlapped(unit: any, units: any[]) {
  const geometries: [number, number][][] = units.map((u) => u.geometry.coordinates);
  for (const point of unit.geometry.coordinates) {
    for (const geometry of geometries) {
      if (isPointInGeometry(point, geometry)) {
        return false;
      }
    }
  }
  return true;
}

export default function(project: any) {
  // const map = project.map;
  const units: any[] = project.units;
  for (let i = 0; i < units.length - 1; i++) {
    const checkUnits = units.slice(i + 1);
    if (unitOverlapped(units[i], checkUnits)) { return false; }
  }
  return true;
}
