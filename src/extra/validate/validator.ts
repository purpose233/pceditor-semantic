import rule from './unit';
import mapUnitRule from './unit';

export interface ValidateRule {
  type: string; // 校验类型
  name: string;
  description: string;
  validateInfo: string;
  runner: (project: any) => ValidateResult;
}

export interface ValidateResult {
  type: 'success' | 'error' | 'warning';
  target?: any;
  msg?: string;
  description?: string;
  code?: number; // 问题标识码
}

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

// 检测道路是否落在可行区域外，检测是否与障碍物接触
function validateBasicCase(): boolean {
  return true;
}

// 与 basic case类似 
function validatePathCase(): boolean {
  return true;
}

// 检测覆盖区域是否在可行区域内，是否与障碍物接触，是否为合理区域
function validateCoverCase(): boolean {
  return true;
}

function validateTestCase(): boolean {
  return true;
}

/////////////////////////////////////////

export default function validate(project: any): boolean {
  return true;
}

////////////////////////////////////////

const ValidateMsg = [
  '地图数据校验中',
  'unit 数据校验中',
  'obstacle 数据校验中',
  'opening 数据校验中',
  'relation 数据校验中',
  '测试用例校验中',
  'basic 用例校验中',
  'path 用例校验中',
  'cover 用例校验中',
]

const rules = ValidateMsg.map((msg) => ({
  type: 'map',
  name: 'mapUnitRule',
  description: '',
  validateInfo: msg,
  runner: () => ({ type: 'success' }),
} as ValidateRule));

export class Validator {

  rules: ValidateRule[] = [
    mapUnitRule,
    ...rules,
  ];

  currentRuleIndex: number = 0;

  public runRule(project: any): ValidateResult {
    const rule = this.rules[this.currentRuleIndex];
    const result = rule.runner(project);
    this.currentRuleIndex++;
    if (this.currentRuleIndex >= this.rules.length) {
      this.currentRuleIndex = 0;
    }
    return result;
  }

  public getCurrentRule() {
    return this.rules[this.currentRuleIndex];
  }

  // public runAll() {}
}
