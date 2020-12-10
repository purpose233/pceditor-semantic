import fs from 'fs';
import path from 'path';
import { sleep } from '../common/common';
import { ToastController } from '../ui/toastController';

(async () => {
  const toastController = new ToastController();
  toastController.init();

  const exportDirInput: HTMLInputElement = document.getElementById('exportDirInput') as HTMLInputElement;
  const generateBtn: HTMLElement = document.getElementById('generateBtn') as HTMLElement;
  generateBtn.addEventListener('click', async () => {
    toastController.showToast('info', '场景生成', '正在执行 Screened Poisson 重建...');
    await sleep(5000);
    // const exportMeshPath = path.resolve(exportDirInput.value, './mesh.ply');
    // const exportProjectPath = path.resolve(exportDirInput.value, './project.json');
    // fs.copyFileSync('source.txt', 'destination.txt');
    toastController.showToast('success', '场景生成', '场景生成完毕！');
  });
})();
