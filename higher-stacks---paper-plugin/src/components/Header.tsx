import React from 'react';
import { Download, FileCode, CheckCircle2, Box, Sparkles } from 'lucide-react';
import { PluginConfig } from '../types/plugin';
import { downloadPluginZip, downloadConfigFile } from '../utils/zipDownloader';

interface HeaderProps {
  config: PluginConfig;
  activeTab: 'config' | 'yaml' | 'source' | 'simulator' | 'docs';
  setActiveTab: (tab: 'config' | 'yaml' | 'source' | 'simulator' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ config, activeTab, setActiveTab }) => {
  const [downloading, setDownloading] = React.useState(false);
  const [downloadedZip, setDownloadedZip] = React.useState(false);
  const [downloadedConfig, setDownloadedConfig] = React.useState(false);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadPluginZip(config);
      setDownloadedZip(true);
      setTimeout(() => setDownloadedZip(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadConfig = () => {
    downloadConfigFile(config);
    setDownloadedConfig(true);
    setTimeout(() => setDownloadedConfig(false), 2500);
  };

  const itemsWithCustomLimitsCount = Object.keys(config.itemLimits).length;

  return (
    <header className="border-b border-stone-800 bg-stone-900/95 backdrop-blur sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xl shadow-inner">
            <Box className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-100 tracking-tight">HigherStacks</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                Paper 1.26
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded bg-stone-800 text-stone-300 border border-stone-700">
                Java 21
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Server-Side Custom Stack Sizes • General limit: <span className="text-emerald-400 font-semibold">{config.generalStackLimit}</span> • <span className="text-amber-400 font-semibold">{itemsWithCustomLimitsCount}</span> specific overrides
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="download-config-btn"
            onClick={handleDownloadConfig}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download only the config.yml file"
          >
            {downloadedConfig ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved config.yml</span>
              </>
            ) : (
              <>
                <FileCode className="w-3.5 h-3.5 text-stone-400" />
                <span>Download config.yml</span>
              </>
            )}
          </button>

          <button
            id="download-project-zip-btn"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            title="Download full ready-to-compile Paper Maven project (.zip)"
          >
            {downloadedZip ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Downloaded ZIP!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>{downloading ? 'Packing Project...' : 'Download Plugin (.zip)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-stone-800/80 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1 text-xs">
          <button
            id="tab-config-btn"
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'config'
                ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <span>Limits Configurator</span>
            <span className="px-1.5 py-0.2 rounded bg-stone-700/80 text-[10px] text-stone-300">
              {itemsWithCustomLimitsCount}
            </span>
          </button>

          <button
            id="tab-yaml-btn"
            onClick={() => setActiveTab('yaml')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'yaml'
                ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <span>Live config.yml</span>
          </button>

          <button
            id="tab-simulator-btn"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Inventory Test</span>
          </button>

          <button
            id="tab-source-btn"
            onClick={() => setActiveTab('source')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'source'
                ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <span>Paper Java 1.26 Code</span>
            <span className="text-[10px] text-emerald-500 font-mono">8 files</span>
          </button>

          <button
            id="tab-docs-btn"
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <span>Setup & Server Commands</span>
          </button>
        </div>
      </div>
    </header>
  );
};
