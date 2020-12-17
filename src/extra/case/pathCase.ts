import { Polygon } from "../map/polygon";

const CasePointColor = '#57b0ff';
const CaseLineColor = '#57b0ff';
const CasePointSize = 5;

const CaseBeginPointColor = '#1ca02d';
const CaseEndPointColor = '#e46a13'

export class PathCase extends Polygon {

  public draw(context: CanvasRenderingContext2D, ): void {
    if (!this.visible) return;
    const drawingPoints = [ ...this.points ];
    if (this.drawingPoint) drawingPoints.push(this.drawingPoint);
    if (this.isClosed) drawingPoints.push(this.points[0]);
    context.lineWidth = 2;
    for (let i = 0; i < drawingPoints.length; i++) {
      context.fillStyle = CasePointColor;
      context.strokeStyle = CaseLineColor;
      if (i === 0) {
        context.fillStyle = CaseBeginPointColor;
      }
      if (i === drawingPoints.length - 1) {
        context.fillStyle = CaseEndPointColor;
      }
      const x = drawingPoints[i].getPosition().x;
      const y = drawingPoints[i].getPosition().y;
      context.beginPath();
      context.moveTo(x, y);
      context.arc(x, y, CasePointSize, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = CasePointColor;
      context.strokeStyle = CaseLineColor;
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
