import React, { useState } from 'react';
import ColorInput from './components/ColorInput';
import PaletteDisplay from './components/PaletteDisplay';
import chroma from 'chroma-js';

function App() {
  const [baseColors, setBaseColors] = useState(['#3498db']);
  const [palette, setPalette] = useState([]);

  const generatePalette = (colors) => {
    let newPalette = [];
    colors.forEach(color => {
      const scale = chroma.scale([color, 'white']).mode('lab').colors(5);
      newPalette = newPalette.concat(scale);
    });
    setPalette(newPalette);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Color Palette Generator</h1>
      <ColorInput baseColors={baseColors} setBaseColors={setBaseColors} generatePalette={generatePalette} />
      <PaletteDisplay palette={palette} />
    </div>
  );
}

export default App;
