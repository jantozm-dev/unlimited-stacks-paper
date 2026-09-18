import React, { useState } from 'react';
import { PluginConfig } from './types/plugin';
import { DEFAULT_CONFIG } from './data/minecraftItems';
import { Header } from './components/Header';
import { ConfigEditor } from './components/ConfigEditor';
import { YamlPreview } from './components/YamlPreview';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { InventorySimulator } from './components/InventorySimulator';
import { DocsGuide } from './components/DocsGuide';

export default function App() {
  const [config, setConfig] = useState<PluginConfig>(() => {
    // Try restoring from localStorage if available
    try {
      const saved = localStorage.getItem('higherstacks_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load stored config', e);
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'config' | 'yaml' | 'source' | 'simulator' | 'docs'>('config');

  // Save changes to localStorage for user convenience
  const handleConfigChange = (newConfig: PluginConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('higherstacks_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Could not persist config', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-emerald-900 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'config' && (
          <ConfigEditor
            config={config}
            onChange={handleConfigChange}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'yaml' && (
          <YamlPreview
            config={config}
            onChange={handleConfigChange}
          />
        )}

        {activeTab === 'simulator' && (
          <InventorySimulator
            config={config}
          />
        )}

        {activeTab === 'source' && (
          <SourceCodeViewer
            config={config}
          />
        )}

        {activeTab === 'docs' && (
          <DocsGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Paper Java 1.26 Server Plugin Generator</span>
            <span>•</span>
            <span>Uses Paper ItemMeta / Data Component API</span>
          </div>
          <div className="flex items-center gap-3">
            <span>General Limit: <strong className="text-emerald-400 font-mono">{config.generalStackLimit}</strong></span>
            <span>Overrides: <strong className="text-amber-400 font-mono">{Object.keys(config.itemLimits).length}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
