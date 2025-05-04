import React from 'react';
import ColorSwatch from './ColorSwatch';

function PaletteDisplay({ palette, baseColors }) {
  if (palette.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No colors in palette yet. Add colors and generate a palette to see results.
      </div>
    );
  }

  // Group palette by base color
  const groupedPalette = {};
  let colorIndex = 0;
  
  baseColors.forEach(baseColor => {
    // Determine number of colors per base color
    const colorsPerBase = palette.length / baseColors.length;
    groupedPalette[baseColor] = palette.slice(colorIndex, colorIndex + colorsPerBase);
    colorIndex += colorsPerBase;
  });

  return (
    <div className="space-y-8">
      {baseColors.map((baseColor, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <span 
              className="w-4 h-4 inline-block rounded-full" 
              style={{ backgroundColor: baseColor }}
            ></span>
            {baseColor.toLowerCase()}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {groupedPalette[baseColor]?.map((color, colorIdx) => (
              <ColorSwatch 
                key={colorIdx} 
                color={color} 
                isBaseColor={color.toLowerCase() === baseColor.toLowerCase()}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaletteDisplay;
