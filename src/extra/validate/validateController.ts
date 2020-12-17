import fs from 'fs';
import path from 'path';
import { sleep } from '../../common/common';
import { ProjectController } from "../projectController";
import { ValidateResult, Validator } from './validator';

export class ValidateController {

  private projectController: ProjectController;

  private nameInput: HTMLInputElement = document.getElementById('project-name') as HTMLInputElement;
  private isMappedInput: HTMLInputElement = document.getElementById('is-mapped') as HTMLInputElement;
  private isCasedInput: HTMLInputElement = document.getElementById('is-cased') as HTMLInputElement;
  private isGeneratedInput: HTMLInputElement = document.getElementById('is-generated') as HTMLInputElement;
  private validateBtn: HTMLElement = document.getElementById('validateBtn') as HTMLElement;
  private validateConfirmBtn: HTMLElement = document.getElementById('confirmBtn') as HTMLElement;
  private validateMsg: HTMLElement = document.getElementById('validateMsg') as HTMLElement;

  private validator: Validator = new Validator();

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
    if (projectMetaData.test_cases && projectMetaData.test_cases.length > 0) {
      this.isCasedInput.value = '已生成';
    }
    if (projectMetaData.model) {
      this.isGeneratedInput.value = '已构建';
    }

    this.validateBtn.addEventListener('click', () => {
      this.validate();
    });
  }

  private prepareValidate(): void {
    this.validateConfirmBtn.setAttribute('disabled', "true");
    // this.validateMsg.innerHTML = ValidateMsg[0];
  }

  public async validate(): Promise<void> {
    const specPath = this.projectController.getActiveSpecPath();
    const metaPath = path.resolve(this.projectController.getActiveProjectPath(), './project.json');
    const projectMetaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    console.log(projectMetaData);
    let currentResult: ValidateResult;
    do {
      const rule = this.validator.getCurrentRule();
      this.validateMsg.innerHTML = rule.validateInfo + '...';
      currentResult = this.validator.runRule(projectMetaData);
      // await sleep(150);
      await sleep(3000);
      if (currentResult.type !== 'success') { break; }
    } while (this.validator.currentRuleIndex !== 0);
    if (currentResult.type !== 'success') {
      this.validateMsg.innerHTML = `校验失败：${currentResult.msg}`;
    } else {
      this.validateMsg.innerHTML = `校验成功！`;
    }
    this.validateConfirmBtn.removeAttribute('disabled');
  }
}
