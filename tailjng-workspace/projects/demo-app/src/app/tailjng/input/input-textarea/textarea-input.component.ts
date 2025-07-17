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

import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JTextareaInput',
  imports: [FormsModule, ReactiveFormsModule, NgClass, LucideAngularModule, CommonModule],
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JTextareaInputComponent),
      multi: true
    }
  ]
})
export class JTextareaInputComponent implements ControlValueAccessor {

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

  // ControlValueAccessor methods
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(public readonly iconsService: JIconsService) { }

  // writeValue - To write a value to the component
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // registerOnChange - To register the change callback function
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // registerOnTouched - To register the touched callback function
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Writes a value to the component.
   * @param event 
   */
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
