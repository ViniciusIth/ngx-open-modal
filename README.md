# Angular Open Modal

This component provides a simple way to instantiate modals on angular.

## Installation

To install, run `npm install ngx-open-modal`.

## Usage

- Have a component you want to become a modal.
- Implement the `OpenModal` class into it.
- Inject `ModalService` where you want the modal to be instantiated from.
- run the `show` function with the desired settings.
- run `waitForDismiss` so that the modal can disappear.

## Example
The component to become a modal
```ts
import { Component, EventEmitter } from '@angular/core';
import { OpenModal, ModalData } from 'ngx-open-modal';

@Component({
  selector: 'app-auth',
  template: '<p>app-auth works</p>'
  styleUrls: ['./auth.component.scss']
})
export class ExampleComponent implements OpenModal {

  dismiss = new EventEmitter<ModalData>;
}
```

The component which will show the modal
```ts
import { ModalService } from 'ngx-open-modal';
import { ExampleComponent } from './example.component';
import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-header',
  template: '<a (click)="showModal()">Home</a>'
})
export class AnotherComponent implements OnInit {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalService,
  ) { }

  async showModal() {
    const modal = this.modalService.show({
      component: ExampleComponent,
      rootContainer: this.viewContainerRef
    })

    await this.modalService.waitForDismiss(modal)
  }
}
```

## API

### ModalSettings
- `component: any` - The component to be loaded.
- `rootContainer: ViewContainerRef` - The root container for the modal to be loaded in.
- `dismissOnBackdrop?: boolean` - Whether the modal should should dismiss on backdrop click.
- `timeout?: number` - The time in miliseconds until the alert destroys itself, leave empty for never.

### ModalData
- `data?: any` - The data returned from the modal with dismiss event.
- `role?: string` - The role of the dismiss.
