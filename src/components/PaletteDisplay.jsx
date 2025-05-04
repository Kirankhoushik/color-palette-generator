import React from 'react';
import ColorSwatch from './ColorSwatch';

function PaletteDisplay({ palette }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {palette.map((color, idx) => (
        <ColorSwatch key={idx} color={color} />
      ))}
    </div>
  );
}

export default PaletteDisplay;
