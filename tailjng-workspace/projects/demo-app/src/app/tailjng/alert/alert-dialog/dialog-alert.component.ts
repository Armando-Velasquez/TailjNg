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

import { Component, inject, computed, Input } from "@angular/core";
import { NgClass } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { JIconsService, JAlertDialogService } from "tailjng";
import { LucideAngularModule } from "lucide-angular";
import { JButtonComponent } from "../../button/button.component";
import { JColorsService } from "../../color/colors.service";

@Component({
  selector: 'JAlertDialog',
  imports: [LucideAngularModule, NgClass, JButtonComponent],
  templateUrl: './dialog-alert.component.html',
  styleUrl: './dialog-alert.component.css',
  animations: [
    trigger("modalTransition", [
      transition(":enter", [
        style({ transform: "translateY(1rem)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("150ms ease-in", style({ transform: "translateY(1rem)", opacity: 0 })),
      ]),
    ]),
  ],
})
export class JAlertDialogComponent {
  @Input() monocromatic: boolean = false;
  private readonly alertDialogService = inject(JAlertDialogService);

  constructor(
    private readonly colorsService: JColorsService,
    private readonly iconsService: JIconsService
  ) { }

  // Single computed property for dialogs
  dialogs = computed(() => this.alertDialogService.dialogs());

  getIcon(type: string) {
    return this.iconsService.icons[type as keyof typeof this.iconsService.icons] || this.iconsService.icons.info;
  }

  // Method to execute the action based on the button clicked
  handleAction(action: "confirm" | "cancel" | "retry") {
    this.alertDialogService.executeAction(action);
  }

  // Get the class for the toast
  getDialogClass(type: string) {
    return this.colorsService.getAlertClass(type, this.monocromatic);
  }

  // Get the class for the icon
  getIconClass(type: string) {
    return this.colorsService.getIconClass(type, this.monocromatic);
  }

  // Get the class for the button
  getButtonClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonClass(type, this.monocromatic);
  }

  // Get the class for the secondary button
  getButtonSecondaryClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonSecondaryClass(type, this.monocromatic);
  }
}
