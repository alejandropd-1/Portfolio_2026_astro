'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Copy, ExternalLink, Download, Check } from 'lucide-react';
import { useMarkdownExport } from '@/lib/hooks/useMarkdownExport';
import styles from '@/styles/components/_markdown-export-menu.module.scss';

interface MarkdownExportMenuProps {
  content: string;
  metadata: Record<string, unknown>;
  filename: string;
}

export default function MarkdownExportMenu({
  content,
  metadata,
  filename,
}: MarkdownExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { copyToClipboard, downloadAsFile, generateMarkdown } = useMarkdownExport({
    content,
    metadata,
    filename,
  });

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const { success } = await copyToClipboard();
    if (success) {
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
    close();
  };

  const handleViewMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    close();
  };

  const handleDownload = () => {
    downloadAsFile();
    close();
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.trigger}>
        <button
          type="button"
          className={styles.triggerMain}
          onClick={handleCopy}
          aria-label="Copy page as Markdown"
        >
          {copied ? (
            <>
              <Check size={12} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy page
            </>
          )}
        </button>
        <button
          type="button"
          className={styles.triggerArrow}
          onClick={() => setIsOpen(prev => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="More export options"
        >
          <ChevronDown size={12} />
        </button>
      </div>

      <div
        className={clsx(styles.dropdown, isOpen && styles['dropdown--open'])}
        role="menu"
        aria-label="Markdown export options"
      >
        <button
          type="button"
          className={styles.item}
          role="menuitem"
          onClick={handleCopy}
        >
          <Copy size={14} />
          Copy Markdown
        </button>

        <button
          type="button"
          className={styles.item}
          role="menuitem"
          onClick={handleViewMarkdown}
        >
          <ExternalLink size={14} />
          View Markdown
        </button>

        <button
          type="button"
          className={styles.item}
          role="menuitem"
          onClick={handleDownload}
        >
          <Download size={14} />
          Download .md
        </button>
      </div>
    </div>
  );
}
