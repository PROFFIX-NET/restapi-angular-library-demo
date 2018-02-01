import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PxHash,
  PxLogin,
  PxLoginService,
  PxConfiguration,
  PxDatenbankService,
  PxConnectionSettings,
  PxConnectionSettingsService,
  PxDatenbank
} from '@proffix/restapi-angular-library';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { LogService } from 'app/log/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  errorWebservice: string;
  errorLogin: string;
  returnUrl: string;
  connectionSettings: PxConnectionSettings;
  login: PxLogin;
  autoLogin: boolean;
  webserviceFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  datenbanken: PxDatenbank[];
  showLogin: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: PxLoginService,
    private connectionSettingsService: PxConnectionSettingsService,
    private datenbankService: PxDatenbankService,
    private configuration: PxConfiguration,
    public logService: LogService
  ) {
    this.errorWebservice = "";
    this.errorLogin = "";
    this.showLogin = false;
  }

  /**
   * Initialisiert die Componente
   * siehe: https://angular.io/guide/lifecycle-hooks
   */
  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      WebserviceUrl: ['', Validators.required],
      WebservicePasswort: ['', Validators.required],
      Datenbank: ['', Validators.required],
      Benutzer: ['', Validators.required],
      Passwort: ['', Validators.required],
      AutoLogin: ['']
    });
    this.connectionSettings = {
      WebserviceUrl: null,
      WebservicePasswortHash: null
    };
    this.login = {
      Benutzer: null,
      Passwort: null,
      Datenbank: {},
      // Die Module können aus der AppConfiguration gelesen werden
      Module: this.configuration.getRequiredLicencedModulesAsStringArray()
    };
    // reset login status
    this.loginService.doLogout();
    // get return url von route parameters oder default '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Funktion welche aufgerufen wird, sobald WebserviceUrl und WebservicePasswort ausgefüllt wurde in UI
   * liest mögliche Datenbanken aus der REST API
   */
  isWebserviceCorrect() {
    this.errorWebservice = "";
    this.connectionSettingsService.current = {
      WebserviceUrl: this.connectionSettings.WebserviceUrl + "/pxapi/v2",
      WebservicePasswortHash: PxHash.sha256(this.connectionSettings.WebservicePasswortHash)
    };

    this.datenbankService.getAll().subscribe(
      datenbanken => {
        this.datenbanken = datenbanken;
        this.showLogin = true;
      },
      error => {
        this.logService.logError(error.Message);
        this.errorWebservice = this.logService.getError();
      }
    );
  }

  /**
   * Login-Funktion des Benutzers
   */
  doLogin() {
    const login = { ...this.login }; // login-Object kopieren (Vorlage aus Constructor)
    login.Passwort = PxHash.sha256(login.Passwort); // direkt via NgModel gesetztes Passwort nachträglich verhashen
    this.loginService.doLogin(login).subscribe(
      loggedIn => {
        this.logService.logInfo("Login erfolgreich: " + loggedIn.Benutzer);
        this.logService.setMitarbeiter(loggedIn.Mitarbeiter);
        if (this.autoLogin) {
          this.loginService.activateAutoLogin(loggedIn);
        } else {
          this.loginService.removeAutoLogin();
        }
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.logService.logError("Login fehlgeschlagen: " + error.Message);
        this.errorLogin = this.logService.getError();
      }
    );
  }
}
