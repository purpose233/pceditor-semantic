import fs from 'fs';
import path from 'path';
import { Vector2 } from 'three';
import { ToastController } from "../../ui/toastController";
import { MapController } from '../map/mapController';
import { Obstacle } from "../map/obstacle";
import { Opening } from "../map/opening";
import { Unit } from "../map/unit";
import { PCScene } from "../ortScene";
import { ProjectController } from "../projectController";
import { GridController } from './gridController';
import { PathCase } from './pathCase';
import { OperationController } from './operationController';
import { ItemController } from './itemController';
import { Polygon } from '../map/polygon';

export class CaseController {

  private pcScene: PCScene;
  private projectController: ProjectController;
  private mapController: MapController;
  private gridController: GridController;
  private operationController: OperationController;
  private itemController: ItemController;
  
  private canvas: HTMLCanvasElement = document.getElementById('case-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private toastController: ToastController = new ToastController();

  // private basicCases: PathCase[] = [];
  private pathCases: PathCase[] = [];
  // private coverCases: PathCase[] = [];
  private drawingItem: Polygon | null = null;
  private displayItem: Polygon | null = null;

  constructor(scene: PCScene, projectController: ProjectController) {
    this.pcScene = scene;
    this.projectController = projectController;
    this.mapController = new MapController(scene, projectController);
    this.gridController = new GridController(scene);
    this.operationController = new OperationController();
    this.itemController = new ItemController();
  }

  public init(): void {
    this.mapController.init();
    this.mapController.readMap(true);
    
    this.gridController.init();
    this.gridController.generateGrid(this.mapController);
    this.gridController.render();

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.operationController.init();
    // this.itemController.init();
  }

  public initEvents(): void {
    this.canvas.addEventListener('mousedown', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'pathCase') {
        if (!this.drawingItem) {
          this.displayItem = null;
          this.drawingItem = new PathCase();
          this.pathCases.push(this.drawingItem);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          this.drawingItem.confirmDrawingPoint();
          this.drawingItem.addDrawingPoint(x, y);
        }
      }
      this.render();
      console.log(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'pathCase') {
         if (this.drawingItem && this.drawingItem.isDrawing()) {
          this.drawingItem.updateDrawingPoint(x, y);
        }
      }
      this.render();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        if (this.drawingItem && this.operationController.getCurrentOperationType() === 'pathCase') {
          this.drawingItem.clearDrawingPoint();
          // this.itemController.addUnitItem(this.drawingItem as Unit);
          // this.itemController.updateParentModelSelect(this.units);
          this.displayItem = this.drawingItem;
          this.drawingItem = null;
        }
      } 
    }
  }

  public render(): void {
    this.unrender();
    for (const pathCase of this.pathCases) {
      pathCase.draw(this.context);
    }
  }

  public unrender(): void {
    this.canvas.width = this.canvas.clientWidth;
  }
}
