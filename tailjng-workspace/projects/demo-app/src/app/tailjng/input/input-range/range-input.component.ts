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

Version: 0.0.15
Creation Date: 2025-01-04
===============================================
*/

import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JRangeInput',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './range-input.component.html',
  styleUrls: ['./range-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JRangeInputComponent),
      multi: true
    }
  ]
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

  // ControlValueAccessor methods
  onChange: any = () => { };
  onTouched: any = () => { };

  // Writes a value to the component
  writeValue(value: any): void {
    if (value !== undefined) {
      this.innerValue = value;
    }
  }

  // Registers a function to call when the value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a function to call when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Handles input changes
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }

  // Clears the input
  clearInput(): void {
    this.value = '';
    this.onChange('');
    this.onTouched();
  }
}
