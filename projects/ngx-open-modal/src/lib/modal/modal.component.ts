import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
  Output,
  AfterViewInit,
  ComponentRef,
  HostBinding,
} from '@angular/core';
import { first, lastValueFrom } from 'rxjs';
import { OpenModal, ModalData } from './modal.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(100, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ModalComponent implements AfterViewInit {
  @HostBinding('@state')
  @Output()
  dismiss = new EventEmitter<ModalData>();
  loaded = new EventEmitter<void>();

  inputData?: { [key: string]: any };
  backdropDismiss? = true;

  @ViewChild('dynamic', { read: ViewContainerRef })
  modalHost!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.modalHost) {
      this.loaded.emit();
    }
  }

  /**
   * Load the inputed component when it's ready
   * @param component - The component to be loaded in the modal
   * @return The loaded component reference
   */
  async LoadComponentReady(component: any): Promise<ComponentRef<unknown>> {
    await lastValueFrom(this.loaded.pipe(first()));
    const generated = this.modalHost.createComponent<OpenModal>(component);

    if (this.inputData) {
      generated.instance.input = this.inputData;
    }

    generated.instance.dismiss.subscribe((data) => {
      this.dismiss.emit(data);
    });

    return generated;
  }

  /**
   * Deletes the component after the set delay
   * @param delay - The time in miliseconds
   * @return The loaded component reference
   */
  async timeout(delay: number) {
    setTimeout(() => {
      this.dismiss.emit();
    }, delay);
  }
}
