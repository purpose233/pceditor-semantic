import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v4';
import { PCDConverter } from './converter/pcdConverter';
import { PCScene } from './render/scene';
import { PCRenderer } from './render/renderer';
import { ConverterTree } from './converter/converterTree';
import { deserializeIndex } from './common/serialize';
import { RenderTree } from './render/renderTree';
import { exportToPCD } from './export/exportToPCD';
import { SelectorController } from './ui/selectorController';
import { SelectorNameType, RenderInfoType, ManifestType, ConfigProjectType } from './common/types';
import { OperationController } from './ui/operationController';
import { ToastController } from './ui/toastController';
import { RenderController } from './ui/renderController';
import { generateConfig, parseConfig, writeConfig } from './app/config';
import { ProjectController } from './ui/projectController';
import { ExportIndexName } from './common/constants';

declare global {
  interface Window {
    toast: ToastController
  }
}

(async () => {

  const config: ManifestType = parseConfig(__dirname) || generateConfig(__dirname);
  
  const container = document.getElementById('canvas-container') as HTMLElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let renderScene: PCScene | null = null;

  // converte pcd file
  // const filePath = './data/copyroom_sample.pcd';
  // const converter = new PCDConverter();
  // const importPath = path.resolve(filePath);
  // const exportPath = path.resolve(__dirname, './projects/copyroom_sample');
  // console.log(exportPath);
  // let tree: ConverterTree | null = await converter.read(importPath, exportPath);
  // console.log(tree);
  // tree = null;

  // render
  const projectPath = path.resolve(__dirname, './projects/copyroom_sample');
  const renderTree = await deserializeIndex(projectPath, path.join(projectPath, ExportIndexName), false) as RenderTree;
  console.log(renderTree);
  const renderer = new PCRenderer(renderTree);
  const pcScene = new PCScene(container, canvas, renderer);
  renderScene = pcScene;
  const scene = pcScene.getScene();
  const camera = pcScene.getCamera();
  const selectorController = new SelectorController();
  selectorController.init();
  selectorController.setOnSelectorChangeCB(async (selectorName: SelectorNameType): Promise<void> => {
    if (!selectorName) { 
      renderer.removeSelector(scene, camera); 
    } else {
      renderer.addSelector(selectorName, scene, camera);
    }
  });
  const renderController = new RenderController();
  renderController.init();
  renderer.setRenderInfoChangeCB((info: RenderInfoType) => {
    renderController.setRenderInfo(info);
  });

  // additional operations
  let axesVisible = false;
  const showAxesBtn = document.getElementById('showAxes');
  showAxesBtn?.addEventListener('click', () => {
    axesVisible = !axesVisible;
    pcScene.setAxesVisible(axesVisible);
    if (axesVisible) {
      showAxesBtn.classList.remove('btn-secondary');
      showAxesBtn.classList.add('btn-light');
    } else {
      showAxesBtn.classList.add('btn-secondary');
      showAxesBtn.classList.remove('btn-light');
    }
  });
  let bboxVisible = false;
  const showBBoxBtn = document.getElementById('showBBox');
  showBBoxBtn?.addEventListener('click', () => {
    bboxVisible = !bboxVisible;
    pcScene.setRootBBoxVisible(bboxVisible);
    if (bboxVisible) {
      showBBoxBtn.classList.remove('btn-secondary');
      showBBoxBtn.classList.add('btn-light');
    } else {
      showBBoxBtn.classList.add('btn-secondary');
      showBBoxBtn.classList.remove('btn-light');
    }
  });
  const deleteBtn = document.getElementById('deletePoints');
  deleteBtn?.addEventListener('click', () => {
    const selector = renderer.getSelector();
    if (selector) {
      selector.deletePoints(scene);
    }
  });
  const translateBtn = document.getElementById('translateConfirm');
  const translateXInput = document.getElementById('translateX');
  const translateYInput = document.getElementById('translateY');
  const translateZInput = document.getElementById('translateZ');
  translateBtn?.addEventListener('click', () => {
    const x = translateXInput ? Number.parseFloat((translateXInput as HTMLInputElement).value) : 0;
    const y = translateYInput ? Number.parseFloat((translateYInput as HTMLInputElement).value) : 0;
    const z = translateZInput ? Number.parseFloat((translateZInput as HTMLInputElement).value) : 0;
    pcScene.translateAxes(x, y, z);
  });
  const rotateBtn = document.getElementById('rotateConfirm');
  const rotateXInput = document.getElementById('rotateX');
  const rotateYInput = document.getElementById('rotateY');
  const rotateZInput = document.getElementById('rotateZ');
  rotateBtn?.addEventListener('click', () => {
    const x = rotateXInput ? Number.parseFloat((rotateXInput as HTMLInputElement).value) : 0;
    const y = rotateYInput ? Number.parseFloat((rotateYInput as HTMLInputElement).value) : 0;
    const z = rotateZInput ? Number.parseFloat((rotateZInput as HTMLInputElement).value) : 0;
    pcScene.rotateAxes(x, y, z);
  });

  /*
  const projectController = new ProjectController();
  projectController.init();
  projectController.setFromConfig(config.projects);
  projectController.setOnUploadCB(async (file: File | null, name: string | null): Promise<boolean> => {
    // TODO: check pcd file
    // TODO: add spinner
    if (!file || !name) {
      window.toast.showToast('error', 'Upload Error', 'Project name or point cloud file cannot be empty.');
    } else if (config.projects.find((project => project.name === name))) {
      window.toast.showToast('error', 'Upload Error', 'Project name cannot repeat.')
    } else {
      const converter = new PCDConverter();
      const importPath = path.resolve(file.path);
      const exportPath = path.resolve(__dirname, './projects/' + name);
      console.log(exportPath);
      let tree: ConverterTree | null = await converter.read(importPath, exportPath);
      console.log(tree);
      tree = null;
      const project: ConfigProjectType = {
        id: uuid(),
        name, 
        path: exportPath,
        lastModified: new Date().toLocaleString()
      };
      config.projects.push(project);
      writeConfig(__dirname, config);
      projectController.addProject(project);
      return true;
    }
    return false;
  });
  projectController.setOnDeleteCB(async (id: string): Promise<boolean> => {
    projectController.deleteProject(id);
    const index = config.projects.findIndex(project => project.id === id);
    if (index >= 0) { 
      const project = config.projects.splice(index, 1)[0];
      const files = fs.readdirSync(project.path);
      for (const file of files) {
        fs.unlinkSync(path.join(project.path, file));
      }
      fs.rmdirSync(project.path);
    }
    writeConfig(__dirname, config);
    return true;
  });
  projectController.setOnEditCB(async (id: string): Promise<boolean> => {
    const project = config.projects.find(project => project.id === id);
    if (!project) { return false; }
    const renderTree = await deserializeIndex(project.path, path.join(project.path, ExportIndexName), false) as RenderTree;
    console.log(renderTree);
    const renderer = new PCRenderer(renderTree);
    const pcScene = new PCScene(container, canvas, renderer);
    renderScene = pcScene;
    const scene = pcScene.getScene();
    const camera = pcScene.getCamera();

    selectorController.setOnSelectorChangeCB(async (selectorName: SelectorNameType): Promise<void> => {
      if (!selectorName) { 
        renderer.removeSelector(scene, camera); 
      } else {
        renderer.addSelector(selectorName, scene, camera);
      }
    });
    renderer.setRenderInfoChangeCB((info: RenderInfoType) => {
      renderController.setRenderInfo(info);
    });
    operationController.setOnExportCB(async (path: string) => {
      const filePath = path + '/out.pcd';
      operationController.waitExportModal();
      await exportToPCD(filePath, renderTree);
      await new Promise((resolve) => {setTimeout(() => {
        resolve();
      }, 1000);})
      operationController.unwaitExportModal();
      operationController.closeExportModal();
      toastController.showToast('success', 'Export', 'Successfully export to ' + filePath);
    });

    return true;
  });

  const toastController = new ToastController();
  toastController.init();
  window.toast = toastController;

  const selectorController = new SelectorController();
  selectorController.init();
  // selectorController.setOnSelectorChangeCB(async (selectorName: SelectorNameType): Promise<void> => {
  //   if (!selectorName) { 
  //     renderer.removeSelector(scene, camera); 
  //   } else {
  //     renderer.addSelector(selectorName, scene, camera);
  //   }
  // });

  const renderController = new RenderController();
  renderController.init();
  // renderer.setRenderInfoChangeCB((info: RenderInfoType) => {
  //   renderController.setRenderInfo(info);
  // });

  const operationController = new OperationController();
  operationController.init();
  // operationController.setOnConfirmExportCB(async (path: string) => {
  //   const filePath = path + '/out.pcd';
  //   operationController.waitExportModal();
  //   await exportToPCD(filePath, renderTree);
  //   await new Promise((resolve) => {setTimeout(() => {
  //     resolve();
  //   }, 1000);})
  //   operationController.unwaitExportModal();
  //   operationController.closeExportModal();
  //   toastController.showToast('success', 'Export', 'Successfully export to ' + filePath);
  // });
  operationController.setOnReturnMenuCB(async () => {
    if (renderScene) {
      renderScene.drop(container);
    }
    // selectorController.setOnSelectorChangeCB(async (selectorName: SelectorNameType): Promise<void> => {});
    // operationController.setOnExportCB(async (path: string) => {});
    projectController.showProjectPanel();
  });
  */
})();
