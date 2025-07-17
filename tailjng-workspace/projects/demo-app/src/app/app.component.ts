import { Component } from '@angular/core';
import { JTooltipDirective } from './tailjng/tooltip/tooltip.directive';
import { JLabelComponent } from './tailjng/label/label.component';
import { JButtonComponent } from './tailjng/button/button.component';
import { JToggleRadioComponent } from './tailjng/toggle-radio/toggle-radio.component';
import { JAlertDialogService, JAlertToastService, TableColumn } from 'tailjng';
import { JAlertDialogComponent } from './tailjng/alert/alert-dialog/dialog-alert.component';
import { JAlertToastComponent } from './tailjng/alert/alert-toast/toast-alert.component';
import { JInputCheckboxComponent } from './tailjng/checkbox/input-checkbox/input-checkbox.component';
import { JSwitchCheckboxComponent } from './tailjng/checkbox/switch-checkbox/switch-checkbox.component';
import { JProgressBarComponent } from './tailjng/progress-bar/progress-bar.component';
import { JViewerImageComponent } from './tailjng/image/viewer-image/viewer-image.component';
import { JDialogComponent } from './tailjng/dialog/dialog.component';
import { JFileInputComponent } from './tailjng/input/input-file/file-input.component';
import { FormsModule } from '@angular/forms';
import { JTextareaInputComponent } from './tailjng/input/input-textarea/textarea-input.component';
import { JRangeInputComponent } from './tailjng/input/input-range/range-input.component';
import { JInputComponent } from './tailjng/input/input/input.component';
import { JModeToggleComponent } from './tailjng/mode-toggle/mode-toggle.component';
import { JMultiTableComponent } from './tailjng/select/select-multi-table/multi-table.component';
import { JDropdownComponent } from './tailjng/select/select-dropdown/dropdown.component';
import { JMultiDropdownComponent } from './tailjng/select/select-multi-dropdown/multi-dropdown.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, JModeToggleComponent, JTooltipDirective, JLabelComponent, JButtonComponent, JToggleRadioComponent, JAlertDialogComponent, JAlertToastComponent, JInputCheckboxComponent, JSwitchCheckboxComponent, JProgressBarComponent, JViewerImageComponent, JDialogComponent, JFileInputComponent, JTextareaInputComponent, JRangeInputComponent, JInputComponent, JMultiTableComponent, JDropdownComponent, JMultiDropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'demo-app';

  dialogOpen = false;

  constructor(
    private readonly alertDialogService: JAlertDialogService,
    private readonly alertToastService: JAlertToastService,
  ) {

  }

  // =========================================================

  isCheck: boolean = true

  togglePasswordVisibility(event: any) {
    this.isCheck = !this.isCheck;
  }

  // =========================================================

  onShowAlert() {
    console.log('Alert button clicked');
    this.alertDialogService.AlertDialog({
      type: 'warning',
      title: 'Alert Title',
      description: 'This is an alert message.',
      onConfirm: () => {

      }
    })
  }

  // =========================================================

  onShowToast() {
    console.log('Alert button clicked');
    this.alertToastService.AlertToast({
      type: 'info',
      title: 'Alert Title',
      description: 'This is an alert message.',
    })
  }

  // =========================================================

  file: File | null = null;

  onFileSelected(event: any): void {
    this.file = event.target.files[0];

    console.log(this.file)
  }

  // =========================================================

  columns: TableColumn<any>[] = []

  get visibleColumns(): TableColumn<any>[] {
    return this.columns.filter(col => !col.hidden);
  }

  // =========================================================


  tableColumns: TableColumn<any>[] = [
    { key: "id", label: "ID", visible: true }, // Columna requerida
    { key: "name", label: "Nombre", visible: true, sortable: true },
    { key: "email", label: "Email", visible: true, sortable: true },
    { key: "phone", label: "Teléfono", visible: false },
    { key: "department", label: "Departamento", visible: true },
    { key: "position", label: "Cargo", visible: false },
    { key: "salary", label: "Salario", visible: false },
    { key: "startDate", label: "Fecha de Inicio", visible: true },
  ]

  onVisibilityChange(columns: TableColumn<any>[]) {
    console.log("Columnas actualizadas:", columns)
    this.tableColumns = columns
  }

  onColumnToggle(event: { column: TableColumn<any>; visible: boolean }) {
    console.log(`Columna ${event.column.label} ${event.visible ? "mostrada" : "ocultada"}`)
  }

  getVisibleColumns(): TableColumn<any>[] {
    return this.tableColumns.filter((col) => col.visible)
  }

  getHiddenColumns(): TableColumn<any>[] {
    return this.tableColumns.filter((col) => !col.visible)
  }

  getColumnValue(item: any, key: string): any {
    return item[key] || "-"
  }

}

