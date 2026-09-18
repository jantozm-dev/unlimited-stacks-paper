import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { PluginConfig } from '../types/plugin';
import { generateYaml, parseYaml } from '../utils/yamlGenerator';
import { downloadConfigFile } from '../utils/zipDownloader';

interface YamlPreviewProps {
  config: PluginConfig;
  onChange: (newConfig: PluginConfig) => void;
}

export const YamlPreview: React.FC<YamlPreviewProps> = ({ config, onChange }) => {
  const [yamlContent, setYamlContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  // Sync state whenever external config updates
  useEffect(() => {
    setYamlContent(generateYaml(config));
  }, [config]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    downloadConfigFile(config);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleYamlChange = (val: string) => {
    setYamlContent(val);
    try {
      const parsed = parseYaml(val, config);
      onChange(parsed);
      setParseNotice(null);
    } catch (e: any) {
      setParseNotice('Notice: Partial syntax or parsing error. Keep typing valid YAML.');
    }
  };

  const handleResetToCurrent = () => {
    setYamlContent(generateYaml(config));
    setParseNotice(null);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-stone-100 font-mono">plugins/HigherStacks/config.yml</h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            This exact file is placed in your server's <code className="text-emerald-400">plugins/HigherStacks/</code> directory. You can edit it here directly!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToCurrent}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Re-generate YAML from current configuration"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format & Re-sync</span>
          </button>

          <button
            id="copy-yaml-btn"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy YAML</span>
              </>
            )}
          </button>

          <button
            id="download-yaml-file-btn"
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download config.yml</span>
              </>
            )}
          </button>
        </div>
      </div>

      {parseNotice && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{parseNotice}</span>
        </div>
      )}

      {/* YAML Editor & Line Numbers */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-inner">
        <div className="bg-stone-900/80 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span>YAML Configuration • Server-Side Authoritative</span>
          <span>UTF-8 • Standard Bukkit Format</span>
        </div>

        <div className="relative">
          <textarea
            id="yaml-editor-textarea"
            value={yamlContent}
            onChange={(e) => handleYamlChange(e.target.value)}
            spellCheck={false}
            className="w-full h-[520px] p-4 bg-transparent text-stone-200 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-emerald-500/50 selection:bg-emerald-900/50"
          />
        </div>
      </div>

      {/* Quick instructions */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 text-xs text-stone-400 flex items-center justify-between">
        <div>
          <span className="font-semibold text-stone-300">Server In-Game Reload:</span> After editing this file on your server, simply type <code className="text-emerald-400 font-mono bg-stone-950 px-1.5 py-0.5 rounded">/higherstacks reload</code> in-game or console!
        </div>
        <span className="text-[11px] text-stone-500">Requires <code className="font-mono">higherstacks.admin</code></span>
      </div>
    </div>
  );
};
