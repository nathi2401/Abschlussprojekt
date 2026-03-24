import { SECTION_TABS } from "../../utils/constants";

interface NavTabsProps {
  activeTab: string;
  onSelect: (tabId: string) => void;
}

export const NavTabs = ({ activeTab, onSelect }: NavTabsProps) => (
  <nav className="flex flex-wrap gap-2">
    {SECTION_TABS.map((tab) => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active
              ? "bg-white text-surface-950"
              : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);
