import { Component, OnInit } from '@angular/core';
import { AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SettingsService } from '../services/settings.service';
import { FieldConfig } from '../main/field-definitions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  availableFields: FieldConfig[] = [];

  constructor(
    private settingsService: SettingsService,
    private alert: AlertService,
    public router: Router
  ) { }

  ngOnInit() {
    this.settingsService.loadSettings().subscribe(fields => {
      this.availableFields = fields;
    });
  }

  saveSettings() {
    this.settingsService.saveSettings(this.availableFields).subscribe({
      next: () => {
        this.alert.success('Ustawienia zostały zapisane!');
        this.router.navigate(['/']);
      },
      error: (err) => this.alert.error('Nie udało się zapisać ustawień: ' + err.message)
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.availableFields, event.previousIndex, event.currentIndex);
  }
}