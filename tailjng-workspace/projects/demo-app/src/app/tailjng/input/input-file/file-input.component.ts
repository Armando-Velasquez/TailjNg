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

import { Component, Input, forwardRef, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JInputFile',
  imports: [FormsModule, ReactiveFormsModule, NgClass, LucideAngularModule, CommonModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JFileInputComponent),
      multi: true
    }
  ]
})
export class JFileInputComponent implements ControlValueAccessor, OnChanges {

  @Input() id?: string;
  @Input() name?: string;

  @Input() accept: string = '';
  @Input() multiple: boolean = false;

  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() clearButton: boolean = false;


  @Input() showImage: boolean = false;
  @Input() widthImgFile: number = 0;
  @Input() heightImgFile: number = 0;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  innerValue: any = '';
  previewUrl: string | null = null;

  // This variable is used to track if the file input has been cleared
  public fileInputCleared = false

  get value(): any {
    return this.innerValue;
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(public readonly iconsService: JIconsService) { }

  /**
   * Writes a value to the component.
   * @param val 
   */
  writeValue(val: any): void {
    this.innerValue = val;

    // If the value is null or empty, clear the preview
    if (!val) {
      this.previewUrl = null;

      // If the value is set to null from outside (e.g., from the form)
      // we need to reset the file input
      if (this.fileInputRef?.nativeElement) {
        this.fileInputRef.nativeElement.value = ""
        this.fileInputCleared = true
      }
    }
  }



  /**
   * Registers a callback function that is called when the value changes.
   * @param fn The callback function.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }



  /**
   * Registers a callback function that is called when the input is touched.
   * @param fn The callback function.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }



  /**
   * Sets the disabled state of the component.
   * If disabled, it clears the inner value and preview URL.
   * @param isDisabled 
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerValue = null;
      this.previewUrl = null;
    }
  }



  /**
   * Handles changes to the component's inputs.
   * If the value changes to null or empty, it clears the preview URL.
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If the value is null or empty, clear the preview
    if (changes['value'] && !this.value) {
      this.previewUrl = null;
    }
  }



  /**
   * Handles the file selection event.
   * It reads the selected file(s) and updates the inner value and preview URL if applicable
   * @param event 
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (files && files.length > 0) {
      const value = this.multiple ? Array.from(files) : files[0]
      this.innerValue = value
      this.onChange(value)
      this.onTouched()
      this.fileInputCleared = false

      if (!this.multiple && value instanceof File && value.type?.startsWith("image")) {
        const reader = new FileReader()
        reader.onload = () => {
          this.previewUrl = reader.result as string
        }
        reader.readAsDataURL(value)
      } else {
        this.previewUrl = null
      }
    }
  }



  /**
   * Clears the file input and resets the preview URL.
   * This method also resets the file input field so that it can be re-triggered.
   */
  clearFile(): void {
    this.innerValue = null
    this.previewUrl = null
    this.onChange(this.multiple ? [] : null)
    this.onTouched()

    // Reset the file input field so that it can be re-triggered
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = ""
      this.fileInputCleared = true
    }
  }



  /**
   * Resets the file input to its initial state.
   */
  resetFileInput(): void {
    this.clearFile()

    // Create a new input element to replace the current one
    // This forces the browser to recognize any selected file as "new"
    if (this.fileInputRef?.nativeElement) {
      const parent = this.fileInputRef.nativeElement.parentNode
      if (parent) {

        // We need to create a new input element
        const oldInput = this.fileInputRef.nativeElement
        const newInput = document.createElement("input")

        // Copy all important attributes
        newInput.type = "file"
        if (this.accept) newInput.accept = this.accept
        if (this.multiple) newInput.multiple = this.multiple
        if (this.name) newInput.name = this.name
        if (this.id) newInput.id = this.id
        if (this.disabled) newInput.disabled = this.disabled
        if (this.required) newInput.required = this.required

        // Copy all event listeners
        newInput.addEventListener("change", (e) => this.onFileSelected(e))

        // Replace the input
        parent.replaceChild(newInput, oldInput)

        // Update the reference
        setTimeout(() => {
          if (this.fileInputRef) {
            this.fileInputRef.nativeElement = newInput as HTMLInputElement
          }
        })
      }
    }


  }


}
