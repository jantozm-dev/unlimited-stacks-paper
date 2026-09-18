import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Search, 
  Layers, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  HelpCircle,
  Check,
  Package
} from 'lucide-react';
import { PluginConfig } from '../types/plugin';
import { ALL_MINECRAFT_MATERIALS, DEFAULT_CONFIG } from '../data/minecraftItems';

interface ConfigEditorProps {
  config: PluginConfig;
  onChange: (newConfig: PluginConfig) => void;
  onNavigateToSimulator: () => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ config, onChange, onNavigateToSimulator }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'combat' | 'food' | 'tools' | 'materials' | 'misc'>('all');
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');

  // Handle general limit change
  const handleGeneralLimitChange = (val: number) => {
    const clamped = Math.max(1, Math.min(999, isNaN(val) ? 64 : val));
    onChange({
      ...config,
      generalStackLimit: clamped,
    });
  };

  // Handle individual item limit change
  const handleItemLimitChange = (material: string, val: number) => {
    const clamped = Math.max(1, Math.min(999, isNaN(val) ? 64 : val));
    onChange({
      ...config,
      itemLimits: {
        ...config.itemLimits,
        [material]: clamped,
      },
    });
  };

  // Remove specific item override
  const handleRemoveItem = (material: string) => {
    const updated = { ...config.itemLimits };
    delete updated[material];
    onChange({
      ...config,
      itemLimits: updated,
    });
  };

  // Add new specific item
  const handleAddItem = (material: string, defaultLimit: number = 64) => {
    onChange({
      ...config,
      itemLimits: {
        ...config.itemLimits,
        [material]: defaultLimit,
      },
    });
    setAddingMaterial(false);
    setMaterialSearch('');
  };

  // Apply Presets
  const applyPreset = (preset: 'qol' | 'max99' | 'vanilla_plus' | 'anarchy') => {
    if (preset === 'qol') {
      onChange({
        ...config,
        generalStackLimit: 64,
        itemLimits: {
          ENDER_PEARL: 64,
          SNOWBALL: 64,
          EGG: 64,
          POTION: 16,
          SPLASH_POTION: 16,
          LINGERING_POTION: 16,
          TOTEM_OF_UNDYING: 16,
          OAK_BOAT: 16,
          MINECART: 16,
          SADDLE: 16,
          MUSHROOM_STEW: 16,
          RABBIT_STEW: 16,
          SUSPICIOUS_STEW: 16,
          LAVA_BUCKET: 16,
          WATER_BUCKET: 16,
          HONEY_BOTTLE: 64,
        },
      });
    } else if (preset === 'max99') {
      onChange({
        ...config,
        generalStackLimit: 99,
        itemLimits: {
          ENDER_PEARL: 99,
          SNOWBALL: 99,
          EGG: 99,
          POTION: 99,
          SPLASH_POTION: 99,
          TOTEM_OF_UNDYING: 99,
          ENCHANTED_GOLDEN_APPLE: 99,
          GOLDEN_APPLE: 99,
          OAK_BOAT: 99,
          MINECART: 99,
          SADDLE: 99,
          MUSHROOM_STEW: 99,
          LAVA_BUCKET: 99,
          WATER_BUCKET: 99,
        },
      });
    } else if (preset === 'vanilla_plus') {
      onChange({
        ...config,
        generalStackLimit: 64,
        itemLimits: {
          ENDER_PEARL: 64,
          SNOWBALL: 64,
          EGG: 64,
          HONEY_BOTTLE: 64,
          OAK_BOAT: 16,
          MINECART: 16,
          SADDLE: 16,
        },
      });
    } else if (preset === 'anarchy') {
      onChange({
        ...config,
        generalStackLimit: 128,
        itemLimits: {
          TOTEM_OF_UNDYING: 64,
          ENCHANTED_GOLDEN_APPLE: 128,
          POTION: 64,
          SPLASH_POTION: 64,
          ENDER_PEARL: 128,
          DIAMOND: 128,
          NETHERITE_INGOT: 128,
          BOW: 16,
          CROSSBOW: 16,
        },
      });
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    onChange({ ...DEFAULT_CONFIG });
  };

  // Filter items in custom limits table
  const customItemsList = Object.entries(config.itemLimits).map(([material, limit]) => {
    const meta = ALL_MINECRAFT_MATERIALS.find((m) => m.material === material) || {
      material,
      displayName: material.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      vanillaMax: 64,
      category: 'misc' as const,
      icon: '📦',
    };
    return {
      ...meta,
      limit,
    };
  });

  const filteredItems = customItemsList.filter((item) => {
    const matchesSearch =
      item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Available items not yet added
  const availableToAdd = ALL_MINECRAFT_MATERIALS.filter(
    (m) => !config.itemLimits[m.material] &&
      (m.displayName.toLowerCase().includes(materialSearch.toLowerCase()) ||
       m.material.toLowerCase().includes(materialSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-stone-100">Paper Stack Limit Rules</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Configure your server's default general limit and craft item-specific rules in <code className="text-emerald-400 font-mono bg-stone-950 px-1 py-0.5 rounded">config.yml</code>. 
              Modern Paper 1.20.5+ through 1.26 uses native Minecraft <code className="text-stone-300 font-mono">max_stack_size</code> components so custom stacks display seamlessly on vanilla clients.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-400 font-medium mr-1">Presets:</span>
            <button
              id="preset-qol"
              onClick={() => applyPreset('qol')}
              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 transition cursor-pointer"
            >
              Quality of Life
            </button>
            <button
              id="preset-max99"
              onClick={() => applyPreset('max99')}
              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 transition cursor-pointer"
            >
              Max Vanilla 99x
            </button>
            <button
              id="preset-vanilla"
              onClick={() => applyPreset('vanilla_plus')}
              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-blue-400 border border-stone-700 transition cursor-pointer"
            >
              Vanilla+ Essentials
            </button>
            <button
              id="preset-anarchy"
              onClick={() => applyPreset('anarchy')}
              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-rose-400 border border-stone-700 transition cursor-pointer"
            >
              PVP / Anarchy
            </button>
            <button
              id="preset-reset"
              onClick={handleResetToDefault}
              className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition cursor-pointer"
              title="Reset to default config"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left column General Limit & Settings, Right column Specific Item Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: General Limit & Automation Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Stack Limit Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-stone-200">General Stack Limit</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Default: {config.generalStackLimit}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1.5">
              The fallback maximum stack size applied across all normal items unless specifically overridden below.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="general-limit-slider"
                  type="range"
                  min="1"
                  max="128"
                  value={config.generalStackLimit}
                  onChange={(e) => handleGeneralLimitChange(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <input
                  id="general-limit-input"
                  type="number"
                  min="1"
                  max="999"
                  value={config.generalStackLimit}
                  onChange={(e) => handleGeneralLimitChange(parseInt(e.target.value, 10))}
                  className="w-20 px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono text-sm text-center focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick limit presets */}
              <div className="flex items-center gap-1.5">
                {[16, 32, 64, 99, 128].map((presetVal) => (
                  <button
                    key={presetVal}
                    onClick={() => handleGeneralLimitChange(presetVal)}
                    className={`px-2.5 py-1 text-xs rounded font-mono transition cursor-pointer ${
                      config.generalStackLimit === presetVal
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    {presetVal}
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2 mt-2">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300">Client Note:</strong> Minecraft 1.20.5+ to 1.26 clients render numbers up to <strong>99</strong> in slot badge badges natively without mods. Limits higher than 99 still stack server-side!
                </span>
              </div>
            </div>
          </div>

          {/* Plugin Automations & Rules */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Stack Enforcement Rules</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.autoApplyOnPickup}
                  onChange={(e) => onChange({ ...config, autoApplyOnPickup: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-stone-800 border-stone-700 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 transition">
                    Auto-apply on Item Pickup
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Boosts max stack size immediately when a player picks up dropped items from the ground.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.autoApplyOnCraft}
                  onChange={(e) => onChange({ ...config, autoApplyOnCraft: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-stone-800 border-stone-700 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 transition">
                    Auto-apply on Crafting
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Applies custom stack limits to crafted results on crafting tables and inventory grids.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.autoApplyOnInventoryOpen}
                  onChange={(e) => onChange({ ...config, autoApplyOnInventoryOpen: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-stone-800 border-stone-700 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 transition">
                    Auto-apply on Inventory Open
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Audits player slots when opening inventories to ensure previously unstacked items receive the higher stack.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.applyToExistingContainers}
                  onChange={(e) => onChange({ ...config, applyToExistingContainers: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-stone-800 border-stone-700 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 transition">
                    Upgrade Existing Containers
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Scans chests, barrels, and shulker boxes when opened to convert items inside to higher stack capabilities.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.enableSoundFeedback}
                  onChange={(e) => onChange({ ...config, enableSoundFeedback: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-stone-800 border-stone-700 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 transition">
                    Item Sound Feedback
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Plays subtle pickup audio chime when an item stack limit is automatically boosted.
                  </p>
                </div>
              </label>
            </div>

            {/* Bypass permission input */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                <span>Bypass Permission</span>
              </label>
              <input
                type="text"
                value={config.bypassPermission}
                onChange={(e) => onChange({ ...config, bypassPermission: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
                placeholder="higherstacks.bypass"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Players with this permission are exempt from stack size modifications (useful for testing).
              </p>
            </div>
          </div>
        </div>

        {/* Right: Specific Item Limits Override Table & Adder */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-stone-100">Specific Item Limits</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-300 border border-stone-700">
                    {Object.keys(config.itemLimits).length} configured
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Set unique maximum stack counts for specific items (e.g. Ender Pearls, Potions, Totems).
                </p>
              </div>

              <button
                id="add-item-override-btn"
                onClick={() => setAddingMaterial(!addingMaterial)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Override</span>
              </button>
            </div>

            {/* Add Material Dropdown Search Panel */}
            {addingMaterial && (
              <div className="my-4 p-4 rounded-xl bg-stone-950 border border-emerald-500/40 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Select Item to Add Override</span>
                  <button
                    onClick={() => setAddingMaterial(false)}
                    className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Search item (e.g., Bow, Elytra, Bucket, Sword, Netherite)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {availableToAdd.length === 0 ? (
                    <p className="text-xs text-stone-500 py-2 text-center">
                      No matching items found or all matching items already added.
                    </p>
                  ) : (
                    availableToAdd.slice(0, 15).map((mat) => (
                      <div
                        key={mat.material}
                        onClick={() => handleAddItem(mat.material, mat.vanillaMax === 1 ? 16 : 64)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-850 hover:border-emerald-500/50 border border-stone-800 transition cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{mat.icon}</span>
                          <div>
                            <span className="font-medium text-stone-200">{mat.displayName}</span>
                            <span className="text-[10px] text-stone-400 ml-2 font-mono">{mat.material}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-400">Vanilla: {mat.vanillaMax}</span>
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                            + Add
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 my-4">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter configured items..."
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-stone-700"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-[11px]">
                {(['all', 'combat', 'food', 'tools', 'materials', 'misc'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-md capitalize transition cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-stone-700 text-stone-100 font-semibold'
                        : 'text-stone-400 hover:text-stone-200 bg-stone-950/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Configured Items */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No items match the filter. Click "Add Item Override" to add custom rules.
                </div>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <div
                      key={item.material}
                      className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-stone-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-lg shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-stone-200">{item.displayName}</h4>
                            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-1.5 py-0.2 rounded border border-stone-800">
                              {item.material}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                            <span>Vanilla: <strong className="text-stone-300">{item.vanillaMax}</strong></span>
                            <span>•</span>
                            <span>Boost: <strong className="text-emerald-400">{Math.round((item.limit / item.vanillaMax) * 10) / 10}x</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Custom Limit Adjuster */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex items-center gap-1 bg-stone-900 border border-stone-700 rounded-lg p-1">
                          <button
                            onClick={() => handleItemLimitChange(item.material, Math.max(1, item.limit - 1))}
                            className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center justify-center cursor-pointer transition"
                            title="Decrease limit"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={item.limit}
                            onChange={(e) => handleItemLimitChange(item.material, parseInt(e.target.value, 10))}
                            className="w-14 text-center bg-transparent text-xs font-mono font-bold text-emerald-400 focus:outline-none"
                          />
                          <button
                            onClick={() => handleItemLimitChange(item.material, Math.min(999, item.limit + 1))}
                            className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center justify-center cursor-pointer transition"
                            title="Increase limit"
                          >
                            +
                          </button>
                        </div>

                        {/* Quick options */}
                        <div className="hidden sm:flex items-center gap-1">
                          {[16, 64, 99].map((q) => (
                            <button
                              key={q}
                              onClick={() => handleItemLimitChange(item.material, q)}
                              className={`px-1.5 py-0.5 text-[10px] rounded font-mono transition cursor-pointer ${
                                item.limit === q
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold'
                                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>

                        {/* Remove override */}
                        <button
                          onClick={() => handleRemoveItem(item.material)}
                          className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-stone-900 rounded-lg transition cursor-pointer"
                          title="Remove custom limit override"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom action to test in simulator */}
            <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Want to test how these stack limits feel in a real inventory?
              </span>
              <button
                onClick={onNavigateToSimulator}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test in Live Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
