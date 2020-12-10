import { Vector2 } from "three";
import { Point } from "../map/point";
import { Polygon } from "../map/polygon";
import { GridCell, GridController } from "./gridController";

const CasePointColor = '#57b0ff';
const CaseLineColor = '#57b0ff';
const CaseFillColor = 'rgba(86, 176, 255, 0.5)';
const CasePointSize = 5;

interface CoverCell extends GridCell {
  covered: boolean;
  // 注意这里的 left/right/top/bottom 是基于 grid 坐标系的
  ltPoint: Vector2;
  rtPoint: Vector2;
  rbPoint: Vector2;
  lbPoint: Vector2;
  visited: boolean;
  parent: GridCell | null;
}

export class CoverCase extends Polygon {

  private pathPoints: Vector2[] = [];
  private centerPathPoints: Vector2[] = [];
  private coverGrid: CoverCell[][] = [];

  public generatePath(gridController: GridController): void {
    this.pathPoints = [];
    this.centerPathPoints = [];
    const grid = gridController.getGrid();
    const coveredGrids: CoverCell[] = [];
    // generate cover grid
    for (let j = 0; j < grid.length; j++) {
      this.coverGrid[j] = [];
      for (let i = 0; i < grid[j].length; i++) {
        const cell = grid[j][i];
        let covered = true;
        const corners = gridController.getGridCorner(i, j);
        if (!Number.isFinite(cell.cost)) {
          covered = false;
        } else {
          for (const corner of corners) {
            if (!this.checkPointInside(corner.x, corner.y)) {
              covered = false;
              break;
            }
          }
        }
        this.coverGrid[j][i] = {
          ...cell,
          covered: covered,
          visited: false,
          parent: null,
          ltPoint: new Vector2((corners[0].x + cell.canvasX) / 2, (corners[0].y + cell.canvasY) / 2),
          rtPoint: new Vector2((corners[1].x + cell.canvasX) / 2, (corners[1].y + cell.canvasY) / 2),
          rbPoint: new Vector2((corners[2].x + cell.canvasX) / 2, (corners[2].y + cell.canvasY) / 2),
          lbPoint: new Vector2((corners[3].x + cell.canvasX) / 2, (corners[3].y + cell.canvasY) / 2),
        };
        if (covered) {
          coveredGrids.push(this.coverGrid[j][i]);
        }
      }
    }
    if (coveredGrids.length > 0) {
      this.stc(null, coveredGrids[Math.floor(coveredGrids.length / 2)], this.coverGrid, this.pathPoints, this.centerPathPoints);
    }
    console.log(this.pathPoints);
  }

