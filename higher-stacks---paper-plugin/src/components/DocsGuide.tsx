import React from 'react';
import { Terminal, Shield, BookOpen, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

export const DocsGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base font-bold text-stone-100">Paper 1.26 HigherStacks Server Guide</h2>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Everything you need to compile, install, configure, and operate the HigherStacks plugin on your Paper / Purpur Minecraft Java 1.26 server.
        </p>
      </div>

      {/* Installation Steps */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Installation & Build Instructions</span>
        </h3>

        <ol className="space-y-3 text-xs text-stone-300">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-stone-100">Download the Plugin Project:</strong>
              <p className="text-stone-400 mt-0.5">
                Click the <strong className="text-emerald-400">Download Plugin (.zip)</strong> button in the top header to obtain the ready-to-compile Maven project.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-stone-100">Compile with Maven (Java 21):</strong>
              <p className="text-stone-400 mt-0.5">
                Extract the zip and execute the standard build command in terminal:
              </p>
              <pre className="mt-1.5 p-2.5 bg-stone-950 border border-stone-800 rounded font-mono text-emerald-400 text-[11px]">
                mvn clean package
              </pre>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-stone-100">Deploy to Server Plugins Folder:</strong>
              <p className="text-stone-400 mt-0.5">
                Copy <code className="text-stone-200 bg-stone-950 px-1 py-0.5 rounded">target/HigherStacks-1.0.0.jar</code> into your Minecraft server's <code className="text-emerald-400 bg-stone-950 px-1 py-0.5 rounded">plugins/</code> folder.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong className="text-stone-100">Start / Reload Server:</strong>
              <p className="text-stone-400 mt-0.5">
                Start your server. Paper will automatically generate <code className="text-stone-200 bg-stone-950 px-1 py-0.5 rounded">plugins/HigherStacks/config.yml</code>. You can replace or adjust this file anytime without restarting the server using <code className="text-emerald-400">/higherstacks reload</code>.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Commands & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commands */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>In-Game Commands</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <code className="text-emerald-400 font-mono font-semibold">/higherstacks reload</code>
              <p className="text-stone-400 mt-1 text-[11px]">
                Reloads <code className="text-stone-300">config.yml</code> from disk immediately without interrupting player gameplay.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <code className="text-emerald-400 font-mono font-semibold">/higherstacks get [material]</code>
              <p className="text-stone-400 mt-1 text-[11px]">
                Queries current stack limit for any material, or for the item held in player's main hand.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <code className="text-emerald-400 font-mono font-semibold">/higherstacks set &lt;material&gt; &lt;limit&gt;</code>
              <p className="text-stone-400 mt-1 text-[11px]">
                Updates the custom limit in memory and persists the change directly into <code className="text-stone-300">config.yml</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Server Permissions</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between">
                <code className="text-amber-400 font-mono font-semibold">higherstacks.admin</code>
                <span className="text-[10px] text-stone-500">Default: OP</span>
              </div>
              <p className="text-stone-400 mt-1 text-[11px]">
                Permission required to execute reload, set, and get administrative commands.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between">
                <code className="text-emerald-400 font-mono font-semibold">higherstacks.use</code>
                <span className="text-[10px] text-stone-500">Default: True</span>
              </div>
              <p className="text-stone-400 mt-1 text-[11px]">
                Allows player to pick up, craft, and hold items with higher stack sizes.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between">
                <code className="text-stone-300 font-mono font-semibold">higherstacks.bypass</code>
                <span className="text-[10px] text-stone-500">Default: False</span>
              </div>
              <p className="text-stone-400 mt-1 text-[11px]">
                Exempts players from stack upgrades (useful for testing vanilla mechanics).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture FAQ */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>Technical Details: Paper 1.26 & Modern Data Components</span>
        </h3>

        <div className="space-y-3 text-xs text-stone-300">
          <div className="border-b border-stone-800 pb-3">
            <h4 className="font-semibold text-stone-100 mb-1">
              How does modern Minecraft Java Edition handle custom stack sizes?
            </h4>
            <p className="text-stone-400 leading-relaxed">
              Starting in Minecraft 1.20.5 and continued into 1.21 through 1.26, Mojang replaced traditional NBT with native <em>Item Data Components</em>. Specifically, the <code className="text-stone-200">minecraft:max_stack_size</code> component allows any item to have its maximum stack size defined from 1 to 99. The vanilla Java client automatically renders slot numbers up to 99 without needing client mods!
            </p>
          </div>

          <div className="border-b border-stone-800 pb-3">
            <h4 className="font-semibold text-stone-100 mb-1">
              Can normally unstackable items (Potions, Totems, Boats) stack?
            </h4>
            <p className="text-stone-400 leading-relaxed">
              Yes! HigherStacks sets the item's maximum stack component. When unstackable items like Healing Potions, Splash Potions, or Totems of Undying are picked up or crafted, they can now stack together up to the limit you define in <code className="text-emerald-400">custom-limits</code> (e.g. 16 or 64). Note that items with durability (such as damaged swords) only merge when undamaged or identically repaired.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-100 mb-1">
              What happens if a limit is configured higher than 99 (e.g. 128)?
            </h4>
            <p className="text-stone-400 leading-relaxed">
              The Paper server handles items authoritatively up to any integer limit. On vanilla Java clients, the inventory counter caps display rendering at 99, but hovering over the item or moving the stack preserves the exact full quantity (e.g. 128x).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
