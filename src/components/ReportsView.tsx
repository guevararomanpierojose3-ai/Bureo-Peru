import { useState } from 'react';
import { 
  FileDown, 
  FileSpreadsheet, 
  ShieldCheck, 
  QrCode, 
  Send, 
  Mail, 
  Clock, 
  CheckCircle, 
  Sliders, 
  Sparkles, 
  Printer, 
  ChevronRight, 
  TrendingUp, 
  Image as ImageIcon,
  Radio,
  FileText,
  Download,
  Share2
} from 'lucide-react';

interface ReportsViewProps {
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onOpenHtmlLinker: () => void;
  isDarkTheme?: boolean;
}

export default function ReportsView({ 
  onOpenLightbox, 
  onOpenHtmlLinker,
  isDarkTheme = true 
}: ReportsViewProps) {
  const [activePeriod, setActivePeriod] = useState<'mensual' | 'semanal' | 'diario' | 'area'>('mensual');
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess('Dossier Ejecutivo Q1-2026 generado y firmado con checksum SHA-256');
      setTimeout(() => setExportSuccess(null), 3500);
    }, 1000);
  };

  const handleExportExcel = () => {
    setExportSuccess('Tablas maestras exportadas para Google Sheets / Excel (.xlsx)');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Subheader status bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-slate-300' 
          : 'bg-white/80 border-slate-200 backdrop-blur-xl text-slate-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
            <Radio className="w-3 h-3 text-cyan-400" />
            DOSSIERS EJECUTIVOS & AUDITORÍA
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">ISO 9001:2015</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline">GAS v2.4 Activo</span>
        </div>
        <span className="text-xs font-mono text-cyan-400">142 registros calificados</span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
            Centro de Reportes & Certificación
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Generación automatizada de informes de calidad, balance de masas NetPositiva y dossiers PDF
          </p>
        </div>

        <button
          onClick={onOpenHtmlLinker}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all self-start ${
            isDarkTheme 
              ? 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-cyan-500/30' 
              : 'bg-white hover:bg-slate-50 text-blue-700 border-blue-200 shadow-xs'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Vincular Fotos en HTML</span>
        </button>
      </div>

      {/* Period Filter Buttons */}
      <div className={`flex flex-wrap gap-1.5 p-1 rounded-2xl border self-start ${
        isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {[
          { id: 'mensual', label: 'Mensual (Q1-2026)' },
          { id: 'semanal', label: 'Semanal' },
          { id: 'diario', label: 'Diario Planta' },
          { id: 'area', label: 'Por Área / Lote' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActivePeriod(btn.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activePeriod === btn.id
                ? isDarkTheme 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                  : 'bg-blue-600 text-white shadow-xs'
                : isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Success notification banner */}
      {exportSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Featured Executive Report Card */}
      <div className={`rounded-2xl p-5 sm:p-6 border transition-all space-y-4 ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white shadow-2xl' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Informe Mensual Consolidado (Enero 2026)</h3>
              <p className="text-xs font-mono text-slate-400">Generado automáticamente por Apps Script • QMS-REP-2026-01</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
            LISTO PARA FIRMA
          </span>
        </div>

        {/* Executive summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Índice ICG Mensual</span>
            <span className="text-xl font-extrabold font-mono text-cyan-400">94.8%</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">Meta: 95.0%</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Masa Procesada</span>
            <span className="text-xl font-extrabold font-mono text-white">1,920 kg</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">+8.4% vs Dic</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">NCs Resueltas</span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">11 / 15</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">73.3% cierre</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Eficiencia Térmica</span>
            <span className="text-xl font-extrabold font-mono text-white">96.2%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Línea Extrusión</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Generando PDF con Firma Digital...' : 'Descargar Dossier Ejecutivo (PDF)'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
              isDarkTheme 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Matriz (.XLSX)</span>
          </button>
        </div>
      </div>

      {/* Automated Dispatch Configuration */}
      <div className={`rounded-2xl p-5 border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-extrabold">Distribución Automatizada de Auditoría</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">CRON DIARIO 06:00 UTC</span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Los reportes se compilan automáticamente desde Google Apps Script y se despachan a la directiva de calidad y auditores externos de Bureo y Patagonia.
        </p>

        <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
          isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-slate-300">gerencia.calidad@bureo.com.pe, auditoria.iso@bureo.com</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            VERIFICADO
          </span>
        </div>
      </div>
    </div>
  );
}
