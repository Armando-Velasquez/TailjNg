/*
===============================================
Librería de Componentes y Funciones - tailjNg
===============================================
Descripción:
  Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
  optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
  web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
Propósito:
  - Crear componentes modulares y personalizables.
  - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
  - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
Uso:
  Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
  componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
  detallados sobre su implementación y personalización.
Autores:
  Armando Josue Velasquez Delgado - Desarrollador principal
Licencia:
  Este proyecto está licenciado bajo la BSD 3-Clause - ver el archivo LICENSE para más detalles.
Versión: 0.0.9
Fecha de creación: 2025-01-04
===============================================
*/
import { JIconsService } from 'tailjng';

import { NgClass } from "@angular/common"import { Component, Input, Output, EventEmitter } from "@angular/core"import { LucideAngularModule } from "lucide-angular"import { JTooltipDirective } from "../tooltip/tooltip.directive"import { JColorsService } from '../color/colors.service';@Component({  selector: 'JButton',  imports: [NgClass, LucideAngularModule, JTooltipDirective],  templateUrl: './button.component.html',  styleUrl: './button.component.css'})export class JButtonComponent {  @Input() type: "button" | "submit" | "reset" = "button";  @Input() tooltipPosition: "top" | "right" | "bottom" | "left" = "top";  @Input() text!: string | number;  @Input() tooltip: string = "";  @Input() icon!: any;  @Input() iconSize: number = 15;  @Input() iconChange!: any;  @Input() isChangeIcon: boolean = false;  @Output() clicked = new EventEmitter<Event>();  @Input() disabled = false;  @Input() isLoading = false;  @Input() classes: string = "";  @Input() ngClasses: { [key: string]: boolean } = {};  // Define classes based on button type (switch)  get variantClasses(): string {    return this.colorsService.variants[this.getActiveVariant()] || "min-w-[100px] text-black dark:text-white shadow-md"  }  // Combine base classes with variants  get computedClasses() {    return {      "flex gap-3 items-center justify-center font-semibold border border-border dark:border-dark-border px-3 py-2 rounded transition duration-300 select-none": true,      [this.variantClasses]: true, // Apply variant classes based on switch      "cursor-pointer": !this.disabled && !this.isLoading, // Default cursor when active      "cursor-default opacity-50 pointer-events-none": this.disabled || this.isLoading, // Disabled cursor      ...this.ngClasses, // Allows using dynamic validations with [ngClass]    }  }  constructor(    public readonly iconsService: JIconsService,    private readonly colorsService: JColorsService,  ) { }  /**   * Verify if a class is present in `classes` or `ngClasses`   * Split the class string by spaces to check each class individually   * @param className Name of the class to check   * @returns True if the class is present, false otherwise   */  private hasClass(className: string): boolean {    const classArray = this.classes.split(" ")    return classArray.includes(className) || this.ngClasses[className]  }  /**   * Get the active variant based on the provided classes.   * It checks if the class exists in the `variants` object of `JColorsService   * @returns The active variant based on the provided classes.   */  private getActiveVariant(): string {    const variant = Object.keys(this.colorsService.variants).find((variant) => this.hasClass(variant))    return variant ?? "default"  }  /**   * Handle click event on the button.   * Emits the clicked event if the button is not disabled and not loading.   * @param event The click event   */  handleClick(event: Event) {    if (!this.disabled && !this.isLoading) {      this.clicked.emit(event)    }  }}