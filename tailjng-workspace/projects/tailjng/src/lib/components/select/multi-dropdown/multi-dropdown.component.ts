import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit, SimpleChanges, OnChanges, } from "@angular/core"
import { FormsModule, type ControlValueAccessor, ReactiveFormsModule, NG_VALUE_ACCESSOR } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { X, LucideAngularModule, ChevronDown, Check, Loader2, SquareDashedMousePointer } from "lucide-angular"
import { animate, style, transition, trigger } from "@angular/animations"

interface ProcessedOption {
  value: any
  text: string
  original?: any
}

@Component({
  selector: "JMultiDropdown",
  imports: [LucideAngularModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./multi-dropdown.component.html",
  styleUrl: "./multi-dropdown.component.css",
  animations: [
    trigger("modalTransition", [
      transition(":enter", [
        style({ transform: "translateX(1rem)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [animate("150ms ease-in", style({ transform: "translateX(1rem)", opacity: 0 }))]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: JMultiDropdownComponent,
      multi: true,
    },
  ],
})
export class JMultiDropdownComponent implements ControlValueAccessor, AfterViewInit, OnInit, OnChanges, OnDestroy {
  // Lucide icons
  icons = {
    chevronDown: ChevronDown,
    x: X,
    check: Check,
    loading: Loader2,
    squareDashedMousePointer: SquareDashedMousePointer,
  }

  @Input() title = "Seleccionar opciones"
  @Input() placeholder = "Seleccione opciones"
  @Input() showClear = true
  @Input() disabled = false
  @Input() isLoading = false

  // Opciones y configuración
  @Input() options: any[] = []
  @Input() optionLabel: string | string[] = "text"
  @Input() optionValue = "value"
  @Input() labelSeparator = " "

  // Multi-selection específico
  @Input() enableSelectAll = true
  @Input() labelSelectAll = "TODOS"
  @Input() multipleSeparator = ", "
  @Input() maxDisplayItems = 3 // Máximo de items a mostrar antes de "X más"

  @Output() selectionChange = new EventEmitter<any[]>()

  @ViewChild("selectButton") selectButton!: ElementRef

  // Estado del componente
  isDropdownOpen = false
  selectedValues: any[] = []
  processedOptions: ProcessedOption[] = []
  displayLabel = ""

  // Dropdown positioning
  dropdownTop = 0
  dropdownLeft = 0
  dropdownWidth = 0

  // ControlValueAccessor
  private onChange: any = () => { }
  private onTouched: any = () => { }

  // Click outside listener
  private clickOutsideListener: any

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.updateDisplayLabel()
  }

  ngAfterViewInit() {
    this.setupClickOutsideListener()
    setTimeout(() => {
      this.processOptions()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["options"]) {
      this.processOptions()
    }
  }

  ngOnDestroy() {
    if (this.clickOutsideListener) {
      document.removeEventListener("click", this.clickOutsideListener)
    }
  }

  // ======================================================
  // Procesamiento de opciones
  // ======================================================

  processOptions() {
    this.processedOptions = []

    if (this.options && this.options.length > 0 && typeof this.options[0] !== "object") {
      // Opciones simples (string, number)
      this.processedOptions = this.options.map((option) => ({
        value: option,
        text: option.toString(),
      }))
    } else if (this.options && this.options.length > 0) {
      // Opciones complejas (objetos)
      this.processedOptions = this.options.map((option) => {
        const text = Array.isArray(this.optionLabel)
          ? this.optionLabel.map((k) => this.getNestedValue(option, k)).join(this.labelSeparator)
          : this.getNestedValue(option, this.optionLabel)
        return {
          value: option[this.optionValue],
          text,
          original: option,
        }
      })
    }

    this.updateDisplayLabel()
    this.cdr.detectChanges()
  }

  // ======================================================
  // Manejo de selección múltiple
  // ======================================================

  toggleOption(option: ProcessedOption) {
    const index = this.selectedValues.findIndex((v) => v === option.value)

    if (index > -1) {
      // Deseleccionar
      this.selectedValues.splice(index, 1)
    } else {
      // Seleccionar
      this.selectedValues.push(option.value)
    }

    this.updateDisplayLabel()
    this.onChange(this.selectedValues)
    this.selectionChange.emit(this.selectedValues)
  }

  toggleSelectAll() {
    const allValues = this.processedOptions.map((opt) => opt.value)

    if (this.isAllSelected()) {
      // Deseleccionar todos
      this.selectedValues = []
    } else {
      // Seleccionar todos
      this.selectedValues = [...allValues]
    }

    this.updateDisplayLabel()
    this.onChange(this.selectedValues)
    this.selectionChange.emit(this.selectedValues)
  }

  isAllSelected(): boolean {
    const allValues = this.processedOptions.map((opt) => opt.value)
    return allValues.length > 0 && allValues.every((v) => this.selectedValues.includes(v))
  }

  clearSelection(event: Event) {
    event.stopPropagation()
    this.selectedValues = []
    this.updateDisplayLabel()
    this.onChange(this.selectedValues)
    this.selectionChange.emit(this.selectedValues)
  }

  // ======================================================
  // Display y UI
  // ======================================================

  updateDisplayLabel() {
    if (this.selectedValues.length === 0) {
      this.displayLabel = this.placeholder
      return
    }

    // Verificar si todos están seleccionados
    if (this.enableSelectAll && this.isAllSelected()) {
      this.displayLabel = this.labelSelectAll
      return
    }

    // Obtener textos de las opciones seleccionadas
    const selectedTexts = this.processedOptions
      .filter((opt) => this.selectedValues.includes(opt.value))
      .map((opt) => opt.text)

    if (selectedTexts.length <= this.maxDisplayItems) {
      // Mostrar todos los elementos
      this.displayLabel = selectedTexts.join(this.multipleSeparator)
    } else {
      // Mostrar algunos elementos + "X más"
      const visibleItems = selectedTexts.slice(0, this.maxDisplayItems)
      const remainingCount = selectedTexts.length - this.maxDisplayItems
      this.displayLabel = `${visibleItems.join(this.multipleSeparator)} y ${remainingCount} más`
    }
  }

  toggleDropdown() {
    if (this.disabled || this.isLoading) return

    this.isDropdownOpen = !this.isDropdownOpen
    if (this.isDropdownOpen) {
      this.onTouched()
      this.updateDropdownPosition()
    }
  }

  // ======================================================
  // Utilidades
  // ======================================================

  getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) ?? ""
  }

  setupClickOutsideListener() {
    this.clickOutsideListener = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement
      const isOutsideDropdown = !this.elementRef.nativeElement.contains(clickedElement)
      if (this.isDropdownOpen && isOutsideDropdown) {
        this.isDropdownOpen = false
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
      this.dropdownWidth = buttonRect.width

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
  // ControlValueAccessor Implementation
  // ======================================================

  writeValue(value: any[]): void {
    this.selectedValues = Array.isArray(value) ? value : []
    this.updateDisplayLabel()
    this.cdr.markForCheck()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }
}
