import { Directive, ElementRef, Input, OnDestroy, HostListener, NgZone, TemplateRef, ViewContainerRef, } from "@angular/core"
import { JTooltipService } from "./tooltip.service"

@Directive({
  selector: '[jTooltip]'
})
export class JTooltipDirective implements OnDestroy {

  @Input("jTooltip") content!: string | TemplateRef<any>;

  @Input() jTooltipPosition: "top" | "right" | "bottom" | "left" = "top";
  @Input() jTooltipShowArrow = true;

  @Input() jTooltipOffsetX = 0;
  @Input() jTooltipOffsetY = 0;

  private mouseTrackingInterval: any;
  private touchStartTimer: any;
  touchStartTime: number = 0;
  private readonly touchHoldDelay: number = 500;

  private isTooltipVisible: boolean = false;
  private readonly isTouchDevice: boolean = false;
  private hasShownTooltip: boolean = false;

  private lastMousePosition: { clientX: number; clientY: number } | null = null

  constructor(
    private readonly el: ElementRef,
    private readonly tooltipService: JTooltipService,
    private readonly zone: NgZone,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
    // Detected tactile devices
    this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
  }

  ngOnDestroy() {
    this.stopMouseTracking()

    // Clean up touch start timer if it exists
    if (this.touchStartTimer) {
      clearTimeout(this.touchStartTimer)
      this.touchStartTimer = null
    }

    this.tooltipService.hide()
  }



  // ==========================================================
  // Events desktop (mouse)
  // ==========================================================

  /**
   * Show the tooltip on mouse enter.
   * If the device is touch, it will not show the tooltip.
   * @returns 
   */
  @HostListener("mouseenter")
  onMouseEnter() {
    if (this.isTouchDevice) return;
    this.show();
  }


  /**
   * Hide the tooltip on mouse leave.
   * If the device is touch, it will not hide the tooltip.
   * @returns 
   */
  @HostListener("mouseleave")
  onMouseLeave() {
    if (this.isTouchDevice) return;
    this.hide();
  }



  // ==========================================================
  // Events mobile (touch)
  // ==========================================================

  /**
   * Show the tooltip on touch start.
   * If the device is not touch, it will not show the tooltip.
   * @param event 
   * @returns 
   */
  @HostListener("touchstart", ["$event"])
  onTouchStart(event: TouchEvent) {
    if (!this.isTouchDevice) return;

    this.touchStartTime = Date.now()
    this.hasShownTooltip = false;

    // Init timer to show tooltip after delay
    this.touchStartTimer = setTimeout(() => {
      this.hasShownTooltip = true;
      this.show();
    }, this.touchHoldDelay)
  }


  /**
   * Hide the tooltip on touch end.
   * If the device is not touch, it will not hide the tooltip.
   * @param event 
   * @returns 
   */
  @HostListener("touchend", ["$event"])
  onTouchEnd(event: TouchEvent) {
    if (!this.isTouchDevice) return;

    // Cancel the timer if released before the delay
    if (this.touchStartTimer) {
      clearTimeout(this.touchStartTimer)
      this.touchStartTimer = null;
    }

    // Hide tooltip if it is visible
    if (this.isTooltipVisible) {
      this.hide();
    }

    // If the tooltip was shown, prevent default action
    if (this.hasShownTooltip) {
      event.preventDefault();
      event.stopPropagation();
    }
  }


  /**
   * Hide the tooltip on touch cancel.
   * If the device is not touch, it will not hide the tooltip.
   * @param event 
   * @returns 
   */
  @HostListener("touchcancel", ["$event"])
  onTouchCancel(event: TouchEvent) {
    if (!this.isTouchDevice) return;

    // Cancel the timer if it exists
    if (this.touchStartTimer) {
      clearTimeout(this.touchStartTimer)
      this.touchStartTimer = null;
    }

    // Hide the tooltip if it is visible
    if (this.isTooltipVisible) {
      this.hide();
    }

    this.hasShownTooltip = false;
  }


