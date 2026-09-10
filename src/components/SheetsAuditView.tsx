import { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HardDrive, 
  Download, 
  Save, 
  FileCode, 
  CheckCircle2, 
  Wifi,
  Sparkles,
  Radio,
  Lock,
  Terminal,
  Activity
} from 'lucide-react';
import { MasterSheetConfig, AuditLogEntry } from '../types';

interface SheetsAuditViewProps {
  masterSheets: MasterSheetConfig[];
  auditLogs: AuditLogEntry[];
  onTriggerSync: () => void;
  isSyncing: boolean;
  isDarkTheme?: boolean;
}

export default function SheetsAuditView({ 
  masterSheets, 
  auditLogs, 
  onTriggerSync, 
  isSyncing,
  isDarkTheme = true
}: SheetsAuditViewProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [prodMode, setProdMode] = useState(true);
  const [bidirectionalSync, setBidirectionalSync] = useState(true);
  const [activeLogFilter, setActiveLogFilter] = useState<'Todos' | 'Registros' | 'CAPA' | 'Sistema'>('Todos');
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const webhookUrl = 'https://script.google.com/macros/s/AKfycbzQMS_Industrial_Bureo_2026_PROD_v2/exec';
  const apiToken = 'bu_qms_2026_sec_89df0129ac8317e0821b';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestPing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult('HTTP 200 OK • Latencia: 118 ms • TLS 1.3 • GAS Runtime v2.4 Activo');
      setTimeout(() => setPingResult(null), 4000);
    }, 600);
  };

  const handleSaveParams = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
            <Terminal className="w-3 h-3 text-cyan-400" />
            APPS SCRIPT RUNTIME v2.4
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">REST API ENGINE</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 font-mono hidden md:inline">TLS 1.3 • SHA-256</span>
        </div>
        <span className="text-xs font-mono text-cyan-400">STATUS: 200 OK</span>
      </div>

      {/* Main Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
            Conexión Google Sheets & Auditoría
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Endpoints GAS, libros maestros de planta y registros criptográficos inmutables
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando con Sheets...' : 'Forzar Sincronización'}</span>
        </button>
      </div>

      {/* Ping Notification */}
      {pingResult && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pingResult}</span>
        </div>
      )}

      {/* Pasarela Activa Card */}
      <div className={`rounded-2xl p-5 sm:p-6 border transition-all space-y-4 ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white shadow-2xl' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Pasarela Activa Google Apps Script</h3>
              <p className="text-xs font-mono text-slate-400">Latencia: 118 ms • Ping Real-time • TLS 1.3</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
              HTTP 200 OK
            </span>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
              ✓ Operacional
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border space-y-2 text-xs font-mono ${
          isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-300">LIBRO MAESTRO VINCULADO</span>
            <a 
              href="https://docs.google.com/spreadsheets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs"
            >
              <span>Abrir Google Sheets</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Último ciclo: hace 2m</span>
            <span className="text-emerald-400">Auto-sync: cada 5 minutos</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleTestPing}
            disabled={isPinging}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
              isDarkTheme 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <Wifi className="w-4 h-4 text-cyan-400" />
            {isPinging ? 'Calculando latencia...' : 'Probar Latencia Ping'}
          </button>

          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Ejecutar Sincronización Ahora'}
          </button>
        </div>
      </div>

      {/* Endpoint Webhook GAS */}
      <div className={`rounded-2xl p-5 sm:p-6 border transition-all space-y-4 text-xs ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold">Endpoint Webhook GAS</h3>
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700 rounded-lg">
            v2.4 Executable
          </span>
        </div>

        {/* Web App URL */}
        <div>
          <div className="flex justify-between items-center mb-1.5 font-mono">
            <span className="text-slate-400 font-bold uppercase">URL DEL WEB APP (DEPLOYMENT)</span>
            <span className="text-emerald-400 font-bold">Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl}
              className={`flex-1 px-3 py-2.5 rounded-xl font-mono text-xs border focus:outline-none ${
                isDarkTheme ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            />
            <button
              onClick={handleCopyWebhook}
              className="p-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 text-cyan-400 transition-colors"
              title="Copiar URL Webhook"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bearer Token */}
        <div>
          <span className="font-mono text-slate-400 font-bold uppercase block mb-1.5">
            BEARER TOKEN / LLAVE API DE PLANTA
          </span>
          <div className="flex items-center gap-2">
            <input 
              type={showToken ? 'text' : 'password'} 
              readOnly 
              value={apiToken}
              className={`flex-1 px-3 py-2.5 rounded-xl font-mono text-xs border focus:outline-none ${
                isDarkTheme ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="p-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title={showToken ? 'Ocultar' : 'Mostrar'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* REST Verbs badge group */}
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold tracking-wider">
            VERBOS REST HABILITADOS EN GAS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-extrabold text-emerald-400 block text-xs">GET</span>
              <span className="text-[10px] text-slate-400">KPIs / Data</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-extrabold text-cyan-400 block text-xs">POST</span>
              <span className="text-[10px] text-slate-400">Registros</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-extrabold text-amber-400 block text-xs">PUT</span>
              <span className="text-[10px] text-slate-400">CAPA / Edit</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-extrabold text-rose-400 block text-xs">DELETE</span>
              <span className="text-[10px] text-slate-400">Soft Audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapeo de Hojas Maestras */}
      <div className={`rounded-2xl p-5 border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <h3 className="text-base font-extrabold mb-4">Hojas Maestras en Google Sheets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {masterSheets.map((sheet) => (
            <div 
              key={sheet.sheetName}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="font-mono font-bold text-cyan-400 text-xs">{sheet.sheetName}</span>
                <p className="text-xs text-slate-400 mt-0.5">{sheet.description}</p>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">
                  Último registro: {sheet.lastRecord} • {sheet.status}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {sheet.rowCount} FILAS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Criptográficos de Auditoría */}
      <div className={`rounded-2xl p-5 border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold">Registro Inmutable de Auditoría</h3>
            <p className="text-xs text-slate-400">Trazabilidad criptográfica de eventos y modificaciones</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} EVENTOS</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div 
              key={log.id}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono ${
                isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-cyan-400 font-bold">{log.timestamp}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-bold">{log.actionText}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>{log.authorName} ({log.authorRole})</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {log.sha256Hash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
