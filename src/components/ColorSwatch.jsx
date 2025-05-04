import React, { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import chroma from 'chroma-js';

function ColorSwatch({ color, isBaseColor = false }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Calculate contrast to determine text color
  const textColor = chroma.contrast(color, 'white') > 3 ? 'white' : 'black';
  
  // Calculate luminance for determining if color is light or dark
  const isLight = chroma(color).luminance() > 0.5;
  
  return (
    <div 
      className={`flex flex-col bg-white rounded-lg overflow-hidden shadow-md 
      ${isBaseColor ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-24 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
        onClick={copyToClipboard}
      >
        {copied && (
          <div 
            className={`flex items-center gap-1 px-2 py-1 rounded bg-opacity-75 ${
              isLight ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <Check size={16} />
            <span className="text-sm">Copied!</span>
          </div>
        )}
      </div>
      
      <div className="p-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono">{color.toLowerCase()}</span>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Copy hex code"
          >
            <Clipboard size={16} />
          </button>
        </div>
        
        <div className="mt-1 text-xs text-gray-500">
          RGB: {chroma(color).rgb().join(', ')}
        </div>
      </div>
    </div>
  );
}

export default ColorSwatch;
