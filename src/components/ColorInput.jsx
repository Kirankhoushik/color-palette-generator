import React from 'react';

function ColorInput({ baseColors, setBaseColors, generatePalette }) {
  const handleColorChange = (index, newColor) => {
    const updated = [...baseColors];
    updated[index] = newColor;
    setBaseColors(updated);
  };

  const addColor = () => {
    if (baseColors.length < 3) {
      setBaseColors([...baseColors, '#ffffff']);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="flex gap-4">
        {baseColors.map((color, idx) => (
          <input
            key={idx}
            type="color"
            value={color}
            onChange={(e) => handleColorChange(idx, e.target.value)}
            className="w-12 h-12 cursor-pointer"
          />
        ))}
        {baseColors.length < 3 && (
          <button onClick={addColor} className="px-3 py-1 bg-blue-500 text-white rounded">
            + Add
          </button>
        )}
      </div>
      <button
        onClick={() => generatePalette(baseColors)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Generate Palette
      </button>
    </div>
  );
}

export default ColorInput;
