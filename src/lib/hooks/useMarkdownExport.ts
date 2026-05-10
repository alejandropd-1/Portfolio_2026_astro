import { useCallback } from 'react';

interface UseMarkdownExportOptions {
  content: string;
  metadata: Record<string, unknown>;
  filename: string;
}

interface UseMarkdownExportReturn {
  generateMarkdown: () => string;
  copyToClipboard: () => Promise<{ success: boolean }>;
  downloadAsFile: (customFilename?: string) => void;
}

function yamlEscape(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const str = String(value);
  // Wrap in quotes if it contains special YAML chars or is empty
  if (str === '' || /[:{}\[\],&*?|>!%@`#'"\n\r]/.test(str)) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

function toYamlFrontmatter(metadata: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${yamlEscape(item)}`);
      }
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${key}:`);
      for (const [subKey, subVal] of Object.entries(value as Record<string, unknown>)) {
        if (subVal === undefined || subVal === null) continue;
        lines.push(`  ${subKey}: ${yamlEscape(subVal)}`);
      }
    } else {
      lines.push(`${key}: ${yamlEscape(value)}`);
    }
  }

  return lines.join('\n');
}

export function useMarkdownExport({
  content,
  metadata,
  filename,
}: UseMarkdownExportOptions): UseMarkdownExportReturn {

  const generateMarkdown = useCallback((): string => {
    const frontmatter = toYamlFrontmatter(metadata);
    return `---\n${frontmatter}\n---\n\n${content}`;
  }, [content, metadata]);

  const copyToClipboard = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      const md = generateMarkdown();
      await navigator.clipboard.writeText(md);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, [generateMarkdown]);

  const downloadAsFile = useCallback((customFilename?: string): void => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = customFilename ?? filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [generateMarkdown, filename]);

  return { generateMarkdown, copyToClipboard, downloadAsFile };
}
