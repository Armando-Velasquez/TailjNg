import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JTooltipDirective } from './tailjng/tooltip/tooltip.directive';
import { JLabelComponent } from './tailjng/label/label.component';
import { JButtonComponent } from './tailjng/button/button.component';
import { JToggleRadioComponent } from './tailjng/toggle-radio/toggle-radio.component';
import { JAlertDialogService, JAlertToastService } from 'tailjng';
import { JAlertDialogComponent } from './tailjng/alert/alert-dialog/dialog-alert.component';
import { JAlertToastComponent } from './tailjng/alert/alert-toast/toast-alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JTooltipDirective, JLabelComponent, JButtonComponent, JToggleRadioComponent, JAlertDialogComponent, JAlertToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';


  constructor(
    private readonly alertDialogService: JAlertDialogService,
    private readonly alertToastService: JAlertToastService,
  ) {}

  onShowAlert() {
    console.log('Alert button clicked');
    this.alertDialogService.AlertDialog({
      type: 'warning',
      title: 'Alert Title',
      description: 'This is an alert message.',
      onConfirm: () => {

      }
    })
  }




  onShowToast() {
    console.log('Alert button clicked');
    this.alertToastService.AlertToast({
      type: 'info',
      title: 'Alert Title',
      description: 'This is an alert message.',
    })
  }
}

