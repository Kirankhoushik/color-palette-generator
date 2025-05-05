import { useState, useEffect } from 'react';
import { Check, Copy, RefreshCw, Plus, Trash2 } from 'lucide-react';

// Helper functions for color manipulation
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

// Generate a random hex color
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// Generate complementary color
const getComplementaryColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  
  const r = 255 - rgb.r;
  const g = 255 - rgb.g;
  const b = 255 - rgb.b;
  
  return rgbToHex(r, g, b);
};

// Generate analogous colors
const getAnalogousColors = (hex, count = 2) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return Array(count).fill("#000000");
  
  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }
  
  // Generate analogous colors by shifting hue
  const colors = [];
  const hueStep = 1 / (count + 1);
  
  for (let i = 1; i <= count; i++) {
    let newHue = (h + hueStep * i) % 1;
    colors.push(hslToHex(newHue, s, l));
  }
  
  return colors;
};

// Convert HSL to Hex
const hslToHex = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
};

// Generate shades (darker) of a color
const getShades = (hex, count = 4) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return Array(count).fill("#000000");
  
  const shades = [];
  for (let i = 1; i <= count; i++) {
    const darkFactor = 1 - (i / (count + 1));
    const r = Math.round(rgb.r * darkFactor);
    const g = Math.round(rgb.g * darkFactor);
    const b = Math.round(rgb.b * darkFactor);
    shades.push(rgbToHex(r, g, b));
  }
  
  return shades;
};

// Generate tints (lighter) of a color
const getTints = (hex, count = 4) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return Array(count).fill("#ffffff");
  
  const tints = [];
  for (let i = 1; i <= count; i++) {
    const tintFactor = i / (count + 1);
    const r = Math.round(rgb.r + (255 - rgb.r) * tintFactor);
    const g = Math.round(rgb.g + (255 - rgb.g) * tintFactor);
    const b = Math.round(rgb.b + (255 - rgb.b) * tintFactor);
    tints.push(rgbToHex(r, g, b));
  }
  
  return tints;
};

// Generate a full palette from a base color
const generatePalette = (baseColor) => {
  const complementary = getComplementaryColor(baseColor);
  const analogous = getAnalogousColors(baseColor, 2);
  const shades = getShades(baseColor, 3);
  const tints = getTints(baseColor, 3);
  
  return {
    base: baseColor,
    complementary,
    analogous,
    shades,
    tints
  };
};

// ColorSwatch component
const ColorSwatch = ({ color, onClick, active = false }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  // Calculate text color based on background brightness
  const rgb = hexToRgb(color);
  const brightness = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 : 128;
  const textColor = brightness > 128 ? 'text-gray-800' : 'text-white';
  
  return (
    <div 
      className={`relative p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 shadow-md ${active ? 'ring-4 ring-blue-500' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <p className={`font-mono text-sm ${textColor}`}>{color.toUpperCase()}</p>
      <button 
        onClick={copyToClipboard}
        className={`mt-2 p-1 rounded ${textColor} hover:bg-opacity-20 hover:bg-gray-900 transition-colors`}
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};

// Main App component
export default function ColorPaletteGenerator() {
  const [baseColors, setBaseColors] = useState([getRandomColor()]);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [palettes, setPalettes] = useState([]);
  
  // Generate palettes when base colors change
  useEffect(() => {
    const newPalettes = baseColors.map(color => generatePalette(color));
    setPalettes(newPalettes);
  }, [baseColors]);
  
  const addNewColor = () => {
    if (baseColors.length < 5) {
      const newColor = getRandomColor();
      setBaseColors([...baseColors, newColor]);
      setActiveColorIndex(baseColors.length);
    }
  };
  
  const updateBaseColor = (index, newColor) => {
    const newBaseColors = [...baseColors];
    newBaseColors[index] = newColor;
    setBaseColors(newBaseColors);
  };
  
  const regenerateColor = (index) => {
    updateBaseColor(index, getRandomColor());
  };
  
  const removeColor = (index) => {
    if (baseColors.length > 1) {
      const newBaseColors = baseColors.filter((_, i) => i !== index);
      setBaseColors(newBaseColors);
      if (activeColorIndex >= newBaseColors.length) {
        setActiveColorIndex(newBaseColors.length - 1);
      } else if (activeColorIndex === index) {
        setActiveColorIndex(0);
      }
    }
  };
  
  const handleColorChange = (e) => {
    updateBaseColor(activeColorIndex, e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Palette Generator</h1>
          <p className="text-gray-600">Select your base colors and generate harmonious palettes</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Base Colors</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {baseColors.map((color, index) => (
              <div 
                key={index}
                className={`relative rounded-lg overflow-hidden shadow-md transition-all duration-200 ${activeColorIndex === index ? 'ring-4 ring-blue-500' : ''}`}
              >
                <div 
                  className="h-24 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setActiveColorIndex(index)}
                />
                <div className="p-2 bg-white flex justify-between items-center">
                  <button 
                    onClick={() => regenerateColor(index)}
                    className="text-gray-600 hover:text-blue-600 p-1"
                    title="Generate new random color"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <span className="font-mono text-xs">{color.toUpperCase()}</span>
                  <button 
                    onClick={() => removeColor(index)}
                    className="text-gray-600 hover:text-red-600 p-1"
                    title="Remove color"
                    disabled={baseColors.length <= 1}
                  >
                    <Trash2 size={16} className={baseColors.length <= 1 ? "opacity-50" : ""} />
                  </button>
                </div>
              </div>
            ))}
            
            {baseColors.length < 5 && (
              <button 
                onClick={addNewColor}
                className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors"
              >
                <Plus size={24} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="flex items-center gap-2">
              <span className="text-gray-700">Color:</span>
              <input 
                type="color" 
                value={baseColors[activeColorIndex]} 
                onChange={handleColorChange}
                className="w-10 h-10 cursor-pointer rounded overflow-hidden"
              />
            </label>
            <span className="font-mono">{baseColors[activeColorIndex].toUpperCase()}</span>
          </div>
        </div>
        
        {palettes.map((palette, baseIndex) => (
          <div 
            key={baseIndex}
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 transition-opacity duration-300 ${activeColorIndex === baseIndex ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-1">Base Color: {palette.base.toUpperCase()}</h3>
              <div className="h-2 rounded-full" style={{ backgroundColor: palette.base }}></div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Complementary</h4>
                <div className="grid grid-cols-1 gap-4">
                  <ColorSwatch color={palette.complementary} />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Analogous</h4>
                <div className="grid grid-cols-2 gap-4">
                  {palette.analogous.map((color, i) => (
                    <ColorSwatch key={i} color={color} />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Shades (Darker)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {palette.shades.map((color, i) => (
                    <ColorSwatch key={i} color={color} />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tints (Lighter)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {palette.tints.map((color, i) => (
                    <ColorSwatch key={i} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}