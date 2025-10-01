import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  // Komponent otrzymuje treść do wyświetlenia od rodzica (MainComponent)
  @Input() content: string | null = null;

  constructor() { }
}