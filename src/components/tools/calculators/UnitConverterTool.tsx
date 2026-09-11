import React, { useState } from 'react';
import { ArrowRightLeft, Scale, Ruler, Thermometer, HardDrive, Gauge } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'data' | 'speed';

const UNIT_CONVERSIONS: Record<
  UnitCategory,
  { name: string; units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }
> = {
  length: {
    name: 'Length & Distance',
    units: [
      { id: 'm', name: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'in', name: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', name: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'mi', name: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'lb', name: 'Pounds (lbs)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', toBase: (v) => v * 0.02834952, fromBase: (v) => v / 0.02834952 },
      { id: 'ton', name: 'Metric Tons (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temp: {
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  data: {
    name: 'Digital Storage',
    units: [
      { id: 'mb', name: 'Megabytes (MB)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'gb', name: 'Gigabytes (GB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'tb', name: 'Terabytes (TB)', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      { id: 'kb', name: 'Kilobytes (KB)', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
      { id: 'bytes', name: 'Bytes (B)', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    units: [
      { id: 'kmh', name: 'Kilometers / hr (km/h)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mph', name: 'Miles / hr (mph)', toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
      { id: 'ms', name: 'Meters / sec (m/s)', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
      { id: 'knot', name: 'Knots (kn)', toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
    ],
  },
};

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState<number>(10);

  const currentCategoryUnits = UNIT_CONVERSIONS[category].units;

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNIT_CONVERSIONS[newCat].units;
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Convert
  const fromObj = currentCategoryUnits.find((u) => u.id === fromUnit) || currentCategoryUnits[0];
  const toObj = currentCategoryUnits.find((u) => u.id === toUnit) || currentCategoryUnits[1] || currentCategoryUnits[0];

  const baseVal = fromObj.toBase(inputValue);
  const resultVal = toObj.fromBase(baseVal);

  const getCategoryIcon = (cat: UnitCategory) => {
    switch (cat) {
      case 'length':
        return <Ruler className="w-4 h-4" />;
      case 'weight':
        return <Scale className="w-4 h-4" />;
      case 'temp':
        return <Thermometer className="w-4 h-4" />;
      case 'data':
        return <HardDrive className="w-4 h-4" />;
      case 'speed':
        return <Gauge className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNIT_CONVERSIONS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              category === cat
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'liquid-glass text-slate-700 dark:text-slate-300'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{UNIT_CONVERSIONS[cat].name}</span>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              From
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-lg font-bold"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              {currentCategoryUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1 pt-4 md:pt-0">
            <button
              type="button"
              onClick={swapUnits}
              className="p-3 rounded-xl liquid-glass hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-sm"
              title="Swap units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              To (Result)
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-lg font-black text-emerald-700 dark:text-emerald-400 select-all truncate">
              {isNaN(resultVal) ? '—' : Number(resultVal.toFixed(6))}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              {currentCategoryUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 font-medium">
          {inputValue} {fromObj.name} = <span className="font-bold text-slate-800 dark:text-slate-200">{Number(resultVal.toFixed(6))}</span> {toObj.name}
        </div>
      </div>
    </div>
  );
};
