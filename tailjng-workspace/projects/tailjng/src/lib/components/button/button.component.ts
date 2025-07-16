import { NgClass } from "@angular/common"
import { Component, Input, Output, EventEmitter } from "@angular/core"
import { LucideAngularModule } from "lucide-angular"
import { JIconsService } from "tailjng";
import { JColorsService } from '../color/colors.service';
import { JTooltipDirective } from "../tooltip/tooltip.directive"

@Component({
  selector: 'JButton',
  imports: [NgClass, LucideAngularModule, JTooltipDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class JButtonComponent {

  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() tooltipPosition: "top" | "right" | "bottom" | "left" = "top";

  @Input() text!: string | number;
  @Input() tooltip: string = "";

  @Input() icon!: any;
  @Input() iconSize: number = 15;
  @Input() iconChange!: any;
  @Input() isChangeIcon: boolean = false;

  @Output() clicked = new EventEmitter<Event>();

  @Input() disabled = false;
  @Input() isLoading = false;

  @Input() classes: string = "";
  @Input() ngClasses: { [key: string]: boolean } = {};


  // Define classes based on button type (switch)
  get variantClasses(): string {
    return this.colorsService.variants[this.getActiveVariant()] || "min-w-[100px] text-black dark:text-white shadow-md"
  }

  // Combine base classes with variants
  get computedClasses() {
    return {
      "flex gap-3 items-center justify-center font-semibold border border-border dark:border-dark-border px-3 py-2 rounded transition duration-300 select-none": true,
      [this.variantClasses]: true, // Apply variant classes based on switch
      "cursor-pointer": !this.disabled && !this.isLoading, // Default cursor when active
      "cursor-default opacity-50 pointer-events-none": this.disabled || this.isLoading, // Disabled cursor
      ...this.ngClasses, // Allows using dynamic validations with [ngClass]
    }
  }


  constructor(
    public readonly iconsService: JIconsService,
    private readonly colorsService: JColorsService,
  ) { }


  /**
   * Verify if a class is present in `classes` or `ngClasses`
   * Split the class string by spaces to check each class individually
   * @param className Name of the class to check
   * @returns True if the class is present, false otherwise
   */
  private hasClass(className: string): boolean {
    const classArray = this.classes.split(" ")
    return classArray.includes(className) || this.ngClasses[className]
  }



  /**
   * Get the active variant based on the provided classes.
   * It checks if the class exists in the `variants` object of `JColorsService
   * @returns The active variant based on the provided classes.
   */
  private getActiveVariant(): string {
    const variant = Object.keys(this.colorsService.variants).find((variant) => this.hasClass(variant))
    return variant ?? "default"
  }



  /**
   * Handle click event on the button.
   * Emits the clicked event if the button is not disabled and not loading.
   * @param event The click event
   */
  handleClick(event: Event) {
    if (!this.disabled && !this.isLoading) {
      this.clicked.emit(event)
    }
  }

}
