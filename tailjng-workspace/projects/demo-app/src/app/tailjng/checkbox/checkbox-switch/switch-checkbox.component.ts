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
