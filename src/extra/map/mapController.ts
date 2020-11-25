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
import { getProjectPath } from '../../common/constants';
import { ToastController } from '../../ui/toastController';

export class MapController {

  private operationController: OperationController = new OperationController();
  private itemController: ItemController = new ItemController();
  private exportBtn: HTMLElement = document.getElementById('export-map') as HTMLElement;
  private deleteBtn: HTMLElement = document.getElementById('delete-point') as HTMLElement;

  private canvas: HTMLCanvasElement = document.getElementById('map-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private toastController: ToastController = new ToastController();

  private units: Unit[] = [];
  private obstacles: Obstacle[] = [];
  private openings: Opening[] = [];
  private drawingItem: Polygon | null = null;
  private dragginPoint: Point | null = null;

  public init(): void {
    this.operationController.init();
    this.itemController.init();

    this.itemController.setOnUnitDeleteCB((unit: Unit): void => {
      const index = this.units.indexOf(unit);
      if (index >= 0) {
        this.units.splice(index, 1);
      }
      this.drawCanvas();
      this.itemController.updateParentModelSelect(this.units);
    });
    this.itemController.setOnUnitVisibleCB((unit: Unit, visible: boolean): void => {
      unit.setVisible(visible);
      this.drawCanvas();  
    });
    this.itemController.setOnObstacleDeleteCB((obstacle: Obstacle): void => {
      const index = this.obstacles.indexOf(obstacle);
      if (index >= 0) {
        this.obstacles.splice(index, 1);
      }
      this.drawCanvas();
    });
    this.itemController.setOnObstacleVisibleCB((obstacle: Obstacle, visible: boolean): void => {
      obstacle.setVisible(visible);
      this.drawCanvas();  
    });
    this.itemController.setOnOpeningDeleteCB((opening: Opening): void => {
      const index = this.openings.indexOf(opening);
      if (index >= 0) {
        this.openings.splice(index, 1);
      }
      this.drawCanvas();
    });
    this.itemController.setOnObstacleVisibleCB((opening: Opening, visible: boolean): void => {
      opening.setVisible(visible);
      this.drawCanvas();  
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
          this.units.push(this.drawingItem);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          const hoveredPoint = this.checkExistedPoints(x, y);
          if (hoveredPoint) {
            if (this.drawingItem.isClosePoint(hoveredPoint)) {
              this.drawingItem.setClosed();
              this.drawingItem.clearDrawingPoint();
              this.itemController.addUnitItem(this.drawingItem as Unit);
              this.itemController.updateParentModelSelect(this.units);
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
            this.drawingItem = null;
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      this.drawCanvas();
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
      this.drawCanvas();
    });
    this.canvas.addEventListener('mouseup', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'hand') {
        this.dragginPoint = null;
      }
      this.drawCanvas();
    });
  
    this.deleteBtn.addEventListener('click', () => {
      if (this.drawingItem) {
        this.drawingItem.deleteRecentPoint();
      }
    });
    this.exportBtn.addEventListener('click', () => {
      const map: any = { units: [], openings: [], obstacles: [] };
      for (const unit of this.units) {
        const unitInfo = this.itemController.getUnitInfo(unit);
        const unitData = {
          ...unitInfo,
          id: unit.getID(),
          feature_type: "unit",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": unit.getCoordinates(),
          },
        };
        map.units.push(unitData);
      }
      for (const obstacle of this.obstacles) {
        const obstacleInfo = this.itemController.getObstacleInfo(obstacle);
        const unitData = {
          ...obstacleInfo,
          id: obstacle.getID(),
          feature_type: "obstacle",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": obstacle.getCoordinates(),
          },
        };
        map.obstacles.push(unitData);
      }
      for (const opening of this.openings) {
        const openingeInfo = this.itemController.getOpeningInfo(opening);
        const unitData = {
          ...openingeInfo,
          id: opening.getID(),
          feature_type: "opening",
          location: null,
          "geometry": {
            "type": "Polygon",
            "coordinates": opening.getCoordinates(),
          },
        };
        map.openings.push(unitData);
      }
      const metaPath = path.resolve(getProjectPath(), './project.json');
      const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      projectMetaData.map = map;
      fs.writeFileSync(metaPath, JSON.stringify(projectMetaData, null, 2));
      console.log(map);
      this.toastController.showToast('success', '地图数据导出', '成功导出地图数据！');
    });
  }

  public clearCanvas(): void {
    this.canvas.width = this.canvas.clientWidth;
  }

  public drawCanvas(): void {
    this.clearCanvas();
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
}
