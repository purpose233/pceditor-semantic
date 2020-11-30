import fs from 'fs';
import path from 'path';
import { Vector2 } from 'three';
import { ToastController } from "../../ui/toastController";
import { MapController } from '../map/mapController';
import { PCScene } from "../ortScene";
import { ProjectController } from "../projectController";
import { GridController } from './gridController';
import { PathCase } from './pathCase';
import { OperationController } from './operationController';
import { ItemController } from './itemController';
import { Polygon } from '../map/polygon';
import { BasicCase } from './basicCase';
import { CoverCase } from './coverCase';

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

  private basicCases: BasicCase[] = [];
  private pathCases: PathCase[] = [];
  private coverCases: CoverCase[] = [];
  private drawingItem: Polygon | null = null;

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
    console.log(this.mapController);
    
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
      if (operationType === 'basicCase') {
        if (!this.drawingItem) {
          this.drawingItem = new BasicCase();
          this.basicCases.push(this.drawingItem as BasicCase);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          if (this.drawingItem.getPointCount() === 1) {
            this.drawingItem.confirmDrawingPoint();
            this.itemController.addBasicCase(this.drawingItem as BasicCase);
            const points = this.drawingItem.getPoints();
            const beginCell = this.gridController.getCellByPosition(
              points[0].getPosition().x, points[0].getPosition().y);
            const endCell = this.gridController.getCellByPosition(
              points[1].getPosition().x, points[1].getPosition().y);
            (this.drawingItem as BasicCase).generatePath('Dijkstra', this.gridController.getGrid(), beginCell, endCell);
            this.drawingItem = null;
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      if (operationType === 'pathCase') {
        if (!this.drawingItem) {
          this.drawingItem = new PathCase();
          this.pathCases.push(this.drawingItem);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          this.drawingItem.confirmDrawingPoint();
          this.drawingItem.addDrawingPoint(x, y);
        }
      }
      if (operationType === 'coverCase') {
        if (!this.drawingItem) {
          this.drawingItem = new CoverCase();
          this.coverCases.push(this.drawingItem as CoverCase);
          this.drawingItem.addDrawingPoint(x, y);
        } else {
          const hoveredPoint = this.drawingItem.checkHoveredPoint(x, y);
          if (hoveredPoint) {
            if (this.drawingItem.isClosePoint(hoveredPoint)) {
              this.drawingItem.setClosed();
              this.drawingItem.clearDrawingPoint();
              this.itemController.addCoverCase(this.drawingItem as CoverCase);
              this.drawingItem = null;
            } else {
              this.drawingItem.confirmDrawingPoint(hoveredPoint);
              this.drawingItem.addDrawingPoint(x, y);
            }
          } else {
            this.drawingItem.confirmDrawingPoint();
            this.drawingItem.addDrawingPoint(x, y);
          }
        }
      }
      this.render();
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const operationType = this.operationController.getCurrentOperationType();
      const x = e.offsetX;
      const y = e.offsetY;
      if (operationType === 'pathCase'
        || operationType === 'basicCase') {
         if (this.drawingItem && this.drawingItem.isDrawing()) {
          this.drawingItem.updateDrawingPoint(x, y);
          // const cell = this.gridController.getCellByPosition(x, y);
          // console.log(cell);
        }
      }
      if (operationType === 'coverCase') {
        if (this.drawingItem && this.drawingItem.isDrawing()) {
          const hoveredPoint = this.drawingItem.checkHoveredPoint(x, y);
          if (hoveredPoint) {
            this.drawingItem.updateDrawingPoint(
              hoveredPoint.getPosition().x,
              hoveredPoint.getPosition().y
            );
          } else {
            this.drawingItem.updateDrawingPoint(x, y);
          }
        }
      }
      this.render();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        if (this.drawingItem && this.operationController.getCurrentOperationType() === 'pathCase') {
          this.drawingItem.clearDrawingPoint();
          this.itemController.addPathCase(this.drawingItem as PathCase);
          this.drawingItem = null;
        }
      } 
    }

    this.itemController.setOnBasicDeleteCB((basic: BasicCase) => {
      const index = this.basicCases.indexOf(basic);
      if (index >= 0) {
        this.basicCases.splice(index, 1);
      }
      this.render();
    });
    this.itemController.setOnBasicVisibleCB((basic: BasicCase, visible: boolean): void => {
      basic.setVisible(visible);
      this.render();  
    });
    this.itemController.setOnPathDeleteCB((path: PathCase) => {
      const index = this.pathCases.indexOf(path);
      if (index >= 0) {
        this.pathCases.splice(index, 1);
      }
      this.render();
    });
    this.itemController.setOnPathVisibleCB((path: PathCase, visible: boolean): void => {
      path.setVisible(visible);
      this.render();  
    });
    this.itemController.setOnCoverDeleteCB((cover: CoverCase) => {
      const index = this.coverCases.indexOf(cover);
      if (index >= 0) {
        this.coverCases.splice(index, 1);
      }
      this.render();
    });
    this.itemController.setOnCoverVisibleCB((cover: CoverCase, visible: boolean): void => {
      cover.setVisible(visible);
      this.render();  
    });
  }

  public render(): void {
    this.unrender();
    for (const basicCase of this.basicCases) {
      basicCase.draw(this.context);
    }
    for (const pathCase of this.pathCases) {
      pathCase.draw(this.context);
    }
    for (const coverCase of this.coverCases) {
      coverCase.draw(this.context);
    }
  }

  public unrender(): void {
    this.canvas.width = this.canvas.clientWidth;
  }
}