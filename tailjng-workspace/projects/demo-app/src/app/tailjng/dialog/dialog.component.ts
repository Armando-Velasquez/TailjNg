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

import { Component, Input, TemplateRef, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JDialog',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('modalTransition', [
      transition(':enter', [
        style({ transform: 'translateY(1rem)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateY(1rem)', opacity: 0 }))
      ])
    ])
  ]
})
export class JDialogComponent implements OnChanges {

  @Input() position:
    | 'center'
    | 'leftCenter'
    | 'rightCenter'
    | 'topCenter'
    | 'bottomCenter'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom' = 'center';

  @Input() offset: { top?: number, bottom?: number, left?: number, right?: number } = {};

  @Input() openModal = false;
  @Output() closeModal = new EventEmitter<void>();

  @Input() title = 'Dialog Title';
  @Input() dialogTemplate!: TemplateRef<any>;

  @Input() width: number | 'auto' | 'full' = 500;
  @Input() height: number | 'auto' | 'full' = 300;

  @Input() overlay: boolean = true;
  @Input() draggable: boolean = false;

  private isDragging = false;
  private hasMoved = false;
  private dragOffset = { x: 0, y: 0 };

  constructor(
    public readonly iconsService: JIconsService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['openModal']?.currentValue === true) {
      this.hasMoved = false;
    }
  }

  onOpen() {
    this.hasMoved = false;
    this.openModal = true;
  }

  onClose() {
    this.closeModal.emit();
  }

  getModalWidth(): string {
    if (this.width === 'auto') return 'auto';
    if (typeof this.width === 'number') return `${this.width}px`;
    if (this.width === 'full') return '90vw';
    return `${this.width || 100}px`;
  }

  getModalHeight(): string {
    if (this.height === 'auto') return 'auto';
    if (typeof this.height === 'number') return `${this.height}px`;
    if (this.height === 'full') return '90vh';
    return `${this.height || 40}px`;
  }


  isFullScreen(): boolean {
    return this.width === 'full' || this.height === 'full';
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.openModal) {
      this.onClose();
    }
  }

  getPositionClass(): string {
    switch (this.position) {
      case 'leftCenter': return 'justify-start items-center';
      case 'rightCenter': return 'justify-end items-center';
      case 'topCenter': return 'justify-center items-start';
      case 'bottomCenter': return 'justify-center items-end';
      case 'leftTop': return 'justify-start items-start';
      case 'leftBottom': return 'justify-start items-end';
      case 'rightTop': return 'justify-end items-start';
      case 'rightBottom': return 'justify-end items-end';
      case 'center':
      default: return 'justify-center items-center';
    }
  }

  getOffsetStyles(): { [key: string]: string } {
    return {
      marginTop: this.offset.top !== undefined ? `${this.offset.top}px` : '',
      marginBottom: this.offset.bottom !== undefined ? `${this.offset.bottom}px` : '',
      marginLeft: this.offset.left !== undefined ? `${this.offset.left}px` : '',
      marginRight: this.offset.right !== undefined ? `${this.offset.right}px` : '',
    };
  }

  startDrag(event: MouseEvent) {
    if (!this.draggable) return;

    this.isDragging = true;

    const dialogElement = (event.currentTarget as HTMLElement).closest('[data-draggable-dialog]') as HTMLElement;
    if (!dialogElement) return;

    const rect = dialogElement.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Only set position if it hasn't been moved before (respects initial offset)
    if (!this.hasMoved) {
      const computedTop = this.offset.top ?? rect.top;
      const computedLeft = rect.left;

      dialogElement.style.position = 'fixed';
      dialogElement.style.margin = '0';
      dialogElement.style.transform = 'none';
      dialogElement.style.zIndex = '1001';
      dialogElement.style.top = `${computedTop}px`;
      dialogElement.style.left = `${computedLeft}px`;

      this.hasMoved = true;
    }

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      if (!this.isDragging) return;

      const newLeft = moveEvent.clientX - this.dragOffset.x;
      const newTop = moveEvent.clientY - this.dragOffset.y;

      const maxLeft = window.innerWidth - dialogElement.offsetWidth;
      const maxTop = window.innerHeight - dialogElement.offsetHeight;

      dialogElement.style.left = `${Math.min(Math.max(newLeft, 0), maxLeft)}px`;
      dialogElement.style.top = `${Math.min(Math.max(newTop, 0), maxTop)}px`;
    };

    const mouseUpHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }



}
