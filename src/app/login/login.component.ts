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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    // Login Status zurücksetzen
    this.loginService.doLogout();
    // get return URL von route parameters oder default '/'
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
    const login = { ...this.login }; // login-Object kopieren (Vorlage aus Konstruktor)
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

  /**
   * Login auf Online DEMODB ausführen
   */
  doLoginDemo() {
    this.showLogin = true; // alle Felder anzeigen, falls Fehler auftritt
    const login = { ...this.login }; // login-Object kopieren (Vorlage aus Konstruktor)
    this.connectionSettingsService.current = {
      WebserviceUrl: "https://remote.proffix.net:11011/pxapi/v2",
      WebservicePasswortHash: "16378f3e3bc8051435694595cbd222219d1ca7f9bddf649b9a0c819a77bb5e50"
    };
    this.datenbankService.getAll().subscribe(
      datenbanken => {
        this.datenbanken = datenbanken;
        this.datenbanken.forEach(datenbank => {
          if (datenbank.Name === "DEMODB") {
            login.Datenbank = datenbank;
          }
        });
        login.Benutzer = "Gast";
        login.Passwort = "16ec7cb001be0525f9af1a96fd5ea26466b2e75ef3e96e881bcb7149cd7598da";
        this.loginService.doLogin(login).subscribe(
          loggedIn => {
            this.logService.logInfo("Login erfolgreich: " + loggedIn.Benutzer);
            this.logService.setMitarbeiter(loggedIn.Mitarbeiter);
            this.loginService.removeAutoLogin();
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.logService.logError("Login fehlgeschlagen: " + error.Message);
            this.errorLogin = this.logService.getError();
          }
        );
      },
      error => {
        this.logService.logError(error.Message);
        this.errorWebservice = this.logService.getError();
      }
    );
  }
}
