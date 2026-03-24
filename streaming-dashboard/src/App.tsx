import React from "react";
import { DashboardPage } from "./pages/DashboardPage";

const App: React.FC = () => (
  <div className="min-h-screen bg-[#07111F] text-slate-100">
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#07111F]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-6 xl:px-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Streaming-Analyse</div>
          <div className="mt-1 text-lg font-semibold text-white">Amazon Prime Video, Netflix und Disney+ im Vergleich</div>
        </div>
        <div className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-white">Lokale Auswertung</div>
      </div>
    </header>

    <DashboardPage />
  </div>
);

export default App;
