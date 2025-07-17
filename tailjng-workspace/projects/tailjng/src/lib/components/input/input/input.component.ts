import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JInput',
  imports: [FormsModule, ReactiveFormsModule, NgClass, LucideAngularModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class JInputComponent {

  @Input() type: 'text' | 'password' | 'number' | 'date' | 'datetime-local' | 'email' = 'text';
  @Input() id?: string;
  @Input() name?: string;
  @Input() placeholder: string = '';
  
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() classes: string = '';
  @Input() ngClass: { [key: string]: boolean } = {};
  
  @Input() clearButton: boolean = false;

  innerValue: any = '';

  get value(): any {
    return this.innerValue;
  }

  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChange(val);
    }
  }

  get combinedNgClass() {
    return {
      ...(this.ngClass || {}),
      'opacity-50': this.disabled
    };
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(public readonly iconsService: JIconsService) { }


  /**
   * Writes a value to the component.
   * @param event 
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }



  /**
   * Clears the input value and resets the component state.
   * This method is typically used when a clear button is clicked.
   */
  clearInput(): void {
    this.value = '';
    this.onChange('');
    this.onTouched();
  }


}
