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
