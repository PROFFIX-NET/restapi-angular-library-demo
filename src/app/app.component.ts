import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { startWith, map } from "rxjs/operators";
import { Observable } from 'rxjs/Rx';
import {
  PxHash,
  PxLoginService,
} from '@proffix/restapi-angular-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  outputLog: string;
  loginMitarbeiter: string;

  constructor(
    public loginService: PxLoginService,
    private router: Router,
  ) {
    this.outputLog = "";
  }

  /**
   * Navigations-Funktion für Kontextmenü-Funktion "Logout"
   */
  navigateLogout() {
    this.loginService.doLogout();
    this.router.navigate([""]);
  }

  /**
   * Navigations-Funktion für Kontextmenü-Funktion "Mein Profil"
   */
  navigateProfile() {
    this.router.navigate(["/profil"]);
  }

  /**
   * Debug Hilfe-Funktion um Local-Storage zu löschen
   * (Klick auf "Demo" in der Titelleiste)
   *
   *clearAllDebug() {
   *  localStorage.clear();
   *}
  */
}
