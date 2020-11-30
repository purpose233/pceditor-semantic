import { Polygon } from "../map/polygon";

const CasePointColor = '#57b0ff';
const CaseLineColor = '#57b0ff';
const CaseFillColor = 'rgba(86, 176, 255, 0.5)';
const CasePointSize = 5;

export class CoverCase extends Polygon {

  public draw(context: CanvasRenderingContext2D, ): void {
    if (!this.visible) return;
    const drawingPoints = [ ...this.points ];
    if (this.drawingPoint) drawingPoints.push(this.drawingPoint);
    if (this.isClosed) drawingPoints.push(this.points[0]);
    context.fillStyle = CasePointColor;
    context.strokeStyle = CaseLineColor;
    for (let i = 0; i < drawingPoints.length; i++) {
      const x = drawingPoints[i].getPosition().x;
      const y = drawingPoints[i].getPosition().y;
      context.beginPath();
      context.moveTo(x, y);
      context.arc(x, y, CasePointSize, 0, 2 * Math.PI);
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
    if (this.isClosed) {
      context.fillStyle = CaseFillColor;
      context.beginPath();
      const x = this.points[0].getPosition().x;
      const y = this.points[0].getPosition().y;
      context.moveTo(x, y);
      for (const point of this.points) {
        const x = point.getPosition().x;
        const y = point.getPosition().y;
        context.lineTo(x, y);
      }
      context.fill();
    }
  }  
}
