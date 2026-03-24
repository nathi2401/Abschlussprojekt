export const formatNumber = (value: number) => new Intl.NumberFormat("de-DE").format(value);

export const formatMinutes = (minutes?: number) => {
  if (!minutes || Number.isNaN(minutes)) {
    return "n/a";
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${rest.toString().padStart(2, "0")}m` : `${rest} min`;
};
