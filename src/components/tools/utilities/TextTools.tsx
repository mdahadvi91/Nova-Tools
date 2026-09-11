import React, { useState } from 'react';
import { Copy, Check, Type, Eraser, Code2 } from 'lucide-react';

interface TextToolsProps {
  toolType: 'counter' | 'case' | 'cleaner' | 'markdown';
}

export const TextTools: React.FC<TextToolsProps> = ({ toolType }) => {
  const [text, setText] = useState(
    'Nova Tools is an ultra-fast, privacy-first online utility platform engineered for high-performance productivity directly in your browser.'
  );
  const [copied, setCopied] = useState(false);

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Metrics for counter
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s+/g, '').length;
  const sentenceCount = trimmed ? (text.match(/[^.!?]+[.!?]+/g) || []).length || 1 : 0;
  const paragraphCount = trimmed ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.ceil(wordCount / 200);

  // Case transforms
  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toCamelCase = (str: string) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');

  const toSnakeCase = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');

  const toKebabCase = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

  // Cleaning transforms
  const removeExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, ' ').trim());
  };

  const removeEmptyLines = () => {
    setText(
      text
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .join('\n')
    );
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* 1. WORD & CHARACTER COUNTER */}
      {toolType === 'counter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {wordCount}
              </span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-1">Words</p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {charCount}
              </span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-1">Characters</p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {charNoSpaces}
              </span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-1">No Spaces</p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ~{readingTimeMin} m
              </span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-1">Reading Time</p>
            </div>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text to count..."
            className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm leading-relaxed"
          />
        </div>
      )}

      {/* 2. CASE CONVERTER */}
      {toolType === 'case' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setText(text.toUpperCase())}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              UPPERCASE
            </button>
            <button
              type="button"
              onClick={() => setText(text.toLowerCase())}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              lowercase
            </button>
            <button
              type="button"
              onClick={() => setText(toTitleCase(text))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={() => setText(toCamelCase(text))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              camelCase
            </button>
            <button
              type="button"
              onClick={() => setText(toSnakeCase(text))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              snake_case
            </button>
            <button
              type="button"
              onClick={() => setText(toKebabCase(text))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              kebab-case
            </button>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => copyText(text)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Converted Text'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. TEXT CLEANER */}
      {toolType === 'cleaner' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={removeExtraSpaces}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              Remove Extra Spaces
            </button>
            <button
              type="button"
              onClick={removeEmptyLines}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              Remove Empty Lines
            </button>
            <button
              type="button"
              onClick={removeDuplicateLines}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            >
              Remove Duplicate Lines
            </button>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => copyText(text)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Cleaned Text'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MARKDOWN TO HTML PREVIEW */}
      {toolType === 'markdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Markdown Editor
            </span>
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Rendered HTML
              </span>
              <button
                type="button"
                onClick={() => copyText(text)}
                className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-h-[260px] text-sm text-slate-800 dark:text-slate-200 prose prose-sm dark:prose-invert max-w-none">
              <p>{text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
