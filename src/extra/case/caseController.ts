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

export class CaseController {

  private pcScene: PCScene;
  private projectController: ProjectController;
  private mapController: MapController;
  
  private canvas: HTMLCanvasElement = document.getElementById('map-canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private toastController: ToastController = new ToastController();

  constructor(scene: PCScene, projectController: ProjectController) {
    this.pcScene = scene;
    this.projectController = projectController;
    this.mapController = new MapController(scene, projectController);
  }

  public init() {
    this.mapController.init();
    this.mapController.readMap(true);

    console.log(this.pcScene.getSceneBounding()); 
  }
}
