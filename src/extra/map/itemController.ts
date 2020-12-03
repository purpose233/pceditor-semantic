import { Obstacle } from "./obstacle";
import { Opening } from "./opening";
import { Polygon } from "./polygon";
import { Relation } from "./relation";
import { Unit } from "./unit";

export class ItemController {
  
  private unitPanel: HTMLElement = document.getElementById('unit-panel') as HTMLElement;
  private obstaclePanel: HTMLElement = document.getElementById('obstacle-panel') as HTMLElement;
  private openingPanel: HTMLElement = document.getElementById('opening-panel') as HTMLElement;
  private relationPanel: HTMLElement = document.getElementById('relation-panel') as HTMLElement;
  private obstacleParentUnitSelect: HTMLSelectElement = document.getElementById('obstacle-parent-unit-select') as HTMLSelectElement;

  private unitItemMap: any = {};
  private unitDeleteCB: (unit: Unit) => void = () => {};
  private unitVisibleCB: (unit: Unit, visible: boolean) => void = () => {};
  
  private obstacleItemMap: any = {};
  private obstacleDeleteCB: (obstacle: Obstacle) => void = () => {};
  private obstacleVisibleCB: (obstacle: Obstacle, visible: boolean) => void = () => {};

  private openingItemMap: any = {};
  private openingDeleteCB: (opening: Opening) => void = () => {};
  private openingVisibleCB: (opening: Opening, visible: boolean) => void = () => {};

  private relationItemMap: any = {};
  private relationDeleteCB: (relation: Relation) => void = () => {};

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
  public setOnRelationDeleteCB(cb: (relation: Relation) => void): void {
    this.relationDeleteCB = cb;
  }

  public updateUnitSelect(units: Unit[]): void {
    let innerHTML = '';
    for (let i = 0; i < units.length; i++) {
      innerHTML += `<option value="${units[i].getID()}">Unit${i}-${units[i].getName()}</option>`;
    }
    this.obstacleParentUnitSelect.innerHTML = innerHTML;
    for (const relationItem of Object.values(this.relationItemMap)) {
      const unit0Select = (relationItem as HTMLElement).getElementsByClassName('relation-unit0-select')[0] as HTMLElement;
      const unit1Select = (relationItem as HTMLElement).getElementsByClassName('relation-unit1-select')[0] as HTMLElement;
      // const openingSelect = (relationItem as HTMLElement).getElementsByClassName('relation-opening-select')[0] as HTMLElement;
      unit0Select.innerHTML = innerHTML;
      unit1Select.innerHTML = innerHTML;
    }
  }

  public updateOpeningSelect(openings: Opening[]): void {
    let innerHTML = '';
    for (let i = 0; i < openings.length; i++) {
      innerHTML += `<option value="${openings[i].getID()}">Opening${i}-${openings[i].getName()}</option>`;
    }
    for (const relationItem of Object.values(this.relationItemMap)) {
      const openingSelect = (relationItem as HTMLElement).getElementsByClassName('relation-opening-select')[0] as HTMLElement;
      openingSelect.innerHTML = innerHTML;
    }
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
      this.unitPanel.removeChild(item);
      delete this.unitItemMap[unit.getID()];
      this.unitDeleteCB(unit);
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
    <button type="button" class="btn btn-success btn-sm parent-btn" data-toggle="modal" data-target="#parent-modal">
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
      this.obstaclePanel.removeChild(item);
      delete this.obstacleItemMap[obstacle.getID()];
      this.obstacleDeleteCB(obstacle);
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
      this.openingPanel.removeChild(item);
      delete this.openingItemMap[opening.getID()];
      this.openingDeleteCB(opening);
    });
    this.openingItemMap[opening.getID()] = item;
  }

  public addRelationItem(relation: Relation): any {
    const div = document.createElement('div');
    div.innerHTML = `
<div class="property-item card" id="opening-${relation.getID()}">
  <div class="card-body">
    <select class="form-control property-item-line relation-unit0-select" id="">
      <option selected>Unit0</option>
      <option>Unit1</option>
    </select>
    <select class="form-control property-item-line relation-unit1-select" id="">
      <option selected>Unit0</option>
      <option>Unit1</option>
    </select>
    <select class="form-control property-item-line relation-opening-select" id="">
      <option selected>Opening0</option>
      <option>Opening1</option>
    </select>
    <select class="form-control property-item-line relation-ori-select" id="">
      <option selected value="both">双向通行</option>
      <option value="unit0-1">Unit0-Unit1可通行</option>
      <option value="unit1-0">Unit1-Unit0可通行</option>
    </select>
    <input type="number" class="form-control property-item-line cost-input" placeholder="Cost" value="1">
    <button type="button" class="btn btn-danger btn-sm delete-btn">
      <i class="iconfont">&#xe62c;</i>
    </button>
  </div>
</div>
    `;
    const item = div.childNodes[1];
    this.relationPanel.appendChild(item);
    const deleteBtn = (item as HTMLElement).getElementsByClassName('delete-btn')[0] as HTMLElement;
    deleteBtn.addEventListener('click', () => {
      this.relationPanel.removeChild(item);
      delete this.relationItemMap[relation.getID()];
      this.relationDeleteCB(relation);
    });
    this.relationItemMap[relation.getID()] = item;
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

  public getRelationInfo(relation: Relation): any {
    const relationItem = this.relationItemMap[relation.getID()];
    const unit0Select = relationItem.getElementsByClassName('relation-unit0-select')[0] as HTMLSelectElement;
    const unit1Select = relationItem.getElementsByClassName('relation-unit1-select')[0] as HTMLSelectElement;
    const oriSelect = relationItem.getElementsByClassName('relation-ori-select')[0] as HTMLSelectElement;
    const costInput = relationItem.getElementsByClassName('cost-input')[0] as HTMLInputElement;
    return {
      unit0: unit0Select.value,
      unit1: unit1Select.value,
      direction: oriSelect.value,
      cost: costInput.value,
    }
  }
}
