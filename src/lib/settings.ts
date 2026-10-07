export type Settings = { name: string; tone: string; hours: string };
const KEY = "ara-settings";
export const defaults: Settings = { name: "", tone: "Formal", hours: "09:00-17:00" };

export function readSettings(): Settings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaults;
  }
}
export function saveSettings(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
