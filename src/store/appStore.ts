import { DEFAULT_EMOTE_IDS, DEFAULT_APIS } from "@/data/emotes";

const STORAGE_KEYS = {
  USER_PASSWORD: "mehedi",
  ADMIN_PASSWORD: "1122",
  CUSTOM_EMOTES: "coming_soon",
  MAINTENANCE: "starff_maintenance",
  SERVER_APIS: "starff_server_apis",
  AUTH: "starff_auth",
};

export function getUserPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.USER_PASSWORD) || "259076";
}

export function setUserPassword(pw: string) {
  localStorage.setItem(STORAGE_KEYS.USER_PASSWORD, pw);
}

export function getAdminPassword(): string {
  return "STAR";
}

export function getCustomEmotes(): string[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_EMOTES);
  return stored ? JSON.parse(stored) : [];
}

export function addCustomEmote(emoteId: string) {
  const emotes = getCustomEmotes();
  if (!emotes.includes(emoteId)) {
    emotes.push(emoteId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EMOTES, JSON.stringify(emotes));
  }
}

export function getAllEmotes(): string[] {
  return [...DEFAULT_EMOTE_IDS, ...getCustomEmotes()];
}

export function isMaintenance(): boolean {
  return localStorage.getItem(STORAGE_KEYS.MAINTENANCE) === "true";
}

export function setMaintenance(val: boolean) {
  localStorage.setItem(STORAGE_KEYS.MAINTENANCE, val.toString());
}

export function getServerApis(): Record<string, string> {
  const stored = localStorage.getItem(STORAGE_KEYS.SERVER_APIS);
  return stored ? JSON.parse(stored) : { ...DEFAULT_APIS };
}

export function setServerApis(apis: Record<string, string>) {
  localStorage.setItem(STORAGE_KEYS.SERVER_APIS, JSON.stringify(apis));
}

export function isAuthenticated(): "user" | "admin" | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH) as "user" | "admin" | null;
}

export function setAuth(role: "user" | "admin" | null) {
  if (role) localStorage.setItem(STORAGE_KEYS.AUTH, role);
  else localStorage.removeItem(STORAGE_KEYS.AUTH);
}
