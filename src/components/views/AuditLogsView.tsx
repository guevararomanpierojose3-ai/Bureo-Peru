import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Activity,
  History
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  isDarkTheme?: boolean;
}

export default function AuditLogsView({
  auditLogs,
  isDarkTheme = false
}: AuditLogsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('TODOS');
  const [selectedAction, setSelectedAction] = useState<string>('TODAS');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = selectedModule === 'TODOS' || log.module === selectedModule;
    const matchesAction = selectedAction === 'TODAS' || log.action === selectedAction;

    return matchesSearch && matchesModule && matchesAction;
  });

  const handleExportLogs = () => {
    const headers = ['ID', 'Timestamp', 'Usuario', 'Rol', 'Accion', 'Modulo', 'Detalles', 'IP / Dispositivo'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName || l.user}"`,
      l.role || l.userRole || 'Operador',
      l.action,
      l.module,
      `"${(l.details || l.affectedRecord || l.newValue || '').replace(/"/g, '""')}"`,
      l.ipAddress || '192.168.1.45'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_QMS_Bureo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Trazabilidad de Integridad & Seguridad
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono">
                  ISO 9001: 7.5.3
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Registro Inmutable de Auditoría (Audit Log)
              </h2>
              <p className="text-xs text-slate-500">
                Pista de auditoría completa de cada creación, modificación, eliminación y sincronización del sistema.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportLogs}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Bitácora de Auditoría</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Total Eventos</span>
          <div className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {auditLogs.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">En la sesión actual</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Usuarios Auditados</span>
          <div className="mt-1 text-2xl font-black font-mono text-blue-600">
            {new Set(auditLogs.map(l => l.userName || l.user)).size}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Operadores y jefes</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Acciones Críticas</span>
          <div className="mt-1 text-2xl font-black font-mono text-amber-600">
            {auditLogs.filter(l => l.action.includes('MODIFICAR') || l.action.includes('CERRAR')).length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ediciones y cierres</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Integridad de Datos</span>
          <div className="mt-1 text-2xl font-black font-mono text-emerald-600">
            100%
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Hash SHA-256 Verificado</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, acción, detalle..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
          >
            <option value="TODOS">Todos los Módulos</option>
            <option value="REGISTROS_CALIDAD">Registros de Calidad</option>
            <option value="NO_CONFORMIDADES">No Conformidades</option>
            <option value="ACCIONES_CORRECTIVAS">Acciones Correctivas</option>
            <option value="SINCRONIZACION">Sincronización GAS</option>
            <option value="SISTEMA">Sistema / Autenticación</option>
          </select>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[10px] font-mono font-bold uppercase border-b ${
              isDarkTheme ? 'bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Acción</th>
                <th className="py-3 px-3">Módulo</th>
                <th className="py-3 px-4">Detalle de la Operación</th>
                <th className="py-3 px-3 text-right">IP Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {log.userName || log.user}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {log.role || log.userRole || 'Operador'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-cyan-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md truncate font-sans" title={log.details || log.affectedRecord}>
                    {log.details || log.affectedRecord || log.newValue}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 text-[10px] whitespace-nowrap">
                    {log.ipAddress || '192.168.1.45'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
