import validateUnit from './unit';

// 检测多边形相互关系：凹凸多边形分割，检测是否有点落在三角形内部
// 检查Unit是否为正确的多边形，unit是否相互覆盖/包含，unit是否包含obstacle
// function validateUnit(): boolean {  
//   return true;
// }

// 检查obstacle是否为正确多边形，是否相互覆盖/包含
function validateObstacle(): boolean {
  return true;
}

// 检测opening是否同时在俩unit边上
// opening是否位于Unit相邻边上
function validateOpening(): boolean {
  return true;
}

// 检查Unit连接关系是否正确，检查Unit是否相邻，relation是否重复，opening位置是否正确
function validateRelation(): boolean {
  return true;
}

function validateMap(): boolean {
  return true;
}

//////////////////////////////////////////

// function check

function validateTestCase(): boolean {
  return true;
}

/////////////////////////////////////////

export default function validate(project: any): boolean {
  return validateUnit(project);
}
