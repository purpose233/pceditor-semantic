import { ToastController } from "../../ui/toastController";
import { MapController } from "../map/mapController";
import { PCScene } from "../ortScene";

export interface GridCell {
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  cost: number;
}

const GridLineColor = 'rgba(255, 251, 38, 0.5)';

export class GridController {

  private pcScene: PCScene;

  // 网格从左下角，即minX，minY开始
  private grid: GridCell[][] = [];
  private cellSize: number = 1;
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
        const canvasX = (i + 0.5) * this.cellWidth;
        const canvasY = height - (j + 0.5) * this.cellHeight;
        const cell: GridCell = {
          xIndex: i,
          yIndex: j,
          x: minX + (i + 0.5) * this.cellSize,
          y: minY + (j + 0.5) * this.cellSize,
          canvasX: (i + 0.5) * this.cellWidth,
          canvasY: height - (j + 0.5) * this.cellHeight,
          cost: mapController.calcPointCost(canvasX, canvasY),
        };
        this.grid[j][i] = cell;
      }
    }
    console.log(this.grid);
  }

  public getCellByPosition(x: number, y: number): GridCell {
    const xIndex = Math.floor(x / this.cellWidth);
    const yIndex = Math.floor((this.canvas.height - y) / this.cellHeight);
    return this.grid[yIndex][xIndex];
  }

  public render(): void {
    this.unrender();
    this.context.fillStyle = GridLineColor;
    this.context.strokeStyle = GridLineColor;
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
    // cost
    for (let j = 0; j < this.grid.length; j++) {
      for (let i = 0; i < this.grid[j].length; i++) {
        const cell = this.grid[j][i];
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
  
  public unrender(): void {
    this.canvas.width = this.canvas.clientWidth;
  }
}

