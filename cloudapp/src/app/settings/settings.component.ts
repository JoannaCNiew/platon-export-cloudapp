import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { CloudAppConfigService, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { AVAILABLE_FIELDS } from '../main/field-definitions';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppSettings, FieldConfig } from '../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: AppSettings = { availableFields: [] };
  form: FormGroup;
  
  // POPRAWKA: Dodano brakujące właściwości do obsługi interfejsu
  hoverIndex: number | null = null; 
  expandedIndex: number | null = null;
  
  get fieldsFormArray(): FormArray {
    return this.form.get('availableFields') as FormArray;
  }

  constructor(
    private configService: CloudAppConfigService,
    private alert: AlertService,
    public router: Router
  ) {
    this.form = new FormGroup({
      availableFields: new FormArray([])
    });
  }

  ngOnInit() {
    this.configService.get().subscribe({
      next: (settings: any) => {
        this.settings = settings && settings.availableFields ? settings : { availableFields: [...AVAILABLE_FIELDS] };
        this.initForm();
      },
      error: (err: any) => this.alert.error('Nie udało się wczytać ustawień: ' + err.message)
    });
  }
  
  initForm() {
    this.settings.availableFields.forEach(field => {
      this.fieldsFormArray.push(new FormGroup({
        name: new FormControl(field.name),
        label: new FormControl(field.label),
        selected: new FormControl(field.selected),
        customLabel: new FormControl(field.customLabel)
      }));
    });
  }

  saveSettings() {
    const fieldsToSave: FieldConfig[] = this.fieldsFormArray.controls.map(control => control.value);
    
    this.configService.set({ availableFields: fieldsToSave } as AppSettings).subscribe({
      next: () => {
        this.alert.success('Ustawienia zostały zapisane!');
        this.router.navigate(['/']);
      },
      error: (err: any) => this.alert.error('Nie udało się zapisać ustawień: ' + err.message)
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsFormArray.controls, event.previousIndex, event.currentIndex);
  }
  
  // POPRAWKA: Dodano brakującą metodę do obsługi rozwijania/zwijania sekcji
  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = index;
    }
  }
}