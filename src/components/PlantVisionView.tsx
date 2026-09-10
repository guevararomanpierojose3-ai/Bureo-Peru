import { useState, useEffect } from 'react';
import { 
  Cpu, 
  Eye, 
  Activity, 
  AlertOctagon, 
  CheckCircle, 
  Camera, 
  Sliders, 
  RefreshCw, 
  Zap, 
  Waves, 
  Gauge, 
  ShieldCheck, 
  Sparkles,
  TreePine,
  Factory,
  Droplets
} from 'lucide-react';
import { PlantSensor } from '../types';
import { ENVIRONMENTAL_IMPACT_METRICS } from '../data/mockQmsData';

interface PlantVisionViewProps {
  sensors: PlantSensor[];
  isDarkTheme?: boolean;
}

interface VisionSample {
  id: string;
  name: string;
  description: string;
  purityScore: number;
  defectsDetected: number;
  status: 'Conforme' | 'Alerta' | 'Crítico';
  imagePlaceholderColor: string;
  detectedBoxes: { x: number; y: number; w: number; h: number; label: string }[];
}

const VISION_SAMPLES: VisionSample[] = [
  {
    id: 'sample-1',
    name: 'Pellet Negro HDPE Grado Inyección',
    description: 'Pellet homogéneo extrusionado a partir de redes de cerco anchoveteras.',
    purityScore: 99.8,
    defectsDetected: 0,
    status: 'Conforme',
    imagePlaceholderColor: '#0f172a',
    detectedBoxes: []
  },
  {
    id: 'sample-2',
    name: 'Escama Lavada con Resto de Arena Costera',
    description: 'Detección óptica de partículas minerales de arena de playa > 1.5mm.',
    purityScore: 95.4,
    defectsDetected: 3,
    status: 'Alerta',
    imagePlaceholderColor: '#1e293b',
    detectedBoxes: [
      { x: 28, y: 32, w: 18, h: 18, label: 'Arena Marina (2.1mm)' },
      { x: 62, y: 55, w: 14, h: 14, label: 'Gránulo cuarzo' },
      { x: 44, y: 72, w: 12, h: 12, label: 'Micro-conchuela' }
    ]
  },
  {
    id: 'sample-3',
    name: 'Muestra con Degradación UV Intensa',
    description: 'Filamentos expuestos a intemperie en caleta con amarilleo y pérdida de tracción.',
    purityScore: 91.2,
    defectsDetected: 4,
    status: 'Crítico',
    imagePlaceholderColor: '#334155',
    detectedBoxes: [
      { x: 20, y: 25, w: 28, h: 24, label: 'Oxidación Fotoquímica' },
      { x: 55, y: 35, w: 22, h: 20, label: 'Filamento Quebradizo' },
      { x: 38, y: 60, w: 25, h: 25, label: 'Degradación UV' }
    ]
  },
  {
    id: 'sample-4',
    name: 'Lote NetPlus Certificado para Gorras Patagonia',
    description: 'Polímero purificado 100% libre de halógenos y metales pesados.',
    purityScore: 100,
    defectsDetected: 0,
    status: 'Conforme',
    imagePlaceholderColor: '#0c4a6e',
    detectedBoxes: []
  }
];

