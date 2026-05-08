import React from 'react';

export function formatTitle(text: string) {
  if (!text) return null;

  const lines = text.split(/\n|\\n/);

  return lines.map((line, lineIdx) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;

    const markerIndex = trimmedLine.indexOf('//');

    let beforeText = '';
    let afterText = '';
    let hasExplicitBreak = false;

    if (markerIndex !== -1) {
      beforeText = trimmedLine.substring(0, markerIndex).trim();
      afterText = trimmedLine.substring(markerIndex + 2).trim();
      hasExplicitBreak = true;
    } else {
      const lastSpaceIndex = trimmedLine.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        beforeText = trimmedLine.substring(0, lastSpaceIndex).trim();
        afterText = trimmedLine.substring(lastSpaceIndex + 1).trim();
      } else {
        beforeText = trimmedLine;
        afterText = '';
      }
    }

    if (!beforeText && !afterText) return null;

    return (
      <React.Fragment key={lineIdx}>
        {beforeText}
        {afterText && (
          <>
            {hasExplicitBreak && beforeText && <br />}
            {!hasExplicitBreak && beforeText && ' '}
            <span>{afterText}</span>
          </>
        )}
        {lineIdx < lines.length - 1 && (beforeText || afterText) && <br />}
      </React.Fragment>
    );
  });
}

export function cleanTitle(text: string) {
  if (!text) return '';
  return text.replace('//', '').replace(/\\n|\n/g, ' ').trim();
}