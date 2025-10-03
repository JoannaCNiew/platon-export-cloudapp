import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { CloudAppConfigService, AlertService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { AVAILABLE_FIELDS } from '../main/field-definitions';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppSettings, FieldConfig } from '../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings: AppSettings = { availableFields: [] };
  form: FormGroup;
  
  hoverIndex: number | null = null; 
  expandedIndex: number | null = null;
  isSaving: boolean = false; 
  
  get fieldsFormArray(): FormArray {
    return this.form.get('availableFields') as FormArray;
  }

  constructor(
    private configService: CloudAppConfigService,
    private alert: AlertService,
    public router: Router,
    private eventsService: CloudAppEventsService
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
    
    // USUNIĘTO: this.registerHeaderActions();
  }
  
  // METODA ANULOWANIA (Wykrywana automatycznie przez SDK jako akcja "Cancel")
  // NAZWA MUSI BYĆ DOKŁADNIE TAKA: onCancel()
  onCancel(): void {
      this.router.navigate(['/']); 
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

  // METODA ZAPISU (Wykrywana automatycznie przez SDK jako akcja "Save")
  // NAZWA MUSI BYĆ DOKŁADNIE TAKA: saveSettings()
  saveSettings() {
    if (this.isSaving) return;
    this.isSaving = true;
    const fieldsToSave: FieldConfig[] = this.fieldsFormArray.controls.map(control => control.value);
    
    this.configService.set({ availableFields: fieldsToSave } as AppSettings).subscribe({
      next: () => {
        this.isSaving = false;
        this.alert.success('Ustawienia zostały zapisane!');
        this.router.navigate(['/']); 
      },
      error: (err: any) => {
        this.isSaving = false;
        this.alert.error('Nie udało się zapisać ustawień: ' + err.message);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsFormArray.controls, event.previousIndex, event.currentIndex);
  }
  
  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = index;
    }
  }

  // Wymagane, aby pasek akcji został zresetowany
  ngOnDestroy(): void {
    this.eventsService.refreshPage().subscribe(); 
  }
}