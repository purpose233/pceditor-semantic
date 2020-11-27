import { ToastController } from "../../ui/toastController";
import { MapController } from "../map/mapController";
import { PCScene } from "../ortScene";

interface GridCell {
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  cost: number;
}

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

  public init(): void {}

  public generateGrid(mapController: MapController): void {
    this.grid = [];
    const { minX, minY, totalX, totalY } = this.pcScene.getSceneBounding();
    const { width, height } = this.pcScene.getCanvasSize();
    this.cellWidth = width / (totalX / this.cellSize);
    this.cellHeight = height / (totalY / this.cellSize);
    this.xCellCount = Math.floor(totalX / this.cellSize);
    this.yCellCount = Math.floor(totalY / this.cellSize);
    for (let j = 0; j < this.yCellCount; j++) {
      this.grid[j] = [];
      for (let i = 0; i < this.xCellCount; i++) {
        const x = minX + (i + 0.5) * this.cellSize;
        const y = minY + (j + 0.5) * this.cellSize;
        const cell: GridCell = {
          xIndex: i,
          yIndex: j,
          x,
          y,
          canvasX: (i + 0.5) * this.cellWidth,
          canvasY: height - (j + 0.5) * this.cellHeight,
          cost: mapController.calcPointCost(x, y),
        };
        this.grid[j][i] = cell;
      }
    }
  }

  public render(): void {}
  
  public unrender(): void {}
}

