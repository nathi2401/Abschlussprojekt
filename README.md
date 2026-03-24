# Streaming Insights Dashboard

Lokales React/TypeScript-Dashboard zur interaktiven Analyse von Amazon Prime Video, Netflix und Disney+ mit Fokus auf Filme vs. TV-Shows, Genre-Vergleiche, Altersfreigaben, Laufzeiten, Staffelanzahlen und saisonale Veröffentlichungen.

## Start lokal

```bash
npm install
npm run dev
```

Optional:

```bash
npm run build
npm run preview
```

## Features

- React + TypeScript + Vite
- Tailwind CSS für ein dunkles, modernes Dashboard-Design
- Recharts für interaktive Visualisierungen
- CSV-Import über die UI
- Lokale Standard-Datenquelle unter `public/data/titles_flat_combined.csv`
- KPI-Cards, Vergleichscharts, Heatmap-Matrix und filterbare Datentabelle

## Datenquelle austauschen

Standardmäßig lädt die App `public/data/titles_flat_combined.csv`.

Du kannst echte Daten auf zwei Arten einfügen:

1. Die Datei `public/data/titles_flat_combined.csv` ersetzen.
2. In der laufenden App den Button `CSV importieren` verwenden.

## Erwartete CSV-Felder

- `title_id`
- `platform` oder `platform_code`
- `type`
- `title`
- `genres`
- `rating_standard` oder `rating_original`
- `release_year`
- `date_added_month`
- `date_added_iso`
- `runtime_minutes`
- `seasons_count`
- `country`
- `language`
- `description`

## Wichtige Einstiegspunkte

- Datenmodell: `src/types/streaming.ts`
- Parsing und Normalisierung: `src/utils/csv.ts`, `src/utils/normalizers.ts`
- Aggregationen: `src/utils/analytics.ts`
- Dashboard-UI: `src/pages/DashboardPage.tsx`
