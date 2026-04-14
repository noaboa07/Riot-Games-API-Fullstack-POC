export const PLATFORM_TO_REGIONAL: Record<string, string> = {
  na1: "americas",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  euw1: "europe",
  eun1: "europe",
  tr1: "europe",
  ru: "europe",
  kr: "asia",
  jp1: "asia",
  oc1: "sea",
  ph2: "sea",
  sg2: "sea",
  th2: "sea",
  tw2: "sea",
  vn2: "sea",
};

export const PLATFORM_LABELS: Record<string, string> = {
  na1: "NA",
  euw1: "EUW",
  eun1: "EUNE",
  kr: "KR",
  br1: "BR",
  jp1: "JP",
  la1: "LAN",
  la2: "LAS",
  oc1: "OCE",
  tr1: "TR",
  ru: "RU",
};

export const SUPPORTED_PLATFORMS = Object.keys(PLATFORM_LABELS);

export function regionalFor(platform: string) {
  return PLATFORM_TO_REGIONAL[platform.toLowerCase()] ?? "americas";
}
