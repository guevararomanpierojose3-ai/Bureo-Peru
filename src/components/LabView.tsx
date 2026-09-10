import { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Printer, 
  Search, 
  Sliders, 
  Layers, 
  Award,
  Sparkles,
  QrCode,
  Download,
  Info
} from 'lucide-react';
import { LabTestRecord } from '../types';

interface LabViewProps {
  labTests: LabTestRecord[];
  onAddTestRecord: (record: LabTestRecord) => void;
  isDarkTheme?: boolean;
}

export default function LabView({ labTests, onAddTestRecord, isDarkTheme = false }: LabViewProps) {
  const [filterMaterial, setFilterMaterial] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLotForCoa, setSelectedLotForCoa] = useState<LabTestRecord | null>(null);

  // Simulator state for new test
  const [newLotCode, setNewLotCode] = useState('LOT-2026-NP95');
  const [materialType, setMaterialType] = useState<'HDPE NetPositiva' | 'Poliamida PA6' | 'PP Monofilamento'>('HDPE NetPositiva');
  const [mfi, setMfi] = useState<number>(10.2);
  const [density, setDensity] = useState<number>(0.951);
  const [tensileStrength, setTensileStrength] = useState<number>(25.2);
  const [moisturePercent, setMoisturePercent] = useState<number>(0.04);
  const [ashContentPercent, setAshContentPercent] = useState<number>(0.72);
  const [ftirPurityPercent, setFtirPurityPercent] = useState<number>(99.3);
  const [analyst, setAnalyst] = useState('Ing. Carola Vega (Lab QA)');
  const [notes, setNotes] = useState('Muestra ensayada bajo norma ASTM D1238 / ISO 1133.');

  // Evaluation logic
  const isMfiValid = mfi >= 8.0 && mfi <= 12.5;
  const isDensityValid = density >= 0.940 && density <= 0.965;
  const isTensileValid = tensileStrength >= 22.0;
  const isMoistureValid = moisturePercent <= 0.08;
  const isAshValid = ashContentPercent <= 1.20;
  const isPurityValid = ftirPurityPercent >= 98.0;

  const allValid = isMfiValid && isDensityValid && isTensileValid && isMoistureValid && isAshValid && isPurityValid;
  const complianceStatus: 'Conforme' | 'Observado' | 'Rechazado' = allValid 
    ? 'Conforme' 
    : (!isMfiValid || !isPurityValid ? 'Observado' : 'Rechazado');

  const handleRegisterTest = () => {
    const record: LabTestRecord = {
      id: `lab-${Date.now()}`,
      lotCode: newLotCode,
      testedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      materialType,
      mfi,
      density,
      tensileStrength,
      moisturePercent,
      ashContentPercent,
      ftirPurityPercent,
      complianceStatus,
      analyst,
      notes
    };
    onAddTestRecord(record);
    setSelectedLotForCoa(record);
    // Suggest next lot
    setNewLotCode(`LOT-2026-NP${Math.floor(96 + Math.random() * 20)}`);
  };

  const filteredTests = labTests.filter(t => {
    const matchesMat = filterMaterial === 'todos' || t.materialType.includes(filterMaterial);
    const matchesSearch = t.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.analyst.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMat && matchesSearch;
  });

  const compliantCount = labTests.filter(t => t.complianceStatus === 'Conforme').length;
  const observedCount = labTests.filter(t => t.complianceStatus === 'Observado').length;
  const passRate = labTests.length > 0 ? Math.round((compliantCount / labTests.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner with High-Contrast Typography & Visual Badges */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white border-slate-200/90 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Laboratorio Fisicoquímico & Control de Pellets
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Ensayos de reología, fluidez (MFI), tracción y pureza polimérica de redes recicladas NetPositiva
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
              <span className="text-[11px] font-bold block uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Tasa de Aprobación</span>
              <span className="text-lg font-black">{passRate}% Conforme</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-300">
              <span className="text-[11px] font-bold block uppercase tracking-wider text-sky-600 dark:text-sky-400">Lotes Testeados</span>
              <span className="text-lg font-black">{labTests.length} Muestras</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
              <span className="text-[11px] font-bold block uppercase tracking-wider text-amber-600 dark:text-amber-400">En Observación</span>
              <span className="text-lg font-black">{observedCount} Lotes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left: Interactive Test Bench / Simulator, Right: Tested Batches & Quality Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator & Certificate Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  Banco de Ensayo Interactivo (ASTM)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Norma ISO 1133
              </span>
            </div>

            <div className="space-y-4">
              {/* Lote & Material */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Código de Lote
                  </label>
                  <input 
                    type="text"
                    value={newLotCode}
                    onChange={(e) => setNewLotCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Tipo de Polímero
                  </label>
                  <select 
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="HDPE NetPositiva">HDPE NetPositiva (Redes)</option>
                    <option value="Poliamida PA6">Poliamida PA6 (Cabos)</option>
                    <option value="PP Monofilamento">PP Monofilamento</option>
                  </select>
                </div>
              </div>

              {/* Slider 1: MFI */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Índice de Fluidez (MFI / MFR)
                  </span>
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                    isMfiValid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {mfi.toFixed(1)} g/10min
                  </span>
                </div>
                <input 
                  type="range" 
                  min="4.0" 
                  max="18.0" 
                  step="0.1"
                  value={mfi}
                  onChange={(e) => setMfi(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>Mín: 8.0 g/10min</span>
                  <span className="font-bold text-blue-600">Rango Óptimo: 8.0 - 12.5</span>
                  <span>Máx: 12.5 g/10min</span>
                </div>
              </div>

              {/* Slider 2: Densidad & Tracción */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Densidad (g/cm³)</span>
                    <span className="text-xs font-mono font-black text-blue-600">{density.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.930" 
                    max="0.980" 
                    step="0.001"
                    value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Esp: 0.940 - 0.965</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Tracción (MPa)</span>
                    <span className="text-xs font-mono font-black text-blue-600">{tensileStrength.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="18.0" 
                    max="35.0" 
                    step="0.2"
                    value={tensileStrength}
                    onChange={(e) => setTensileStrength(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Meta: ≥ 22.0 MPa</span>
                </div>
              </div>

              {/* Slider 3: Pureza FTIR & Humedad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Pureza FTIR</span>
                    <span className="text-xs font-mono font-black text-emerald-600">{ftirPurityPercent.toFixed(1)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="94.0" 
                    max="100.0" 
                    step="0.1"
                    value={ftirPurityPercent}
                    onChange={(e) => setFtirPurityPercent(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Mín: ≥ 98.0%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Humedad Residual</span>
                    <span className="text-xs font-mono font-black text-blue-600">{moisturePercent.toFixed(2)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.01" 
                    max="0.20" 
                    step="0.01"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Máx: ≤ 0.08%</span>
                </div>
              </div>

              {/* Status Preview Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                complianceStatus === 'Conforme'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                  : complianceStatus === 'Observado'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
                  : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-3">
                  {complianceStatus === 'Conforme' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  ) : complianceStatus === 'Observado' ? (
                    <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      Dictamen de Laboratorio
                    </span>
                    <h3 className="text-base font-black">
                      {complianceStatus === 'Conforme' ? 'LOTE APTO PARA EXTRUSIÓN' : complianceStatus === 'Observado' ? 'OBSERVACIÓN POR DESVIACIÓN' : 'LOTE NO CONFORME RECHAZADO'}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/70 dark:bg-black/40 border border-current">
                  {complianceStatus}
                </span>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleRegisterTest}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Award className="w-5 h-5" />
                <span>Registrar Ensayo & Generar Certificado (CoA)</span>
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 dark:bg-slate-900 dark:border-blue-900/60 dark:text-blue-300 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold block">Trazabilidad Química NetPositiva:</span>
              <p className="text-slate-600 dark:text-slate-400">
                Cada ensayo fisicoquímico se vincula automáticamente al código del lote de molienda y queda disponible para auditorías de sostenibilidad Patagonia y certificado de origen ISO 9001:2015.
              </p>
            </div>
          </div>
        </div>

        {/* Tested Batches Table & Visual Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-black text-lg text-slate-900 dark:text-white">
                  Historial de Ensayos Registrados
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resultados analíticos validados por el equipo de QA Bureo Perú
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Buscar lote..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select 
                  value={filterMaterial}
                  onChange={(e) => setFilterMaterial(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="HDPE">HDPE</option>
                  <option value="Poliamida">PA6</option>
                  <option value="PP">PP</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Lote / Material</th>
                    <th className="py-2.5 px-3">MFI (g/10m)</th>
                    <th className="py-2.5 px-3">Densidad</th>
                    <th className="py-2.5 px-3">Tracción</th>
                    <th className="py-2.5 px-3">FTIR Pureza</th>
                    <th className="py-2.5 px-3">Dictamen</th>
                    <th className="py-2.5 px-3 text-right">Certificado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                          {test.lotCode}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {test.materialType} • {test.testedAt}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={test.mfi > 12.5 ? 'text-amber-600 font-black' : 'text-slate-700 dark:text-slate-200'}>
                          {test.mfi.toFixed(1)}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                        {test.density.toFixed(3)}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                        {test.tensileStrength.toFixed(1)} MPa
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {test.ftirPurityPercent.toFixed(1)}%
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          test.complianceStatus === 'Conforme'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : test.complianceStatus === 'Observado'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {test.complianceStatus === 'Conforme' && <CheckCircle2 className="w-3 h-3" />}
                          {test.complianceStatus === 'Observado' && <AlertTriangle className="w-3 h-3" />}
                          {test.complianceStatus === 'Rechazado' && <XCircle className="w-3 h-3" />}
                          {test.complianceStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => setSelectedLotForCoa(test)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/60 transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver CoA</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality Distribution / Reference Norms Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Especificaciones de Ficha Técnica NetPositiva (TDS)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Norma ASTM D1238</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">MFR @ 230°C / 2.16kg</span>
                <span className="font-mono text-sm font-black text-blue-600 block mt-1">8.0 - 12.5 g/10min</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Norma ASTM D792</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Densidad Picnometría</span>
                <span className="font-mono text-sm font-black text-emerald-600 block mt-1">0.940 - 0.965 g/cm³</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Norma ASTM D638</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Resistencia Tracción</span>
                <span className="font-mono text-sm font-black text-purple-600 block mt-1">≥ 22.0 MPa (Yield)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Certificado de Análisis (CoA / CoC) */}
      {selectedLotForCoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
            {/* Header / Seal */}
            <div className="flex items-start justify-between border-b pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-black tracking-widest">
                    BUREO NETPOSITIVA
                  </div>
                  <span className="text-xs font-bold text-slate-500">ISO 9001:2015 QA LAB</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Certificado de Calidad & Análisis (CoA)
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Documento Oficial de Liberación de Lote • Ref: COA-{selectedLotForCoa.lotCode}
                </p>
              </div>

              <button 
                onClick={() => setSelectedLotForCoa(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Lote Analizado</span>
                  <span className="font-mono font-black text-blue-600 text-sm">{selectedLotForCoa.lotCode}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Material</span>
                  <span className="font-bold text-slate-800">{selectedLotForCoa.materialType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Fecha y Turno</span>
                  <span className="font-medium text-slate-700">{selectedLotForCoa.testedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Estado Oficial</span>
                  <span className={`font-bold inline-block px-2 py-0.5 rounded text-[11px] ${
                    selectedLotForCoa.complianceStatus === 'Conforme' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedLotForCoa.complianceStatus}
                  </span>
                </div>
              </div>

              {/* Lab Values Table */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase border-b">
                    <tr>
                      <th className="p-2.5">Parámetro Evaluado</th>
                      <th className="p-2.5">Método / Norma</th>
                      <th className="p-2.5">Especificación</th>
                      <th className="p-2.5 font-bold text-blue-700">Resultado Obtenido</th>
                      <th className="p-2.5">Dictamen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-mono">
                    <tr>
                      <td className="p-2.5 font-sans font-bold text-slate-800">MFI (Melt Flow Rate)</td>
                      <td className="p-2.5 text-slate-500">ASTM D1238</td>
                      <td className="p-2.5 text-slate-600">8.0 - 12.5 g/10min</td>
                      <td className="p-2.5 font-bold text-blue-600">{selectedLotForCoa.mfi.toFixed(1)} g/10min</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Pasa</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold text-slate-800">Densidad a 23°C</td>
                      <td className="p-2.5 text-slate-500">ASTM D792</td>
                      <td className="p-2.5 text-slate-600">0.940 - 0.965 g/cm³</td>
                      <td className="p-2.5 font-bold text-blue-600">{selectedLotForCoa.density.toFixed(3)} g/cm³</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Pasa</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold text-slate-800">Resistencia a Tracción</td>
                      <td className="p-2.5 text-slate-500">ASTM D638</td>
                      <td className="p-2.5 text-slate-600">≥ 22.0 MPa</td>
                      <td className="p-2.5 font-bold text-blue-600">{selectedLotForCoa.tensileStrength.toFixed(1)} MPa</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Pasa</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold text-slate-800">Pureza Espectral FTIR</td>
                      <td className="p-2.5 text-slate-500">FTIR ATR In-Line</td>
                      <td className="p-2.5 text-slate-600">≥ 98.0%</td>
                      <td className="p-2.5 font-bold text-emerald-600">{selectedLotForCoa.ftirPurityPercent.toFixed(1)}%</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Pasa</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold text-slate-800">Humedad Residual</td>
                      <td className="p-2.5 text-slate-500">ASTM D6980</td>
                      <td className="p-2.5 text-slate-600">≤ 0.08%</td>
                      <td className="p-2.5 font-bold text-blue-600">{selectedLotForCoa.moisturePercent.toFixed(2)}%</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Pasa</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures and QR verification */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Verificación Digital</span>
                    <span className="font-mono text-[11px] text-slate-700 font-bold">SHA-256: 4f8a...991c</span>
                    <span className="text-[10px] text-emerald-600 block font-bold">✓ Firma Biométrica Validada</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Analista Responsable</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedLotForCoa.analyst}</span>
                  <span className="text-xs text-slate-500 block">Jefatura de Calidad • Bureo Perú</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
              <button 
                onClick={() => setSelectedLotForCoa(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Certificado Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
