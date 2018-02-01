import { Component, OnInit } from '@angular/core';
import {
  PxMitarbeiter,
  PxMitarbeiterService,
  PxLoginService
} from '@proffix/restapi-angular-library';
import { LogService } from 'app/log/log.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})

export class ProfilComponent implements OnInit {
  mitarbeiter: PxMitarbeiter;

  constructor(
    private mitarbeiterService: PxMitarbeiterService,
    private loginService: PxLoginService,
    private logService: LogService,
  ) {}

  /**
   * Initialisiert die Componente
   * siehe: https://angular.io/guide/lifecycle-hooks
   */
  ngOnInit(): void {
    this.mitarbeiter = this.logService.getMitarbeiter();
  }

}
