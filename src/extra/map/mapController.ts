import { OperationController } from "./operationController";
import { Polygon } from "./polygon";
import { Unit } from './unit';
import { Point } from './point';
import { Vector2 } from "three";
import { ItemController } from "./itemController";
import { Obstacle } from "./obstacle";

export class MapController {

  private operationController: OperationController = new OperationController();
  private itemController: ItemController = new ItemController();

  private canvas: HTMLCanvasElement = document.getElementById('map-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;

  private units: Unit[] = [];
  private obstacles: Obstacle[] = [];
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

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvas.addEventListener('mousedown', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      // const x =
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
      if (operationType === 'unit' || operationType === 'obstacle') {
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
