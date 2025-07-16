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

Version: 0.0.9
Creation Date: 2025-01-04
===============================================
*/

import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class JTooltipService {

  private readonly renderer: Renderer2;

  private tooltipElement: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private showArrow = true;

  private offsetX = 0;
  private offsetY = 0;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  /**
   * Show the tooltip with the specified content, target element, position, arrow visibility, and offsets.
   * @param content The content to display in the tooltip.
   * @param target The target element to attach the tooltip to.
   * @param position The position of the tooltip relative to the target element.
   * @param showArrow Whether to show the arrow pointing to the target element.
   * @param offsetX The horizontal offset of the tooltip.
   * @param offsetY The vertical offset of the tooltip.
   * @returns 
   */
  show(
    content: string | HTMLElement,
    target: HTMLElement,
    position = "top",
    showArrow = true,
    offsetX = 0,
    offsetY = 0,
  ) {
    if (!content || !target) return

    this.hide()
    this.showArrow = showArrow
    this.offsetX = offsetX
    this.offsetY = offsetY

    if (!this.tooltipElement) {
      this.tooltipElement = this.renderer.createElement("div")
      this.renderer.addClass(this.tooltipElement, "j-tooltip")
      this.renderer.setStyle(this.tooltipElement, "position", "absolute")
      this.renderer.setStyle(this.tooltipElement, "z-index", "9999")
      this.renderer.setStyle(this.tooltipElement, "background-color", "#333")
      this.renderer.setStyle(this.tooltipElement, "color", "white")
      this.renderer.setStyle(this.tooltipElement, "padding", "0.5rem")
      this.renderer.setStyle(this.tooltipElement, "border-radius", "0.25rem")
      this.renderer.setStyle(this.tooltipElement, "font-size", "0.875rem")
      this.renderer.setStyle(this.tooltipElement, "pointer-events", "none")
      this.renderer.setStyle(this.tooltipElement, "box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
      this.renderer.setStyle(this.tooltipElement, "max-width", "230px")
      this.renderer.setStyle(this.tooltipElement, "word-wrap", "break-word")
      this.renderer.setStyle(this.tooltipElement, "transition", "opacity 0.2s ease, transform 0.2s ease")

      this.arrowElement = this.renderer.createElement("div")
      this.renderer.setStyle(this.arrowElement, "position", "absolute")
      this.renderer.setStyle(this.arrowElement, "width", "0")
      this.renderer.setStyle(this.arrowElement, "height", "0")
      this.renderer.setStyle(this.arrowElement, "border-style", "solid")
    }

    if (this.tooltipElement) {
      while (this.tooltipElement.firstChild) {
        this.tooltipElement.removeChild(this.tooltipElement.firstChild)
      }
    }

    if (typeof content === "string") {
      this.tooltipElement!.textContent = content
    } else if (content instanceof HTMLElement) {
      this.renderer.appendChild(this.tooltipElement!, content.cloneNode(true))
    }

    if (this.showArrow) {
      this.renderer.appendChild(this.tooltipElement!, this.arrowElement!)
    }

    this.renderer.appendChild(document.body, this.tooltipElement)
    this.renderer.setStyle(this.tooltipElement, "opacity", "0")
    this.renderer.setStyle(this.tooltipElement, "transform", "scale(1)")
    this.renderer.setStyle(this.tooltipElement, "display", "block")

    this.positionAbsolute(target, position)

    requestAnimationFrame(() => {
      this.renderer.setStyle(this.tooltipElement!, "opacity", "1")
    })
  }



  /**
   * Hide the tooltip if it is currently displayed.
   * * This method sets the tooltip's opacity to 0, scales it down, and hides it from view.
   * @returns
   */
  hide() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, "opacity", "0")
      this.renderer.setStyle(this.tooltipElement, "transform", "scale(0.95)")
      this.renderer.setStyle(this.tooltipElement, "display", "none")
    }
  }



  /**
   * Position the tooltip absolutely relative to the target element.
   * @param target The target element to position the tooltip against.
   * @param position The position of the tooltip (top, bottom, left, right).
   * @returns
   */
  positionAbsolute(target: HTMLElement, position: string) {
    if (!this.tooltipElement) return

    const tooltipRect = this.tooltipElement.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    const arrowSize = 6
    let left = 0
    let top = 0

    if (this.showArrow && this.arrowElement) {
      this.renderer.setStyle(this.arrowElement, "border-width", `${arrowSize}px`)
      this.renderer.setStyle(this.arrowElement, "border-color", "transparent")
      this.renderer.setStyle(this.arrowElement, "top", "")
      this.renderer.setStyle(this.arrowElement, "bottom", "")
      this.renderer.setStyle(this.arrowElement, "left", "")
      this.renderer.setStyle(this.arrowElement, "right", "")
    }

    switch (position) {
      case "top":
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + this.offsetX
        top = targetRect.top - tooltipRect.height - arrowSize + this.offsetY
        if (this.showArrow && this.arrowElement) {
          this.renderer.setStyle(this.arrowElement, "bottom", `-5px`)
          this.renderer.setStyle(this.arrowElement, "left", `calc(50% - ${arrowSize}px)`)
          this.renderer.setStyle(this.arrowElement, "border-top-color", "#333")
          this.renderer.setStyle(this.arrowElement, "border-bottom-width", "0")
        }
        break

      case "bottom":
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + this.offsetX
        top = targetRect.bottom + arrowSize + this.offsetY
        if (this.showArrow && this.arrowElement) {
          this.renderer.setStyle(this.arrowElement, "top", `-5px`)
          this.renderer.setStyle(this.arrowElement, "left", `calc(50% - ${arrowSize}px)`)
          this.renderer.setStyle(this.arrowElement, "border-bottom-color", "#333")
          this.renderer.setStyle(this.arrowElement, "border-top-width", "0")
        }
        break

      case "left":
        left = targetRect.left - tooltipRect.width - arrowSize + this.offsetX
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + this.offsetY
        if (this.showArrow && this.arrowElement) {
          this.renderer.setStyle(this.arrowElement, "right", `-5px`)
          this.renderer.setStyle(this.arrowElement, "top", `calc(50% - ${arrowSize}px)`)
          this.renderer.setStyle(this.arrowElement, "border-left-color", "#333")
          this.renderer.setStyle(this.arrowElement, "border-right-width", "0")
        }
        break

      case "right":
        left = targetRect.right + arrowSize + this.offsetX
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + this.offsetY
        if (this.showArrow && this.arrowElement) {
          this.renderer.setStyle(this.arrowElement, "left", `-5px`)
          this.renderer.setStyle(this.arrowElement, "top", `calc(50% - ${arrowSize}px)`)
          this.renderer.setStyle(this.arrowElement, "border-right-color", "#333")
          this.renderer.setStyle(this.arrowElement, "border-left-width", "0")
        }
        break
    }

    this.renderer.setStyle(this.tooltipElement, "left", `${left + window.scrollX}px`)
    this.renderer.setStyle(this.tooltipElement, "top", `${top + window.scrollY}px`)
  }



}
