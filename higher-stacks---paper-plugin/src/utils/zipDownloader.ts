import JSZip from 'jszip';
import { PluginConfig } from '../types/plugin';
import { generatePluginFiles } from './sourceCodeGenerator';
import { generateYaml } from './yamlGenerator';

export async function downloadPluginZip(config: PluginConfig): Promise<void> {
  const zip = new JSZip();
  const files = generatePluginFiles(config);

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'HigherStacks-Paper-Plugin-1.26.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadConfigFile(config: PluginConfig): void {
  const yamlContent = generateYaml(config);
  const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.yml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
