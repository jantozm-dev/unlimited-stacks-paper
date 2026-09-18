import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder, ChevronRight, Download, Terminal } from 'lucide-react';
import { PluginConfig, GeneratedFile } from '../types/plugin';
import { generatePluginFiles } from '../utils/sourceCodeGenerator';
import { downloadPluginZip } from '../utils/zipDownloader';

interface SourceCodeViewerProps {
  config: PluginConfig;
}

export const SourceCodeViewer: React.FC<SourceCodeViewerProps> = ({ config }) => {
  const files: GeneratedFile[] = generatePluginFiles(config);
  const [selectedFilePath, setSelectedFilePath] = useState<string>(files[0].path);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const selectedFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadPluginZip(config);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-stone-100">Paper 1.26 Maven Plugin Source Code</h2>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-[11px] text-stone-300 font-mono">
              Ready to compile with Java 21
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Production-ready Paper server-side plugin structure. Built with modern Paper Data Component API (<code className="text-emerald-400">ItemMeta.setMaxStackSize</code>) for native 1.26 compatibility.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Creating ZIP...' : 'Download Maven Project (.zip)'}</span>
        </button>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-inner">
        {/* Left: File Tree */}
        <div className="md:col-span-4 bg-stone-900/60 border-b md:border-b-0 md:border-r border-stone-800 p-3">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1 mb-2 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-stone-400" />
            <span>Plugin Project Structure</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {files.map((file) => {
              const isSelected = file.path === selectedFile.path;
              const fileName = file.path.split('/').pop();
              const dir = file.path.includes('/') ? file.path.substring(0, file.path.lastIndexOf('/')) : '';

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition flex items-start gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-semibold'
                      : 'text-stone-300 hover:bg-stone-850 hover:text-stone-100'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-stone-500'}`} />
                  <div className="truncate">
                    <div className="truncate text-xs">{fileName}</div>
                    {dir && <div className="text-[10px] text-stone-500 truncate">{dir}</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick compilation note */}
          <div className="mt-6 p-3 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-stone-400">
            <div className="flex items-center gap-1 text-stone-300 font-semibold mb-1">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>Compilation:</span>
            </div>
            <code className="block bg-stone-900 p-1.5 rounded font-mono text-[10px] text-emerald-400 mb-1">
              mvn clean package
            </code>
            <span>Output will be in <code className="text-stone-300">target/HigherStacks-1.0.0.jar</code></span>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="md:col-span-8 flex flex-col h-[580px]">
          {/* File Tab Header */}
          <div className="px-4 py-2.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-semibold text-stone-200">{selectedFile.path}</span>
              <p className="text-[11px] text-stone-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1.2 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto p-4 bg-stone-950">
            <pre className="text-xs font-mono text-stone-200 leading-relaxed">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
