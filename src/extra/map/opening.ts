import { Polygon } from "./polygon";

const OpeningPointColor = '#ffe836';
const OpeningLineColor = '#ffe836';
const OpeningLineSize = 5;
const OpeningPointSize = 5;

export class Opening extends Polygon {

  public draw(context: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    const drawingPoints = [ ...this.points ];
    if (this.drawingPoint) drawingPoints.push(this.drawingPoint);
    if (this.isClosed) drawingPoints.push(this.points[0]);
    context.fillStyle = OpeningPointColor;
    context.strokeStyle = OpeningLineColor;
    for (let i = 0; i < drawingPoints.length; i++) {
      const x = drawingPoints[i].getPosition().x;
      const y = drawingPoints[i].getPosition().y;
      context.moveTo(x, y);
      context.arc(x, y, OpeningPointSize, 0, 2 * Math.PI);
      context.fill();
      if (i > 0) {
        context.lineWidth = OpeningLineSize;
        context.beginPath();
        const lastX = drawingPoints[i - 1].getPosition().x;
        const lastY = drawingPoints[i - 1].getPosition().y;
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
        context.lineWidth = 1;
      }
    }
  }  
}
