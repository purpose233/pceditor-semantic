import fs from 'fs';
import path from 'path';
import { ProjectController } from "../projectController";
import validate from './validator';

export class ValidateController {

  private projectController: ProjectController;

  private nameInput: HTMLInputElement = document.getElementById('project-name') as HTMLInputElement;
  private isMappedInput: HTMLInputElement = document.getElementById('is-mapped') as HTMLInputElement;
  private isCasedInput: HTMLInputElement = document.getElementById('is-cased') as HTMLInputElement;
  private isGeneratedInput: HTMLInputElement = document.getElementById('is-generated') as HTMLInputElement;
  private validateBtn: HTMLElement = document.getElementById('validateBtn') as HTMLElement;

  constructor(projectController: ProjectController) {
    this.projectController = projectController;
  }

  public init(): void {
    const metaPath = path.resolve(this.projectController.getActiveProjectPath(), './project.json');
    const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    this.nameInput.value = projectMetaData.config.name;
    if (projectMetaData.map) {
      this.isMappedInput.value = '已标注';
    }
    if (projectMetaData.cases) {
      this.isCasedInput.value = '已生成';
    }
    if (projectMetaData.model) {
      this.isGeneratedInput.value = '已构建';
    }

    this.validateBtn.addEventListener('click', () => {
      this.validate();
    });
  }

  public validate(): void {
    const specPath = this.projectController.getActiveSpecPath();
    const metaPath = path.resolve(this.projectController.getActiveProjectPath(), './project.json');
    const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    console.log(projectMetaData);
    console.log(validate(projectMetaData));
  }
}

