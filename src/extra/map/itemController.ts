import { Obstacle } from "./obstacle";
import { Opening } from "./opening";
import { Unit } from "./unit";

export class ItemController {
  
  private unitPanel: HTMLElement = document.getElementById('unit-panel') as HTMLElement;
  private obstaclePanel: HTMLElement = document.getElementById('obstacle-panel') as HTMLElement;
  private openingPanel: HTMLElement = document.getElementById('opening-panel') as HTMLElement;

  private unitItems: HTMLElement[] = [];
  private unitDeleteCB: (unit: Unit) => void = () => {};
  private unitVisibleCB: (unit: Unit, visible: boolean) => void = () => {};
  
  private obstacleItems: HTMLElement[] = [];
  private obstacleDeleteCB: (obstacle: Obstacle) => void = () => {};
  private obstacleVisibleCB: (obstacle: Obstacle, visible: boolean) => void = () => {};

  private openingItems: HTMLElement[] = [];
  private openingDeleteCB: (opening: Opening) => void = () => {};
  private openingVisibleCB: (opening: Opening, visible: boolean) => void = () => {};

  public init(): void {}

  public setOnUnitDeleteCB(cb: (unit: Unit) => void): void {
    this.unitDeleteCB = cb;
  }
  public setOnUnitVisibleCB(cb: (unit: Unit, visible: boolean) => void): void {
    this.unitVisibleCB = cb;
  }
  public setOnObstacleDeleteCB(cb: (obstacle: Obstacle) => void): void {
    this.obstacleDeleteCB = cb;
  }
  public setOnObstacleVisibleCB(cb: (obstacle: Obstacle, visible: boolean) => void): void {
    this.obstacleVisibleCB = cb;
  }
  public setOnOpeningDeleteCB(cb: (opening: Opening) => void): void {
    this.openingDeleteCB = cb;
  }
  public setOnOpeningVisibleCB(cb: (opening: Opening, visible: boolean) => void): void {
    this.openingVisibleCB = cb;
  }

  public addUnitItem(unit: Unit): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="unit-${unit.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Unit名称">
    <select class="form-control property-item-line category-select">
      <option selected>房间</option>
      <option>通道</option>
    </select>
    <select class="form-control property-item-line access-select">
      <option selected>可通行</option>
      <option>不可通行</option>
    </select>
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
    this.unitPanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.unitVisibleCB(unit, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.unitDeleteCB(unit);
      this.unitPanel.removeChild(item);
    });
  }

  public addObstacleItem(obstacle: Obstacle): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="obstacle-${obstacle.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Obstacle名称">
    <select class="form-control property-item-line type-select">
      <option selected>静态障碍物</option>
      <option>可移动障碍物</option>
    </select>
    <button type="button" class="btn btn-success btn-sm visible-btn">
      <i class="iconfont-map">&#xe667;</i>
    </button>
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
    this.obstaclePanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.obstacleVisibleCB(obstacle, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.obstacleDeleteCB(obstacle);
      this.obstaclePanel.removeChild(item);
    });
  }

  public addOpeningItem(opening: Opening): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="opening-${opening.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Opening名称">
    <select class="form-control property-item-line type-select">
      <option selected>门</option>
    </select>
    <button type="button" class="btn btn-success btn-sm visible-btn">
      <i class="iconfont-map">&#xe667;</i>
    </button>
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
    this.openingPanel.appendChild(item);
    const visibleBtn = (item as HTMLElement).getElementsByClassName('visible-btn')[0] as HTMLElement;
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    let visible = true;
    visibleBtn.addEventListener('click', () => {
      visible = !visible;
      this.openingVisibleCB(opening, visible);
      if (visible) {
        visibleBtn.classList.remove('btn-secondary');
        visibleBtn.classList.add('btn-primary');
      } else {
        visibleBtn.classList.remove('btn-primary');
        visibleBtn.classList.add('btn-secondary');
      }
    });
    deleteBtn.addEventListener('click', () => {
      this.openingDeleteCB(opening);
      this.openingPanel.removeChild(item);
    });
  }
}
