export class OperationController {

  private basicCaseBtn: HTMLElement = document.getElementById('basicCaseBtn') as HTMLElement;
  private pathCaseBtn: HTMLElement = document.getElementById('pathCaseBtn') as HTMLElement;
  private coverCaseBtn: HTMLElement = document.getElementById('coverCaseBtn') as HTMLElement;

  private showPCBtn: HTMLElement = document.getElementById('showPCBtn') as HTMLElement;
  private showGridBtn: HTMLElement = document.getElementById('showGridBtn') as HTMLElement;
  private showAreaBtn: HTMLElement = document.getElementById('showAreaBtn') as HTMLElement;

  private currentBtn: HTMLElement = this.basicCaseBtn;

  private pcVisibleCB: (visible: boolean) => void = () => {}
  private gridVisibleCB: (visible: boolean) => void = () => {}
  private areaVisibleCB: (visible: boolean) => void = () => {}

  public setOnPCVisibleCB(cb: (visible: boolean) => void): void {
    this.pcVisibleCB = cb;
  }
  public setOnGridVisibleCB(cb: (visible: boolean) => void): void {
    this.gridVisibleCB = cb;
  }
  public setOnAreaVisibleCB(cb: (visible: boolean) => void): void {
    this.areaVisibleCB = cb;
  }

  public init(): void {
    this.basicCaseBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.basicCaseBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.basicCaseBtn;
        this.selectBtn(this.currentBtn);
      }
    });
    this.pathCaseBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.pathCaseBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.pathCaseBtn;
        this.selectBtn(this.currentBtn);
      }
    });
    this.coverCaseBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.coverCaseBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.coverCaseBtn;
        this.selectBtn(this.currentBtn);
      }
    });
  
    this.showPCBtn.addEventListener('click', () => {
      if (this.showPCBtn.classList.contains('btn-light')) {
        this.unselectBtn(this.showPCBtn);
        this.pcVisibleCB(false);
      } else {
        this.selectBtn(this.showPCBtn);
        this.pcVisibleCB(true);
      }
    });
    this.showGridBtn.addEventListener('click', () => {
      if (this.showGridBtn.classList.contains('btn-light')) {
        this.unselectBtn(this.showGridBtn);
        this.gridVisibleCB(false);
      } else {
        this.selectBtn(this.showGridBtn);
        this.gridVisibleCB(true);
      }
    });
    this.showAreaBtn.addEventListener('click', () => {
      if (this.showAreaBtn.classList.contains('btn-light')) {
        this.unselectBtn(this.showAreaBtn);
        this.areaVisibleCB(false);
      } else {
        this.selectBtn(this.showAreaBtn);
        this.areaVisibleCB(true);
      }
    });
  }

  public getCurrentOperationType(): string {
    switch (this.currentBtn) {
      case this.basicCaseBtn: return 'basicCase';
      case this.pathCaseBtn: return 'pathCase';
      case this.coverCaseBtn: return 'coverCase';
      default: return 'basicCase';
    }
  }
  
  private selectBtn(btn: HTMLElement) {
    btn.classList.add('btn-light');
    btn.classList.remove('btn-secondary');
  }

  private unselectBtn(btn: HTMLElement) {
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-light');
  }
}
