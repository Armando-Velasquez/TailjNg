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

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Eye, LucideAngularModule, Check, SquareDashedMousePointer } from "lucide-angular";
import { animate, style, transition, trigger } from "@angular/animations";
import { JButtonComponent } from "../../button/button.component";
import { TableColumn } from 'tailjng';

@Component({
  selector: "JMultiTableSelect",
  imports: [LucideAngularModule, JButtonComponent, CommonModule, FormsModule],
  templateUrl: "./multi-table-select.component.html",
  styleUrls: ["./multi-table-select.component.css"],
  animations: [
    trigger("modalTransition", [
      transition(":enter", [
        style({ transform: "translateX(1rem)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [animate("150ms ease-in", style({ transform: "translateX(1rem)", opacity: 0 }))]),
    ]),
  ],
})
export class JMultiTableSelectComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  // Definición de iconos
  icons = {
    view: Eye,
    check: Check,
    squareDashedMousePointer: SquareDashedMousePointer,
  };

  @Input() btnIcon = this.icons.view; // Icono del botón
  @Input() btnText = ""; // Texto del botón
  @Input() title = "Columnas visibles"; // Título del dropdown
  @Input() disabled = false; // Estado deshabilitado
  @Input() showActions = true; // Mostrar botones de acción (mostrar todas, ocultar todas, etc.)

  // Columnas de la tabla
  @Input() columns: TableColumn<any>[] = []; // Usar 'any' para el tipo genérico

  // Eventos
  @Output() visibilityChange = new EventEmitter<TableColumn<any>[]>();
  @Output() columnToggle = new EventEmitter<{ column: TableColumn<any>; visible: boolean }>();

  @ViewChild("selectButton") selectButton!: ElementRef;

  // Estado del componente
  isColumnSelectorOpen = false;
  private originalColumns: TableColumn<any>[] = []; // Para restablecer valores por defecto

  // Posicionamiento del dropdown
  dropdownTop = 0;
  dropdownLeft = 0;
  dropdownWidth = 0;

  // Click fuera del componente
  private clickOutsideListener: any;

  constructor(private readonly cdr: ChangeDetectorRef, private readonly elementRef: ElementRef) {}

  ngOnInit() {
    // Guardar el estado original de las columnas
    this.saveOriginalState();
  }

  ngAfterViewInit() {
    this.setupClickOutsideListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["columns"]) {
      this.saveOriginalState();
    }
  }

  ngOnDestroy() {
    if (this.clickOutsideListener) {
      document.removeEventListener("click", this.clickOutsideListener);
    }
  }

  // ======================================================
  // Manejo de columnas
  // ======================================================

  toggleColumnVisibility(column: TableColumn<any>) {
    // No permitir ocultar columnas si `hidden` es true
    if (column.hidden) {
      return;
    }

    column.visible = !column.visible;
    this.emitChanges(column);
  }

  selectAllColumns() {
    this.columns.forEach((column) => {
      column.visible = true;
    });
    this.emitVisibilityChange();
  }

  deselectAllColumns() {
    this.columns.forEach((column) => {
      // No ocultar columnas que estén marcadas como `hidden`
      if (!column.hidden) {
        column.visible = false;
      }
    });
    this.emitVisibilityChange();
  }

  resetToDefault() {
    this.columns.forEach((column, index) => {
      const original = this.originalColumns[index];
      if (original) {
        column.visible = original.visible ?? false; // Si `visible` es undefined, asignar false
      }
    });
    this.emitVisibilityChange();
  }

  // ======================================================
  // Métodos de utilidad
  // ======================================================

  private saveOriginalState() {
    this.originalColumns = this.columns.map((col) => ({
      ...col,
      visible: col.visible ?? false, // Asegúrate de que `visible` siempre tenga un valor booleano
    }));
  }

  private emitChanges(column: TableColumn<any>) {
    this.columnToggle.emit({ column, visible: column.visible ?? false });
    this.emitVisibilityChange();
  }

  private emitVisibilityChange() {
    this.visibilityChange.emit([...this.columns]);
  }

  // ======================================================
  // UI y posicionamiento
  // ======================================================

  toggleColumnSelector() {
    if (this.disabled) return;

    this.isColumnSelectorOpen = !this.isColumnSelectorOpen;
    if (this.isColumnSelectorOpen) {
      this.updateDropdownPosition();
    }
  }

  setupClickOutsideListener() {
    this.clickOutsideListener = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const isOutsideDropdown = !this.elementRef.nativeElement.contains(clickedElement);
      if (this.isColumnSelectorOpen && isOutsideDropdown) {
        this.isColumnSelectorOpen = false;
        this.cdr.detectChanges();
      }
    };
    document.addEventListener("click", this.clickOutsideListener);
  }

  updateDropdownPosition() {
    setTimeout(() => {
      if (!this.selectButton) return;

      const button = this.selectButton.nativeElement;
      const buttonRect = button.getBoundingClientRect();

      // Posición básica
      this.dropdownTop = buttonRect.bottom + window.scrollY;
      this.dropdownLeft = buttonRect.left + window.scrollX;
      this.dropdownWidth = Math.max(buttonRect.width, 250); // Mínimo 250px

      this.cdr.detectChanges();

      // Ajustar posición si es necesario
      setTimeout(() => {
        const dropdown = this.elementRef.nativeElement.querySelector(".absolute.z-\\[100\\]");
        if (!dropdown) return;

        const dropdownRect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Ajustar si se sale por abajo
        if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
          this.dropdownTop = buttonRect.top + window.scrollY - dropdownRect.height;
        }

        // Ajustar si se sale por la derecha
        if (buttonRect.left + dropdownRect.width > viewportWidth) {
          this.dropdownLeft = buttonRect.right + window.scrollX - dropdownRect.width;
        }

        this.cdr.detectChanges();
      }, 0);
    });
  }

  // ======================================================
  // Métodos públicos para uso externo
  // ======================================================

  getVisibleColumns(): TableColumn<any>[] {
    return this.columns.filter((col) => col.visible);
  }

  getHiddenColumns(): TableColumn<any>[] {
    return this.columns.filter((col) => !col.visible);
  }

  setColumnVisibility(key: string, visible: boolean) {
    const column = this.columns.find((col) => col.key === key);
    if (column && !column.hidden) {  // Solo cambiar visibilidad si no está oculto
      column.visible = visible;
      this.emitChanges(column);
    }
  }

  getColumnVisibility(key: string): boolean {
    const column = this.columns.find((col) => col.key === key);
    return column?.visible ?? false;
  }
}
