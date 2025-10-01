// src/app/services/alma.service.ts
import { Injectable } from '@angular/core';
import { CloudAppRestService, Entity, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { Observable, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlmaService {

  constructor(private restService: CloudAppRestService) { }

  // Pobiera szczegółowe dane dla zaznaczonych encji
  getPoLineDetails(entities: Entity[]): Observable<any[]> {
    if (entities.length === 0) {
      return of([]); // Zwróć pustą tablicę, jeśli nic nie zaznaczono
    }
    const requests = entities.map(entity => 
      this.restService.call({ url: entity.link, method: HttpMethod.GET })
    );
    return forkJoin(requests);
  }
}