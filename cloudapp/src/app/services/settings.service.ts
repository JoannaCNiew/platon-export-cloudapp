import { Injectable } from '@angular/core';
import { CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { AVAILABLE_FIELDS, FieldConfig } from '../main/field-definitions';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  private _settingsCache$?: Observable<FieldConfig[]>;

  constructor(private configService: CloudAppConfigService) { }

  loadSettings(): Observable<FieldConfig[]> {
    if (!this._settingsCache$) {
      this._settingsCache$ = this.configService.get().pipe(
        map(settings => (settings && settings.availableFields) ? settings.availableFields : [...AVAILABLE_FIELDS]),
        catchError(() => of([...AVAILABLE_FIELDS])),
        shareReplay(1)
      );
    }
    return this._settingsCache$;
  }

  saveSettings(fields: FieldConfig[]): Observable<void> {
    return this.configService.set({ availableFields: fields }).pipe(
      tap(() => {
        this._settingsCache$ = undefined;
      }),
      map(() => undefined) 
    );
  }
}