// src/app/main/main.component.ts (po poprawkach)
import { Component, OnInit } from '@angular/core';
import { AlertService, CloudAppEventsService, Entity } from '@exlibris/exl-cloudapp-angular-lib';
import { Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { FieldConfig } from '../main/field-definitions'; // Upewnij się, że ścieżka jest poprawna
import { SettingsService } from '../services/settings.service';
import { AlmaService } from '../services/alma.service';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loading = false;
  entities$: Observable<Entity[]>;
  selectedEntities: Entity[] = [];
  previewContent: string | null = null;
  allSelected = false;
  availableFields: FieldConfig[] = [];

  constructor(
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private settingsService: SettingsService,
    private almaService: AlmaService,
    private exportService: ExportService
  ) {
    this.entities$ = this.eventsService.entities$.pipe(tap(() => this.reset()));
  }

  ngOnInit() {
    this.settingsService.loadSettings().subscribe(fields => this.availableFields = fields);
  }

  reset() {
    this.loading = false;
    this.selectedEntities = [];
    this.previewContent = null;
    this.allSelected = false;
  }

  toggleAll(entities: Entity[]) {
    this.allSelected = !this.allSelected;
    this.selectedEntities = this.allSelected ? [...entities] : [];
  }

  generatePreview() {
    if (this.selectedEntities.length === 0) {
      return this.alert.warn('Wybierz co najmniej jedną encję.');
    }
    this.loading = true;
    this.almaService.getPoLineDetails(this.selectedEntities).pipe(
      switchMap(responses => {
        const selectedFields = this.availableFields.filter(f => f.selected);
        const content = this.exportService.generateTxtContent(responses, selectedFields);
        return [content];
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: content => {
        this.previewContent = content;
        this.alert.success('Podgląd został wygenerowany!');
      },
      error: err => this.alert.error('Wystąpił błąd: ' + err.message)
    });
  }

  downloadFile() {
    if (!this.previewContent) return this.alert.error('Najpierw wygeneruj podgląd.');
    this.exportService.downloadFile(this.previewContent, 'koszyk.txt');
    this.alert.success('Plik TXT został pobrany!');
  }

  copyToClipboard() {
    if (!this.previewContent) return this.alert.error('Najpierw wygeneruj podgląd.');
    this.exportService.copyToClipboard(this.previewContent);
    this.alert.success('Skopiowano do schowka!');
  }
}