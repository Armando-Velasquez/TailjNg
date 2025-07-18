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

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'JContainerForm',
  imports: [NgClass],
  templateUrl: './container-form.component.html',
  styleUrl: './container-form.component.css'
})
export class JContainerFormComponent {

  @Input() columns: number = 1;
  @Input() rows: boolean = false;

  getClasses(): string {
    if (this.rows) return 'flex flex-row gap-3 items-center';

    const base = 'grid gap-2';
    const columnClassMap: { [key: number]: string } = {
      1: 'flex flex-col gap-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-6',
    };

    return `${base} ${columnClassMap[this.columns] || columnClassMap[1]}`;
  }

}
