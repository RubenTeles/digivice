export const MainPanelSections = ["party"] as const;

export type MainPanelSection = (typeof MainPanelSections)[number];
