import { ModalComponent } from './modal.component';
import { ComponentRef, EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import { lastValueFrom, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  /**
  * Loads the modal in the desired component
  * @summary Most commonly used to insert above the intire page. Can be used for a bunch of reasons.
  * @param settings - The settings for the modal to be instantiated.
  * @return The instantiated modal component reference
  */
  show(settings: ModalSettings) {
    const modalComponent = settings.rootContainer
      .createComponent(ModalComponent)

    modalComponent.instance.backdropDismiss = settings.dismissOnBackdrop

    if (settings.timeout) {
      modalComponent.instance.timeout(settings.timeout)
    }

    modalComponent.instance.LoadComponentReady(settings.component)
    return modalComponent
  }

  /**
  * Waits for the modal to emit its dismiss event.
  * @summary Await until the modal component emit its 'closed' event, on receive, will destroy the modal component. If you don't want the modal to be dismissible simply don't call this function.
  * @param modalComponent - The modal component to be destroyed.
  * @return The data sent from the modal.
  */
  async waitForDismiss(modalComponent: ComponentRef<ModalComponent>) {
    const data: ModalData = await lastValueFrom(modalComponent.instance.dismiss.pipe(first()))
    modalComponent.destroy()
    console.log(data);

    return data
  }
}

export interface ModalSettings {
  /**
   * component - The component to be loaded
   */
  component: any
  /**
   * rootContainer - The root container for the modal to be loaded in.
   *
   * Ex: this.viewContainerRef
   */
  rootContainer: ViewContainerRef
  /**
   * component - Whether the modal should should dismiss on backdrop click
   * @default true
   */
  dismissOnBackdrop?: boolean
  /**
  * timeout - The time in miliseconds until the alert destroys itself, leave empty for never
  */
  timeout?: number
}

export interface ModalData {
  data?: any
  role?: string
}

/**
* A base class that needs to be implemented into every component
* that can be inserted as a modal
*/
export abstract class OpenModal {
  abstract dismiss: EventEmitter<ModalData>
}
