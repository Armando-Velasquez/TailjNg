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

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { JIconsService } from 'tailjng';

@Component({
  selector: 'JModeToggle',
  imports: [LucideAngularModule],
  templateUrl: './mode-toggle.component.html',
  styleUrl: './mode-toggle.component.css'
})
export class JModeToggleComponent {

  title = 'frontend';
  theme: string = 'light';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    public readonly iconsService: JIconsService
  ) {
    this.loadTheme();
  }

  
  /**
   * Set the theme for the application.
   * @param theme - The theme to set, either 'light' or 'dark'.
   */
  setTheme(theme: 'light' | 'dark') {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
    this.theme = theme; // Actualizar la variable theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }



  /**
   * Load the theme from localStorage and apply it to the document.
   */
  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      this.theme = storedTheme ?? 'light';
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }



  /**
   * Toggle between light and dark mode.
   */
  toggleDarkMode() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }


}
