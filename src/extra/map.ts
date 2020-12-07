import path from 'path';
import { PCScene } from './ortScene';
import { PCRenderer } from '../render/renderer';
import { deserializeIndex } from '../common/serialize';
import { RenderTree } from '../render/renderTree';
import { ToastController } from '../ui/toastController';
import { RenderController } from '../ui/renderController';
import { ExportIndexName, setOrtPointSize } from '../common/constants';
import { SelectorNameType, RenderInfoType, ManifestType, ConfigProjectType } from '../common/types';
import { MapController } from './map/mapController';
import { ProjectController } from './projectController';

declare global {
  interface Window {
    toast: ToastController
  }
}

(async () => {
  setOrtPointSize();

  const container = document.getElementById('canvas-container') as HTMLElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const projectController = new ProjectController();
  projectController.init();

  // render
  const projectPath = projectController.getActiveProjectPath();
  // const projectPath = projectController.getActiveProjectPath();
  const renderTree = await deserializeIndex(projectPath, path.join(projectPath, ExportIndexName), false) as RenderTree;
  console.log(renderTree);
  const renderer = new PCRenderer(renderTree);
  const pcScene = new PCScene(container, canvas, renderer);

  console.log(renderer);
  const mapController = new MapController(pcScene, projectController);
  mapController.init();
  mapController.initEvents();
  mapController.readMap();
  // const renderController = new RenderController();
  // renderController.init();
  // renderer.setRenderInfoChangeCB((info: RenderInfoType) => {
  //   renderController.setRenderInfo(info);
  // });
})();
