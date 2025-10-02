import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertService,
  CloudAppEventsService,
  CloudAppRestService,
  Entity,
  HttpMethod,
  CloudAppConfigService,
  CloudAppStoreService
} from '@exlibris/exl-cloudapp-angular-lib';
import { Observable, forkJoin } from 'rxjs';
import { finalize, tap, map } from 'rxjs/operators';
import { AVAILABLE_FIELDS } from './field-definitions';
import { AppSettings, FieldConfig } from '../models/settings'; 

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  // Używamy entities$ jako właściwości (zgodnie z kompatybilną wersją biblioteki)
  entities$: Observable<Entity[]>;
  selectedEntities: Entity[] = [];
  previewContent: string | null = null;

  availableFields: FieldConfig[] = [...AVAILABLE_FIELDS];

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private configService: CloudAppConfigService,
    private storeService: CloudAppStoreService // Zostawiamy StoreService, aby zachować zgodność z poprzednim kodem
  ) {
    // 1. Użycie entities$ jako właściwości
    this.entities$ = this.eventsService.entities$.pipe(
      tap(() => {
        // Zresetowanie stanu przy zmianie kontekstu
        this.loading = false;
        this.selectedEntities = [];
        this.previewContent = null;
      })
    );
  }

  ngOnInit() {
    this.loadSettings();
  }

  ngOnDestroy(): void { }

  get selectedFields(): FieldConfig[] {
    return this.availableFields.filter(field => field.selected);
  }

  // Metoda do dodawania/usuwania encji z listy wybranych (Zgodne z logiką select-entities)
  toggleEntity(entity: Entity) {
    const index = this.selectedEntities.findIndex(e => e.link === entity.link);
    if (index === -1) {
      this.selectedEntities.push(entity);
    } else {
      this.selectedEntities.splice(index, 1);
    }
  }

  // Zmiana logiki toggleAll, aby operowała na wszystkich widocznych encjach
  toggleAll(entities: Entity[]) {
    const allSelected = this.selectedEntities.length === entities.length;
    if (allSelected) {
      this.selectedEntities = [];
    } else {
      // Ustaw nową listę na wszystkie widoczne encje
      this.selectedEntities = [...entities];
    }
  }

  // Sprawdza, czy encja jest wybrana, dla checkboxa w HTML
  isSelected(entity: Entity): boolean {
    return this.selectedEntities.some(e => e.link === entity.link);
  }


  // --- Logika generowania i pobierania plików ---

  generatePreview() {
    this.loading = true;

    if (this.selectedEntities.length === 0) {
      this.loading = false;
      this.alert.warn('Wybierz co najmniej jedną encję, aby wygenerować podgląd.');
      return;
    }

    const requests = this.selectedEntities.map(entity => this.restService.call({ url: entity.link, method: HttpMethod.GET }));

    forkJoin(requests)
      .pipe(
        finalize(() => this.loading = false),
        map(responses => {
          // GENEROWANIE NAGŁÓWKA
          const headers = this.selectedFields.map(field => field.customLabel).join('\t');
          let fileContent = `# Koszyk TXT Magazyn Wirtualny OSDW Azymut #\n${headers}\n`;
          
          // GENEROWANIE DANYCH
          responses.forEach((response: any) => { 
            const row = this.selectedFields.map(field => {
              switch (field.name) {
                case 'isbn':
                  return response.resource_metadata?.isbn || '';
                case 'title':
                  return response.resource_metadata?.title || '';
                case 'quantity':
                  return response.location?.reduce((sum: number, loc: any) => sum + loc.quantity, 0) || 0;
                case 'poNumber':
                  return response.po_number || '';
                case 'author':
                  return response.resource_metadata?.author || '';
                case 'line_number':
                  return response.number || '';
                case 'owner':
                  return response.owner?.desc || '';
                case 'vendor':
                  return response.vendor?.desc || '';
                case 'price':
                  return `${response.price?.sum} ${response.price?.currency?.value}` || '';
                case 'fund':
                  return response.fund_distribution?.[0]?.fund_code?.value || '';
                default:
                  return '';
              }
            }).join('\t');
            fileContent += `${row}\n`;
          });
          return fileContent;
        })
      )
      .subscribe({
        next: (fileContent: string) => { 
          this.previewContent = fileContent;
          this.alert.success('Podgląd został wygenerowany!');
        },
        error: (err: any) => { 
          this.alert.error('Wystąpił błąd podczas pobierania danych: ' + err.message);
        }
      });
  }

  downloadFile() {
    if (!this.previewContent) {
      this.alert.error('Brak zawartości do pobrania. Najpierw wygeneruj podgląd.');
      return;
    }

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.previewContent);

    const a = document.createElement('a');
    a.href = dataUri;
    a.download = 'koszyk.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.alert.success('Plik TXT został pobrany!');
  }

  copyToClipboard() {
    if (!this.previewContent) {
      this.alert.error('Brak zawartości do skopiowania. Najpierw wygeneruj podgląd.');
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = this.previewContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    this.alert.success('Zawartość została skopiowana do schowka!');
  }

  loadSettings() {
    this.configService.get().subscribe({
      next: (settings: AppSettings) => {
        if (settings && settings.availableFields) {
          this.availableFields = settings.availableFields;
        }
      },
      error: (err: any) => this.alert.error('Nie udało się wczytać ustawień: ' + err.message)
    });
  }
}