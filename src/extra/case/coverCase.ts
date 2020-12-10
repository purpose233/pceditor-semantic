import { Point } from "../map/point";
import { Polygon } from "../map/polygon";
import { GridCell, GridController } from "./gridController";

const CasePointColor = '#57b0ff';
const CaseLineColor = '#57b0ff';
const CaseFillColor = 'rgba(86, 176, 255, 0.5)';
const CasePointSize = 5;

interface CoverCell extends GridCell {
  covered: boolean;
}

export class CoverCase extends Polygon {

  private pathPoints: Point[] = [];
  private coverGrid: CoverCell[][] = [];

  public generatePath(grid: GridCell[][], gridController: GridController): void {
    for (let j = 0; j < grid.length; j++) {
      this.coverGrid[j] = [];
      for (let i = 0; i < grid[j].length; i++) {
        // let covered = true;
        const corners = grid
        const lt = grid
        this.coverGrid[j][i] = {
          ...grid[j][i],
          covered: true
        }
      }
    }
  }

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
