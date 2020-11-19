import { Vector2 } from "three";
import { Point } from "./point";

let polygonID = 0;

export class Polygon {

  protected id: number = polygonID++;
  protected points: Point[] = [];
  protected drawingPoint: Point | null = null;
  protected isClosed: boolean = false;
  protected visible: boolean = true;

  public getID(): number { return this.id; }

  public draw(context: CanvasRenderingContext2D): void {}

  public addDrawingPoint(x: number, y: number): void {
    this.drawingPoint = new Point(new Vector2(x, y));
  }

  public updateDrawingPoint(x: number, y: number): void {
    if (!this.drawingPoint) return;
    this.drawingPoint.setPosition(new Vector2(x, y));
  }

  public confirmDrawingPoint(point?: Point): void {
    if (point) {
      this.points.push(point);
    } else if (this.drawingPoint) {
      this.points.push(this.drawingPoint);
    }
    this.drawingPoint = null;
  }

  public clearDrawingPoint(): void {
    this.drawingPoint = null;
  }

  public addNewPoint(x: number, y: number): void {
    this.points.push(new Point(new Vector2(x, y)));
  }

  public addPoint(point: Point): void {
    this.points.push(point);
  }

  public setClosed(): void {
    this.isClosed = true;
  }

  public checkHoveredPoint(x: number, y: number): Point | null {
    for (const point of this.points) {
      if (point.checkHovered(new Vector2(x, y))) {
        return point;
      }
    }
    return null;
  }

  public isDrawing(): boolean {
    return !!this.drawingPoint;
  }

  public isClosePoint(point: Point): boolean {
    return this.points.length > 2 && point === this.points[0];
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
  }

  public getPointCount(): number {
    return this.points.length;
  }

  public deleteRecentPoint(): void {
    if (this.points.length > 0) {
      this.points.pop();
    }
  }

  // public replaceRecentPoint(point: Point): void {
  //   if (this.points.length <= 0) return;
  //   this.points.pop();
  //   this.points.push(point);
  // }
}