  /**
   * Handle touch move events.
   * If the device is not touch, it will not handle the event.
   * @param event 
   * @returns 
   */
  @HostListener("touchmove", ["$event"])
  onTouchMove(event: TouchEvent) {
    if (!this.isTouchDevice) return;

    // If the finger moves too much, cancel the tooltip
    const touch = event.touches[0]
    const rect = this.el.nativeElement.getBoundingClientRect()

    // Check if the finger is still inside the element
    const isInsideElement =
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom

    if (!isInsideElement) {
      // Cancel the timer if the finger leaves the element
      if (this.touchStartTimer) {
        clearTimeout(this.touchStartTimer)
        this.touchStartTimer = null
      }

      // Hide the tooltip if it is visible
      if (this.isTooltipVisible) {
        this.hide()
      }

      this.hasShownTooltip = false
    }
  }



  // ==========================================================
  // Functions
  // ==========================================================

  /**
   * Show the tooltip with the specified content, target element, position, arrow visibility, and offsets.
   * This method creates the tooltip element, sets its content, and positions it relative to the target element.
   * @returns 
   */
  private show() {
    if (!this.content) return;

    this.isTooltipVisible = true;

    // Only start mouse tracking on desktop
    if (!this.isTouchDevice) {
      this.startMouseTracking();
    }

    this.zone.runOutsideAngular(() => {
      let finalContent: string | HTMLElement = ""

      if (this.content instanceof TemplateRef) {
        const view = this.content.createEmbeddedView({});
        this.viewContainerRef.insert(view);
        view.detectChanges();

        const fragment = document.createElement("div");
        view.rootNodes.forEach((node) => fragment.appendChild(node.cloneNode(true)));
        finalContent = fragment;

        view.destroy();

      } else {
        finalContent = this.content;
      }

      this.tooltipService.show(
        finalContent,
        this.el.nativeElement,
        this.jTooltipPosition,
        this.jTooltipShowArrow,
        this.jTooltipOffsetX,
        this.jTooltipOffsetY,
      )
    })
  }


  /**
   * Start mouse tracking to update tooltip position.
   * This method sets an interval to update the tooltip position based on mouse movements.
   */
  private hide() {
    this.isTooltipVisible = false
    this.stopMouseTracking()
    this.zone.runOutsideAngular(() => {
      this.tooltipService.hide()
    })
  }


  /**
   * Stop mouse tracking by clearing the interval and removing global event listeners.
   * This method ensures that no multiple intervals are running and cleans up the event listeners.
   * @return
   */
  private startMouseTracking() {
    this.stopMouseTracking();

    this.zone.runOutsideAngular(() => {
      this.mouseTrackingInterval = setInterval(() => {
        if (!this.isTooltipVisible) return

        // Obtener la posición actual del mouse
        const mouseEvent = this.getLastMousePosition()
        if (!mouseEvent) return

        // Verificar si el mouse sigue sobre el elemento
        const elementUnderMouse = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY)
        const isMouseOverElement =
          this.el.nativeElement.contains(elementUnderMouse) || this.el.nativeElement === elementUnderMouse

        if (!isMouseOverElement && this.isTooltipVisible) {
          this.zone.run(() => {
            this.hide()
          })
        }
      }, 100)
    })

    // Add listener for global mouse move events
    document.addEventListener("mousemove", this.onGlobalMouseMove)
  }


  /**
   * Stop mouse tracking by clearing the interval and removing global event listeners.
   * This method ensures that no multiple intervals are running and cleans up the event listeners.
   * @returns
   */
  private stopMouseTracking() {
    if (this.mouseTrackingInterval) {
      clearInterval(this.mouseTrackingInterval)
      this.mouseTrackingInterval = null
    }
    document.removeEventListener("mousemove", this.onGlobalMouseMove)
  }


  /**
   * Handle global mouse move events.
   * @param event The mouse event.
   * @returns 
   */
  private readonly onGlobalMouseMove = (event: MouseEvent) => {
    this.lastMousePosition = { clientX: event.clientX, clientY: event.clientY }

    if (!this.isTooltipVisible) return

    // Verify if the mouse is still over the element
    const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY)
    const isMouseOverElement =
      this.el.nativeElement.contains(elementUnderMouse) || this.el.nativeElement === elementUnderMouse

    if (!isMouseOverElement) {
      this.zone.run(() => {
        this.hide()
      })
    }
  }


  /**
   * Get the last mouse position.
   * This method returns the last recorded mouse position.
   * @returns 
   */
  private getLastMousePosition() {
    return this.lastMousePosition
  }

}
