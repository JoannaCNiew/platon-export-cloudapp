import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FieldConfig } from '../../main/field-definitions'; // Upewnij się, że ścieżka jest poprawna

@Component({
  selector: 'app-column-config',
  templateUrl: './column-config.component.html',
  styleUrls: ['./column-config.component.scss']
})
export class ColumnConfigComponent {
  
  // Komponent otrzymuje listę pól od swojego rodzica (np. SettingsComponent)
  @Input() fields: FieldConfig[] = [];

  constructor() { }

  // Logika do przestawiania elementów na liście
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }
}