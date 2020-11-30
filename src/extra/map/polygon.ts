import { Vector2 } from "three";
import { PCScene } from "../ortScene";
import { Point } from "./point";

let polygonID = 0;

export class Polygon {

  protected id: number = polygonID++;
  protected altName: string = '';
  protected points: Point[] = [];
  protected drawingPoint: Point | null = null;
  protected isClosed: boolean = false;
  protected visible: boolean = true;

  public getName(): string { return this.altName; }
  public setName(name: string): void { this.altName = name; }

  public getID(): number { return this.id; }
  public getPoints(): Point[] { return this.points; }

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

  public getCoordinates(scene: PCScene): number[][] {
    const { minX, minY, totalX, totalY } = scene.getSceneBounding();
    const { width, height } = scene.getCanvasSize();
    const coordinates: number[][] = [];
    for (const point of this.points) {
      const position = point.getPosition();
      const x = totalX / width * position.x + minX;
      const y = totalY / height * position.y + minY;
      coordinates.push([x, y]);
    }
    return coordinates;
  }

  public setCoordinates(scene: PCScene, coordinates: number[][]): void {
    const { minX, minY, totalX, totalY } = scene.getSceneBounding();
    const { width, height } = scene.getCanvasSize();
    const points: Point[] = [];
    for (const coordinate of coordinates) {
      const x = (coordinate[0] - minX) * width / totalX;
      const y = (coordinate[1] - minY) * height / totalY;
      const point = new Point(new Vector2(x, y));
      points.push(point);
    }
    this.points = points;
  }

  // public replaceRecentPoint(point: Point): void {
  //   if (this.points.length <= 0) return;
  //   this.points.pop();
  //   this.points.push(point);
  // }

  public checkPointInside(x: number, y: number): boolean {
    if (this.points.length <= 2) { return false; }
    // 暂不考虑在边上

    // 与顶点重合
    for (const point of this.points) {
      const position = point.getPosition();
      if (Math.abs(position.x - x) <= Number.EPSILON
        && Math.abs(position.y - y) <= Number.EPSILON) {
        return true;
      }
    }
    // 凸多边形内部
    const p = new Vector2(x, y);
    let position0 = this.points[0].getPosition();
    let position1 = this.points[1].getPosition();
    let vAB = position1.clone().sub(position0);
    let vAP = p.clone().sub(position0);
    const flag = Math.sign(vAB.cross(vAP));
    const testPoints = [...this.points, this.points[0]];
    for (let i = 1; i < testPoints.length - 1; i++) {
      position0 = testPoints[i].getPosition();
      position1 = testPoints[i + 1].getPosition();
      vAB = position1.clone().sub(position0);
      vAP = p.clone().sub(position0); 
      if (Math.sign(vAB.cross(vAP)) !== flag) { return false; }
    }
    return true;
  }
}
