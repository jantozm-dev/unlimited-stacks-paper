import { PluginConfig } from '../types/plugin';

export function generateYaml(config: PluginConfig): string {
  const customLimitsEntries = Object.entries(config.itemLimits)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mat, limit]) => `  ${mat}: ${limit}`)
    .join('\n');

  return `# ==========================================================
# HigherStacks - Paper Minecraft Java 1.26 Server Plugin
# Author: AI Studio Build
# Official Paper 1.26 DataComponent / ItemMeta MaxStack API
# ==========================================================

# General default stack limit applied to items on the server.
# Minecraft 1.20.5+ / 1.26 natively supports stack numbers up to 99 on client GUI!
general-stack-limit: ${config.generalStackLimit}

# Automatically update stack sizes when players pick up dropped items
auto-apply-on-pickup: ${config.autoApplyOnPickup}

# Automatically update stack sizes when crafting items on workbench/inventory
auto-apply-on-craft: ${config.autoApplyOnCraft}

# Scan and update item stack sizes when players open their inventory
auto-apply-on-inventory-open: ${config.autoApplyOnInventoryOpen}

# Scan and update chest / barrel / shulker box container items when opened
apply-to-existing-containers: ${config.applyToExistingContainers}

# Permission to bypass stack modifications (useful for admins or specific ranks)
bypass-permission: "${config.bypassPermission}"

# Play subtle chime sound when an item stack limit is automatically boosted
enable-sound-feedback: ${config.enableSoundFeedback}

# ==========================================================
# SPECIFIC ITEM LIMITS
# Define custom stack limits for specific Minecraft materials.
# Any item listed here overrides the 'general-stack-limit'.
# Use standard Bukkit / Paper Material names (UPPERCASE).
# ==========================================================
custom-limits:
${customLimitsEntries || '  # Example: ENDER_PEARL: 64'}
`;
}

export function parseYaml(yamlStr: string, currentConfig: PluginConfig): PluginConfig {
  try {
    const updated: PluginConfig = { ...currentConfig };
    const lines = yamlStr.split('\n');
    let inCustomLimits = false;
    const newLimits: Record<string, number> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('custom-limits:')) {
        inCustomLimits = true;
        continue;
      }

      if (inCustomLimits) {
        if (!line.startsWith(' ') && !line.startsWith('\t')) {
          inCustomLimits = false;
        } else {
          const match = trimmed.match(/^([A-Za-z0-9_]+)\s*:\s*(\d+)/);
          if (match) {
            const mat = match[1].toUpperCase();
            const limit = parseInt(match[2], 10);
            if (!isNaN(limit) && limit > 0) {
              newLimits[mat] = limit;
            }
          }
          continue;
        }
      }

      const generalMatch = trimmed.match(/^general-stack-limit\s*:\s*(\d+)/);
      if (generalMatch) {
        updated.generalStackLimit = parseInt(generalMatch[1], 10);
      }

      const pickupMatch = trimmed.match(/^auto-apply-on-pickup\s*:\s*(true|false)/i);
      if (pickupMatch) {
        updated.autoApplyOnPickup = pickupMatch[1].toLowerCase() === 'true';
      }

      const craftMatch = trimmed.match(/^auto-apply-on-craft\s*:\s*(true|false)/i);
      if (craftMatch) {
        updated.autoApplyOnCraft = craftMatch[1].toLowerCase() === 'true';
      }

      const invMatch = trimmed.match(/^auto-apply-on-inventory-open\s*:\s*(true|false)/i);
      if (invMatch) {
        updated.autoApplyOnInventoryOpen = invMatch[1].toLowerCase() === 'true';
      }

      const containerMatch = trimmed.match(/^apply-to-existing-containers\s*:\s*(true|false)/i);
      if (containerMatch) {
        updated.applyToExistingContainers = containerMatch[1].toLowerCase() === 'true';
      }

      const bypassMatch = trimmed.match(/^bypass-permission\s*:\s*["']?([^"']+)["']?/);
      if (bypassMatch) {
        updated.bypassPermission = bypassMatch[1].trim();
      }

      const soundMatch = trimmed.match(/^enable-sound-feedback\s*:\s*(true|false)/i);
      if (soundMatch) {
        updated.enableSoundFeedback = soundMatch[1].toLowerCase() === 'true';
      }
    }

    if (Object.keys(newLimits).length > 0) {
      updated.itemLimits = newLimits;
    }

    return updated;
  } catch (err) {
    console.error('Failed to parse YAML', err);
    return currentConfig;
  }
}
