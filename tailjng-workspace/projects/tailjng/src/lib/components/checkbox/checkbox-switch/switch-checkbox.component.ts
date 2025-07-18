import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JSwitchCheckbox',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './switch-checkbox.component.html',
  styleUrl: './switch-checkbox.component.css'
})
export class JSwitchCheckboxComponent {

  @Input() title!: string;

  @Input() disabled?: boolean;
  @Input() classes: string = '';
  @Input() isLoading?: boolean;

  @Input() isChecked: boolean = false;

  // Funciones
  @Input() toggleSwitch: (isChecked: boolean) => void = () => { };

  constructor(
    public readonly iconsService: JIconsService
  ) { }

}
