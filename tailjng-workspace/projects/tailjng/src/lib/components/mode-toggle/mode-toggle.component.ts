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
