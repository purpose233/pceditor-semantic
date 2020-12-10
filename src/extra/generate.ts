import fs from 'fs';
import path from 'path';
import { sleep } from '../common/common';
import { ProjectController } from './projectController';
import { ToastController } from '../ui/toastController';

(async () => {
  const toastController = new ToastController();
  toastController.init();

  const projectController = new ProjectController();
  projectController.init()

  const exportDirInput: HTMLInputElement = document.getElementById('exportDirInput') as HTMLInputElement;
  const generateBtn: HTMLElement = document.getElementById('generateBtn') as HTMLElement;
  generateBtn.addEventListener('click', async () => {
    toastController.showToast('info', '场景生成', '正在执行 Screened Poisson 重建...');
    await sleep(5000);
    const dirPath = exportDirInput.files?.[0].path as string;
    const exportMeshPath = path.resolve(dirPath, './mesh.ply');
    const exportProjectPath = path.resolve(dirPath, './project.json');
    fs.copyFileSync(projectController.getActiveSpecPath(), exportProjectPath);
    fs.copyFileSync(projectController.getActivePLYPath(), exportMeshPath);
    toastController.showToast('success', '场景生成', '场景生成完毕！');
  });
})();
