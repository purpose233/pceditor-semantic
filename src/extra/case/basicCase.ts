import { Vector2 } from "three";
import { setOrtPointSize } from "../../common/constants";
import { Point } from "../map/point";
import { Polygon } from "../map/polygon";
import { GridCell } from './gridController';

const CasePointColor = '#57b0ff';
const CaseLineColor = '#57b0ff';
const CasePointSize = 5;

const PathPointColor = '#00ffd0';
const PathLineColor = '#00ffd0';
const PathPointSize = 5;

export class BasicCase extends Polygon {

  private pathPoints: Point[] = [];

  public generatePath(pathType: string, grid: GridCell[][], beginCell: GridCell, endCell: GridCell): void {
    this.pathPoints = []; 
    // 判断起始末位点 cost 
    // if (pathType === 'A*') {

    // }
    if (pathType === 'Dijkstra') {
      const result = this.dijstraSearch(grid, beginCell, endCell);
      console.log(result);
      if (Number.isFinite(result.cost)) {
        const path = result.path;
        // 去除起始、到达网格
        // path.shift();
        // path.pop();
        for (const cell of path) {
          this.pathPoints.push(new Point(new Vector2(
            cell.canvasX,
            cell.canvasY
          )));
        }
      }
    }
  }

  private dijstraSearch(grid: GridCell[][], beginCell: GridCell, endCell: GridCell) {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    interface GridCache {
      i: number;
      j: number;
      cost: number;
      path: GridCell[];
      isVisited: boolean;
    }
    const cache: GridCache[][] = [];
    const beginI = beginCell.xIndex;
    const beginJ = beginCell.yIndex;
    
    const list: GridCache[] = [];
    for (let j = 0; j < gridHeight; j++) {
      cache[j] = [];
      for (let i = 0; i < gridWidth; i++) {
        if (i === beginI && j === beginJ) {
          cache[j][i] = {
            i, j,
            cost: 0,
            path: [],
            isVisited: false,
          };
          list.unshift(cache[j][i]);
        } else if (Number.isFinite(grid[j][i].cost)){
          cache[j][i] = {
            i, j,
            cost: Infinity,
            path: [],
            isVisited: false,
          };
          list.push(cache[j][i]);
        }
      }
    }

    function updateCache(widthIndex: number, heightIndex: number) {
      const curCell = grid[heightIndex][widthIndex];
      const curCache = cache[heightIndex][widthIndex];
      const curPathCost = curCache.cost;
      const curPath = curCache.path;
      curCache.isVisited = true;
      list.splice(list.indexOf(curCache), 1);
      for (let j = heightIndex - 1; j <= heightIndex + 1; j++) {
        for (let i = widthIndex - 1; i <= widthIndex + 1; i++) {
          if (i === widthIndex && j === heightIndex) { continue; }
          if (j < 0 || j >= gridHeight || i < 0 || i >= gridWidth) { continue; }
          if (!Number.isFinite(grid[j][i].cost)) { continue; }
          const dist = Math.sqrt(Math.abs(j - heightIndex) + Math.abs(i - widthIndex)) / 2;
          const nextCost = grid[j][i].cost * dist / 2
            + curCell.cost * dist / 2;
          const pathCost = nextCost + curPathCost;
          if (cache[j][i].cost > pathCost) {
            cache[j][i].cost = pathCost;
            cache[j][i].path = [...curPath, curCell];
          }
        }
      }
      list.sort((a, b) => {
        return a.cost - b.cost;
      });
      if (list.length <= 0 || !Number.isFinite(list[0].cost)) { return null; }
      return list[0];
    }
    
    let curCache: GridCache | null = list[0];
    while (curCache) {
      curCache = updateCache(curCache.i, curCache.j);
    }
    const endCache = cache[endCell.yIndex][endCell.xIndex];
    return {
      path: endCache.path,
      cost: endCache.cost
    };
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
      // if (i > 0) {
      //   context.beginPath();
      //   const lastX = drawingPoints[i - 1].getPosition().x;
      //   const lastY = drawingPoints[i - 1].getPosition().y;
      //   context.moveTo(lastX, lastY);
      //   context.lineTo(x, y);
      //   context.stroke();
      // }
    }
    if (this.pathPoints.length > 0) {
      context.fillStyle = PathPointColor;
      context.strokeStyle = PathLineColor;
      // for (const point of this.pathPoints) {
      //   const x = point.getPosition().x;
      //   const y = point.getPosition().y;
      //   context.moveTo(x, y);
      //   context.arc(x, y, CasePointSize, 0, 2 * Math.PI);
      //   context.fill();
      // }
      const pathPoints = [...this.pathPoints, this.points[1]];
      context.beginPath();
      const beginPosition = this.points[0].getPosition();
      context.moveTo(beginPosition.x, beginPosition.y);
      for (const point of pathPoints) {
        const x = point.getPosition().x;
        const y = point.getPosition().y;
        context.lineTo(x, y);
      }
      context.stroke();
    }
  }  
}
