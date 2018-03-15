import { Component, OnInit, NgModule } from '@angular/core';
import { DateFormatPipe } from "./date.pipe";
import { FormControl } from '@angular/forms';
import { startWith, map } from "rxjs/operators";
import { Observable } from 'rxjs/Rx';

import {
  PxRapport,
  PxRapportService,
  PxMitarbeiter,
  PxAuftrag,
  PxPositionsart,
  PxMitarbeiterService,
  PxAuftragService,
  PxPositionsartService,
  PxGlobalQueryParameter
} from '@proffix/restapi-angular-library';
import { LogService } from 'app/log/log.service';


@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss'],
})
export class RapportComponent implements OnInit {
  rapporte: PxRapport[];
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  emptyRapport: PxRapport = { Mitarbeiter: {}, Auftrag: {}, Positionsart: {} };
  selectedRapport: PxRapport = { Mitarbeiter: {}, Auftrag: {}, Positionsart: {} };
  newRapport: PxRapport = { Mitarbeiter: {}, Auftrag: {}, Positionsart: {} };
  mitarbeiters: PxMitarbeiter[];
  auftraege: PxAuftrag[];
  positionsarten: PxPositionsart[];
  dateNow = new Date(Date.now());
  dateNewRapport: string;
  rapporteMehr: boolean;

  constructor(
    private rapportService: PxRapportService,
    private logService: LogService,
    private mitarbeiterService: PxMitarbeiterService,
    private auftragService: PxAuftragService,
    private positionsartService: PxPositionsartService
  ) { }

  /**
   * Initialisiert die Componente
   * siehe: https://angular.io/guide/lifecycle-hooks
   */
  ngOnInit(): void {
    this.getRapporteInit().subscribe();
    this.getMitarbeiter().subscribe();
    this.getAuftraege().subscribe();
    this.getPositionsarten().subscribe();
    this.getDatum();
  }

  /**
   * getRapporte-Funktion macht den Aufruf für die ersten 20 Rapporte
   */
  getRapporteInit(): Observable<PxRapport[]> {
    // setze Rapport Array auf leer bzw. length auf 0 damit die Rapporte frisch geladen werden
    this.rapporte = [];
    // setze rapporteMehr auf true, am Anfang hat es bestimmt Rapporte zu laden
    this.rapporteMehr = true;
    return this.getRapporteMehr();
  }

  /**
   * getRapporte-Funktion welche immer die nächsten maximal 20 Rapporte lädt
   */
  getRapporteMehr(): Observable<PxRapport[]> {
    // lade die nächsten 20 Rapporte welche nur Rapporte mit Positionsart und Auftrag beinhalten soll
    // keine Rapporte mit Artikel oder Projekte
    return this.rapportService.getAll({ offset: this.rapporte.length, limit: 20, filter: "Positionsart != 0, Auftrag != NULL" }).do(
      rapporte => {
        // sobald die Abfrage weniger wie 20 weitere Rapporte zurückliefert
        if (rapporte.length < 20) {
          // setze Boolean auf false, welcher den "mehr Rapporte laden"-Button disabled
          this.rapporteMehr = false;
        }
        // für jeden Rapport welcher im Rapport Array zurückgeliefert wird
        for (const rapport of rapporte) {
          // füge den einzelnen Rapport zum bereits bestehenden Array hinzu
          this.rapporte.push(rapport);
        }
      },
      error => this.logService.logError(error)
    );
  }

  /**
   * Mitarbeiter-Array laden
   * um bei neuem oder zu editierenden Rapport in Dropdownfeld auswählen zu können
   */
  getMitarbeiter(): Observable<PxMitarbeiter[]> {
    return this.mitarbeiterService.getAll().do(
      mitarbeiter => this.mitarbeiters = mitarbeiter,
      error => this.logService.logError(error)
    );
  }

  /**
   * Aufträge-Array laden
   * um bei neuem oder zu editierenden Rapport in Dropdownfeld auswählen zu können
   */
  getAuftraege(): Observable<PxAuftrag[]> {
    return this.auftragService.getAll().do(
      auftrag => this.auftraege = auftrag,
      error => this.logService.logError(error)
    );
  }

  /**
   * Positionsarten-Array laden
   * um bei neuem oder zu editierenden Rapport in Dropdownfeld auswählen zu können
   */
  getPositionsarten(): Observable<PxPositionsart[]> {
    return this.positionsartService.getAll().do(
      positionsart => this.positionsarten = positionsart,
      error => this.logService.logError(error)
    );
  }

  /**
   * Datum in speziellem Format laden
   * um bei neuem Rapport den vorgegebenen Wert abfüllen zu können
   */
  getDatum() {
    const month = this.dateNow.getMonth() + 1;
    const day = this.dateNow.getDay();

    this.dateNewRapport = this.dateNow.getFullYear().toString();
    this.dateNewRapport += "-" + (month < 10 ? "0" + month.toString() : month.toString());
    this.dateNewRapport += "-" + (day < 10 ? "0" + day.toString() : day.toString());
  }

  /**
   * Hilfe-Funktion für Dropdownfeld Mitarbeiter
   * @param mitarbeiter Mitarbeiterobjekt
   */
  displayMitarbeiter(mitarbeiter: PxMitarbeiter): string {
    if (mitarbeiter) {
      return mitarbeiter.Name;
    }
  }

  /**
   * Hilfe-Funktion für Dropdownfeld Auftrag
   * @param auftrag Auftragsobjekt
   */
  displayAuftrag(auftrag: PxAuftrag): string {
    if (auftrag) {
      return auftrag.Bezeichnung;
    }
  }

  /**
   * Hilfe-Funktion für Dropdownfeld Positionsart
   * @param positionsart Positionsartobjekt
   */
  displayPositionsart(positionsart: PxPositionsart): string {
    if (positionsart) {
      return positionsart.Bezeichnung;
    }
  }

  /**
   * Toggle-Funktion welches den zu editierendes Rapport aus dem Rapportarray wählt
   * @param selectedRapport zu editierendes Rapportobjekt
   */
  toggleRapport(selectedRapport: PxRapport) {
    this.selectedRapport = this.emptyRapport;
    this.selectedRapport = this.rapporte.find(rapport => rapport.RapportNr === selectedRapport.RapportNr);
  }

  /**
   * Speichern-Funktion für den editierten Rapport
   * lädt ausserdem Rapportliste neu
   */
  saveEditedRapport() {
    this.rapportService
      .put(this.selectedRapport)
      .flatMap(location => this.getRapporteInit())
      .subscribe();
    this.selectedRapport = this.emptyRapport;
  }

  /**
   * Speichern-Funktion für den neu angelegten Rapport
   * lädt ausserdem Rapportliste neu
   */
  saveNewRapport() {
    this.newRapport.Datum = this.dateNewRapport;
    this.rapportService
      .post(this.newRapport)
      .flatMap(location => this.getRapporteInit())
      .subscribe();
    this.newRapport = this.emptyRapport;
  }
}
