import { ItemLimit } from '../types/plugin';

export const POPULAR_ITEMS: ItemLimit[] = [
  {
    material: 'ENDER_PEARL',
    displayName: 'Ender Pearl',
    vanillaMax: 16,
    customMax: 64,
    category: 'misc',
    icon: '🔮'
  },
  {
    material: 'POTION',
    displayName: 'Potion',
    vanillaMax: 1,
    customMax: 16,
    category: 'food',
    icon: '🧪'
  },
  {
    material: 'SPLASH_POTION',
    displayName: 'Splash Potion',
    vanillaMax: 1,
    customMax: 16,
    category: 'combat',
    icon: '💥'
  },
  {
    material: 'LINGERING_POTION',
    displayName: 'Lingering Potion',
    vanillaMax: 1,
    customMax: 16,
    category: 'combat',
    icon: '🌫️'
  },
  {
    material: 'TOTEM_OF_UNDYING',
    displayName: 'Totem of Undying',
    vanillaMax: 1,
    customMax: 16,
    category: 'combat',
    icon: '🗿'
  },
  {
    material: 'SNOWBALL',
    displayName: 'Snowball',
    vanillaMax: 16,
    customMax: 64,
    category: 'combat',
    icon: '❄️'
  },
  {
    material: 'EGG',
    displayName: 'Egg',
    vanillaMax: 16,
    customMax: 64,
    category: 'food',
    icon: '🥚'
  },
  {
    material: 'ENCHANTED_GOLDEN_APPLE',
    displayName: 'Enchanted Golden Apple',
    vanillaMax: 64,
    customMax: 99,
    category: 'food',
    icon: '✨'
  },
  {
    material: 'GOLDEN_APPLE',
    displayName: 'Golden Apple',
    vanillaMax: 64,
    customMax: 99,
    category: 'food',
    icon: '🍏'
  },
  {
    material: 'OAK_BOAT',
    displayName: 'Oak Boat',
    vanillaMax: 1,
    customMax: 16,
    category: 'misc',
    icon: '🛶'
  },
  {
    material: 'MINECART',
    displayName: 'Minecart',
    vanillaMax: 1,
    customMax: 16,
    category: 'misc',
    icon: '🛒'
  },
  {
    material: 'SADDLE',
    displayName: 'Saddle',
    vanillaMax: 1,
    customMax: 16,
    category: 'misc',
    icon: '🐎'
  },
  {
    material: 'MUSHROOM_STEW',
    displayName: 'Mushroom Stew',
    vanillaMax: 1,
    customMax: 16,
    category: 'food',
    icon: '🍲'
  },
  {
    material: 'RABBIT_STEW',
    displayName: 'Rabbit Stew',
    vanillaMax: 1,
    customMax: 16,
    category: 'food',
    icon: '🥣'
  },
  {
    material: 'SUSPICIOUS_STEW',
    displayName: 'Suspicious Stew',
    vanillaMax: 1,
    customMax: 16,
    category: 'food',
    icon: '🍄'
  },
  {
    material: 'LAVA_BUCKET',
    displayName: 'Lava Bucket',
    vanillaMax: 1,
    customMax: 16,
    category: 'tools',
    icon: '🌋'
  },
  {
    material: 'WATER_BUCKET',
    displayName: 'Water Bucket',
    vanillaMax: 1,
    customMax: 16,
    category: 'tools',
    icon: '💧'
  },
  {
    material: 'MILK_BUCKET',
    displayName: 'Milk Bucket',
    vanillaMax: 1,
    customMax: 16,
    category: 'food',
    icon: '🥛'
  },
  {
    material: 'HONEY_BOTTLE',
    displayName: 'Honey Bottle',
    vanillaMax: 16,
    customMax: 64,
    category: 'food',
    icon: '🍯'
  },
  {
    material: 'BOW',
    displayName: 'Bow',
    vanillaMax: 1,
    customMax: 8,
    category: 'combat',
    icon: '🏹'
  },
  {
    material: 'CROSSBOW',
    displayName: 'Crossbow',
    vanillaMax: 1,
    customMax: 8,
    category: 'combat',
    icon: '🎯'
  },
  {
    material: 'SHIELD',
    displayName: 'Shield',
    vanillaMax: 1,
    customMax: 8,
    category: 'combat',
    icon: '🛡️'
  },
  {
    material: 'DIAMOND',
    displayName: 'Diamond',
    vanillaMax: 64,
    customMax: 99,
    category: 'materials',
    icon: '💎'
  },
  {
    material: 'NETHERITE_INGOT',
    displayName: 'Netherite Ingot',
    vanillaMax: 64,
    customMax: 99,
    category: 'materials',
    icon: '⬛'
  },
  {
    material: 'IRON_INGOT',
    displayName: 'Iron Ingot',
    vanillaMax: 64,
    customMax: 99,
    category: 'materials',
    icon: '🔩'
  },
  {
    material: 'COBBLESTONE',
    displayName: 'Cobblestone',
    vanillaMax: 64,
    customMax: 99,
    category: 'materials',
    icon: '🪨'
  }
];

