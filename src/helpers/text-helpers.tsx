import React from 'react';

/**
 * Formats a title string, splitting it at the "//" marker to apply a span 
 * for gradient styling. If no "//" marker is found, it automatically
 * applies the span to the last word.
 * Supports multiple lines via "\n" or literal "\n".
 * 
 * @param text The title text to format
 * @returns React elements with spans and breaks
 */
export function formatTitle(text: string) {
  if (!text) return null;

  // Split by actual newlines OR literal "\n" strings
  const lines = text.split(/\n|\\n/);

  return lines.map((line, lineIdx) => {
    let parts: string[] = [];
    let hasExplicitBreak = false;

    if (line.includes('//')) {
      parts = line.split('//');
      hasExplicitBreak = true;
    } else {
      // If no // marker, automatically split at the last space to create the span
      const lastSpaceIndex = line.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        parts = [line.substring(0, lastSpaceIndex), line.substring(lastSpaceIndex + 1)];
      } else {
        parts = [line];
      }
    }
    
    return (
      <React.Fragment key={lineIdx}>
        {parts[0].trim()}
        {parts[1] !== undefined && (
          <>
            {hasExplicitBreak ? <br /> : ' '}
            <span>{parts[1].trim()}</span>
          </>
        )}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

/**
 * Removes formatting markers like "//" and newlines from a title string.
 * Useful for alt tags, aria-labels, etc.
 * 
 * @param text The title text to clean
 * @returns A clean string without markers
 */
export function cleanTitle(text: string) {
  if (!text) return '';
  return text.replace('//', '').replace(/\\n|\n/g, ' ').trim();
}
