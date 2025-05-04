import React from 'react';
import { Trash2, Sliders } from 'lucide-react';

function ColorInput({ 
  baseColors, 
  setBaseColors, 
  generatePalette, 
  paletteType, 
  setPaletteType, 
  colorSteps, 
  setColorSteps 
}) {
  const handleColorChange = (index, newColor) => {
    const updated = [...baseColors];
    updated[index] = newColor;
    setBaseColors(updated);
  };

  const addColor = () => {
    if (baseColors.length < 5) {
      // Generate a random color
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      setBaseColors([...baseColors, randomColor]);
    }
  };

  const removeColor = (index) => {
    if (baseColors.length > 1) {
      const updated = baseColors.filter((_, i) => i !== index);
      setBaseColors(updated);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">Base Colors</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {baseColors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="relative group">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="w-16 h-16 cursor-pointer rounded"
                />
                <span className="text-xs font-mono mt-1 block text-center">{color}</span>
                {baseColors.length > 1 && (
                  <button 
                    onClick={() => removeColor(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {baseColors.length < 5 && (
            <button 
              onClick={addColor} 
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Add Color
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Palette Type</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setPaletteType('full')}
              className={`px-3 py-2 rounded ${
                paletteType === 'full' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Full Range
            </button>
            <button
              onClick={() => setPaletteType('tints')}
              className={`px-3 py-2 rounded ${
                paletteType === 'tints' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Tints Only
            </button>
            <button
              onClick={() => setPaletteType('shades')}
              className={`px-3 py-2 rounded ${
                paletteType === 'shades' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Shades Only
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Variations ({colorSteps})</h3>
          <div className="flex items-center gap-3">
            <Sliders size={20} />
            <input
              type="range"
              min="3"
              max="10"
              value={colorSteps}
              onChange={(e) => setColorSteps(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => generatePalette(baseColors)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full md:w-auto md:self-start"
      >
        Regenerate Palette
      </button>
    </div>
  );
}

export default ColorInput;
