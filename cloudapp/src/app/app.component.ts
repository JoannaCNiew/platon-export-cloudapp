import { Component, OnInit } from '@angular/core';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private eventsService: CloudAppEventsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // USUNIĘTO: Wszelkie próby rejestracji akcji menu.
    // Teraz ikona ustawień jest obsługiwana wyłącznie przez routerLink w main.component.html.

    // Standardowe czyszczenie paska narzędzi przy zmianie routingu
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        // Wymuszamy odświeżenie paska akcji (czyszczenie starych przycisków, jeśli istnieją)
        this.eventsService.refreshPage().subscribe(); 
    });
  }

  // Usunięto: Metoda updateHeaderActions
}