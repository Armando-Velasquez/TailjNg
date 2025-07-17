/*
===============================================
Component and Function Library - tailjNg
===============================================
Description:
  This library is designed to provide a set of reusable components and optimized functions
  to facilitate the development of user interfaces and data management in web applications.
  It includes tools to improve the developer experience and user interaction.

Purpose:
  - Create modular and customizable components.
  - Improve front-end development efficiency through reusable tools.
  - Provide scalable solutions that are easy to integrate with existing applications.

Usage:
  To access full functionality, simply import the necessary modules and use the
  components according to your use case. Be sure to review the official documentation for detailed examples 
  on implementation and customization.

Authors:
  Armando Josue Velasquez Delgado - Lead Developer

License:
  This project is licensed under the BSD 3-Clause - see the LICENSE file for more details.

Version: 0.0.9
Creation Date: 2025-01-04
===============================================
*/

import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JInputRange',
  imports: [FormsModule, ReactiveFormsModule, NgClass, LucideAngularModule, CommonModule],
  templateUrl: './range-input.component.html',
  styleUrl: './range-input.component.css'
})
export class JRangeInputComponent {

  @Input() id?: string;
  @Input() name?: string;
  @Input() placeholder: string = '';

  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() classes: string = '';
  @Input() ngClass: { [key: string]: boolean } = {};

  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  
  @Input() isLabel: boolean = false;
  @Input() simbol: string = '';
  
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
