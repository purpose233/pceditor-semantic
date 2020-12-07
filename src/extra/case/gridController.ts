import { Vector2 } from "three";
import { ToastController } from "../../ui/toastController";
import { MapController } from "../map/mapController";
import { Obstacle } from "../map/obstacle";
import { Relation } from "../map/relation";
import { PCScene } from "../ortScene";

export interface GridCell {
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  cost: number;
  additionalConnectedCells: GridCell[];
}

const GridLineColor = 'rgba(255, 251, 38, 0.5)';
const GridFillColor = 'rgba(255, 251, 38, 0.5)';
const ConnectedGridFillColor = 'rgba(255, 104, 104, 0.5)';

export class GridController {

  private pcScene: PCScene;

  // 网格从左下角，即minX，minY开始
  private grid: GridCell[][] = [];
  private cellSize: number = 0.5;
  private cellWidth: number = 0;
  private cellHeight: number = 0;
  private xCellCount: number = 0;
  private yCellCount: number = 0;

  private canvas: HTMLCanvasElement = document.getElementById('grid-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private toastController: ToastController = new ToastController();

  constructor(scene: PCScene) {
    this.pcScene = scene;
  }

  public getGrid(): GridCell[][] { return this.grid; }

  public init(): void {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  public generateGrid(mapController: MapController): void {
    this.grid = [];
    const { minX, minY, totalX, totalY } = this.pcScene.getSceneBounding();
    const { width, height } = this.pcScene.getCanvasSize();
    this.cellWidth = width / (totalX / this.cellSize);
    this.cellHeight = height / (totalY / this.cellSize);
    this.xCellCount = Math.ceil(totalX / this.cellSize);
    this.yCellCount = Math.ceil(totalY / this.cellSize);
    for (let j = 0; j < this.yCellCount; j++) {
      this.grid[j] = [];
      for (let i = 0; i < this.xCellCount; i++) {
        // const canvasX = (i + 0.5) * this.cellWidth;
        // const canvasY = height - (j + 0.5) * this.cellHeight;
        const cell: GridCell = {
          xIndex: i,
          yIndex: j,
          x: minX + (i + 0.5) * this.cellSize,
          y: minY + (j + 0.5) * this.cellSize,
          canvasX: (i + 0.5) * this.cellWidth,
          canvasY: height - (j + 0.5) * this.cellHeight,
          // cost: mapController.calcPointCost(canvasX, canvasY),
          cost: this.calcCellCost(i, j, mapController),
          additionalConnectedCells: [],
        };
        this.grid[j][i] = cell;
      }
    }
    for (const relation of mapController.getRelations()) {
      this.updateRelationCells(relation);
    }
    console.log(this.grid);
  }

  public getCellByPosition(x: number, y: number): GridCell | null {
    const xIndex = Math.floor(x / this.cellWidth);
    const yIndex = Math.floor((this.canvas.height - y) / this.cellHeight);
    if (xIndex < 0 || xIndex >= this.xCellCount) { return null; }
    if (yIndex < 0 || yIndex >= this.yCellCount) { return null; }
    return this.grid[yIndex][xIndex];
  }

  public render(showGrid: boolean = true, showArea: boolean = true): void {
    this.unrender();
    this.context.fillStyle = GridLineColor;
    this.context.strokeStyle = GridFillColor;
    if (showGrid) {
      for (let i = 0; i < this.xCellCount + 1; i++) {
        const x = i * this.cellWidth;
        this.context.beginPath();
        this.context.moveTo(x, 0);
        this.context.lineTo(x, this.canvas.height);
        this.context.stroke();
      }
      for (let i = 0; i < this.yCellCount + 1; i++) {
        const y = this.canvas.height - i * this.cellHeight;
        this.context.beginPath();
        this.context.moveTo(0, y);
        this.context.lineTo(this.canvas.width, y);
        this.context.stroke();
      }
    }
    if (showArea) {
      // cost
      for (let j = 0; j < this.grid.length; j++) {
        for (let i = 0; i < this.grid[j].length; i++) {
          const cell = this.grid[j][i];
          if (cell.additionalConnectedCells.length > 0) {
            this.context.fillStyle = ConnectedGridFillColor;
          } else {
            this.context.fillStyle = GridFillColor;
          }
          if (cell.cost < Infinity) {
            this.context.fillRect(
              cell.canvasX - this.cellWidth / 2,
              cell.canvasY - this.cellHeight / 2,
              this.cellWidth,
              this.cellHeight
            );
          }
        }
      }
    }
  }
  
  public unrender(): void {
    this.canvas.width = this.canvas.clientWidth;
  }

  private calcCellCost(xIndex: number, yIndex: number, mapController: MapController): number {
    const { height } = this.pcScene.getCanvasSize();
    const canvasX = (xIndex + 0.5) * this.cellWidth;
    const canvasY = height - (yIndex + 0.5) * this.cellHeight;
    const obj0 = mapController.getPointObject(canvasX - this.cellWidth / 2, canvasY - this.cellHeight / 2);
    const obj1 = mapController.getPointObject(canvasX + this.cellWidth / 2, canvasY - this.cellHeight / 2);
    const obj2 = mapController.getPointObject(canvasX - this.cellWidth / 2, canvasY + this.cellHeight / 2);
    const obj3 = mapController.getPointObject(canvasX + this.cellWidth / 2, canvasY + this.cellHeight / 2);
    if (obj0 === obj1 && obj0 === obj2 && obj0 === obj3) {
      if (obj0 instanceof Obstacle || obj0 === null) {
        return Infinity;
      }
      return obj0.getCost();
    }
    return Infinity;
  }

  private updateRelationCells(relation: Relation) {
    const unit0 = relation.getUnit0();
    const unit1 = relation.getUnit1();
    const opening = relation.getOpening();
    if (!unit0 || !unit1 || !opening) { return; }
    const openingLength = opening.getLength();
    const p0 = opening.getPoints()[0].getPosition();
    const p1 = opening.getPoints()[1].getPosition();
    const v01 = p1.clone().sub(p0).normalize();
    const vOrt = new Vector2(v01.y, -v01.x).normalize();
    const minDist = Math.min(this.cellWidth, this.cellHeight) / 2;
    const p = p0.clone();
    const unit0Cells: GridCell[] = [];
    const unit1Cells: GridCell[] = [];
    for (let dist = 0; dist <= openingLength; dist += minDist) {
      p.add(v01.clone().multiplyScalar(minDist));

      let q0 = p.clone().add(vOrt.clone().multiplyScalar(minDist));
      let cellQ0 = this.getCellByPosition(q0.x, q0.y);
      if (cellQ0 && Number.isFinite(cellQ0.cost)) { unit0Cells.push(cellQ0); }
      else {
        q0 = p.clone().add(vOrt.clone().multiplyScalar(minDist * 2));
        cellQ0 = this.getCellByPosition(q0.x, q0.y);
        if (cellQ0 && Number.isFinite(cellQ0.cost)) { unit0Cells.push(cellQ0); }
      }

      let q1 = p.clone().add(vOrt.clone().multiplyScalar(-minDist));
      let cellQ1 = this.getCellByPosition(q1.x, q1.y);
      if (cellQ1 && Number.isFinite(cellQ1.cost)) { unit1Cells.push(cellQ1); }
      else {
        q1 = p.clone().add(vOrt.clone().multiplyScalar(-minDist * 2));
        cellQ1 = this.getCellByPosition(q1.x, q1.y);
        if (cellQ1 && Number.isFinite(cellQ1.cost)) { unit1Cells.push(cellQ1); }
      }
    }
    for (const unit of unit0Cells) {
      const units = [ ...unit.additionalConnectedCells, ...unit1Cells ];
      unit.additionalConnectedCells = Array.from(new Set(units));
    }
    for (const unit of unit1Cells) {
      const units = [ ...unit.additionalConnectedCells, ...unit0Cells ];
      unit.additionalConnectedCells = Array.from(new Set(units));
    }
    console.log(unit0Cells, unit1Cells);
  }
}

