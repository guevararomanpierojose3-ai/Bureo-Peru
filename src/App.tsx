import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import GlobalSearchModal from './components/GlobalSearchModal';
import EvidenceGalleryModal from './components/EvidenceGalleryModal';
import RecordDetailModal from './components/RecordDetailModal';

// Views
import ExecutiveDashboardView from './components/views/ExecutiveDashboardView';
import QualityRecordsView from './components/views/QualityRecordsView';
import ContaminationView from './components/views/ContaminationView';
import TraceabilityView from './components/views/TraceabilityView';
import NcView from './components/views/NcView';
import CorrectiveActionsView from './components/views/CorrectiveActionsView';
import IndicatorsView from './components/views/IndicatorsView';
import ReportsModuleView from './components/views/ReportsModuleView';
import PersonnelView from './components/views/PersonnelView';
import AuditLogsView from './components/views/AuditLogsView';
import MasterSheetConfigView from './components/views/MasterSheetConfigView';
import SystemParamsView from './components/views/SystemParamsView';
import LabView from './components/LabView';
import PlantVisionView from './components/PlantVisionView';

// Mock Data
import { 
  INITIAL_COMPANY_CONFIG,
  INITIAL_APPSCRIPT_CONFIG,
  INITIAL_PARAMETERS,
  INITIAL_USERS,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_QUALITY_RECORDS,
  INITIAL_CAPA_CASES,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_INDICATOR_METRICS,
  INITIAL_AREA_RANKINGS,
  MASTER_SHEETS_CONFIG,
  INITIAL_AUDIT_LOGS
} from './data/mockQmsData';

import { 
  ActiveTab, 
  ColorTheme, 
  UserProfile, 
  UserRole, 
  QualityRecord, 
  CapaCase, 
  CorrectiveActionItem, 
  DigitalEvidence, 
  CompanyConfig, 
  MasterSheetConfig,
  AuditLogEntry,
  LabTestRecord,
  PlantSensor
} from './types';

