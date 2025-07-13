import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { JTooltipDirective } from '../tooltip/tooltip.directive';
import { JIconsService } from '../../services/icons.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JLabel',
  imports: [NgClass, JTooltipDirective, LucideAngularModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class JLabelComponent {

  constructor(public iconsService: JIconsService) { }

  @Input() tooltipPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() tooltip: string = '';
  @Input() for: string = '';
  
  @Input() classes: string = '';
  @Input() ngClass: { [key: string]: boolean } = {};
  
  @Input() isRequired: boolean = false;
  @Input() isConditioned: boolean = false;
  @Input() isAutomated: boolean = false;
}