export default function PlantVisionView({ sensors, isDarkTheme = false }: PlantVisionViewProps) {
  const [activeZone, setActiveZone] = useState<number>(3); // 1 to 4
  const [selectedSample, setSelectedSample] = useState<VisionSample>(VISION_SAMPLES[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [alertActive, setAlertActive] = useState<boolean>(false);

  // Environmental simulator state
  const [simulatedNetsTons, setSimulatedNetsTons] = useState<number>(1840);

  // Simulate scanning effect
  const handleTriggerScan = (sample: VisionSample) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  // Environmental calculations based on tons
  const calculatedCo2Tons = Math.round(simulatedNetsTons * 2.5);
  const calculatedWaterMillionLiters = (simulatedNetsTons * 0.01).toFixed(1);
  const calculatedVisors = Math.round(simulatedNetsTons * 500);
  const calculatedSkates = Math.round(simulatedNetsTons * 125);

  const zones = [
    { id: 1, name: '1. Acopio Costero', location: 'Chimbote & Paita', status: 'Operativo', items: 'Clasificación de redes, lavado primario' },
    { id: 2, name: '2. Molienda & Criba', location: 'Planta Principal', status: 'Operativo', items: 'Triturado a escamas de 12mm' },
    { id: 3, name: '3. Extrusora Doble Husillo', location: 'Línea de Pelletizado #1', status: alertActive ? 'Alerta Térmica' : 'Óptimo', items: 'Fusión 240°C y desgasificación al vacío' },
    { id: 4, name: '4. Visión Óptica & Big-Bags', location: 'Área Despacho', status: 'En Línea', items: 'Control granular e inspección continua' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Monitoreo de Planta IoT & Visión Artificial
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Telemetría en tiempo real de extrusión, control de calidad por imagen y balance ambiental
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAlertActive(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                alertActive 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{alertActive ? '¡Alerta Simulada Activa!' : 'Simular Alarma Térmica'}</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Redes IoT Conectadas (9/9)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Process Stages Navigation / Interactive Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {zones.map((zone) => {
          const isSelected = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-500 shadow-md shadow-blue-500/20 scale-[1.02]'
                  : isDarkTheme
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {zone.location}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  alertActive && zone.id === 3 ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'
                }`} />
              </div>
              <h3 className="font-bold text-sm">{zone.name}</h3>
              <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {zone.items}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left: IoT Sensor Telemetry, Right: Computer Vision Defect Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IoT Live Sensor Matrix (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-600" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  Sensores en Línea: Extrusora de Doble Husillo
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Frecuencia: 100ms
              </span>
            </div>

            {/* Sensor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sensors.map((sensor) => {
                const isTemp = sensor.name.includes('Temp');
                const isOverheated = alertActive && isTemp && sensor.id === 'sn-3';
                const displayValue = isOverheated ? sensor.value + 18 : sensor.value;
                const isAbnormal = displayValue > sensor.maxSafe || displayValue < sensor.minSafe;

                return (
                  <div 
                    key={sensor.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isAbnormal
                        ? 'bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
                        : isDarkTheme
                        ? 'bg-slate-800/60 border-slate-700/80 text-white'
                        : 'bg-slate-50 border-slate-200/90 text-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {sensor.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isAbnormal ? 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isAbnormal ? 'DESVIACIÓN' : 'NORMAL'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-1">
                      <span className={`text-2xl font-black font-mono tracking-tight ${
                        isAbnormal ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'
                      }`}>
                        {displayValue}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {sensor.unit}
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>Rango: {sensor.minSafe} a {sensor.maxSafe} {sensor.unit}</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{String(sensor.zone || 'Zona 1').split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Computer Vision Defect Scanner (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  Escáner Óptico de Partículas & Defectos
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                IA de Visión In-Line
              </span>
            </div>

            {/* Test Sample Selector Buttons */}
            <div className="space-y-1.5 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Seleccionar Muestra de Inspección:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {VISION_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleTriggerScan(sample)}
                    className={`p-2.5 text-left rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedSample.id === sample.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="block truncate">{sample.name}</span>
                    <span className={`text-[10px] block mt-0.5 ${
                      sample.status === 'Conforme' ? 'text-emerald-600' : sample.status === 'Alerta' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {sample.purityScore}% Pureza • {sample.defectsDetected} Defectos
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Camera Viewfinder with Bounding Boxes */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center p-4">
              {/* Scanline animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none animate-scanline" />

              {/* Grid overlay */}
              <div className="absolute inset-0 cyber-grid-dark opacity-30 pointer-events-none" />

              {/* Viewfinder crosshairs */}
              <div className="absolute top-3 left-3 text-cyan-400 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                CAM-INSPECTION-04 • 120 FPS
              </div>

              <div className="absolute bottom-3 left-3 text-slate-400 font-mono text-[10px]">
                ISO-SENSITIVITY: 400 • EXPOSURE: 1/800s
              </div>

              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded font-mono text-xs font-black ${
                  selectedSample.status === 'Conforme'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : selectedSample.status === 'Alerta'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                }`}>
                  {selectedSample.status.toUpperCase()}
                </span>
              </div>

              {/* Central Sample Graphic with Visual Bounding Boxes */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Simulated Polymer visual */}
                <div 
                  className="w-48 h-32 rounded-xl shadow-2xl border border-slate-700 flex flex-col items-center justify-center text-center p-3 relative"
                  style={{ backgroundColor: selectedSample.imagePlaceholderColor }}
                >
                  <span className="text-white font-mono font-bold text-xs">
                    {selectedSample.name}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {selectedSample.description}
                  </span>

                  {/* Bounding Boxes on defects */}
                  {selectedSample.detectedBoxes.map((box, idx) => (
                    <div 
                      key={idx}
                      className="absolute border-2 border-rose-500 bg-rose-500/20 rounded pointer-events-none animate-pulse"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] font-mono font-bold bg-rose-600 text-white px-1 rounded whitespace-nowrap">
                        {box.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scanning indicator */}
              {isScanning && (
                <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-xs flex items-center justify-center text-cyan-300 font-mono font-bold text-xs gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>ANALIZANDO ESPECTRO ÓPTICO...</span>
                </div>
              )}
            </div>

            {/* Scan Results Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-bold">Pureza de Lote por IA:</span>
                <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                  {selectedSample.purityScore}% Pureza
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[11px] font-bold">Partículas Rechazadas:</span>
                <span className="font-mono font-black text-base text-rose-600">
                  {selectedSample.defectsDetected} impurezas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental & NetPositiva Impact Calculator (Bureo x Patagonia) */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Calculadora de Huella Positiva NetPositiva
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Bureo x Patagonia
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transformación medible de redes de pesca descartadas en productos circulares de alto valor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Toneladas de Redes:</span>
            <span className="font-mono font-black text-lg px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600">
              {simulatedNetsTons.toLocaleString()} Ton
            </span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Ajustar volumen de redes marinas recicladas (Perú & Chile):</span>
            <span className="font-mono text-emerald-600 font-black">{simulatedNetsTons * 1000} Kg Reciclados</span>
          </div>
          <input 
            type="range"
            min="200"
            max="5000"
            step="50"
            value={simulatedNetsTons}
            onChange={(e) => setSimulatedNetsTons(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>200 Toneladas</span>
            <span>2,500 Toneladas</span>
            <span>5,000 Toneladas</span>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
            <span className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              CO₂ Evitado a la Atmósfera
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block">
              {calculatedCo2Tons.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
              Toneladas métricas de CO₂eq mitigadas vs plástico virgen
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-800 text-sky-950 dark:text-sky-200">
            <span className="text-[11px] uppercase font-bold text-sky-700 dark:text-sky-400 block mb-1">
              Ahorro de Agua Potable
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block">
              {calculatedWaterMillionLiters}M
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 mt-1 block">
              Millones de litros de agua preservados en proceso
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
            <span className="text-[11px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
              Viseras Patagonia NetPlus
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block">
              {calculatedVisors.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 block">
              Unidades manufacturadas con 100% redes recicladas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800 text-teal-950 dark:text-teal-200">
            <span className="text-[11px] uppercase font-bold text-teal-700 dark:text-teal-400 block mb-1">
              Comunidades Artesanales
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block">
              48 Caletas
            </span>
            <span className="text-xs text-teal-600 dark:text-teal-400 mt-1 block">
              Pescadores remunerados en Chimbote, Pisco, Paita y Chile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
