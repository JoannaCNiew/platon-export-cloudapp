import { Component, OnInit } from '@angular/core';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Usunięto cały globalny obiekt headerActions
// Metoda onAction i rejestracja zostały usunięte

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
    // Standardowe czyszczenie paska narzędzi przy zmianie routingu
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        // Wymuszamy odświeżenie paska akcji (to jest jedyna komunikacja z eventsService)
        this.eventsService.refreshPage().subscribe(); 
    });
  }
}