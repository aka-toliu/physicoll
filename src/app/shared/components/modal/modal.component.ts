import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  public modalControl = model<boolean>(false);
  public modalClose = output<boolean>();
  public confirmModal = output<boolean>();
  public disableControl = input<boolean>(false);

  closeModal(): void {
    this.modalControl.set(false);
    this.modalClose.emit(false);
  }

  confirmModalAction(): void{
    this.confirmModal.emit(true);
    this.closeModal();
  }



}
