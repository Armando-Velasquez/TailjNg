import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'JInputCheckbox',
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input-checkbox.component.html',
  styleUrl: './input-checkbox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JInputCheckboxComponent),
      multi: true
    }
  ]
})
export class JInputCheckboxComponent {

  @Input() title!: string;

  @Input() icon: any;
  @Input() iconSize: number = 15;

  @Input() disabled?: boolean;
  @Input() isLoading?: boolean;
  @Input() classes: string = '';

  @Input() item: any;
  @Input() column: any;

  // Funciones
  @Input() getValue: (item: any, column: any) => boolean = () => false;
  @Input() onCheckboxChange: (item: any, column: any) => void = () => { };

  constructor(
    public readonly iconsService: JIconsService
  ) {
    this.icon = this.iconsService.icons.check;
  }

}
