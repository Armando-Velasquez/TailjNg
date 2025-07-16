import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'JProgressBar',
  imports: [NgClass],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class JProgressBarComponent {

  @Input() value: number = 0;
  @Input() max: number = 100;
  @Input() simbol: string = '%';

  @Input() height: number = 30;
  @Input() borderRadius: number = 50;
  @Input() ngClasses: string[] = [];

}