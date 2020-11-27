import { Polygon } from "./polygon";

const UnitPointColor = '#66ff74';
const UnitLineColor = '#66ff74';
const UnitPointSize = 5;

export class Unit extends Polygon {

  private cost: number = 0;
  
  public getCost(): number { return this.cost; }
  public setCost(cost: number): void { this.cost = cost; }

  public draw(context: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    const drawingPoints = [ ...this.points ];
    if (this.drawingPoint) drawingPoints.push(this.drawingPoint);
    if (this.isClosed) drawingPoints.push(this.points[0]);
    context.fillStyle = UnitPointColor;
    context.strokeStyle = UnitLineColor;
    for (let i = 0; i < drawingPoints.length; i++) {
      const x = drawingPoints[i].getPosition().x;
      const y = drawingPoints[i].getPosition().y;
      context.moveTo(x, y);
      context.arc(x, y, UnitPointSize, 0, 2 * Math.PI);
      context.fill();
      if (i > 0) {
        context.beginPath();
        const lastX = drawingPoints[i - 1].getPosition().x;
        const lastY = drawingPoints[i - 1].getPosition().y;
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
      }
    }
  }  
}