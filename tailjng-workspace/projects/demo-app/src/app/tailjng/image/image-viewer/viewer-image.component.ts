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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';
import { JButtonComponent } from '../../button/button.component';

@Component({
  selector: 'JViewerImage',
  imports: [CommonModule, LucideAngularModule, JButtonComponent],
  templateUrl: './viewer-image.component.html',
  styleUrl: './viewer-image.component.css'
})
export class JViewerImageComponent implements OnChanges {

  @Input() src!: string | SafeUrl;
  @Input() alt: string = 'Imagen';

  @Input() width?: number;
  @Input() height?: number;

  @Input() objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'contain';

  posX = 0;
  posY = 0;

  zoom = 1;
  rotate = 0;

  isFullscreen = false;
  internalLoading = true;
  animateTransform = true;
  hasError = false;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };

  constructor(public readonly iconsService: JIconsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && changes['src'].currentValue !== changes['src'].previousValue) {
      this.internalLoading = true;
    }
  }

  handleLoad() {
    this.internalLoading = false;
    this.hasError = false;
  }

  handleError() {
    this.internalLoading = false;
    this.hasError = true;
  }

  get loading(): boolean {
    return this.internalLoading;
  }

  toggleFullscreen(container: HTMLElement) {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom + 0.1, 3);
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - 0.1, 0.5);
  }

  rotateRightImg() {
    this.rotate += 90;
  }

  rotateLeftImg() {
    this.rotate -= 90;
  }

  reset() {
    this.zoom = 1;
    this.rotate = 0;
    this.posX = 0;
    this.posY = 0;
  }

  startDrag(event: MouseEvent) {
    if (this.zoom <= 1) return;
    this.dragging = true;
    this.animateTransform = false;

    this.dragStart = {
      x: event.clientX,
      y: event.clientY
    };

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.endDrag);
  }

  onDrag = (event: MouseEvent) => {
    if (!this.dragging) return;

    const deltaX = event.clientX - this.dragStart.x;
    const deltaY = event.clientY - this.dragStart.y;

    const angleRad = (this.rotate % 360) * (Math.PI / 180);

    const rotatedX = deltaX * Math.cos(angleRad) + deltaY * Math.sin(angleRad);
    const rotatedY = deltaY * Math.cos(angleRad) - deltaX * Math.sin(angleRad);

    this.posX += rotatedX;
    this.posY += rotatedY;

    this.dragStart.x = event.clientX;
    this.dragStart.y = event.clientY;
  };

  endDrag = () => {
    this.dragging = false;
    this.animateTransform = true;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.endDrag);
  };
}
