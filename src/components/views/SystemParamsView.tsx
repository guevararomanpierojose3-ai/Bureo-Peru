import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Target, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Save, 
  MapPin, 
  Sliders,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CompanyConfig, SystemTheme } from '../../types';

interface SystemParamsViewProps {
  companyConfig: CompanyConfig;
  onUpdateCompanyConfig: (config: CompanyConfig) => void;
  currentTheme: SystemTheme;
  onChangeTheme: (theme: SystemTheme) => void;
  isDarkTheme?: boolean;
}

export default function SystemParamsView({
  companyConfig,
  onUpdateCompanyConfig,
  currentTheme,
  onChangeTheme,
  isDarkTheme = false
}: SystemParamsViewProps) {
  const [form, setForm] = useState<CompanyConfig>(companyConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Targets state
  const [maxContaminationTarget, setMaxContaminationTarget] = useState(1.5);
  const [minCapaEfficiencyTarget, setMinCapaEfficiencyTarget] = useState(90.0);
  const [maxNcCloseDaysTarget, setMaxNcCloseDaysTarget] = useState(7);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyConfig(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const themeOptions: { id: SystemTheme; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'ocean',
      name: 'Azul Océano Industrial',
      desc: 'Colores de alta visibilidad para plantas de procesamiento',
      colors: ['bg-blue-600', 'bg-blue-100', 'bg-slate-900']
    },
    {
      id: 'eco',
      name: 'Verde Eco Sostenible',
      desc: 'Enfoque ecológico NetPlus® y economía circular marina',
      colors: ['bg-emerald-600', 'bg-emerald-100', 'bg-slate-900']
    },
    {
      id: 'cobalt',
      name: 'Cobalto Oscuro',
      desc: 'Monitores de control y salas de supervisión',
      colors: ['bg-indigo-600', 'bg-indigo-100', 'bg-slate-900']
    },
    {
      id: 'dark',
      name: 'Modo Noche Alta Densidad',
      desc: 'Para turnos nocturnos en planta y reducción de fatiga visual',
      colors: ['bg-slate-800', 'bg-slate-950', 'bg-cyan-500']
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                  Configuración Global
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
                  Bureo NetPlus®
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Parámetros del Sistema, Identidad & Metas QMS
              </h2>
              <p className="text-xs text-slate-500">
                Ajuste de datos corporativos, membrete oficial, tolerancias operativas y temas visuales.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configuración guardada</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Empresa y Membrete */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Identidad Corporativa y Membrete Oficial
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Estos datos aparecerán en los encabezados de reportes oficiales, exportaciones e interfaz.
          </p>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Razón Social de la Empresa</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">RUC / Registro Tributario</label>
                <input
                  type="text"
                  value={form.taxId || ''}
                  onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                  placeholder="20601234567"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Teléfono / Celular de Contacto</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+51 987 654 321"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Dirección de Planta / Sede Principal</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Carretera Paita - Sullana Km 3.5, Piura, Perú"
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">URL del Logo Institucional</label>
              <input
                type="url"
                value={form.logoUrl || ''}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Datos Corporativos</span>
              </button>
            </div>
          </form>
        </div>

        {/* Metas y Tolerancias Operacionales */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            Tolerancias & Metas Normativas
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Límites para las alertas de semáforo y desviaciones de calidad.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Límite Máximo de Contaminación (%)</span>
                <span className="font-mono font-bold text-rose-600">{maxContaminationTarget}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={maxContaminationTarget}
                onChange={(e) => setMaxContaminationTarget(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">Valores mayores a esta meta disparan alerta en tablero.</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Meta Mínima de Eficacia CAPA (%)</span>
                <span className="font-mono font-bold text-emerald-600">{minCapaEfficiencyTarget}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                step="1"
                value={minCapaEfficiencyTarget}
                onChange={(e) => setMinCapaEfficiencyTarget(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">Porcentaje mínimo de acciones cerradas con éxito.</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">SLA Máximo de Cierre de NC (Días)</span>
                <span className="font-mono font-bold text-blue-600">{maxNcCloseDaysTarget} días</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={maxNcCloseDaysTarget}
                onChange={(e) => setMaxNcCloseDaysTarget(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">Tiempo límite antes de marcar la NC como "Vencida".</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paleta y Temas Oficiales (#49) */}
      <div className={`p-6 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-600" />
          Temas Visuales de Alta Visibilidad
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Selecciona la paleta de colores para optimizar el contraste según el ambiente de trabajo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themeOptions.map((opt) => {
            const isSelected = currentTheme === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => onChangeTheme(opt.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {opt.desc}
                  </p>
                </div>

                <div className="mt-4 flex gap-1.5">
                  {opt.colors.map((c, i) => (
                    <div key={i} className={`w-6 h-6 rounded-lg ${c} border border-black/10`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
