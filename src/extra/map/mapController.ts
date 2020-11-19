import { OperationController } from "./operationController";
import { Polygon } from "./polygon";
import { Unit } from './unit';
import { Point } from './point';

export class MapController {

  private operationController: OperationController = new OperationController();

  private canvas: HTMLCanvasElement = document.getElementById('map-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;

  private units: Unit[] = [];
  // private obstacles: 
  private drawingItem: Polygon | null = null;
  private isDrawingPoint: boolean = false;

  public init(): void {
    this.operationController.init();
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvas.addEventListener('mousedown', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      // const x =
      // if (operationType === 'hand') {

      // }
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
        // this.isDrawingPoint = true;
      }
      // if (operationType === 'obstacle') {

      // }
      this.drawCanvas();
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'unit') {
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
    // this.canvas.addEventListener('mouseup', (e) => {
    //   const operationType = this.operationController.getCurrentOperationType();
    //   const x = e.offsetX;
    //   const y = e.offsetY;
    //   if (operationType === 'unit') {
    //     if (this.drawingItem && this.isDrawingPoint) {
    //       // this.isDrawingPoint = false;
    //       const hoveredPoint = this.checkExistedPoints(x, y);
    //       if (hoveredPoint) {
    //         this.drawingItem.replaceRecentPoint(hoveredPoint);
    //       }
    //     }
    //   }
    //   this.drawCanvas();
    // });
  }

  public clearCanvas(): void {
    this.canvas.width = this.canvas.clientWidth;
  }

  public drawCanvas(): void {
    this.clearCanvas();
    for (const unit of this.units) {
      unit.draw(this.context);
    }
  }

  public checkExistedPoints(x: number, y: number): Point | null {
    const operationType = this.operationController.getCurrentOperationType();
    if (operationType === 'unit') {
      for (const unit of this.units) {
        const point = unit.checkHoveredPoint(x, y);
        if (point) { return point; }
      }
      return null;
    }
    return null;
  }
}
