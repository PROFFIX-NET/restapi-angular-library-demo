import { Injectable } from '@angular/core';
import { PxMitarbeiter } from '@proffix/restapi-angular-library';

@Injectable()
export class LogService {
  error: string;
  mitarbeiter: PxMitarbeiter;

  /**
   * Infos loggen (nur in Console)
   * @param logtext string der für Console geloggt werden soll
   */
  logInfo(logtext: string) {
    console.log(logtext);
  }

  /**
   * Error loggen (in Console und für Errorfeld in UI)
   * @param logtext string der für Console und UI geloggt werden soll
   */
  logError(logtext: string) {
    console.log("Error: " + logtext);
    this.error = logtext;
  }

  /**
   * Error lesen
   */
  getError() {
    return this.error;
  }

  /**
   * Errortext zurücksetzen
   */
  resetError() {
    this.error = null;
  }

  /**
   * Mitarbeiterobjekt für Account-Anzeige setzen
   * @param ma Mitarbeiterobjekt für Account-Anzeige
   */
  setMitarbeiter(ma: PxMitarbeiter) {
    this.mitarbeiter = ma;
  }

  /**
   * Mitarbeiterobjekt für Account-Anzeige lesen
   */
  getMitarbeiter(): PxMitarbeiter {
    return this.mitarbeiter;
  }
}
