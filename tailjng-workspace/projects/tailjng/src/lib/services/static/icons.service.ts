import { Injectable } from '@angular/core';
import { Info, Loader2 } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class JIconsService {

  public icons = {
    Info,
    Loader2,
  }


  constructor() { }
}
