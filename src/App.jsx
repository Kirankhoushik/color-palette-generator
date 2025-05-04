import React, { useState, useEffect } from 'react';
import ColorInput from './components/ColorInput';
import PaletteDisplay from './components/PaletteDisplay';
import chroma from 'chroma-js';

function App() {
  const [baseColors, setBaseColors] = useState(['#3498db']);
  const [palette, setPalette] = useState([]);
  const [paletteType, setPaletteType] = useState('full'); // 'full', 'tints', 'shades'
  const [colorSteps, setColorSteps] = useState(5);

  // Generate palette whenever baseColors, paletteType, or colorSteps change
  useEffect(() => {
    if (baseColors.length > 0) {
      generatePalette(baseColors);
    }
  }, [baseColors, paletteType, colorSteps]);

  const generatePalette = (colors) => {
    let newPalette = [];
    
    colors.forEach(color => {
      try {
        let scale;
        
        switch (paletteType) {
          case 'tints':
            scale = chroma.scale([color, '#ffffff']).mode('lab').colors(colorSteps);
            break;
          case 'shades':
            scale = chroma.scale([color, '#000000']).mode('lab').colors(colorSteps);
            break;
          case 'full':
          default:
            // Create both tints and shades for a fuller palette
            const tints = chroma.scale([color, '#ffffff']).mode('lab').colors(colorSteps);
            const shades = chroma.scale([color, '#000000']).mode('lab').colors(colorSteps);
            // Remove the first shade to avoid duplicating the base color
            scale = [...tints, ...shades.slice(1)];
        }
        
        // Format all colors as lowercase hex
        scale = scale.map(c => chroma(c).hex().toLowerCase());
        newPalette = newPalette.concat(scale);
      } catch (error) {
        console.error(`Error generating palette for color ${color}:`, error);
      }
    });
    
    setPalette(newPalette);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Color Palette Generator</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <ColorInput 
            baseColors={baseColors} 
            setBaseColors={setBaseColors} 
            generatePalette={generatePalette} 
            paletteType={paletteType}
            setPaletteType={setPaletteType}
            colorSteps={colorSteps}
            setColorSteps={setColorSteps}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Palette</h2>
          <PaletteDisplay palette={palette} baseColors={baseColors} />
        </div>
      </div>
    </div>
  );
}

export default App;
