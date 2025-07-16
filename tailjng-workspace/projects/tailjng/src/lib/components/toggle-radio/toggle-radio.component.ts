import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService, JGenericCrudService } from 'tailjng';

@Component({
  selector: 'JToggleRadio',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './toggle-radio.component.html',
  styleUrl: './toggle-radio.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JToggleRadioComponent),
      multi: true,
    },
  ],
})
export class JToggleRadioComponent implements OnInit, ControlValueAccessor {

  @Input() endpoint: string = '';

  @Input() options: any[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';

  @Input() sort: 'ASC' | 'DESC' = 'ASC';
  @Input() defaultFilters: { [key: string]: any } = {};

  @Input() loadOnInit = false;
  @Input() selectFirstOnLoad: boolean = false;

  @Input() disabled: boolean = false;
  @Input() showClear = false;

  @Input() classes: string = '';
  @Input() classesElement: string = '';

  @Output() selectionChange = new EventEmitter<any>();

  internalOptions: { value: any; label: string }[] = [];
  selectedValue: any = null;
  isLoading = false;

  isComponentDisabled = false;

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    public readonly iconsService: JIconsService,
    private readonly genericService: JGenericCrudService
  ) { }

  ngOnInit(): void {
    if (this.endpoint && this.loadOnInit) {
      this.loadOptionsFromApi();
    } else {
      this.processOptions();
    }
  }


  /**
   * Set the disabled state of the component.
   * This method is part of the ControlValueAccessor interface.
   * @param isDisabled 
   */
  setDisabledState(isDisabled: boolean): void {
    this.isComponentDisabled = isDisabled;
  }


  /**
   * Load options from the API based on the endpoint and default filters.
   * This method fetches data from the API and processes it to set the internal options.
   */
  loadOptionsFromApi() {
    this.isLoading = true;

    const params: any = {};
    params['sortOrder'] = this.sort;

    Object.keys(this.defaultFilters).forEach((key) => {
      params[`filter[${key}]`] = this.defaultFilters[key];
    });

    this.genericService.getAll<any>(this.endpoint, params).subscribe({
      next: (res) => {
        const data = res.data[this.endpoint] || [];
        this.options = data;
        this.processOptions();
        this.isLoading = false;

        // If selectFirstOnLoad is true, select the first element
        if (this.selectFirstOnLoad && this.internalOptions.length > 0) {
          this.selectedValue = this.internalOptions[0].value;
          this.onChange(this.selectedValue);
          this.selectionChange.emit(this.selectedValue);
        }
      },
      error: () => (this.isLoading = false),
    });
  }


  /**
   * Get a nested value from an object using a dot-separated path.
   * @param obj The object to search.
   * @param path The dot-separated path to the desired value.
   * @returns The value found at the specified path, or an empty string if not found.
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
  }


  /**
   * Process the options to extract value and label.
   * This method checks if the options are objects and extracts the specified value and label.
   */
  processOptions() {
    if (this.options.length > 0 && typeof this.options[0] === 'object') {

      this.internalOptions = this.options.map((opt) => ({
        value: opt[this.optionValue],
        label: this.getNestedValue(opt, this.optionLabel),
      }));

    } else {
      this.internalOptions = this.options.map((opt) => ({
        value: opt,
        label: opt.toString(),
      }));
    }
  }


  /**
   * Select an option.
   * @param value The value of the option to select.
   * @returns 
   */
  select(value: any) {
    if (this.disabled || this.isComponentDisabled) return;
    this.selectedValue = value;
    this.onChange(this.selectedValue);
    this.selectionChange.emit(this.selectedValue);
  }


  /**
   * Clear the selected value.
   */
  clear() {
    this.selectedValue = null;
    this.onChange(null);
    this.selectionChange.emit(null);
  }


  /**
   * Write the value to the component.
   * This method is part of the ControlValueAccessor interface.
   * It updates the selected value and notifies the change.
   * @param value The value to write.
   */
  writeValue(value: any): void {
    this.selectedValue = value;
  }


  /**
   * Register a callback function to be called when the value changes.
   * This method is part of the ControlValueAccessor interface.
   * @param fn 
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  /**
   * Register a callback function to be called when the control is touched.
   * This method is part of the ControlValueAccessor interface.
   * @param fn The callback function to register.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  /**
   * Reload the options based on the current filters.
   * This method can be called to refresh the options displayed in the toggle radio component.
   */
  reloadOptions() {
    this.loadOptionsFromApi();  // Reload options with the new filters
  }

}
