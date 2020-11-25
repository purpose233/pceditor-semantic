import path from 'path';
import { PCScene } from './ortScene';
import { PCRenderer } from '../render/renderer';
import { deserializeIndex } from '../common/serialize';
import { RenderTree } from '../render/renderTree';
import { ToastController } from '../ui/toastController';
import { RenderController } from '../ui/renderController';
import { ExportIndexName, getProjectPath, setOrtPointSize } from '../common/constants';
import { SelectorNameType, RenderInfoType, ManifestType, ConfigProjectType } from '../common/types';
import { MapController } from './map/mapController';

declare global {
  interface Window {
    toast: ToastController
  }
}

(async () => {
  
  setOrtPointSize();

  const container = document.getElementById('canvas-container') as HTMLElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  // render
  const projectPath = getProjectPath();
  const renderTree = await deserializeIndex(projectPath, path.join(projectPath, ExportIndexName), false) as RenderTree;
  console.log(renderTree);
  const renderer = new PCRenderer(renderTree);
  const pcScene = new PCScene(container, canvas, renderer);

  console.log(renderer);
  const mapController = new MapController();
  mapController.init();
  // const renderController = new RenderController();
  // renderController.init();
  // renderer.setRenderInfoChangeCB((info: RenderInfoType) => {
  //   renderController.setRenderInfo(info);
  // });
})();
