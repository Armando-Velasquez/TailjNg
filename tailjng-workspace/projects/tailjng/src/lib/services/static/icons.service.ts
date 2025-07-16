import { Injectable } from '@angular/core';
import { Check, CircleCheck, CircleHelp, CircleX, Info, Loader2, TriangleAlert, X } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class JIconsService {

  public icons = {
    info: Info,
    success: CircleCheck,
    error: CircleX,
    warning: TriangleAlert,
    question: CircleHelp,
    close: X,
    check: Check,
    loading: Loader2,
  }


  constructor() { }
}
