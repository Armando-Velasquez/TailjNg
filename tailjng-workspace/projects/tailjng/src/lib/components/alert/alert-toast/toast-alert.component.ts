import { Component, computed, inject, Input } from '@angular/core';
import { trigger, transition, style, animate } from "@angular/animations";
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JButtonComponent } from '../../button/button.component';
import { JColorsService } from '../../color/colors.service';
import { JIconsService, JAlertToastService } from 'tailjng';

@Component({
  selector: 'JAlertToast',
  imports: [LucideAngularModule, NgClass, JButtonComponent],
  templateUrl: './toast-alert.component.html',
  styleUrl: './toast-alert.component.css',
  animations: [
    trigger("toastTransition", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
      ]),
      transition(":leave", [
        animate("150ms ease-in", style({ opacity: 0, transform: "translateY(10px)" }))
      ])
    ])
  ]
})
export class JAlertToastComponent {
  @Input() monocromatic: boolean = false;
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right';

  private readonly alertToastService = inject(JAlertToastService);

  constructor(
    private readonly colorsService: JColorsService,
    public readonly iconsService: JIconsService
  ) { }

  toasts = computed(() => this.alertToastService.toasts());

  getIcon(type: string) {
    return this.iconsService.icons[type as keyof typeof this.iconsService.icons] || this.iconsService.icons.info;
  }

  handleAction(toastId: string, action: "action" | "cancel") {
    this.alertToastService.executeToastAction(toastId, action);
  }

  closeToast(toastId: string) {
    this.alertToastService.closeToastById(toastId);
  }

  // Get the class of the toast
  getToastClass(type: string) {
    return this.colorsService.getAlertClass(type, this.monocromatic);
  }

  // Get the class of the icon
  getIconClass(type: string) {
    return this.colorsService.getIconClass(type, this.monocromatic);
  }

  // Get the class of the button
  getButtonClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonClass(type, this.monocromatic);
  }

  // Get the class of the secondary button
  getButtonSecondaryClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonSecondaryClass(type, this.monocromatic);
  }

  // Assign toast position
  getPositionClass(): string {
    const base = 'w-full fixed z-1000 flex flex-col gap-2 max-w-md';
    switch (this.position) {
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'top-right':
        return `${base} top-20 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
      default:
        return `${base} bottom-4 right-4`;
    }
  }

}
