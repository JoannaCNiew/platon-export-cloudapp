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
    // Wymuszenie czyszczenia nagłówka przy zmianie routingu, 
    // aby usunąć przyciski, które zostały zdefiniowane w settings.component.ts.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        this.eventsService.refreshPage().subscribe(); 
    });
  }
}