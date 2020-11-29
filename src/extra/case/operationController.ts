export class OperationController {

  private basicCaseBtn: HTMLElement = document.getElementById('basicCaseBtn') as HTMLElement;
  private pathCaseBtn: HTMLElement = document.getElementById('pathCaseBtn') as HTMLElement;
  private coverCaseBtn: HTMLElement = document.getElementById('coverCaseBtn') as HTMLElement;

  private currentBtn: HTMLElement = this.basicCaseBtn;

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
