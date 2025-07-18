import { Injectable } from '@angular/core';
import { Check, ChevronDown, CircleCheck, CircleHelp, CircleX, Copy, Eye, ImageOff, Info, Loader2, Minimize2, Moon, RefreshCcw, RotateCcw, RotateCw, Scan, Search, SquareDashedMousePointer, Sun, TriangleAlert, Upload, X, ZoomIn, ZoomOut } from 'lucide-angular';

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
    zoomIn: ZoomIn,
    zoomOut: ZoomOut,
    rotateRight: RotateCw,
    rotateLeft: RotateCcw,
    reset: RefreshCcw,
    fullscreen: Scan,
    exitFullscreen: Minimize2,
    imageOff: ImageOff,
    upload: Upload,
    view: Eye,
    chevronDown: ChevronDown,
    squareDashedMousePointer: SquareDashedMousePointer,
    search: Search,
    copy: Copy,
    sun: Sun,
    moon: Moon,
    loading: Loader2,
  }

  constructor() { }
}