  private stc(cellW: CoverCell | null, cellX: CoverCell, coverGrid: CoverCell[][], path: Vector2[], centerPath: Vector2[]) {
    cellX.visited = true;
    const neighbors = this.clockwiseFind(cellW, cellX, coverGrid);
    let latestNeighbor = null;
    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        this.addRightPoint(latestNeighbor ? latestNeighbor : cellW, cellX, neighbor, coverGrid, path, centerPath, false);
        this.stc(cellX, neighbor, coverGrid, path, centerPath);
        latestNeighbor = neighbor;
      }
    }
    this.addRightPoint(latestNeighbor, cellX, cellW, coverGrid, path, centerPath, true);
  }

  private clockwiseFind(cellW: CoverCell | null, cellX: CoverCell, coverGrid: CoverCell[][]): CoverCell[] {
    const neighbors: CoverCell[] = [];
    const yCount = coverGrid.length;
    const xCount = coverGrid[0].length;
    const checkIndex = [];
    // 寻找顺序为 右 -> 前 -> 左
    if (!cellW || cellW.yIndex < cellX.yIndex) {
      // w -> x 为向上
      checkIndex.push([cellX.xIndex + 1, cellX.yIndex]);
      checkIndex.push([cellX.xIndex, cellX.yIndex + 1]);
      checkIndex.push([cellX.xIndex - 1, cellX.yIndex]);
    } else if (cellW.yIndex > cellX.yIndex) {
      // w -> x 为向下  
      checkIndex.push([cellX.xIndex - 1, cellX.yIndex]);
      checkIndex.push([cellX.xIndex, cellX.yIndex - 1]);
      checkIndex.push([cellX.xIndex + 1, cellX.yIndex]);
    } else if (cellW.xIndex < cellX.xIndex) {
      // w -> x 为向右
      checkIndex.push([cellX.xIndex, cellX.yIndex - 1]);
      checkIndex.push([cellX.xIndex + 1, cellX.yIndex]);
      checkIndex.push([cellX.xIndex, cellX.yIndex + 1]);
    } else if (cellW.xIndex > cellX.xIndex) {
      // w -> x 为向左
      checkIndex.push([cellX.xIndex, cellX.yIndex + 1]);
      checkIndex.push([cellX.xIndex - 1, cellX.yIndex]);
      checkIndex.push([cellX.xIndex, cellX.yIndex - 1]);
    }
    for (const index of checkIndex) {
      if (index[0] >= 0 && index[0] < xCount
        && index[1] >= 0 && index[1] < yCount
        && coverGrid[index[1]][index[0]].covered) {
        neighbors.push(coverGrid[index[1]][index[0]]);
      }
    }
    return neighbors;
  }

  private addRightPoint(
    cellW: CoverCell | null,
    cellX: CoverCell, 
    cellY: CoverCell | null, 
    coverGrid: CoverCell[][], 
    path: Vector2[],
    centerPath: Vector2[],
    isReturning: boolean,
  ): void {
    // 返回时，cellX可能为起始点，此时cellY为null
    if (!cellY) {
      if (!cellW || cellW.yIndex < cellX.yIndex) {
        // w -> x 为向上
        path.push(cellX.lbPoint);
      } else if (cellW.yIndex > cellX.yIndex) {
        // w -> x 为向下
        path.push(cellX.rtPoint);
      } else if (cellW.xIndex < cellX.xIndex) {
        // w -> x 为向右
        path.push(cellX.rbPoint);
      } else if (cellW.xIndex > cellX.xIndex) {
        // w -> x 为向左
        path.push(cellX.ltPoint);
      }
      return;
    }
    centerPath.push(new Vector2(cellY.canvasX, cellY.canvasY));
    // 出发时，cellX可能为起始点，此时cellW为null
    if (cellX.yIndex < cellY.yIndex) {
      // x -> y 为向上
      if (!cellW) {
        // 返回且 cellW 为 null 时，cellX 为尽头点，此时需要额外补一个点
        if (isReturning) {
          path.push(cellX.lbPoint);
        }
        path.push(cellX.rbPoint);
        path.push(cellX.rtPoint);
        path.push(cellY.rbPoint);
      }
      // 如果从 w -> x -> y 为左转
      if (cellW && (cellW.xIndex < cellX.xIndex)) {
        path.push(cellX.rbPoint);
        path.push(cellX.rtPoint);
        path.push(cellY.rbPoint);
      }
      // 如果从 w -> x -> y 为直行
      if (cellW && (cellW.xIndex === cellX.xIndex)) {
        path.push(cellX.rtPoint);
        path.push(cellY.rbPoint);
      }
      // 如果从 w -> x -> y 为右转
      if (cellW && (cellW.xIndex > cellX.xIndex)) {
        path.push(cellY.rbPoint);
      }
    } else if (cellX.yIndex > cellY.yIndex) {
      // x -> y 为向下
      if (!cellW) {
        if (isReturning) {
          path.push(cellX.rtPoint);
        }
        path.push(cellX.ltPoint);
        path.push(cellX.lbPoint);
        path.push(cellY.ltPoint);
      }
      if (cellW && (cellW.xIndex > cellX.xIndex)) {
        path.push(cellX.ltPoint);
        path.push(cellX.lbPoint);
        path.push(cellY.ltPoint);
      }
      if (cellW && (cellW.xIndex === cellX.xIndex)) {
        path.push(cellX.lbPoint);
        path.push(cellY.ltPoint);
      }
      if (cellW && (cellW.xIndex < cellX.xIndex)) {
        path.push(cellY.ltPoint);
      }
    } else if (cellX.xIndex < cellY.xIndex) {
      // x -> y 为向右
      if (!cellW) {
        if (isReturning) {
          path.push(cellX.ltPoint);
        }
        path.push(cellX.lbPoint);
        path.push(cellX.rbPoint);
        path.push(cellY.lbPoint);
      }
      if (cellW && (cellW.yIndex > cellX.yIndex)) {
        path.push(cellX.lbPoint);
        path.push(cellX.rbPoint);
        path.push(cellY.lbPoint);
      }
      if (cellW && (cellW.yIndex === cellX.yIndex)) {
        path.push(cellX.rbPoint);
        path.push(cellY.lbPoint);
      }
      if (cellW && (cellW.yIndex < cellX.yIndex)) {
        path.push(cellY.lbPoint);
      }
    } else if (cellX.xIndex > cellY.xIndex) {
      // x -> y 为向左
      if (!cellW) {
        if (isReturning) {
          path.push(cellX.rbPoint);
        }
        path.push(cellX.rtPoint);
        path.push(cellX.ltPoint);
        path.push(cellY.rtPoint);
      }
      if (cellW && (cellW.yIndex < cellX.yIndex)) {
        path.push(cellX.rtPoint);
        path.push(cellX.ltPoint);
        path.push(cellY.rtPoint);
      }
      if (cellW && (cellW.yIndex === cellX.yIndex)) {
        path.push(cellX.ltPoint);
        path.push(cellY.rtPoint);
      }
      if (cellW && (cellW.yIndex > cellX.yIndex)) {
        path.push(cellY.rtPoint);
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

    for (let i = 0; i < this.pathPoints.length; i++) {
      const x = this.pathPoints[i].x;
      const y = this.pathPoints[i].y;
      // context.beginPath();
      // context.moveTo(x, y);
      // context.arc(x, y, CasePointSize, 0, 2 * Math.PI);
      // context.fill();
      if (i > 0) {
        context.beginPath();
        const lastX = this.pathPoints[i - 1].x;
        const lastY = this.pathPoints[i - 1].y;
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
      }
    }
    // for (let i = 0; i < this.centerPathPoints.length; i++) {
    //   const x = this.centerPathPoints[i].x;
    //   const y = this.centerPathPoints[i].y;
    //   context.beginPath();
    //   context.moveTo(x, y);
    //   context.arc(x, y, CasePointSize, 0, 2 * Math.PI);
    //   context.fill();
    //   if (i > 0) {
    //     context.beginPath();
    //     const lastX = this.centerPathPoints[i - 1].x;
    //     const lastY = this.centerPathPoints[i - 1].y;
    //     context.moveTo(lastX, lastY);
    //     context.lineTo(x, y);
    //     context.stroke();
    //   }
    // }
  }
}
