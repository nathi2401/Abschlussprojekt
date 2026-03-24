# Streaming-Analyse Dashboard

Dieses Projekt ist eine lokale Webanwendung zur interaktiven Analyse von Amazon Prime Video, Netflix und Disney+.
Die App läuft komplett lokal mit React, TypeScript, Vite, Tailwind CSS und Recharts.

Wichtig:
Die aktive Anwendung liegt im Ordner `streaming-dashboard`.
Falls im Workspace noch andere Ordner wie `src`, `public` oder alte Projektdateien außerhalb von `streaming-dashboard` sichtbar sind, gehören sie nicht zum aktiven Dashboard-Projekt.

## 1. Projektziel

Die Anwendung vergleicht Inhalte von:

- Amazon Prime Video
- Netflix
- Disney+

Sie zeigt unter anderem:

- Gesamtanzahl von Titeln
- Vergleich von Filmen und TV-Serien
- Genre-Verteilungen
- Plattformpräferenzen
- Laufzeit-Auswertungen
- älteste Filme und TV-Serien
- Serien nach Staffelanzahl
- filterbare Titelliste mit Detailansicht

## 2. Verwendeter Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- lokale CSV-Datenquelle

## 3. Relevante Projektstruktur

Nur dieser Ordner ist für das Dashboard wichtig:

```text
streaming-dashboard/
├─ public/
│  └─ data/
│     └─ titles_flat_combined.csv
├─ src/
│  ├─ components/
│  │  ├─ charts/
│  │  └─ common/
│  ├─ config/
│  ├─ context/
│  ├─ data/
│  ├─ hooks/
│  ├─ pages/
│  ├─ services/
│  ├─ types/
│  ├─ utils/
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## 4. Was die wichtigsten Ordner machen

### `src/components/charts`

Enthält die Diagramme, zum Beispiel:

- Genre-Vergleich
- Plattformvergleich
- Laufzeit-Auswertung
- Heatmap
- Donut-/Kreisdiagramm

### `src/components/common`

Enthält wiederverwendbare UI-Bausteine:

- Karten
- Filterleiste
- Datenliste
- Ladeanzeige
- Detail-Modal

### `src/pages`

Enthält die gerenderte Hauptseite:

- `DashboardPage.tsx`

### `src/hooks`

Enthält die zentrale Datenlogik:

- Laden
- Filtern
- Aufbereiten
- Berechnen der Kennzahlen

### `src/services`

Enthält die Datenlade-Schicht:

- Einlesen der CSV
- Mapping auf das App-Datenmodell

### `src/utils`

Hilfsfunktionen für:

- CSV-Parsing
- Normalisierung
- Aggregation
- Statistik

### `src/types`

Gemeinsame TypeScript-Typen für das ganze Projekt.

### `public/data`

Hier liegt die aktuell verwendete CSV-Datei:

- `titles_flat_combined.csv`

## 5. Voraussetzungen

Bevor du das Projekt startest, brauchst du:

- Node.js 18 oder neuer
- npm

Prüfen kannst du das in PowerShell mit:

```bash
node -v
npm -v
```

## 6. Projekt lokal starten

### Schritt 1: In den Projektordner wechseln

```bash
cd streaming-dashboard
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Entwicklungsserver starten

```bash
npm run dev
```

### Schritt 4: Im Browser öffnen

Vite zeigt dir danach eine lokale Adresse an, meistens:

```text
http://localhost:5173
```

## 7. Produktions-Build erstellen

Wenn du prüfen möchtest, ob das Projekt produktionsbereit baut:

```bash
npm run build
```

Danach kannst du den Build lokal testen mit:

```bash
npm run preview
```

## 8. Woher die Daten kommen

Die App lädt standardmäßig diese Datei:

```text
public/data/titles_flat_combined.csv
```

Wenn die CSV nicht geladen werden kann, nutzt die App als Fallback:

```text
src/data/mockData.ts
```

## 9. Eigene Daten einfügen

Wenn du später echte Daten einsetzen willst, gehe so vor:

### Schritt 1: CSV ersetzen

Ersetze die Datei:

```text
public/data/titles_flat_combined.csv
```

durch deine eigene Datei.

### Schritt 2: Spalten prüfen

Die App erwartet Felder in dieser Art:

- `id`
- `title`
- `platform`
- `type`
- `genre`
- `age_rating`
- `release_year`
- `release_month`
- `runtime_minutes`
- `seasons`
- `country`
- `date_added`
- `description`

### Schritt 3: Mapping bei Bedarf anpassen

Wenn deine CSV andere Spaltennamen hat, passe diese Datei an:

```text
src/services/dataService.ts
```

### Schritt 4: Normalisierung prüfen

Wenn Plattformnamen, Genres oder Altersfreigaben anders formatiert sind, passe diese Datei an:

```text
src/utils/dataUtils.ts
```

## 10. Zentrale Einstiegspunkte im Code

Wenn du die App weiterentwickeln willst, sind diese Dateien die wichtigsten:

- `src/main.tsx`
- `src/App.tsx`
- `src/pages/DashboardPage.tsx`
- `src/hooks/useDashboardData.ts`
- `src/services/dataService.ts`
- `src/utils/analytics.ts`
- `src/config/theme.ts`

## 11. Typischer Workflow für Änderungen

### Layout oder Design ändern

Starte hier:

- `src/pages/DashboardPage.tsx`
- `src/components/common`
- `src/components/charts`
- `src/index.css`

### Filterlogik ändern

Starte hier:

- `src/components/common/FilterPanel.tsx`
- `src/context/FilterContext.tsx`
- `src/utils/analytics.ts`

### Datenmodell ändern

Starte hier:

- `src/types/index.ts`
- `src/services/dataService.ts`
- `src/utils/dataUtils.ts`

### Diagramme anpassen

Starte hier:

- `src/components/charts`

## 12. Nützliche npm-Befehle

### Entwicklungsserver

```bash
npm run dev
```

### Produktions-Build

```bash
npm run build
```

### Build lokal ansehen

```bash
npm run preview
```

### Optional: Lint ausführen

```bash
npm run lint
```

## 13. Häufige Probleme

### `npm install` funktioniert nicht

Prüfe:

- ob Node.js installiert ist
- ob du dich im Ordner `streaming-dashboard` befindest

### Die Seite zeigt keine Daten

Prüfe:

- ob `public/data/titles_flat_combined.csv` vorhanden ist
- ob die CSV korrekt aufgebaut ist
- ob in der Browser-Konsole Fehler erscheinen

### Änderungen sind nicht sichtbar

Prüfe:

- ob du wirklich im Ordner `streaming-dashboard` arbeitest
- ob du die aktive Datei im richtigen Projekt bearbeitest
- ob Vite neu gestartet werden sollte

## 14. Empfehlung für sauberes Arbeiten im Workspace

Damit es in VS Code übersichtlich bleibt:

- arbeite nur im Ordner `streaming-dashboard`
- öffne idealerweise direkt diesen Ordner als Projekt
- ignoriere ältere oder parallele Test-Strukturen außerhalb dieses Ordners

## 15. Kurzfassung

Projekt starten:

```bash
cd streaming-dashboard
npm install
npm run dev
```

Wichtige Dateien:

- `src/pages/DashboardPage.tsx`
- `src/hooks/useDashboardData.ts`
- `src/services/dataService.ts`
- `src/utils/analytics.ts`
- `public/data/titles_flat_combined.csv`
