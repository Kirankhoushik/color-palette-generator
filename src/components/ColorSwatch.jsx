import React, { useState } from 'react';

function ColorSwatch({ color }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-col items-center bg-white shadow rounded p-2">
      <div
        className="w-16 h-16 rounded mb-2"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm font-mono">{color}</p>
      <button
        onClick={copyToClipboard}
        className="text-xs mt-1 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

export default ColorSwatch;
