import { Obstacle } from "./obstacle";
import { Opening } from "./opening";
import { Polygon } from "./polygon";
import { Unit } from "./unit";

export class ItemController {
  
  private unitPanel: HTMLElement = document.getElementById('unit-panel') as HTMLElement;
  private obstaclePanel: HTMLElement = document.getElementById('obstacle-panel') as HTMLElement;
  private openingPanel: HTMLElement = document.getElementById('opening-panel') as HTMLElement;
  private parentUnitSelect: HTMLSelectElement = document.getElementById('parent-unit-select') as HTMLSelectElement;

  private unitItemMap: any = {};
  private unitDeleteCB: (unit: Unit) => void = () => {};
  private unitVisibleCB: (unit: Unit, visible: boolean) => void = () => {};
  
  private obstacleItemMap: any = {};
  private obstacleDeleteCB: (obstacle: Obstacle) => void = () => {};
  private obstacleVisibleCB: (obstacle: Obstacle, visible: boolean) => void = () => {};

  private openingItemMap: any = {}
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

  public updateParentModelSelect(units: Unit[]): void {
    let innerHTML = '';
    for (let i = 0; i < units.length; i++) {
      innerHTML += `<option>Unit${i}</option>`;
    }
    this.parentUnitSelect.innerHTML = innerHTML;
  }

  public addUnitItem(unit: Unit): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="unit-${unit.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Unit名称" value="${unit.getName()}">
    <select class="form-control property-item-line category-select">
      <option selected>房间</option>
      <option>通道</option>
    </select>
    <select class="form-control property-item-line access-select">
      <option selected>可通行</option>
      <option>不可通行</option>
    </select>
    <input type="number" class="form-control property-item-line cost-input" placeholder="Cost" value="1">
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
    this.unitItemMap[unit.getID()] = item;
  }

  public addObstacleItem(obstacle: Obstacle): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="obstacle-${obstacle.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Obstacle名称" value="${obstacle.getName()}">
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
    this.obstacleItemMap[obstacle.getID()] = item;
  }

  public addOpeningItem(opening: Opening): void {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="opening-${opening.getID()}">
  <div class="card-body">
    <input type="text" class="form-control property-item-line name-input" placeholder="Opening名称"  value="${opening.getName()}">
    <select class="form-control property-item-line type-select">
      <option selected>门</option>
    </select>
    <button type="button" class="btn btn-success btn-sm visible-btn"  data-toggle="modal" data-target="#parent-modal">
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
    this.openingItemMap[opening.getID()] = item;
  }

  public getUnitInfo(unit: Unit): any {
    const unitItem = this.unitItemMap[unit.getID()] as HTMLElement;
    const nameInput = unitItem.getElementsByClassName('name-input')[0] as HTMLInputElement;
    const categorySelect = unitItem.getElementsByClassName('category-select')[0] as HTMLSelectElement;
    const accessSelect = unitItem.getElementsByClassName('access-select')[0] as HTMLSelectElement;
    const costInput = unitItem.getElementsByClassName('cost-input')[0] as HTMLInputElement;
    return {
      alt_name: nameInput.value,
      category: categorySelect.value,
      access: accessSelect.value,
      cost: costInput.value, 
    };
  }

  public getObstacleInfo(obstacle: Obstacle): any {
    const obstacleItem = this.obstacleItemMap[obstacle.getID()] as HTMLElement;
    const nameInput = obstacleItem.getElementsByClassName('name-input')[0] as HTMLInputElement;
    const typeSelect = obstacleItem.getElementsByClassName('type-select')[0] as HTMLSelectElement;
    return {
      altName: nameInput.value,
      type: typeSelect.value,
    };
  }
  
  public getOpeningInfo(opening: Opening): any {
    const openingItem = this.openingItemMap[opening.getID()] as HTMLElement;
    const nameInput = openingItem.getElementsByClassName('name-input')[0] as HTMLInputElement;
    const typeSelect = openingItem.getElementsByClassName('type-select')[0] as HTMLSelectElement;
    return {
      altName: nameInput.value,
      type: typeSelect.value,
    };
  }
}
