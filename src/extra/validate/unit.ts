import { isPointInGeometry } from "./common";
import { ValidateRule, ValidateResult } from './validator';

function unitOverlapped(unit: any, units: any[]) {
  const geometries: [number, number][][] = units.map((u) => u.geometry.coordinates);
  for (const point of unit.geometry.coordinates) {
    for (const geometry of geometries) {
      if (isPointInGeometry(point, geometry)) {
        return true;
      }
    }
  }
  return false;
}

function validate(project: any): ValidateResult {
  // const map = project.map;
  const units: any[] = project.map.units;
  for (let i = 0; i < units.length; i++) {
    const checkUnits = [...units];
    checkUnits.splice(i, 1);
    if (unitOverlapped(units[i], checkUnits)) {
      return {
        type: 'error',
        target: units[i],
        msg: '地图 Unit 元素禁止相互遮盖！',
      }
    }
  }
  return { type: 'success' };
}

const rule: ValidateRule = {
  type: 'map',
  name: 'mapUnitRule',
  description: '',
  validateInfo: '校验地图Unit数据中',
  runner: validate,
};
export default rule;
