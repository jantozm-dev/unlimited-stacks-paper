import { GeneratedFile, PluginConfig } from '../types/plugin';
import { generateYaml } from './yamlGenerator';

export function generatePluginFiles(config: PluginConfig): GeneratedFile[] {
  const yamlConfig = generateYaml(config);

  const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.higherstacks</groupId>
    <artifactId>HigherStacks</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>HigherStacks</name>
    <description>Server-side Paper plugin for custom general and item-specific stack sizes</description>

    <properties>
        <java.version>21</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <paper.api.version>1.21.4-R0.1-SNAPSHOT</paper.api.version>
    </properties>

    <repositories>
        <!-- PaperMC Repository -->
        <repository>
            <id>papermc-repo</id>
            <url>https://repo.papermc.io/repository/maven-public/</url>
        </repository>
    </repositories>

    <dependencies>
        <!-- Paper API supporting DataComponentTypes and ItemMeta.setMaxStackSize -->
        <dependency>
            <groupId>io.papermc.paper</groupId>
            <artifactId>paper-api</artifactId>
            <version>\${paper.api.version}</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <defaultGoal>clean package</defaultGoal>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <source>\${java.version}</source>
                    <target>\${java.version}</target>
                    <release>\${java.version}</release>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.5.3</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <createDependencyReducedPom>false</createDependencyReducedPom>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>`;

  const paperPluginYml = `name: HigherStacks
version: '1.0.0'
main: com.higherstacks.HigherStacksPlugin
api-version: '1.21'
bootstrapper: com.higherstacks.HigherStacksBootstrap
description: Server-side Paper plugin enabling customizable general and per-item higher stack limits.
author: AI Studio Build
website: https://papermc.io

permissions:
  higherstacks.admin:
    description: Allows reloading config and changing item stack limits in-game
    default: op
  higherstacks.bypass:
    description: Players with this permission bypass stack size modifications
    default: false
  higherstacks.use:
    description: Allows players to benefit from higher item stacks
    default: true

commands:
  higherstacks:
    description: Main command for managing HigherStacks limits and reloading
    permission: higherstacks.admin
    usage: /higherstacks <reload|set|get|help> [material] [limit]
    aliases: [hstacks, hs]`;

  const higherStacksPluginJava = `package com.higherstacks;

import com.higherstacks.commands.HigherStacksCommand;
import com.higherstacks.config.ConfigManager;
import com.higherstacks.listeners.StackListener;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.Objects;

/**
 * HigherStacks - Server-side Paper Plugin for Minecraft Java 1.26.
 * Manages general stack limits and item-specific overrides using modern
 * Paper ItemMeta / DataComponent max stack size mechanics.
 */
public final class HigherStacksPlugin extends JavaPlugin {

    private static HigherStacksPlugin instance;
    private ConfigManager configManager;

    @Override
    public void onEnable() {
        instance = this;

        // Initialize and load config.yml
        saveDefaultConfig();
        this.configManager = new ConfigManager(this);
        this.configManager.loadConfiguration();

        // Register event listener for pickup, craft, inventory interaction
        getServer().getPluginManager().registerEvents(new StackListener(this, configManager), this);

        // Register command
        HigherStacksCommand commandExecutor = new HigherStacksCommand(this, configManager);
        Objects.requireNonNull(getCommand("higherstacks")).setExecutor(commandExecutor);
        Objects.requireNonNull(getCommand("higherstacks")).setTabCompleter(commandExecutor);

        getLogger().info("HigherStacks v" + getPluginMeta().getVersion() + " has been successfully loaded!");
        getLogger().info("General stack limit: " + configManager.getGeneralLimit());
        getLogger().info("Specific overrides loaded: " + configManager.getCustomLimits().size() + " items");
    }

    @Override
    public void onDisable() {
        getLogger().info("HigherStacks disabled cleanly.");
    }

    public static HigherStacksPlugin getInstance() {
        return instance;
    }

    public ConfigManager getConfigManager() {
        return configManager;
    }
}`;

  const configManagerJava = `package com.higherstacks.config;

import com.higherstacks.HigherStacksPlugin;
import org.bukkit.Material;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;

import java.util.EnumMap;
import java.util.Map;
import java.util.logging.Level;

/**
 * Manages loading, caching, and querying item stack limits.
 */
public class ConfigManager {

    private final HigherStacksPlugin plugin;
    private int generalLimit = 64;
    private boolean autoApplyOnPickup = true;
    private boolean autoApplyOnCraft = true;
    private boolean autoApplyOnInventoryOpen = true;
    private boolean applyToExistingContainers = true;
    private String bypassPermission = "higherstacks.bypass";
    private boolean enableSoundFeedback = true;

    private final Map<Material, Integer> customLimits = new EnumMap<>(Material.class);

    public ConfigManager(HigherStacksPlugin plugin) {
        this.plugin = plugin;
    }

    public void loadConfiguration() {
        plugin.reloadConfig();
        FileConfiguration config = plugin.getConfig();

        this.generalLimit = config.getInt("general-stack-limit", 64);
        this.autoApplyOnPickup = config.getBoolean("auto-apply-on-pickup", true);
        this.autoApplyOnCraft = config.getBoolean("auto-apply-on-craft", true);
        this.autoApplyOnInventoryOpen = config.getBoolean("auto-apply-on-inventory-open", true);
        this.applyToExistingContainers = config.getBoolean("apply-to-existing-containers", true);
        this.bypassPermission = config.getString("bypass-permission", "higherstacks.bypass");
        this.enableSoundFeedback = config.getBoolean("enable-sound-feedback", true);

        customLimits.clear();

        ConfigurationSection customSection = config.getConfigurationSection("custom-limits");
        if (customSection != null) {
            for (String key : customSection.getKeys(false)) {
                try {
                    Material mat = Material.matchMaterial(key.toUpperCase());
                    if (mat != null) {
                        int limit = customSection.getInt(key);
                        if (limit > 0) {
                            customLimits.put(mat, limit);
                        }
                    } else {
                        plugin.getLogger().warning("Unrecognized material in custom-limits config: " + key);
                    }
                } catch (Exception e) {
                    plugin.getLogger().log(Level.WARNING, "Error parsing material limit for: " + key, e);
                }
            }
        }
    }

    /**
     * Resolves the maximum stack size for a given material.
     * Returns the item-specific limit if defined; otherwise checks if generalLimit
     * is higher than the material's vanilla default.
     */
    public int getMaxStackFor(Material material) {
        if (material == null || material.isAir()) {
            return 0;
        }

        // Check if explicit override exists in config.yml
        if (customLimits.containsKey(material)) {
            return customLimits.get(material);
        }

        // Fallback to general limit if greater than vanilla max
        int vanilla = material.getMaxStackSize();
        if (generalLimit > vanilla) {
            return generalLimit;
        }

        return vanilla;
    }

    public void setItemLimit(Material material, int limit) {
        customLimits.put(material, limit);
        plugin.getConfig().set("custom-limits." + material.name(), limit);
        plugin.saveConfig();
    }

    public int getGeneralLimit() { return generalLimit; }
    public boolean isAutoApplyOnPickup() { return autoApplyOnPickup; }
    public boolean isAutoApplyOnCraft() { return autoApplyOnCraft; }
    public boolean isAutoApplyOnInventoryOpen() { return autoApplyOnInventoryOpen; }
    public boolean isApplyToExistingContainers() { return applyToExistingContainers; }
    public String getBypassPermission() { return bypassPermission; }
    public boolean isEnableSoundFeedback() { return enableSoundFeedback; }
    public Map<Material, Integer> getCustomLimits() { return customLimits; }
}`;

  const stackListenerJava = `package com.higherstacks.listeners;

import com.higherstacks.HigherStacksPlugin;
import com.higherstacks.config.ConfigManager;
import org.bukkit.Material;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockDropItemEvent;
import org.bukkit.event.entity.EntityPickupItemEvent;
import org.bukkit.event.inventory.*;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;

/**
 * Event listener that applies custom stack sizes to ItemStacks seamlessly
 * across pickup, crafting, looting, and inventory interactions.
 */
public class StackListener implements Listener {

    private final HigherStacksPlugin plugin;
    private final ConfigManager configManager;

    public StackListener(HigherStacksPlugin plugin, ConfigManager configManager) {
        this.plugin = plugin;
        this.configManager = configManager;
    }

    /**
     * Applies the configured max stack size to an ItemStack meta.
     * Uses Paper's ItemMeta.setMaxStackSize (Paper 1.20.5+ / 1.26 API).
     */
    public boolean applyCustomStackSize(ItemStack item) {
        if (item == null || item.getType().isAir()) {
            return false;
        }

        Material material = item.getType();
        int targetLimit = configManager.getMaxStackFor(material);

        ItemMeta meta = item.getItemMeta();
        if (meta == null) {
            return false;
        }

        // Check if meta already has the correct max stack size set
        Integer currentCustomMax = meta.hasMaxStackSize() ? meta.getMaxStackSize() : null;
        if (currentCustomMax == null || currentCustomMax != targetLimit) {
            meta.setMaxStackSize(targetLimit);
            item.setItemMeta(meta);
            return true;
        }

        return false;
    }

    @EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
    public void onEntityPickup(EntityPickupItemEvent event) {
        if (!configManager.isAutoApplyOnPickup()) return;

        if (event.getEntity() instanceof Player player) {
            if (player.hasPermission(configManager.getBypassPermission())) {
                return;
            }

            ItemStack item = event.getItem().getItemStack();
            boolean modified = applyCustomStackSize(item);
            event.getItem().setItemStack(item);

            if (modified && configManager.isEnableSoundFeedback()) {
                player.playSound(player.getLocation(), Sound.ENTITY_ITEM_PICKUP, 0.5f, 1.4f);
            }
        }
    }

    @EventHandler(priority = EventPriority.NORMAL)
    public void onPrepareCraft(PrepareItemCraftEvent event) {
        if (!configManager.isAutoApplyOnCraft()) return;

        ItemStack result = event.getInventory().getResult();
        if (result != null && !result.getType().isAir()) {
            applyCustomStackSize(result);
            event.getInventory().setResult(result);
        }
    }

    @EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
    public void onCraft(CraftItemEvent event) {
        if (!configManager.isAutoApplyOnCraft()) return;

        ItemStack result = event.getCurrentItem();
        if (result != null && !result.getType().isAir()) {
            applyCustomStackSize(result);
        }
    }

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onInventoryOpen(InventoryOpenEvent event) {
        if (!configManager.isAutoApplyOnInventoryOpen()) return;

        if (event.getPlayer() instanceof Player player) {
            if (player.hasPermission(configManager.getBypassPermission())) return;

            // Apply to player inventory
            scanAndUpgrade(player.getInventory());

            // Apply to opened top inventory if enabled (chests, barrels, shulkers)
            if (configManager.isApplyToExistingContainers()) {
                scanAndUpgrade(event.getInventory());
            }
        }
    }

    @EventHandler(priority = EventPriority.NORMAL, ignoreCancelled = true)
    public void onBlockDrop(BlockDropItemEvent event) {
        event.getItems().forEach(drop -> {
            ItemStack is = drop.getItemStack();
            if (applyCustomStackSize(is)) {
                drop.setItemStack(is);
            }
        });
    }

    @EventHandler(priority = EventPriority.HIGHEST, ignoreCancelled = true)
    public void onInventoryClick(InventoryClickEvent event) {
        // Ensure stack limits are respected during manual clicks, splits, and merges
        ItemStack current = event.getCurrentItem();
        ItemStack cursor = event.getCursor();

        if (current != null && !current.getType().isAir()) {
            applyCustomStackSize(current);
        }
        if (cursor != null && !cursor.getType().isAir()) {
            applyCustomStackSize(cursor);
        }
    }

    private void scanAndUpgrade(Inventory inv) {
        if (inv == null) return;
        ItemStack[] contents = inv.getContents();
        boolean changed = false;
        for (ItemStack item : contents) {
            if (item != null && !item.getType().isAir()) {
                if (applyCustomStackSize(item)) {
                    changed = true;
                }
            }
        }
    }
}`;

  const higherStacksCommandJava = `package com.higherstacks.commands;

import com.higherstacks.HigherStacksPlugin;
import com.higherstacks.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.Material;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Command executor for /higherstacks (aliases: /hstacks, /hs)
 */
public class HigherStacksCommand implements CommandExecutor, TabCompleter {

    private final HigherStacksPlugin plugin;
    private final ConfigManager configManager;

    public HigherStacksCommand(HigherStacksPlugin plugin, ConfigManager configManager) {
        this.plugin = plugin;
        this.configManager = configManager;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command, @NotNull String label, @NotNull String[] args) {
        if (!sender.hasPermission("higherstacks.admin")) {
            sender.sendMessage(Component.text("You do not have permission to run this command.", NamedTextColor.RED));
            return true;
        }

        if (args.length == 0 || args[0].equalsIgnoreCase("help")) {
            sendHelp(sender, label);
            return true;
        }

        String sub = args[0].toLowerCase(Locale.ROOT);

        switch (sub) {
            case "reload" -> {
                configManager.loadConfiguration();
                sender.sendMessage(Component.text("[HigherStacks] Configuration reloaded successfully!", NamedTextColor.GREEN));
                sender.sendMessage(Component.text("General limit: " + configManager.getGeneralLimit(), NamedTextColor.GRAY));
                sender.sendMessage(Component.text("Active item overrides: " + configManager.getCustomLimits().size(), NamedTextColor.GRAY));
            }
            case "get" -> {
                if (args.length < 2) {
                    if (sender instanceof Player player) {
                        ItemStack hand = player.getInventory().getItemInMainHand();
                        if (!hand.getType().isAir()) {
                            Material mat = hand.getType();
                            int limit = configManager.getMaxStackFor(mat);
                            sender.sendMessage(Component.text("[HigherStacks] " + mat.name() + " stack limit: " + limit, NamedTextColor.GOLD));
                            return true;
                        }
                    }
                    sender.sendMessage(Component.text("Usage: /" + label + " get <material>", NamedTextColor.YELLOW));
                    return true;
                }
                Material mat = Material.matchMaterial(args[1].toUpperCase());
                if (mat == null) {
                    sender.sendMessage(Component.text("Unknown material: " + args[1], NamedTextColor.RED));
                    return true;
                }
                int limit = configManager.getMaxStackFor(mat);
                sender.sendMessage(Component.text("[HigherStacks] " + mat.name() + " max stack size is: " + limit, NamedTextColor.GOLD));
            }
            case "set" -> {
                if (args.length < 3) {
                    sender.sendMessage(Component.text("Usage: /" + label + " set <material> <limit>", NamedTextColor.YELLOW));
                    return true;
                }
                Material mat = Material.matchMaterial(args[1].toUpperCase());
                if (mat == null) {
                    sender.sendMessage(Component.text("Unknown material: " + args[1], NamedTextColor.RED));
                    return true;
                }
                try {
                    int limit = Integer.parseInt(args[2]);
                    if (limit <= 0 || limit > 999) {
                        sender.sendMessage(Component.text("Limit must be between 1 and 999.", NamedTextColor.RED));
                        return true;
                    }
                    configManager.setItemLimit(mat, limit);
                    sender.sendMessage(Component.text("[HigherStacks] Set " + mat.name() + " stack limit to " + limit + " and saved config.yml!", NamedTextColor.GREEN));
                } catch (NumberFormatException e) {
                    sender.sendMessage(Component.text("Invalid number: " + args[2], NamedTextColor.RED));
                }
            }
            default -> sendHelp(sender, label);
        }

        return true;
    }

    private void sendHelp(CommandSender sender, String label) {
        sender.sendMessage(Component.text("--- HigherStacks v1.0.0 Help ---", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("/" + label + " reload ", NamedTextColor.YELLOW)
                .append(Component.text("- Reloads config.yml", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/" + label + " get [material] ", NamedTextColor.YELLOW)
                .append(Component.text("- Shows stack limit for item", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/" + label + " set <material> <limit> ", NamedTextColor.YELLOW)
                .append(Component.text("- Sets and saves custom stack limit", NamedTextColor.GRAY)));
    }

    @Override
    public @Nullable List<String> onTabComplete(@NotNull CommandSender sender, @NotNull Command command, @NotNull String alias, @NotNull String[] args) {
        if (!sender.hasPermission("higherstacks.admin")) return List.of();

        if (args.length == 1) {
            return filter(List.of("reload", "get", "set", "help"), args[0]);
        }

        if (args.length == 2 && (args[0].equalsIgnoreCase("get") || args[0].equalsIgnoreCase("set"))) {
            return filter(Arrays.stream(Material.values()).filter(Material::isItem).map(Enum::name).toList(), args[1]);
        }

        if (args.length == 3 && args[0].equalsIgnoreCase("set")) {
            return List.of("16", "32", "64", "99", "128");
        }

        return List.of();
    }

    private List<String> filter(List<String> list, String prefix) {
        List<String> result = new ArrayList<>();
        String lower = prefix.toLowerCase(Locale.ROOT);
        for (String s : list) {
            if (s.toLowerCase(Locale.ROOT).startsWith(lower)) {
                result.add(s);
            }
        }
        return result;
    }
}`;

  const readmeMd = `# HigherStacks - Minecraft Java 1.26 Paper Server Plugin

HigherStacks is a lightweight, server-authoritative Paper plugin that allows players to hold higher item stack sizes than vanilla defaults. It supports both a global general limit and granular, item-by-item specific limits defined in \`config.yml\`.

## Features
- **General Stack Limit**: Set a default ceiling for all items on your server.
- **Specific Item Limits**: Set exact custom limits for any Minecraft material (e.g., Ender Pearls to 64, Potions to 16, Totems of Undying to 16, Golden Apples to 99).
- **Modern Paper API**: Leverages Paper 1.20.5+ / 1.26 \`ItemMeta.setMaxStackSize(int)\` and native Minecraft \`max_stack_size\` components.
- **Automatic Enforcement**: Upgrades stack sizes on item pickup, workbench crafting, inventory open, and block drops.
- **Commands & Tab Completion**: In-game management with \`/higherstacks reload\` and \`/higherstacks set <item> <amount>\`.
- **Zero Client Mods Required**: Works with standard vanilla Minecraft Java Edition clients!

## Installation
1. Compile the plugin using Maven:
   \`\`\`bash
   mvn clean package
   \`\`\`
2. Grab the compiled jar from \`target/HigherStacks-1.0.0.jar\`.
3. Drop it into your Paper server's \`plugins/\` folder.
4. Restart your server or run \`/paper reload\`.
5. Customize \`plugins/HigherStacks/config.yml\` anytime and run \`/higherstacks reload\`.

## Commands & Permissions
| Command | Permission | Description |
|---|---|---|
| \`/higherstacks reload\` | \`higherstacks.admin\` | Reloads \`config.yml\` instantly |
| \`/higherstacks get [material]\` | \`higherstacks.admin\` | Inspect current stack limit for item or held item |
| \`/higherstacks set <material> <limit>\` | \`higherstacks.admin\` | Dynamically sets and saves custom stack limit |

- \`higherstacks.admin\` - Grants access to plugin commands (default: op).
- \`higherstacks.use\` - Grants ability to use higher stacks (default: true).
- \`higherstacks.bypass\` - Bypasses stack adjustments for admin testing (default: false).

## Compatibility
- **Server**: Paper 1.21.x / 1.26+
- **Client**: Vanilla Minecraft Java Edition (native visual counter supports up to 99 in 1.20.5+)
- **Java**: Java 21+
`;

  return [
    {
      path: 'src/main/resources/config.yml',
      description: 'Main configuration file for general and item-specific stack limits',
      language: 'yaml',
      content: yamlConfig
    },
    {
      path: 'src/main/resources/paper-plugin.yml',
      description: 'Paper plugin metadata, command registry, and permissions',
      language: 'yaml',
      content: paperPluginYml
    },
    {
      path: 'pom.xml',
      description: 'Maven build file with Paper 1.26 repository and Java 21 compilation',
      language: 'xml',
      content: pomXml
    },
    {
      path: 'src/main/java/com/higherstacks/HigherStacksPlugin.java',
      description: 'Main Paper JavaPlugin lifecycle and initialization',
      language: 'java',
      content: higherStacksPluginJava
    },
    {
      path: 'src/main/java/com/higherstacks/config/ConfigManager.java',
      description: 'Configuration loader, material resolver, and stack calculator',
      language: 'java',
      content: configManagerJava
    },
    {
      path: 'src/main/java/com/higherstacks/listeners/StackListener.java',
      description: 'Event listener for item pickup, crafting, and container inventory',
      language: 'java',
      content: stackListenerJava
    },
    {
      path: 'src/main/java/com/higherstacks/commands/HigherStacksCommand.java',
      description: 'Command executor for in-game reloading and stack limit inspection',
      language: 'java',
      content: higherStacksCommandJava
    },
    {
      path: 'README.md',
      description: 'Installation, compilation, command reference, and usage guide',
      language: 'markdown',
      content: readmeMd
    }
  ];
}
