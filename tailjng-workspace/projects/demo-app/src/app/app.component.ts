import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JTooltipDirective } from './tailjng/tooltip/tooltip.directive';
import { JLabelComponent } from './tailjng/label/label.component';
import { JButtonComponent } from './tailjng/button/button.component';
import { JToggleRadioComponent } from './tailjng/toggle-radio/toggle-radio.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JTooltipDirective, JLabelComponent, JButtonComponent, JToggleRadioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';
}