export default function App() {
  // Navigation & Themes
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('ocean');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Authentication & Users
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Ing. Marcos Salinas
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Global Modals State
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isEvidenceGalleryOpen, setIsEvidenceGalleryOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<DigitalEvidence | null>(null);
  const [isRecordDetailOpen, setIsRecordDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<QualityRecord | null>(null);

  // Core Datasets
  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>(INITIAL_QUALITY_RECORDS);
  const [capaCases, setCapaCases] = useState<CapaCase[]>(INITIAL_CAPA_CASES);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionItem[]>(INITIAL_CORRECTIVE_ACTIONS);
  const [indicators, setIndicators] = useState(INITIAL_INDICATOR_METRICS);
  const [areaRankings, setAreaRankings] = useState(INITIAL_AREA_RANKINGS);
  const [evidences, setEvidences] = useState<DigitalEvidence[]>(INITIAL_EVIDENCE_ITEMS);
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(INITIAL_COMPANY_CONFIG);
  const [appScriptConfig, setAppScriptConfig] = useState(INITIAL_APPSCRIPT_CONFIG);
  const [masterSheets, setMasterSheets] = useState(MASTER_SHEETS_CONFIG);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modern Industrial Modules State (Lab & IoT Telemetry)
  const [labTests, setLabTests] = useState<LabTestRecord[]>([
    {
      id: 'lab-1',
      lotCode: 'LOT-2026-NP95',
      testedAt: 'Hoy, 09:30',
      materialType: 'HDPE NetPositiva',
      mfi: 10.2,
      density: 0.951,
      tensileStrength: 25.2,
      moisturePercent: 0.04,
      ashContentPercent: 0.72,
      ftirPurityPercent: 99.3,
      complianceStatus: 'Conforme',
      analyst: 'Ing. Carola Vega (Lab QA)',
      notes: 'Muestra ensayada bajo norma ASTM D1238 / ISO 1133. Aprobado para exportación a Patagonia.'
    },
    {
      id: 'lab-2',
      lotCode: 'LOT-2026-PA6-42',
      testedAt: 'Ayer, 16:15',
      materialType: 'Poliamida PA6',
      mfi: 14.8,
      density: 1.132,
      tensileStrength: 78.4,
      moisturePercent: 0.06,
      ashContentPercent: 0.88,
      ftirPurityPercent: 98.6,
      complianceStatus: 'Conforme',
      analyst: 'Ing. Carola Vega (Lab QA)',
      notes: 'Filamento de poliamida lavado en frío. Estabilidad reológica conforme.'
    },
    {
      id: 'lab-3',
      lotCode: 'LOT-2026-PP18',
      testedAt: '07/09/2026 11:20',
      materialType: 'PP Monofilamento',
      mfi: 7.4,
      density: 0.905,
      tensileStrength: 29.5,
      moisturePercent: 0.09,
      ashContentPercent: 1.45,
      ftirPurityPercent: 97.2,
      complianceStatus: 'Observado',
      analyst: 'Lic. Elena Torres',
      notes: 'Cenizas ligeramente por encima del límite (1.20%). Retenido para segundo ensayo.'
    }
  ]);

  const [plantSensors, setPlantSensors] = useState<PlantSensor[]>([
    { id: 'sn-1', name: 'Temp Zona 1 (Alimentación)', value: 185.4, unit: '°C', minSafe: 175, maxSafe: 195, status: 'normal', zone: 'Zona 1' },
    { id: 'sn-2', name: 'Temp Zona 2 (Compresión)', value: 215.8, unit: '°C', minSafe: 205, maxSafe: 225, status: 'normal', zone: 'Zona 2' },
    { id: 'sn-3', name: 'Temp Zona 3 (Dosificación)', value: 232.1, unit: '°C', minSafe: 215, maxSafe: 235, status: 'alerta', zone: 'Zona 3' },
    { id: 'sn-4', name: 'Presión en Cabezal de Filtro', value: 142.5, unit: 'bar', minSafe: 110, maxSafe: 160, status: 'normal', zone: 'Cabezal' },
    { id: 'sn-5', name: 'Velocidad de Husillos', value: 340, unit: 'RPM', minSafe: 280, maxSafe: 380, status: 'normal', zone: 'Motor' },
    { id: 'sn-6', name: 'Caudal de Enfriamiento por Agua', value: 48.2, unit: 'L/min', minSafe: 40, maxSafe: 60, status: 'normal', zone: 'Bañera' }
  ]);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncBanner, setSyncBanner] = useState<string | null>(null);

  const isDarkTheme = currentTheme === 'dark';

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Keyboard shortcut Ctrl+K / Cmd+K to open global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to log audit entries
  const addAuditLog = (action: string, module: 'Dashboard' | 'Registro' | 'Contaminación' | 'Trazabilidad' | 'No Conformidades' | 'Acciones Correctivas' | 'Indicadores' | 'Reportes' | 'Personal' | 'Configuración' | 'Auditoría', affectedRecord: string, details?: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      user: currentUser.name,
      userRole: currentUser.role,
      timestamp: `${dateStr} ${timeStr}`,
      date: dateStr,
      time: timeStr,
      module,
      action,
      affectedRecord,
      newValue: details,
      sha256Hash: `${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Google Apps Script Sync Simulation
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const timeStr = new Date().toLocaleTimeString();
      setSyncBanner(`✓ Sincronización exitosa con Google Sheets (10 Hojas Maestras conectadas • ${timeStr})`);
      
      addAuditLog(
        'SINCRONIZACION_GAS',
        'Configuración',
        '10 Hojas Maestras',
        'Actualización bidireccional exitosa mediante REST API Apps Script'
      );

      setAppScriptConfig(prev => ({
        ...prev,
        lastSyncTimestamp: `${new Date().toLocaleDateString()} ${timeStr}`,
        totalSyncedRows: qualityRecords.length + capaCases.length + correctiveActions.length + auditLogs.length
      }));

      setTimeout(() => setSyncBanner(null), 4000);
    }, 1400);
  };

  // Record Handlers
  const handleAddQualityRecord = (record: QualityRecord) => {
    setQualityRecords(prev => [record, ...prev]);
    addAuditLog('CREAR_REGISTRO', 'Registro', record.id, `Pesaje: ${record.processedKg}kg, Contaminación: ${record.contaminationKg}kg (${record.contaminationPercent.toFixed(2)}%)`);
    
    // If it generated NC, create CAPA case
    if (record.generatesNc && record.ncId) {
      const newNc: CapaCase = {
        id: `nc-${Date.now()}`,
        code: record.ncId,
        date: record.date,
        recordId: record.id,
        area: record.area,
        lotCode: record.traceability,
        title: `Desviación en ${record.area} (${record.cause})`,
        description: `Contaminación de ${record.contaminationKg} kg (${record.contaminationPercent.toFixed(2)}%) supera el umbral normativo.`,
        cause: record.cause,
        severity: record.severity,
        risk: record.risk,
        riskScore: record.severity === 'Crítica' ? 5 : record.severity === 'Mayor' ? 4 : 3,
        status: 'Abierta',
        responsibleName: record.responsible,
        responsibleRole: 'Supervisor de Calidad',
        commitmentDate: record.commitmentDate,
        immediateAction: record.immediateAction
      };
      setCapaCases(prev => [newNc, ...prev]);
      addAuditLog('CREAR_NC_AUTOMATICA', 'No Conformidades', record.ncId, `Generada automáticamente desde registro ${record.id}`);
    }
  };

  const handleUpdateQualityRecord = (updated: QualityRecord) => {
    setQualityRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    addAuditLog('MODIFICAR_REGISTRO', 'Registro', updated.id, `Actualizado por ${currentUser.name}`);
  };

  const handleDeleteQualityRecord = (id: string) => {
    setQualityRecords(prev => prev.filter(r => r.id !== id));
    addAuditLog('ELIMINAR_REGISTRO', 'Registro', id, 'Registro eliminado del sistema');
  };

  // NC Handlers
  const handleAddCapaCase = (capa: CapaCase) => {
    setCapaCases(prev => [capa, ...prev]);
    addAuditLog('REGISTRAR_NC', 'No Conformidades', capa.code, capa.title);
  };

  const handleUpdateCapaCase = (capa: CapaCase) => {
    setCapaCases(prev => prev.map(c => c.id === capa.id ? capa : c));
    addAuditLog('ACTUALIZAR_NC', 'No Conformidades', capa.code, `Estado: ${capa.status}`);
  };

  // Corrective Action Handlers
  const handleAddAction = (act: CorrectiveActionItem) => {
    setCorrectiveActions(prev => [act, ...prev]);
    addAuditLog('CREAR_ACCION_CAPA', 'Acciones Correctivas', act.id, act.description);
  };

  const handleUpdateAction = (act: CorrectiveActionItem) => {
    setCorrectiveActions(prev => prev.map(a => a.id === act.id ? act : a));
    addAuditLog('ACTUALIZAR_ACCION_CAPA', 'Acciones Correctivas', act.id, `Progreso: ${act.progressPercent}%, Estado: ${act.status}`);
  };

  // Role Switcher for simulation
  const handleChangeUserRole = (newRole: UserRole) => {
    const matchedUser = users.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole
    };
    setCurrentUser(matchedUser);
    addAuditLog('CAMBIO_ROL_SIMULADO', 'Personal', matchedUser.name, `Rol cambiado a ${newRole}`);
  };

  // Total contamination kg for share% calculations
  const totalContaminationSumKg = useMemo(() => {
    return qualityRecords.reduce((sum, r) => sum + r.contaminationKg, 0);
  }, [qualityRecords]);

  // Pareto causes calculated
  const paretoCauses = useMemo(() => {
    const causesMap: Record<string, number> = {};
    qualityRecords.forEach(r => {
      causesMap[r.cause] = (causesMap[r.cause] || 0) + r.contaminationKg;
    });

    const sorted = Object.entries(causesMap)
      .map(([cause, contaminationKg]) => ({
        cause,
        contaminationKg,
        sharePercent: totalContaminationSumKg > 0 ? (contaminationKg / totalContaminationSumKg) * 100 : 0,
        cumulativePercent: 0
      }))
      .sort((a, b) => b.contaminationKg - a.contaminationKg);

    let accum = 0;
    sorted.forEach(item => {
      accum += item.sharePercent;
      item.cumulativePercent = Math.min(100, accum);
    });

    return sorted;
  }, [qualityRecords, totalContaminationSumKg]);

  // Monthly quality trends for executive charts
  const monthlyQualityTrends = [
    { month: 'Ene', contaminationPercent: 1.68, conformityPercent: 98.32, target: 1.50 },
    { month: 'Feb', contaminationPercent: 1.55, conformityPercent: 98.45, target: 1.50 },
    { month: 'Mar', contaminationPercent: 1.48, conformityPercent: 98.52, target: 1.50 },
    { month: 'Abr', contaminationPercent: 1.62, conformityPercent: 98.38, target: 1.50 },
    { month: 'May', contaminationPercent: 1.39, conformityPercent: 98.61, target: 1.50 },
    { month: 'Jun', contaminationPercent: 1.45, conformityPercent: 98.55, target: 1.50 },
    { month: 'Jul', contaminationPercent: 1.51, conformityPercent: 98.49, target: 1.50 },
    { month: 'Ago', contaminationPercent: 1.40, conformityPercent: 98.60, target: 1.50 },
    { month: 'Sep', contaminationPercent: 1.42, conformityPercent: 98.58, target: 1.50 },
  ];

  // Traceability rankings
  const traceabilityRankings = [
    { traceability: 'Austral', processedKg: 780, contaminationKg: 14.2, contaminationPercent: 1.82, status: 'Observación' },
    { traceability: 'Pacífico-B', processedKg: 680, contaminationKg: 7.7, contaminationPercent: 1.13, status: 'Conforme' },
    { traceability: 'Mar del Sur', processedKg: 460, contaminationKg: 5.4, contaminationPercent: 1.17, status: 'Conforme' },
  ];

  // Heatmap data per area
  const heatmapData = [
    { area: 'Corte', monthlyContamination: [3.8, 3.5, 3.4, 3.6, 3.2, 3.5, 3.6, 3.4, 3.45] },
    { area: 'Lavado', monthlyContamination: [1.8, 1.7, 1.6, 1.9, 1.5, 1.6, 1.7, 1.5, 1.45] },
    { area: 'Tendido', monthlyContamination: [1.2, 1.1, 1.0, 1.3, 1.1, 1.0, 1.1, 1.0, 0.95] },
    { area: 'Secado', monthlyContamination: [0.9, 0.8, 0.7, 0.8, 0.7, 0.8, 0.7, 0.7, 0.68] },
    { area: 'Recogido', monthlyContamination: [0.7, 0.6, 0.5, 0.6, 0.6, 0.5, 0.6, 0.5, 0.52] },
    { area: 'Empaque', monthlyContamination: [0.5, 0.4, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4, 0.42] },
  ];

  // Open counts for badge notifications
  const openNcCount = capaCases.filter(c => c.status !== 'Cerrada').length;
  const openActionsCount = correctiveActions.filter(a => a.status !== 'Cerrada').length;

  // Background style per theme
  const themeBackgroundClasses: Record<ColorTheme, string> = {
    ocean: 'bg-[#f4f7fb] text-slate-900 selection:bg-blue-600 selection:text-white',
    eco: 'bg-[#f5f9f6] text-stone-900 selection:bg-emerald-600 selection:text-white',
    cobalt: 'bg-[#f4f6fc] text-slate-950 selection:bg-indigo-600 selection:text-white',
    dark: 'bg-[#080d1a] text-slate-100 selection:bg-cyan-500 selection:text-black'
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-200 ${themeBackgroundClasses[currentTheme]} ${isDarkTheme ? 'dark' : ''}`}>
      {/* 1. Sidebar Component (Role-based, collapsible, user profile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onChangeUserRole={handleChangeUserRole}
        companyConfig={companyConfig}
        onLogout={() => setIsLoginModalOpen(true)}
        openNcCount={openNcCount}
        openActionsCount={openActionsCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDarkTheme={isDarkTheme}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Component (Search, Themes, GAS Sync, Notifications) */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
          currentUser={currentUser}
          currentTheme={currentTheme}
          onChangeTheme={setCurrentTheme}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSync}
          onNavigateToTab={setActiveTab}
          isDarkTheme={isDarkTheme}
        />

        {/* Sync Toast Notification */}
        {syncBanner && (
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white text-xs py-2.5 px-4 text-center font-mono shadow-md animate-fadeIn flex items-center justify-center gap-2">
            <span>{syncBanner}</span>
          </div>
        )}

        {/* View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <ExecutiveDashboardView
              currentUser={currentUser}
              qualityRecords={qualityRecords}
              capaCases={capaCases}
              correctiveActions={correctiveActions}
              indicators={indicators}
              areaRankings={areaRankings}
              evidences={evidences}
              auditLogs={auditLogs}
              monthlyQualityTrends={monthlyQualityTrends}
              paretoCauses={paretoCauses}
              traceabilityRankings={traceabilityRankings}
              heatmapData={heatmapData}
              onNavigateToTab={setActiveTab}
              onOpenEvidence={(ev) => {
                setSelectedEvidence(ev);
                setIsEvidenceGalleryOpen(true);
              }}
              onSelectRecord={(rec) => {
                setSelectedRecord(rec);
                setIsRecordDetailOpen(true);
              }}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'registro' && (
            <QualityRecordsView
              records={qualityRecords}
              onAddRecord={handleAddQualityRecord}
              onUpdateRecord={handleUpdateQualityRecord}
              onDeleteRecord={handleDeleteQualityRecord}
              onOpenRecordDetail={(rec) => {
                setSelectedRecord(rec);
                setIsRecordDetailOpen(true);
              }}
              onNavigateToTab={setActiveTab}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'contaminacion' && (
            <ContaminationView
              records={qualityRecords}
              areaRankings={areaRankings}
              paretoCauses={paretoCauses}
              onOpenRecordDetail={(rec) => {
                setSelectedRecord(rec);
                setIsRecordDetailOpen(true);
              }}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'trazabilidad' && (
            <TraceabilityView
              records={qualityRecords}
              capaCases={capaCases}
              evidences={evidences}
              onNavigateToTab={setActiveTab}
              onOpenRecordDetail={(rec) => {
                setSelectedRecord(rec);
                setIsRecordDetailOpen(true);
              }}
              isDarkTheme={isDarkTheme}
            />
          )}

          {(activeTab === 'ncs' || activeTab === 'capa') && (
            <NcView
              capaCases={capaCases}
              onAddCapa={handleAddCapaCase}
              onUpdateCapa={handleUpdateCapaCase}
              onNavigateToTab={setActiveTab}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'lab' && (
            <LabView
              labTests={labTests}
              onAddTestRecord={(newRecord) => {
                setLabTests(prev => [newRecord, ...prev]);
                addAuditLog('ENSAYO_LABORATORIO', 'Registro', newRecord.lotCode, `Ensayo MFI: ${newRecord.mfi}, Estado: ${newRecord.complianceStatus}`);
              }}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'planta' && (
            <PlantVisionView
              sensors={plantSensors}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'acciones' && (
            <CorrectiveActionsView
              correctiveActions={correctiveActions}
              onAddAction={handleAddAction}
              onUpdateAction={handleUpdateAction}
              onNavigateToTab={setActiveTab}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'indicadores' && (
            <IndicatorsView
              indicators={indicators}
              areaRankings={areaRankings}
              onNavigateToTab={setActiveTab}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'reportes' && (
            <ReportsModuleView
              companyConfig={companyConfig}
              currentUser={currentUser}
              records={qualityRecords}
              capaCases={capaCases}
              correctiveActions={correctiveActions}
              indicators={indicators}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'personal' && (
            <PersonnelView
              users={users}
              isDarkTheme={isDarkTheme}
            />
          )}

          {activeTab === 'parametros' && (
            <SystemParamsView
              companyConfig={companyConfig}
              onUpdateCompanyConfig={setCompanyConfig}
              currentTheme={currentTheme}
              onChangeTheme={setCurrentTheme}
              isDarkTheme={isDarkTheme}
            />
          )}

          {(activeTab === 'configuracion' || activeTab === 'config') && (
            <div className="space-y-6">
              <MasterSheetConfigView
                sheetConfig={masterSheets}
                onUpdateConfig={setMasterSheets}
                onTriggerSync={handleTriggerSync}
                isSyncing={isSyncing}
                isDarkTheme={isDarkTheme}
              />

              <AuditLogsView
                auditLogs={auditLogs}
                isDarkTheme={isDarkTheme}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Login / Account Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        companyConfig={companyConfig}
        users={users}
        onLoginAsUser={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
          addAuditLog('INICIO_SESION', 'Personal', user.name, `Acceso con rol ${user.role}`);
        }}
        isDarkTheme={isDarkTheme}
      />

      {/* 2. Global Search Modal (Ctrl+K / Cmd+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        qualityRecords={qualityRecords}
        capaCases={capaCases}
        correctiveActions={correctiveActions}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsGlobalSearchOpen(false);
        }}
        onSelectRecord={(record) => {
          setSelectedRecord(record);
          setIsRecordDetailOpen(true);
        }}
        isDarkTheme={isDarkTheme}
      />

      {/* 3. Digital Evidence Gallery Modal */}
      <EvidenceGalleryModal
        isOpen={isEvidenceGalleryOpen}
        onClose={() => {
          setIsEvidenceGalleryOpen(false);
          setSelectedEvidence(null);
        }}
        evidences={evidences}
        selectedEvidence={selectedEvidence}
        isDarkTheme={isDarkTheme}
      />

      {/* 4. Complete 25-Field Record Detail Modal */}
      <RecordDetailModal
        isOpen={isRecordDetailOpen}
        onClose={() => {
          setIsRecordDetailOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onSaveRecord={(updatedRecord) => {
          handleUpdateQualityRecord(updatedRecord);
          setSelectedRecord(updatedRecord);
        }}
        totalContaminationSumKg={totalContaminationSumKg}
        onNavigateToNc={(ncId) => {
          setIsRecordDetailOpen(false);
          setActiveTab('ncs');
        }}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}
