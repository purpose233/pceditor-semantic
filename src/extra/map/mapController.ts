import fs from 'fs';
import path from 'path';
import { OperationController } from "./operationController";
import { Polygon } from "./polygon";
import { Unit } from './unit';
import { Point } from './point';
import { Vector2 } from "three";
import { ItemController } from "./itemController";
import { Obstacle } from "./obstacle";
import { Opening } from "./opening";
import { ToastController } from '../../ui/toastController';
import { PCScene } from '../ortScene';
import { ProjectController } from '../projectController';
import { Relation } from './relation';

export class MapController {

  private pcScene: PCScene;
  private projectController: ProjectController;

  private operationController: OperationController = new OperationController();
  private itemController: ItemController = new ItemController();
  private exportBtn: HTMLElement = document.getElementById('export-map') as HTMLElement;
  private deleteBtn: HTMLElement = document.getElementById('delete-point') as HTMLElement;
  private createRelationBtn: HTMLElement = document.getElementById('new-relation') as HTMLElement;

  private canvas: HTMLCanvasElement = document.getElementById('map-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private toastController: ToastController = new ToastController();

  private units: Unit[] = [];
  private obstacles: Obstacle[] = [];
  private openings: Opening[] = [];
  private relations: Relation[] = [];
  private drawingItem: Polygon | null = null;
  private dragginPoint: Point | null = null;

  constructor(scene: PCScene, projectController: ProjectController) {
    this.pcScene = scene;
    this.projectController = projectController;
  }

  public init(): void {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  public initEvents(): void {
    this.operationController.init();
    this.itemController.init();

    this.itemController.setOnUnitDeleteCB((unit: Unit): void => {
      const index = this.units.indexOf(unit);
      if (index >= 0) {
        this.units.splice(index, 1);
      }
      this.render();
      this.itemController.updateUnitSelect(this.units);
    });
    this.itemController.setOnUnitVisibleCB((unit: Unit, visible: boolean): void => {
      unit.setVisible(visible);
      this.render();  
    });
    this.itemController.setOnObstacleDeleteCB((obstacle: Obstacle): void => {
      const index = this.obstacles.indexOf(obstacle);
      if (index >= 0) {
        this.obstacles.splice(index, 1);
      }
      this.render();
    });
    this.itemController.setOnObstacleVisibleCB((obstacle: Obstacle, visible: boolean): void => {
      obstacle.setVisible(visible);
      this.render();  
    });
    this.itemController.setOnOpeningDeleteCB((opening: Opening): void => {
      const index = this.openings.indexOf(opening);
      if (index >= 0) {
        this.openings.splice(index, 1);
      }
      this.render();
    });
    this.itemController.setOnOpeningVisibleCB((opening: Opening, visible: boolean): void => {
      opening.setVisible(visible);
      this.render();  
    });
    this.itemController.setOnRelationDeleteCB((relation: Relation) => {
      const index = this.relations.indexOf(relation);
      if (index >= 0) {
        this.relations.splice(index, 1);
      }
    });

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvas.addEventListener('mousedown', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'hand') {
        const point = this.checkAllExistedPoints(x, y);
        if (point) {
          this.dragginPoint = point;
        }
      }
      if (operationType === 'unit') {
        if (!this.drawingItem) {
          this.drawingItem = new Unit();
          this.units.push(this.drawingItem as Unit);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          const hoveredPoint = this.checkExistedPoints(x, y);
          if (hoveredPoint) {
            if (this.drawingItem.isClosePoint(hoveredPoint)) {
              this.drawingItem.setClosed();
              this.drawingItem.clearDrawingPoint();
              this.itemController.addUnitItem(this.drawingItem as Unit);
              this.itemController.updateUnitSelect(this.units);
              this.drawingItem = null;
            } else {
              this.drawingItem.confirmDrawingPoint(hoveredPoint);
              this.drawingItem.addDrawingPoint(x, y);
            }
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      if (operationType === 'obstacle') {
        if (!this.drawingItem) {
          this.drawingItem = new Obstacle();
          this.obstacles.push(this.drawingItem);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          const hoveredPoint = this.checkExistedPoints(x, y);
          if (hoveredPoint) {
            if (this.drawingItem.isClosePoint(hoveredPoint)) {
              this.drawingItem.setClosed();
              this.drawingItem.clearDrawingPoint();
              this.itemController.addObstacleItem(this.drawingItem as Obstacle);
              this.drawingItem = null;
            } else {
              this.drawingItem.confirmDrawingPoint(hoveredPoint);
              this.drawingItem.addDrawingPoint(x, y);
            }
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      if (operationType === 'opening') {
        if (!this.drawingItem) {
          this.drawingItem = new Opening();
          this.openings.push(this.drawingItem);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          if (this.drawingItem.getPointCount() === 1) {
            this.drawingItem.confirmDrawingPoint();
            this.itemController.addOpeningItem(this.drawingItem as Opening);
            this.itemController.updateOpeningSelect(this.openings);
            this.drawingItem = null;
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      this.render();
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'hand') {
        if (this.dragginPoint) {
          this.dragginPoint.setPosition(new Vector2(x, y));
        }
      }
      if (
        operationType === 'unit'
        || operationType === 'obstacle'
        || operationType === 'opening'
      ) {
        if (this.drawingItem && this.drawingItem.isDrawing()) {
          const hoveredPoint = this.checkExistedPoints(x, y);
          if (hoveredPoint) {
            this.drawingItem.updateDrawingPoint(
              hoveredPoint.getPosition().x,
              hoveredPoint.getPosition().y
            );
          } else {
            this.drawingItem.updateDrawingPoint(x, y);
          }
        }
      }
      this.render();
    });
    this.canvas.addEventListener('mouseup', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'hand') {
        this.dragginPoint = null;
      }
      this.render();
    });
  
    this.deleteBtn.addEventListener('click', () => {
      if (this.drawingItem) {
        this.drawingItem.deleteRecentPoint();
      }
      this.render();
    });
    this.exportBtn.addEventListener('click', () => {
      const map: any = { units: [], openings: [], obstacles: [], relations: [] };
      for (const unit of this.units) {
        const unitInfo = this.itemController.getUnitInfo(unit);
        const data = {
          ...unitInfo,
          id: unit.getID(),
          feature_type: "unit",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": unit.getCoordinates(this.pcScene),
          },
        };
        map.units.push(data);
      }
      for (const obstacle of this.obstacles) {
        const obstacleInfo = this.itemController.getObstacleInfo(obstacle);
        const data = {
          ...obstacleInfo,
          id: obstacle.getID(),
          feature_type: "obstacle",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": obstacle.getCoordinates(this.pcScene),
          },
        };
        map.obstacles.push(data);
      }
      for (const opening of this.openings) {
        const openingeInfo = this.itemController.getOpeningInfo(opening);
        const data = {
          ...openingeInfo,
          id: opening.getID(),
          feature_type: "opening",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": opening.getCoordinates(this.pcScene),
          },
        };
        map.openings.push(data);
      }
      for (const relation of this.relations) {
        const relationInfo = this.itemController.getRelationInfo(relation);
        const data = {
          ...relationInfo,
          id: relation.getID(),
        };
        map.relations.push(data);
      }
      const metaPath = path.resolve(this.projectController.getActiveProjectPath(), './project.json');
      const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      projectMetaData.map = map;
      fs.writeFileSync(metaPath, JSON.stringify(projectMetaData, null, 2));
      console.log(map);
      this.toastController.showToast('success', '地图数据导出', '成功导出地图数据！');
    });
    this.createRelationBtn.addEventListener('click', () => {
      const relation = new Relation();
      this.relations.push(relation);
      this.itemController.addRelationItem(relation);
      this.itemController.updateUnitSelect(this.units);
      this.itemController.updateOpeningSelect(this.openings);
    });
  }

  public readMap(dismissItem: boolean = false): void {
    const metaPath = path.resolve(this.projectController.getActiveProjectPath(), './project.json');
    const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const map = projectMetaData.map;
    console.log(projectMetaData);
    for (const data of map.units) {
      const unit = new Unit();
      unit.setName(data.alt_name);
      unit.setCoordinates(this.pcScene, data.geometry.coordinates);
      unit.setClosed();
      unit.setCost(Number.parseFloat(data.cost));
      this.units.push(unit);
      (!dismissItem) && this.itemController.addUnitItem(unit);
    }
    for (const data of map.obstacles) {
      const obstacle = new Obstacle();
      obstacle.setName(data.alt_name);
      obstacle.setCoordinates(this.pcScene, data.geometry.coordinates);
      obstacle.setClosed();
      this.obstacles.push(obstacle);
      (!dismissItem) && this.itemController.addObstacleItem(obstacle);
    }
    for (const data of map.openings) {
      const opening = new Opening();
      opening.setName(data.alt_name);
      opening.setCoordinates(this.pcScene, data.geometry.coordinates);
      this.openings.push(opening);
      (!dismissItem) && this.itemController.addOpeningItem(opening);
    }
    (!dismissItem) && this.itemController.updateUnitSelect(this.units);
    this.render();
  }

  public unrender(): void {
    this.canvas.width = this.canvas.clientWidth;
  }

  public render(): void {
    this.unrender();
    for (const unit of this.units) {
      unit.draw(this.context);
    }
    for (const obstacle of this.obstacles) {
      obstacle.draw(this.context);
    }
    for (const opening of this.openings) {
      opening.draw(this.context);
    }
  }

  public checkExistedPoints(x: number, y: number): Point | null {
    const operationType = this.operationController.getCurrentOperationType();
    if (operationType === 'unit') {
      for (const unit of this.units) {
        const point = unit.checkHoveredPoint(x, y);
        if (point) { return point; }
      }
    }
    if (operationType === 'obstacle') {
      for (const obstacle of this.obstacles) {
        const point = obstacle.checkHoveredPoint(x, y);
        if (point) { return point; }
      }
    }
    return null;
  }

  public checkAllExistedPoints(x: number, y: number): Point | null {
    for (const unit of this.units) {
      const point = unit.checkHoveredPoint(x, y);
      if (point) { return point; }
    }
    for (const obstacle of this.obstacles) {
      const point = obstacle.checkHoveredPoint(x, y);
      if (point) { return point; }
    }
    return null;
  }

  public calcPointCost(x: number, y: number): number {
    for (const obstacle of this.obstacles) {
      if (obstacle.checkPointInside(x, y)) {
        return Infinity;
      }
    }
    for (const unit of this.units) {
      if (unit.checkPointInside(x, y)) {
        return unit.getCost();
      }
    }
    return Infinity;
  }
}