export const ALL_MINECRAFT_MATERIALS: { material: string; displayName: string; vanillaMax: number; category: ItemLimit['category']; icon: string }[] = [
  ...POPULAR_ITEMS,
  { material: 'ACACIA_BOAT', displayName: 'Acacia Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'BIRCH_BOAT', displayName: 'Birch Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'CHERRY_BOAT', displayName: 'Cherry Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'SPRUCE_BOAT', displayName: 'Spruce Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'JUNGLE_BOAT', displayName: 'Jungle Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'DARK_OAK_BOAT', displayName: 'Dark Oak Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'MANGROVE_BOAT', displayName: 'Mangrove Boat', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'BAMBOO_RAFT', displayName: 'Bamboo Raft', vanillaMax: 1, category: 'misc', icon: '🛶' },
  { material: 'BUCKET', displayName: 'Empty Bucket', vanillaMax: 16, category: 'tools', icon: '🪣' },
  { material: 'POWDER_SNOW_BUCKET', displayName: 'Powder Snow Bucket', vanillaMax: 1, category: 'tools', icon: '❄️' },
  { material: 'AXOLOTL_BUCKET', displayName: 'Axolotl Bucket', vanillaMax: 1, category: 'tools', icon: '🦎' },
  { material: 'TADPOLE_BUCKET', displayName: 'Tadpole Bucket', vanillaMax: 1, category: 'tools', icon: '🐸' },
  { material: 'COD_BUCKET', displayName: 'Cod Bucket', vanillaMax: 1, category: 'tools', icon: '🐟' },
  { material: 'SALMON_BUCKET', displayName: 'Salmon Bucket', vanillaMax: 1, category: 'tools', icon: '🐠' },
  { material: 'PUFFERFISH_BUCKET', displayName: 'Pufferfish Bucket', vanillaMax: 1, category: 'tools', icon: '🐡' },
  { material: 'TROPICAL_FISH_BUCKET', displayName: 'Tropical Fish Bucket', vanillaMax: 1, category: 'tools', icon: '🐟' },
  { material: 'CHEST_MINECART', displayName: 'Minecart with Chest', vanillaMax: 1, category: 'misc', icon: '🛒' },
  { material: 'FURNACE_MINECART', displayName: 'Minecart with Furnace', vanillaMax: 1, category: 'misc', icon: '🛒' },
  { material: 'TNT_MINECART', displayName: 'Minecart with TNT', vanillaMax: 1, category: 'misc', icon: '🛒' },
  { material: 'HOPPER_MINECART', displayName: 'Minecart with Hopper', vanillaMax: 1, category: 'misc', icon: '🛒' },
  { material: 'FISHING_ROD', displayName: 'Fishing Rod', vanillaMax: 1, category: 'tools', icon: '🎣' },
  { material: 'FLINT_AND_STEEL', displayName: 'Flint and Steel', vanillaMax: 1, category: 'tools', icon: '🔥' },
  { material: 'SHEARS', displayName: 'Shears', vanillaMax: 1, category: 'tools', icon: '✂️' },
  { material: 'COMPASS', displayName: 'Compass', vanillaMax: 64, category: 'tools', icon: '🧭' },
  { material: 'CLOCK', displayName: 'Clock', vanillaMax: 64, category: 'tools', icon: '⏰' },
  { material: 'SPYGLASS', displayName: 'Spyglass', vanillaMax: 1, category: 'tools', icon: '🔭' },
  { material: 'TRIDENT', displayName: 'Trident', vanillaMax: 1, category: 'combat', icon: '🔱' },
  { material: 'MACE', displayName: 'Mace', vanillaMax: 1, category: 'combat', icon: '🔨' },
  { material: 'WIND_CHARGE', displayName: 'Wind Charge', vanillaMax: 64, category: 'combat', icon: '💨' },
  { material: 'FIREWORK_ROCKET', displayName: 'Firework Rocket', vanillaMax: 64, category: 'misc', icon: '🎆' },
  { material: 'CAKE', displayName: 'Cake', vanillaMax: 1, category: 'food', icon: '🎂' },
  { material: 'WRITABLE_BOOK', displayName: 'Book and Quill', vanillaMax: 1, category: 'misc', icon: '📖' },
  { material: 'ENCHANTED_BOOK', displayName: 'Enchanted Book', vanillaMax: 1, category: 'misc', icon: '📕' },
  { material: 'LEAD', displayName: 'Lead', vanillaMax: 64, category: 'misc', icon: '🪢' },
  { material: 'NAME_TAG', displayName: 'Name Tag', vanillaMax: 64, category: 'misc', icon: '🏷️' },
  { material: 'DIAMOND_SWORD', displayName: 'Diamond Sword', vanillaMax: 1, category: 'combat', icon: '🗡️' },
  { material: 'NETHERITE_SWORD', displayName: 'Netherite Sword', vanillaMax: 1, category: 'combat', icon: '🗡️' },
  { material: 'DIAMOND_PICKAXE', displayName: 'Diamond Pickaxe', vanillaMax: 1, category: 'tools', icon: '⛏️' },
  { material: 'NETHERITE_PICKAXE', displayName: 'Netherite Pickaxe', vanillaMax: 1, category: 'tools', icon: '⛏️' },
  { material: 'DIAMOND_AXE', displayName: 'Diamond Axe', vanillaMax: 1, category: 'tools', icon: '🪓' },
  { material: 'NETHERITE_AXE', displayName: 'Netherite Axe', vanillaMax: 1, category: 'tools', icon: '🪓' },
  { material: 'DIAMOND_HELMET', displayName: 'Diamond Helmet', vanillaMax: 1, category: 'combat', icon: '🪖' },
  { material: 'DIAMOND_CHESTPLATE', displayName: 'Diamond Chestplate', vanillaMax: 1, category: 'combat', icon: '🦺' },
  { material: 'DIAMOND_LEGGINGS', displayName: 'Diamond Leggings', vanillaMax: 1, category: 'combat', icon: '👖' },
  { material: 'DIAMOND_BOOTS', displayName: 'Diamond Boots', vanillaMax: 1, category: 'combat', icon: '👢' },
  { material: 'ELYTRA', displayName: 'Elytra', vanillaMax: 1, category: 'combat', icon: '🪽' }
];

export const DEFAULT_CONFIG: {
  generalStackLimit: number;
  autoApplyOnPickup: boolean;
  autoApplyOnCraft: boolean;
  autoApplyOnInventoryOpen: boolean;
  applyToExistingContainers: boolean;
  bypassPermission: string;
  enableSoundFeedback: boolean;
  itemLimits: Record<string, number>;
} = {
  generalStackLimit: 64,
  autoApplyOnPickup: true,
  autoApplyOnCraft: true,
  autoApplyOnInventoryOpen: true,
  applyToExistingContainers: true,
  bypassPermission: 'higherstacks.bypass',
  enableSoundFeedback: true,
  itemLimits: {
    ENDER_PEARL: 64,
    SNOWBALL: 64,
    EGG: 64,
    POTION: 16,
    SPLASH_POTION: 16,
    LINGERING_POTION: 16,
    TOTEM_OF_UNDYING: 16,
    ENCHANTED_GOLDEN_APPLE: 99,
    GOLDEN_APPLE: 99,
    OAK_BOAT: 16,
    MINECART: 16,
    SADDLE: 16,
    MUSHROOM_STEW: 16,
    LAVA_BUCKET: 16,
    WATER_BUCKET: 16,
    HONEY_BOTTLE: 64
  }
};
