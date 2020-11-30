import { BasicCase } from "./basicCase";
import { CoverCase } from "./coverCase";
import { PathCase } from "./pathCase";

export class ItemController {
  private basicCasePanel: HTMLElement = document.getElementById('basicCasePanel') as HTMLElement;
  private pathCasePanel: HTMLElement = document.getElementById('pathCasePanel') as HTMLElement;
  private coverCasePanel: HTMLElement = document.getElementById('coverCasePanel') as HTMLElement;

  private basicItemMap: any = {};
  private basicDeleteCB: (item: BasicCase) => void = () => {};
  private basicVisibleCB: (item: BasicCase, visible: boolean) => void = () => {};
  
  private pathItemMap: any = {};
  private pathDeleteCB: (item: PathCase) => void = () => {};
  private pathVisibleCB: (item: PathCase, visible: boolean) => void = () => {};

  private coverItemMap: any = {}
  private coverDeleteCB: (item: CoverCase) => void = () => {};
  private coverVisibleCB: (item: CoverCase, visible: boolean) => void = () => {};

  public init(): void {}

  public setOnBasicDeleteCB(cb: (item: BasicCase) => void): void {
    this.basicDeleteCB = cb;
  }
  public setOnBasicVisibleCB(cb: (item: BasicCase, visible: boolean) => void): void {
    this.basicVisibleCB = cb;
  }
  public setOnPathDeleteCB(cb: (item: PathCase) => void): void {
    this.pathDeleteCB = cb;
  }
  public setOnPathVisibleCB(cb: (item: PathCase, visible: boolean) => void): void {
    this.pathVisibleCB = cb;
  }
  public setOnCoverDeleteCB(cb: (item: CoverCase) => void): void {
    this.coverDeleteCB = cb;
  }
  public setOnCoverVisibleCB(cb: (item: CoverCase, visible: boolean) => void): void {
    this.coverVisibleCB = cb;
  }

  public addBasicCase(basicCase: BasicCase): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="basicCase-${basicCase.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="基础用例名称" value="${basicCase.getName()}">
    <select class="form-control property-item-line path-select">
      <option selected value="A*">A*</option>
      <option value="Dijkstra">Dijkstra</option>
      <option value="null">不规定轨迹</option>
    </select>
    <select class="form-control property-item-line order-select">
      <option selected value="false">不可碰撞</option>
      <option value="true">可碰撞</option>
    </select>
    <input type="number" class="form-control property-item-line time-input" placeholder="限制时间(d)" value="30">
    <button type="button" class="btn btn-primary btn-sm visible-btn">
      <i class="iconfont">&#xe6cc;</i>
    </button>
    <button type="button" class="btn btn-danger btn-sm delete-btn">
      <i class="iconfont">&#xe62c;</i>
    </button>
  </div>
</div>
    `;
    const item = div.childNodes[1];
    this.basicCasePanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.basicVisibleCB(basicCase, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.basicDeleteCB(basicCase);
      this.basicCasePanel.removeChild(item);
    });
    this.basicItemMap[basicCase.getID()] = item;
  }

  public addPathCase(pathCase: PathCase): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="pathCase-${pathCase.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="路径点用例名称" value="${pathCase.getName()}">
    <select class="form-control property-item-line order-select">
      <option selected value="true">依顺序</option>
      <option value="false">不依照顺序</option>
    </select>
    <select class="form-control property-item-line order-select">
      <option selected value="false">不可碰撞</option>
      <option value="true">可碰撞</option>
    </select>
    <input type="number" class="form-control property-item-line time-input" placeholder="限制时间(d)" value="30">
    <button type="button" class="btn btn-primary btn-sm visible-btn">
      <i class="iconfont">&#xe6cc;</i>
    </button>
    <button type="button" class="btn btn-danger btn-sm delete-btn">
      <i class="iconfont">&#xe62c;</i>
    </button>
  </div>
</div>
    `;
    const item = div.childNodes[1];
    this.pathCasePanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.pathVisibleCB(pathCase, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.pathDeleteCB(pathCase);
      this.pathCasePanel.removeChild(item);
    });
    this.pathItemMap[pathCase.getID()] = item;
  }

  public addCoverCase(coverCase: CoverCase): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="coverCase-${coverCase.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="覆盖用例名称" value="${coverCase.getName()}">
    <select class="form-control property-item-line order-select">
      <option selected value="false">不可碰撞</option>
      <option value="true">可碰撞</option>
    </select>
    <select class="form-control property-item-line order-select">
      <option selected value="false">不允许越过</option>
      <option value="true">允许越过</option>
    </select>
    <input type="number" class="form-control property-item-line time-input" placeholder="限制时间(d)" value="30">
    <input type="number" class="form-control property-item-line time-input" placeholder="最低覆盖率(%)" value="100">
    <button type="button" class="btn btn-primary btn-sm visible-btn">
      <i class="iconfont">&#xe6cc;</i>
    </button>
    <button type="button" class="btn btn-danger btn-sm delete-btn">
      <i class="iconfont">&#xe62c;</i>
    </button>
  </div>
</div>
    `;
    const item = div.childNodes[1];
    this.coverCasePanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.coverVisibleCB(coverCase, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.coverDeleteCB(coverCase);
      this.coverCasePanel.removeChild(item);
    });
    this.coverItemMap[coverCase.getID()] = item;
  }

}

