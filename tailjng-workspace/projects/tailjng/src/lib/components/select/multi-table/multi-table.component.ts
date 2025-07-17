import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit, SimpleChanges, OnChanges, } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { Eye, LucideAngularModule, Check, SquareDashedMousePointer } from "lucide-angular"
import { animate, style, transition, trigger } from "@angular/animations"
import { JButtonComponent } from "../../button/button.component"
import type { TableColumn } from "tailjng"

@Component({
  selector: "JMultiTable",
  imports: [LucideAngularModule, JButtonComponent, CommonModule, FormsModule],
  templateUrl: "./multi-table.component.html",
  styleUrl: "./multi-table.component.css",
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
export class JMultiTableComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  // Lucide icons
  icons = {
    view: Eye,
    check: Check,
    squareDashedMousePointer: SquareDashedMousePointer,
  }

  @Input() btnIcon = this.icons.view // Icono del botón
  @Input() btnText = "" // Texto del botón
  @Input() title = "Columnas visibles" // Titulo del dropdown
  @Input() disabled = false
  @Input() showActions = true // Mostrar botones de acción (mostrar todas, ocultar todas, etc.)

  // Columnas de la tabla
  @Input() columns: TableColumn<any>[] = []

  // Eventos
  @Output() visibilityChange = new EventEmitter<TableColumn<any>[]>()
  @Output() columnToggle = new EventEmitter<{ column: TableColumn<any>; visible: boolean }>()

  @ViewChild("selectButton") selectButton!: ElementRef

  // Estado del componente
  isColumnSelectorOpen = false
  private originalColumns: TableColumn<any>[] = [] // Para restablecer valores por defecto

  // Dropdown positioning
  dropdownTop = 0
  dropdownLeft = 0
  dropdownWidth = 0

  // Click outside listener
  private clickOutsideListener: any

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
  ) { }

  ngOnInit() {
    // Guardar estado original de las columnas
    this.saveOriginalState()
  }

  ngAfterViewInit() {
    this.setupClickOutsideListener()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["columns"]) {
      this.saveOriginalState()
    }
  }

  ngOnDestroy() {
    if (this.clickOutsideListener) {
      document.removeEventListener("click", this.clickOutsideListener)
    }
  }

  // ======================================================
  // Manejo de columnas
  // ======================================================

  toggleColumnVisibility(column: TableColumn<any>) {
    // No permitir cambiar columnas deshabilitadas
    if (column.isDisabled) {
      return
    }

    // Manejar tanto visible como hidden
    if (column.hidden !== undefined) {
      column.hidden = !column.hidden
    } else {
      column.visible = !column.visible
    }

    this.emitChanges(column)
  }

  selectAllColumns() {
    this.columns.forEach((column) => {
      if (!column.isDisabled) {
        if (column.hidden !== undefined) {
          column.hidden = false
        } else {
          column.visible = true
        }
      }
    })
    this.emitVisibilityChange()
  }

  deselectAllColumns() {
    this.columns.forEach((column) => {
      // No ocultar columnas deshabilitadas
      if (!column.isDisabled) {
        if (column.hidden !== undefined) {
          column.hidden = true
        } else {
          column.visible = false
        }
      }
    })
    this.emitVisibilityChange()
  }

  resetToDefault() {
    this.columns.forEach((column, index) => {
      const original = this.originalColumns[index]
      if (original && !column.isDisabled) {
        if (column.hidden !== undefined) {
          column.hidden = original.hidden
        } else {
          column.visible = original.visible
        }
      }
    })
    this.emitVisibilityChange()
  }

  // ======================================================
  // Métodos de utilidad
  // ======================================================

  private saveOriginalState() {
    this.originalColumns = this.columns.map((col) => ({
      ...col,
    }))
  }

  private emitChanges(column: TableColumn<any>) {
    const isVisible = this.isColumnVisible(column)
    this.columnToggle.emit({ column, visible: isVisible })
    this.emitVisibilityChange()
  }

  private emitVisibilityChange() {
    this.visibilityChange.emit([...this.columns])
  }

  // ======================================================
  // UI y posicionamiento
  // ======================================================

  toggleColumnSelector() {
    if (this.disabled) return

    this.isColumnSelectorOpen = !this.isColumnSelectorOpen
    if (this.isColumnSelectorOpen) {
      this.updateDropdownPosition()
    }
  }

  setupClickOutsideListener() {
    this.clickOutsideListener = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement
      const isOutsideDropdown = !this.elementRef.nativeElement.contains(clickedElement)
      if (this.isColumnSelectorOpen && isOutsideDropdown) {
        this.isColumnSelectorOpen = false
        this.cdr.detectChanges()
      }
    }
    document.addEventListener("click", this.clickOutsideListener)
  }

  updateDropdownPosition() {
    setTimeout(() => {
      if (!this.selectButton) return

      const button = this.selectButton.nativeElement
      const buttonRect = button.getBoundingClientRect()

      // Posición básica
      this.dropdownTop = buttonRect.bottom + window.scrollY
      this.dropdownLeft = buttonRect.left + window.scrollX
      this.dropdownWidth = Math.max(buttonRect.width, 250) // Mínimo 250px

      this.cdr.detectChanges()

      // Ajustar posición si es necesario
      setTimeout(() => {
        const dropdown = this.elementRef.nativeElement.querySelector(".absolute.z-\\[100\\]")
        if (!dropdown) return

        const dropdownRect = dropdown.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth

        // Ajustar si se sale por abajo
        if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
          this.dropdownTop = buttonRect.top + window.scrollY - dropdownRect.height
        }

        // Ajustar si se sale por la derecha
        if (buttonRect.left + dropdownRect.width > viewportWidth) {
          this.dropdownLeft = buttonRect.right + window.scrollX - dropdownRect.width
        }

        this.cdr.detectChanges()
      }, 0)
    })
  }

  // ======================================================
  // Métodos públicos para uso externo
  // ======================================================

  isColumnVisible(column: TableColumn<any>): boolean {
    // Si tiene la propiedad hidden, usarla
    if (column.hidden !== undefined) {
      return !column.hidden
    }
    // Si no, usar visible (por defecto true si no está definido)
    return column.visible !== false
  }

  getVisibleColumns(): TableColumn<any>[] {
    return this.columns.filter((col) => this.isColumnVisible(col))
  }

  getHiddenColumns(): TableColumn<any>[] {
    return this.columns.filter((col) => !this.isColumnVisible(col))
  }

  setColumnVisibility(key: string, visible: boolean) {
    const column = this.columns.find((col) => col.key === key)
    if (column && !column.isDisabled) {
      if (column.hidden !== undefined) {
        column.hidden = !visible
      } else {
        column.visible = visible
      }
      this.emitChanges(column)
    }
  }

  getColumnVisibility(key: string): boolean {
    const column = this.columns.find((col) => col.key === key)
    return column ? this.isColumnVisible(column) : false
  }
}
