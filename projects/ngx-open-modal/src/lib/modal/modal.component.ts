import { CommonModule } from '@angular/common';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from 'ngx-animates';
import { Component, ViewChild, ViewContainerRef, EventEmitter, Output, AfterViewInit, ComponentRef, HostBinding } from '@angular/core';
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
      transition(':enter', useAnimation(fadeIn, { params: { timing: .1 } })),
      transition(':leave', useAnimation(fadeOut, { params: { timing: .1 } }))
    ])
  ]
})
export class ModalComponent implements AfterViewInit {

  @HostBinding('@state')

  @Output()
  dismiss = new EventEmitter<ModalData>();

  loaded = new EventEmitter<void>();

  backdropDismiss?= true


  @ViewChild('dynamic', { read: ViewContainerRef })
  modalHost!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.modalHost) {
      this.loaded.emit()
    }
  }

  /**
  * Load the inputed component when it's ready
  * @param component - The component to be loaded in the modal
  * @return The loaded component reference
  */
  async LoadComponentReady(component: any): Promise<ComponentRef<unknown>> {
    console.log(this.backdropDismiss);

    await lastValueFrom(this.loaded.pipe(first()))
    const generated = this.modalHost.createComponent<OpenModal>(component)

    generated.instance.dismiss.subscribe(
      data => {
        this.dismiss.emit(data)
      }
    )

    return generated
  }

  /**
  * Deletes the component after the set delay
  * @param delay - The time in miliseconds
  * @return The loaded component reference
  */
  async timeout(delay: number) {
    setTimeout(() => {
      this.dismiss.emit()
    }, delay);
  }
}

