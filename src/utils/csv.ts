import Papa from "papaparse";
import type { CsvTitleRecord, StreamingTitle } from "../types/streaming";
import { normalizeCsvRow } from "./normalizers";

export const parseCsvText = (csvText: string): Promise<StreamingTitle[]> =>
  new Promise((resolve, reject) => {
    Papa.parse<CsvTitleRecord>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data.map(normalizeCsvRow)),
      error: (error) => reject(error)
    });
  });

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, "utf-8");
  });
