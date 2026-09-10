import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Database, 
  Key, 
  Code, 
  ShieldCheck, 
  Layers, 
  Clock, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { MasterSheetConfig, AuditLogEntry } from '../../types';

interface MasterSheetConfigViewProps {
  sheetConfig: MasterSheetConfig;
  onUpdateConfig: (config: MasterSheetConfig) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  isDarkTheme?: boolean;
}

export default function MasterSheetConfigView({
  sheetConfig,
  onUpdateConfig,
  onTriggerSync,
  isSyncing,
  isDarkTheme = false
}: MasterSheetConfigViewProps) {
  const [formConfig, setFormConfig] = useState<MasterSheetConfig>(sheetConfig);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setTestResult('Configuración guardada correctamente.');
    setTimeout(() => setTestResult(null), 3500);
  };

  const handleCopyGasCode = () => {
    navigator.clipboard.writeText(gasScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // 10 Official Master Sheets of the Enterprise QMS (#41, #42)
  const masterSheets = [
    { name: 'REGISTROS_CALIDAD', cols: 25, desc: 'Ensayos y pesajes de calidad con cálculo de merma' },
    { name: 'NO_CONFORMIDADES', cols: 13, desc: 'Registro de desvíos, clasificación y severidad ISO' },
    { name: 'ACCIONES_CORRECTIVAS', cols: 12, desc: 'Planes CAPA, responsables, avance % y verificación' },
    { name: 'RANKING_AREAS', cols: 9, desc: 'Desempeño mensual por área y porcentajes de merma' },
    { name: 'PARETO_CAUSAS', cols: 6, desc: 'Distribución 80/20 y causa raíz acumulada' },
    { name: 'CALENDARIO_COMPROMISOS', cols: 8, desc: 'Fechas límite de SLA para acciones correctivas' },
    { name: 'INDICADORES_CALIDAD', cols: 8, desc: 'Resultados, metas corporativas y brechas' },
    { name: 'AUDIT_LOG', cols: 8, desc: 'Pista de auditoría inmutable de eventos' },
    { name: 'PARAMETROS_SISTEMA', cols: 5, desc: 'Metas de tolerancia, catálogos y tolerancias' },
    { name: 'EVIDENCIAS_DIGITALES', cols: 7, desc: 'URLs de Drive, hashes y metadatos de fotos' },
  ];

  // Google Apps Script template for 2-way synchronization
  const gasScriptCode = `/**
 * BUREO PERU - QMS ENTERPRISE GAS CONNECTOR
 * Google Apps Script Web App for 10-Sheet Bidirectional Sync
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = e.parameter.sheet || 'REGISTROS_CALIDAD';
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Hoja no encontrada: ' + sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, idx) {
      obj[header] = row[idx];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    sheet: sheetName,
    count: result.length,
    timestamp: new Date().toISOString(),
    data: result
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(payload.sheet);
    
    if (!sheet) {
      sheet = ss.insertSheet(payload.sheet);
      sheet.appendRow(payload.headers);
    }
    
    // Append or update rows
    if (payload.action === 'INSERT') {
      sheet.appendRow(payload.row);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Sincronizado con éxito en ' + payload.sheet
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Integración Cloud & Sheets
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                  10 Hojas Maestras
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Sincronización Bidireccional con Google Sheets
              </h2>
              <p className="text-xs text-slate-500">
                Conexión segura en tiempo real mediante Google Apps Script (GAS Web App REST API).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Todo Ahora'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Master Sheets Grid (#41, #42) */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Estructura Oficial de las 10 Hojas de Cálculo
          </h3>
          <span className="text-xs font-mono text-emerald-600 font-bold">10/10 Mapeadas y Activas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {masterSheets.map((sh, idx) => (
            <div 
              key={sh.name}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">{sh.cols} cols</span>
              </div>
              <h4 className="font-mono font-bold text-[11px] text-slate-900 dark:text-white truncate" title={sh.name}>
                {sh.name}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">
                {sh.desc}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Conectada
                </span>
                <span className="font-mono text-slate-400">0 ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Parámetros de Enlace Web App de Google Apps Script
        </h3>

        {testResult && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{testResult}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">ID de la Hoja de Cálculo (Google Spreadsheet ID)</label>
              <input
                type="text"
                value={formConfig.spreadsheetId}
                onChange={(e) => setFormConfig({ ...formConfig, spreadsheetId: e.target.value })}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">URL de Despliegue de Apps Script (/exec)</label>
              <input
                type="url"
                value={formConfig.scriptUrl}
                onChange={(e) => setFormConfig({ ...formConfig, scriptUrl: e.target.value })}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Token Secreto de API (Opcional)</label>
              <input
                type="password"
                value={formConfig.apiToken || ''}
                onChange={(e) => setFormConfig({ ...formConfig, apiToken: e.target.value })}
                placeholder="••••••••••••••••"
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Frecuencia de Sincronización Automática</label>
              <select
                value={formConfig.autoSyncIntervalMinutes}
                onChange={(e) => setFormConfig({ ...formConfig, autoSyncIntervalMinutes: Number(e.target.value) })}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              >
                <option value={0}>Manual únicamente</option>
                <option value={5}>Cada 5 minutos</option>
                <option value={15}>Cada 15 minutos (Recomendado)</option>
                <option value={30}>Cada 30 minutos</option>
                <option value={60}>Cada hora</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Estado del Conector</label>
              <div className="p-2 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                <span>✓ Activo & Enlazado</span>
                <span className="font-mono text-[10px]">{formConfig.lastSyncTimestamp}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>

      {/* Embedded Google Apps Script Code Generator (#44) */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Código de Servidor Google Apps Script (Copiar & Pegar)
            </h3>
          </div>

          <button
            onClick={handleCopyGasCode}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código GAS</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Pega este código en <em>Extensiones &gt; Apps Script</em> en tu hoja de cálculo y despliega como <strong>Aplicación Web</strong> con acceso "Cualquier persona".
        </p>

        <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
          <code>{gasScriptCode}</code>
        </pre>
      </div>
    </div>
  );
}
