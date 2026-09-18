import React, { useState } from 'react';
import { Sparkles, Trash2, ArrowUpRight, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { PluginConfig } from '../types/plugin';
import { ALL_MINECRAFT_MATERIALS } from '../data/minecraftItems';

interface InventorySimulatorProps {
  config: PluginConfig;
}

interface SlotItem {
  id: string;
  material: string;
  displayName: string;
  count: number;
  icon: string;
  vanillaMax: number;
}

export const InventorySimulator: React.FC<InventorySimulatorProps> = ({ config }) => {
  // 36 inventory slots: indices 0-26 (Main inventory), indices 27-35 (Hotbar)
  const [slots, setSlots] = useState<(SlotItem | null)[]>(() => {
    const initial = new Array(36).fill(null);
    // Initial sample items to show stacking
    initial[27] = {
      id: 'pearl-1',
      material: 'ENDER_PEARL',
      displayName: 'Ender Pearl',
      count: 16,
      icon: '🔮',
      vanillaMax: 16,
    };
    initial[28] = {
      id: 'pearl-2',
      material: 'ENDER_PEARL',
      displayName: 'Ender Pearl',
      count: 16,
      icon: '🔮',
      vanillaMax: 16,
    };
    initial[29] = {
      id: 'totem-1',
      material: 'TOTEM_OF_UNDYING',
      displayName: 'Totem of Undying',
      count: 4,
      icon: '🗿',
      vanillaMax: 1,
    };
    initial[30] = {
      id: 'potion-1',
      material: 'POTION',
      displayName: 'Potion of Healing',
      count: 8,
      icon: '🧪',
      vanillaMax: 1,
    };
    initial[31] = {
      id: 'snowball-1',
      material: 'SNOWBALL',
      displayName: 'Snowball',
      count: 32,
      icon: '❄️',
      vanillaMax: 16,
    };
    return initial;
  });

  const [cursorItem, setCursorItem] = useState<SlotItem | null>(null);
  const [logMessage, setLogMessage] = useState<string>(
    'Simulating Paper 1.26 StackListener: Click items to pick up, and click onto matching items to merge up to your configured limits!'
  );

  // Helper to resolve max stack based on current config
  const getMaxStack = (material: string): number => {
    if (config.itemLimits[material]) {
      return config.itemLimits[material];
    }
    const vanilla = ALL_MINECRAFT_MATERIALS.find((m) => m.material === material)?.vanillaMax || 64;
    return Math.max(vanilla, config.generalStackLimit);
  };

  // Slot click handler
  const handleSlotClick = (index: number) => {
    const current = slots[index];

    // Case 1: Cursor has item, slot is empty -> place cursor into slot
    if (cursorItem && !current) {
      const nextSlots = [...slots];
      nextSlots[index] = cursorItem;
      setSlots(nextSlots);
      setCursorItem(null);
      setLogMessage(`Placed ${cursorItem.count}x ${cursorItem.displayName} into slot #${index + 1}.`);
      return;
    }

    // Case 2: Cursor has item, slot has same item -> merge up to custom max stack!
    if (cursorItem && current && cursorItem.material === current.material) {
      const allowedMax = getMaxStack(current.material);
      const total = current.count + cursorItem.count;

      if (total <= allowedMax) {
        const nextSlots = [...slots];
        nextSlots[index] = { ...current, count: total };
        setSlots(nextSlots);
        setCursorItem(null);
        setLogMessage(
          `Merged stacks! ${current.displayName} is now stacked to ${total} / ${allowedMax} (Vanilla limit was ${current.vanillaMax}).`
        );
      } else {
        const placeAmount = allowedMax - current.count;
        if (placeAmount > 0) {
          const nextSlots = [...slots];
          nextSlots[index] = { ...current, count: allowedMax };
          setSlots(nextSlots);
          setCursorItem({ ...cursorItem, count: cursorItem.count - placeAmount });
          setLogMessage(
            `Filled slot to max limit ${allowedMax}x. Remaining ${cursorItem.count - placeAmount}x in cursor.`
          );
        } else {
          setLogMessage(`Slot is already at maximum stack limit (${allowedMax}x).`);
        }
      }
      return;
    }

    // Case 3: Cursor has item, slot has different item -> swap items
    if (cursorItem && current && cursorItem.material !== current.material) {
      const nextSlots = [...slots];
      nextSlots[index] = cursorItem;
      setSlots(nextSlots);
      setCursorItem(current);
      setLogMessage(`Swapped ${cursorItem.displayName} with ${current.displayName}.`);
      return;
    }

    // Case 4: Cursor is empty, slot has item -> pick up item
    if (!cursorItem && current) {
      const nextSlots = [...slots];
      nextSlots[index] = null;
      setSlots(nextSlots);
      setCursorItem(current);
      setLogMessage(`Picked up ${current.count}x ${current.displayName} (Max Stack: ${getMaxStack(current.material)}).`);
    }
  };

  // Right-click or split
  const handleSlotRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const current = slots[index];

    // If holding item in cursor, place 1 into slot
    if (cursorItem) {
      const allowedMax = getMaxStack(cursorItem.material);
      if (!current) {
        const nextSlots = [...slots];
        nextSlots[index] = { ...cursorItem, count: 1 };
        setSlots(nextSlots);
        if (cursorItem.count === 1) {
          setCursorItem(null);
        } else {
          setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
        }
        setLogMessage(`Placed 1x ${cursorItem.displayName} into slot.`);
      } else if (current.material === cursorItem.material && current.count < allowedMax) {
        const nextSlots = [...slots];
        nextSlots[index] = { ...current, count: current.count + 1 };
        setSlots(nextSlots);
        if (cursorItem.count === 1) {
          setCursorItem(null);
        } else {
          setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
        }
        setLogMessage(`Added 1x to ${current.displayName} (now ${current.count + 1} / ${allowedMax}).`);
      }
      return;
    }

    // If cursor is empty and slot has item, take half
    if (!cursorItem && current && current.count > 1) {
      const takeCount = Math.ceil(current.count / 2);
      const remainCount = current.count - takeCount;
      const nextSlots = [...slots];
      nextSlots[index] = { ...current, count: remainCount };
      setSlots(nextSlots);
      setCursorItem({ ...current, count: takeCount });
      setLogMessage(`Split stack: took ${takeCount}x, left ${remainCount}x.`);
    }
  };

  // Spawn item helper
  const spawnItem = (material: string, count: number) => {
    const meta = ALL_MINECRAFT_MATERIALS.find((m) => m.material === material) || {
      material,
      displayName: material.replace(/_/g, ' '),
      vanillaMax: 64,
      icon: '📦',
    };

    const maxLimit = getMaxStack(material);
    let remainingToSpawn = count;

    const nextSlots = [...slots];

    // 1. Try adding to existing non-full stacks
    for (let i = 0; i < nextSlots.length; i++) {
      if (remainingToSpawn <= 0) break;
      const item = nextSlots[i];
      if (item && item.material === material && item.count < maxLimit) {
        const space = maxLimit - item.count;
        const add = Math.min(space, remainingToSpawn);
        nextSlots[i] = { ...item, count: item.count + add };
        remainingToSpawn -= add;
      }
    }

    // 2. Place in empty slots
    for (let i = 0; i < nextSlots.length; i++) {
      if (remainingToSpawn <= 0) break;
      if (!nextSlots[i]) {
        const place = Math.min(maxLimit, remainingToSpawn);
        nextSlots[i] = {
          id: `${material}-${Date.now()}-${Math.random()}`,
          material,
          displayName: meta.displayName,
          count: place,
          icon: meta.icon,
          vanillaMax: meta.vanillaMax,
        };
        remainingToSpawn -= place;
      }
    }

    setSlots(nextSlots);

    if (remainingToSpawn < count) {
      setLogMessage(
        `Spawned ${count - remainingToSpawn}x ${meta.displayName} (Allowed Max Stack: ${maxLimit}).`
      );
    } else {
      setLogMessage(`Inventory full! Could not spawn items.`);
    }
  };

  const clearInventory = () => {
    setSlots(new Array(36).fill(null));
    setCursorItem(null);
    setLogMessage('Inventory cleared.');
  };

  // Quick preset spawns
  const spawnQoLPreset = () => {
    clearInventory();
    spawnItem('ENDER_PEARL', 64);
    spawnItem('POTION', 16);
    spawnItem('SPLASH_POTION', 16);
    spawnItem('TOTEM_OF_UNDYING', 16);
    spawnItem('SNOWBALL', 64);
    spawnItem('EGG', 64);
    spawnItem('OAK_BOAT', 16);
    spawnItem('MUSHROOM_STEW', 16);
    setLogMessage('Filled inventory with popular Quality of Life stacks!');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Info Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-stone-100">Interactive Paper Inventory Stacking Simulator</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Experience your <code className="text-emerald-400 font-mono">config.yml</code> rules in action! Spawn items, drag and click to merge stacks, and see items combine beyond vanilla limitations up to your custom limits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={spawnQoLPreset}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Fill QoL Stacks</span>
            </button>
            <button
              onClick={clearInventory}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Item Spawner Palette */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4">
        <span className="text-xs font-semibold text-stone-300 block mb-2.5">
          Quick Spawn Test Items (Click to drop into inventory):
        </span>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {[
            { mat: 'ENDER_PEARL', label: '+16 Ender Pearls', count: 16, icon: '🔮' },
            { mat: 'TOTEM_OF_UNDYING', label: '+4 Totems', count: 4, icon: '🗿' },
            { mat: 'POTION', label: '+4 Potions', count: 4, icon: '🧪' },
            { mat: 'SPLASH_POTION', label: '+4 Splash Potions', count: 4, icon: '💥' },
            { mat: 'SNOWBALL', label: '+16 Snowballs', count: 16, icon: '❄️' },
            { mat: 'EGG', label: '+16 Eggs', count: 16, icon: '🥚' },
            { mat: 'OAK_BOAT', label: '+4 Boats', count: 4, icon: '🛶' },
            { mat: 'ENCHANTED_GOLDEN_APPLE', label: '+32 Gapples', count: 32, icon: '✨' },
            { mat: 'DIAMOND', label: '+64 Diamonds', count: 64, icon: '💎' },
            { mat: 'MUSHROOM_STEW', label: '+4 Stews', count: 4, icon: '🍲' },
          ].map((sp) => {
            const limit = getMaxStack(sp.mat);
            return (
              <button
                key={sp.mat}
                onClick={() => spawnItem(sp.mat, sp.count)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/50 text-stone-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{sp.icon}</span>
                <span>{sp.label}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  (cap: {limit})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Minecraft Inventory UI Box */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 flex flex-col items-center select-none shadow-md">
        {/* Floating Cursor Hand */}
        <div className="mb-4 flex items-center gap-3 bg-stone-950 px-4 py-2 rounded-lg border border-stone-800 text-xs">
          <span className="text-stone-400 font-medium">In Cursor / Hand:</span>
          {cursorItem ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{cursorItem.icon}</span>
              <span className="font-semibold text-emerald-400 font-mono">
                {cursorItem.count}x {cursorItem.displayName}
              </span>
              <span className="text-stone-400 text-[11px]">
                (Max Stack: {getMaxStack(cursorItem.material)})
              </span>
            </div>
          ) : (
            <span className="text-stone-500 italic">Empty (Click any slot to pick up)</span>
          )}
        </div>

        {/* Realistic Minecraft Inventory Container */}
        <div className="bg-[#c6c6c6] dark:bg-[#2b2b2b] p-4 rounded-lg border-4 border-[#373737] dark:border-[#1a1a1a] shadow-xl w-full max-w-xl">
          <div className="text-[11px] font-bold text-stone-800 dark:text-stone-300 mb-2 uppercase tracking-wide">
            Survival Inventory (36 Slots)
          </div>

          {/* Main Inventory: 3 rows of 9 */}
          <div className="grid grid-cols-9 gap-1.5 mb-4">
            {slots.slice(0, 27).map((item, i) => {
              const maxCap = item ? getMaxStack(item.material) : 0;
              const isBoosted = item && maxCap > item.vanillaMax;

              return (
                <div
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  onContextMenu={(e) => handleSlotRightClick(e, i)}
                  className="w-full aspect-square bg-[#8b8b8b] dark:bg-[#1f1f1f] rounded border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] dark:border-t-[#141414] dark:border-l-[#141414] dark:border-b-[#3f3f3f] dark:border-r-[#3f3f3f] relative flex items-center justify-center cursor-pointer hover:bg-stone-700/30 transition group"
                  title={
                    item
                      ? `${item.displayName}\nCount: ${item.count}\nServer Max: ${maxCap}\nVanilla Max: ${item.vanillaMax}\n(Left-click merge/swap, Right-click split/add 1)`
                      : `Slot #${i + 1} (Empty)`
                  }
                >
                  {item && (
                    <>
                      <span className="text-xl sm:text-2xl drop-shadow pointer-events-none">
                        {item.icon}
                      </span>
                      <span
                        className={`absolute bottom-0.5 right-1 text-[11px] font-bold font-mono tracking-tight ${
                          isBoosted ? 'text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]'
                        }`}
                      >
                        {item.count}
                      </span>
                      {isBoosted && (
                        <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-1 bg-stone-600/40 my-3 rounded" />

          {/* Hotbar: 1 row of 9 */}
          <div className="text-[10px] font-bold text-stone-700 dark:text-stone-400 mb-1 uppercase tracking-wide">
            Hotbar Slots
          </div>
          <div className="grid grid-cols-9 gap-1.5">
            {slots.slice(27, 36).map((item, idx) => {
              const i = 27 + idx;
              const maxCap = item ? getMaxStack(item.material) : 0;
              const isBoosted = item && maxCap > item.vanillaMax;

              return (
                <div
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  onContextMenu={(e) => handleSlotRightClick(e, i)}
                  className="w-full aspect-square bg-[#8b8b8b] dark:bg-[#1f1f1f] rounded border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] dark:border-t-[#141414] dark:border-l-[#141414] dark:border-b-[#3f3f3f] dark:border-r-[#3f3f3f] relative flex items-center justify-center cursor-pointer hover:bg-stone-700/30 transition group"
                  title={
                    item
                      ? `${item.displayName}\nCount: ${item.count}\nServer Max: ${maxCap}\nVanilla Max: ${item.vanillaMax}`
                      : `Hotbar #${idx + 1} (Empty)`
                  }
                >
                  {item && (
                    <>
                      <span className="text-xl sm:text-2xl drop-shadow pointer-events-none">
                        {item.icon}
                      </span>
                      <span
                        className={`absolute bottom-0.5 right-1 text-[11px] font-bold font-mono tracking-tight ${
                          isBoosted ? 'text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]'
                        }`}
                      >
                        {item.count}
                      </span>
                      {isBoosted && (
                        <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </>
                  )}
                  {/* Slot number badge */}
                  <span className="absolute top-0.5 left-0.5 text-[9px] text-stone-500 font-mono select-none">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulator Console Log */}
        <div className="mt-5 w-full max-w-xl bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs flex items-center gap-2 text-stone-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate font-mono">{logMessage}</span>
        </div>

        {/* Helper Hint */}
        <div className="mt-3 text-center text-xs text-stone-400 max-w-md">
          Tip: <strong className="text-stone-300">Left-Click</strong> to pick up or merge stacks. <strong className="text-stone-300">Right-Click</strong> to split in half or place 1 item at a time.
        </div>
      </div>
    </div>
  );
};
