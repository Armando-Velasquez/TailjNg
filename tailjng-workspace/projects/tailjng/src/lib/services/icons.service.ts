import { Injectable } from '@angular/core';
import { Info } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class JIconsService {

  public icons = {
    Info,

  }


  constructor() { }
}
