export interface ItemLimit {
  material: string;
  displayName: string;
  vanillaMax: number;
  customMax: number;
  category: 'tools' | 'combat' | 'food' | 'materials' | 'misc';
  icon: string;
}

export interface PluginConfig {
  generalStackLimit: number;
  autoApplyOnPickup: boolean;
  autoApplyOnCraft: boolean;
  autoApplyOnInventoryOpen: boolean;
  applyToExistingContainers: boolean;
  bypassPermission: string;
  enableSoundFeedback: boolean;
  itemLimits: Record<string, number>;
}

export interface SimulationItem {
  id: string;
  material: string;
  displayName: string;
  count: number;
  maxStack: number;
  icon: string;
  color?: string;
}

export interface GeneratedFile {
  path: string;
  description: string;
  language: string;
  content: string;
}
