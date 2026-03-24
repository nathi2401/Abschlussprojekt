import React, { createContext, useContext, useMemo, useState } from "react";
import { FiltersState } from "../types";

type FilterContextValue = {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  resetFilters: () => void;
};

const initialFilters: FiltersState = {
  platform: "All",
  type: "All",
  genre: "All",
  age_rating: "All",
  release_year: "All",
  runtime_min: 0,
  runtime_max: 240,
  query: ""
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters: () => setFilters(initialFilters)
    }),
    [filters]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
};
