export class OperationController {

  private handBtn: HTMLElement = document.getElementById('hand') as HTMLElement;
  private unitBtn: HTMLElement = document.getElementById('unitLine') as HTMLElement;
  private obsBtn: HTMLElement = document.getElementById('obsLine') as HTMLElement;
  private openingBtn: HTMLElement = document.getElementById('openingLine') as HTMLElement;

  private currentBtn: HTMLElement = this.handBtn;

  public init(): void {
    this.handBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.handBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.handBtn;
        this.selectBtn(this.currentBtn);
      }
    });
    
    this.unitBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.unitBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.unitBtn;
        this.selectBtn(this.currentBtn);
      }
    });
    
    this.obsBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.obsBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.obsBtn;
        this.selectBtn(this.currentBtn);
      }
    });

    this.openingBtn.addEventListener('click', async () => {
      if (this.currentBtn === this.openingBtn) { return; }
      else {
        this.unselectBtn(this.currentBtn);
        this.currentBtn = this.openingBtn;
        this.selectBtn(this.currentBtn);
      }
    });
  }

  public getCurrentOperationType(): string {
    switch (this.currentBtn) {
      case this.handBtn: return 'hand';
      case this.unitBtn: return 'unit';
      case this.obsBtn: return 'obstacle';
      case this.openingBtn: return 'opening';
      default: return 'hand';
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