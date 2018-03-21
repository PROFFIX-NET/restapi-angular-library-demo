PROFFIX REST API Angular Library Demo
=====================================

Programm um die Verwendung der [REST API Angular Library](https://github.com/PROFFIX-NET/restapi-angular-library) zu demonstrieren. Es kann verwendet werden um Rapporte über die [PROFFIX REST API](http://www.proffix.net/entwickler) zu erfassen.

Inbetriebnahme
--------------
1. sicherstellen dass [NodeJS](https://nodejs.org) (6.9.0 oder höher) installiert ist
2. sicherstellen dass [Angular CLI](https://cli.angular.io) installiert ist (sonst installieren: `npm install @angular/cli -g`)
3. den Projektordner in der Befehlszeile öffnen
4. Projektabhängigkeiten installieren: `npm install`
5. Entwicklungsserver starten: `ng serve --aot`
6. Applikation im Browser öffnen: http://localhost:4200

Entwickeln und debuggen
-----------------------
Wir empfehlen die Verwendung von [Visual Studio Code](https://code.visualstudio.com) um Webapplikationen zu entwickeln. Zusätzlich wird Typescript und TSLint global benötigt: `npm install typescript tslint -g` und die Erweiterung [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) für Visual Studio Code.

Nach dem der Entwicklungserver läuft (siehe [Inbetriebname](#inbetriebnahme)), kann Chrome im Remote Debuggin Modus aus Visual Studio Code gestartet werden durch das Drücken von <kbd>F5</kbd> (oder dem grünen Pfeil auf der Debuggen-Ansicht).

Veröffentlichen
---------------
Der Produktions-Build in den Ordner _/dist_ kann über den Befehl `ng build --prod` gestartet werden 
