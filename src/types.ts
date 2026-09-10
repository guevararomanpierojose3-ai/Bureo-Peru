export type ActiveTab = 
  | 'dashboard' 
  | 'registro' 
  | 'contaminacion' 
  | 'trazabilidad' 
  | 'ncs' 
  | 'acciones' 
  | 'indicadores' 
  | 'reportes' 
  | 'personal' 
  | 'parametros' 
  | 'configuracion'
  | 'lab'
  | 'planta'
  | 'capa'
  | 'config';

export type ColorTheme = 'ocean' | 'eco' | 'cobalt' | 'dark';
export type SystemTheme = ColorTheme;

export type UserRole = 'ADMINISTRADOR' | 'GERENTE' | 'SUPERVISOR DE CALIDAD' | 'CONSULTA';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  avatarUrl: string;
  status: 'Activo' | 'Inactivo';
  lastActive: string;
}

export type RiskLevel = 'Riesgo bajo' | 'Riesgo medio' | 'Riesgo alto' | 'Riesgo crítico';
export type SeverityLevel = 'Sin incidencia' | 'Menor' | 'Moderada' | 'Mayor' | 'Crítica';
export type DispositionType = 'Liberado conforme' | 'Retenido temporal' | 'Reproceso requerido' | 'Rechazado';
export type QualityRecordStatus = 'No aplica' | 'Abierta' | 'En proceso' | 'Cerrada' | 'Vencida';

export interface QualityRecord {
  id: string; // ID Registro (e.g. CAL-00001)
  date: string; // Fecha (e.g. 2026-01-05)
  year: number; // Año (e.g. 2026)
  month: string; // Mes (e.g. enero)
  week: number; // Semana (e.g. 2)
  area: string; // Área (e.g. Corte, Lavado, Tendido, Secado, Recogido, Empaque)
  traceability: string; // Trazabilidad (e.g. Austral, Pacífico-B, Mar del Sur)
  supervisor: string; // Supervisor de calidad
  processedKg: number; // Material Procesado (kg)
  contaminationType: string; // Tipo de Contaminación (e.g. Plástico y material no grs, Arena marina, Grasa)
  contaminationKg: number; // Cantidad Contaminación (kg)
  contaminationPercent: number; // % Contaminación = (contaminationKg / processedKg) * 100
  sharePercent: number; // % Participación = (contaminationKg / totalContaminationKg) * 100
  cause: string; // Causa Detectada (e.g. Mezcla de material, Plástico, Mala segregación)
  severity: SeverityLevel; // Severidad
  risk: RiskLevel; // Riesgo
  disposition: DispositionType; // Disposición del Material
  generatesNc: boolean; // ¿Genera NC? (true / false)
  ncId?: string; // ID NC (obligatorio si generatesNc = true)
  immediateAction?: string; // Acción Inmediata
  responsible: string; // Responsable
  commitmentDate: string; // Fecha Compromiso
  status: QualityRecordStatus; // Estado
  closeDate?: string; // Fecha Cierre
  efficacyVerification?: string; // Verificación de Eficacia
  observations?: string; // Observaciones
  evidenceUrls?: string[]; // Evidencias fotográficas / video
}

export type NcStatus = 'Abierta' | 'En proceso' | 'En Proceso' | 'Pendiente de verificación' | 'Por Verificar' | 'Cerrada' | 'Cerrada Conforme' | 'Vencida' | string;
export type CapaStatus = NcStatus;

export interface CapaCase {
  id: string;
  code: string; // e.g. NC-2026-004
  date: string;
  detectedDate?: string;
  recordId?: string; // ID Registro asociado
  area: string;
  lotCode: string;
  traceability?: string;
  title: string;
  description: string;
  cause: string;
  severity: SeverityLevel;
  risk: RiskLevel;
  riskLevel?: RiskLevel | string;
  riskScore: number; // 1 to 5
  status: NcStatus;
  isCritical?: boolean;
  isOverdue?: boolean;
  overdueDays?: number;
  overdueText?: string;
  responsibleName: string;
  responsibleRole: string;
  commitmentDate: string;
  immediateAction?: string;
  rootCauseMethod?: string;
  rootCauseDiagnosis?: string;
  correctiveActionCode?: string;
  correctiveActionPlan?: string;
  implementationProgress?: number; // 0 - 100
  efficacyPercentage?: number;
  closeDate?: string;
  closedDate?: string;
  closedBy?: string;
  observations?: string;
  evidenceFiles?: DigitalEvidence[];
  resolutionCycle?: {
    detect?: boolean;
    cause?: boolean;
    immediate?: boolean;
    implement?: boolean;
    efficacy?: boolean;
  };
}

export type ActionStatus = 'Pendiente' | 'En proceso' | 'Próxima a vencer' | 'Vencida' | 'Cerrada';

export interface CorrectiveActionItem {
  id: string; // ID Acción (e.g. CAPA-AC-088)
  ncId: string; // ID NC (e.g. NC-2026-004)
  description: string;
  responsibleName: string;
  responsibleRole: string;
  area: string;
  startDate: string;
  commitmentDate: string;
  closeDate?: string;
  closedDate?: string;
  status: ActionStatus;
  progressPercent: number;
  efficacyVerification?: string;
  efficacyResult?: 'Eficaz' | 'En evaluación' | 'No eficaz';
  observations?: string;
  evidenceUrls?: string[];
}

export interface IndicatorMetric {
  id: string;
  category: string;
  name: string;
  value: number;
  result?: number;
  unit: string;
  target: number;
  targetDirection: 'gte' | 'lte' | 'eq';
  gap: number;
  compliancePercentage: number;
  compliancePercent?: number;
  status: 'cumple' | 'atencion' | 'critico' | 'estable' | 'OPTIMO' | 'ALERTA' | 'CRITICO';
  trendText?: string;
  trend?: string;
  sparkline?: number[];
}

export interface AreaRanking {
  id: string;
  name: string;
  area?: string;
  position?: number;
  processedKg: number;
  contaminationKg: number;
  contaminationRate: number; // %
  contaminationPercent?: number;
  complianceRate: number; // %
  status: 'Excelente' | 'Conforme' | 'Observación' | 'Crítico';
  auditedLots: number;
  ncCount: number;
}

export interface DigitalEvidence {
  id: string;
  code: string;
  title: string;
  type: 'image' | 'video' | 'pdf';
  fileUrl: string;
  thumbnailUrl: string;
  capturedAt: string;
  location: string;
  operator: string;
  fileSize: string;
  associatedRecordId?: string;
  associatedNcId?: string;
  videoDuration?: string;
  isBeforeAfter?: boolean;
  phase?: 'Antes' | 'Durante' | 'Después';
}

export interface AuditLogEntry {
  id: string;
  user: string;
  userName?: string;
  userRole?: string;
  role?: string;
  authorName?: string;
  authorRole?: string;
  userAvatar?: string;
  timestamp: string;
  date: string;
  time: string;
  module: 'Dashboard' | 'Registro' | 'Contaminación' | 'Trazabilidad' | 'No Conformidades' | 'Acciones Correctivas' | 'Indicadores' | 'Reportes' | 'Personal' | 'Configuración' | 'Auditoría';
  action: string;
  actionText?: string;
  affectedRecord: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
  ipAddress?: string;
  sha256Hash?: string;
}

export interface LabTestRecord {
  id: string;
  lotCode: string;
  testedAt: string;
  materialType: 'HDPE NetPositiva' | 'Poliamida PA6' | 'PP Monofilamento' | string;
  mfi: number;
  density: number;
  tensileStrength: number;
  moisturePercent: number;
  ashContentPercent: number;
  ftirPurityPercent: number;
  complianceStatus: 'Conforme' | 'Observado' | 'Rechazado' | string;
  analyst: string;
  notes?: string;
}

export interface PlantSensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  minSafe: number;
  maxSafe: number;
  status: 'normal' | 'alerta' | 'critico' | string;
  location?: string;
  zone?: string | number;
}

export interface CompanyConfig {
  name: string;
  systemTitle: string;
  logoUrl: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  ruc: string;
  taxId?: string;
}

export interface AppScriptConfig {
  scriptUrl: string;
  spreadsheetId: string;
  spreadsheetName: string;
  lastSyncTimestamp: string;
  autoSync: boolean;
  status: 'Conectado' | 'Desconectado' | 'Sincronizando' | 'Error';
  totalSyncedRows: number;
}

export interface QualityParameters {
  maxContaminationPercent: number; // e.g. 1.50
  targetIcgPercent: number; // e.g. 95.0
  maxNcCloseDays: number; // e.g. 15
  maxActionCloseDays: number; // e.g. 30
  highRiskThresholdKg: number; // e.g. 20
  criticalContaminationPercent: number; // e.g. 2.00
}

export interface MasterSheetConfig {
  id: string;
  sheetName: string;
  rowCount: number;
  lastRecord: string;
  status: 'Sync' | 'Alerta NC' | 'Constante' | 'Append-Only';
  statusColor: 'emerald' | 'amber' | 'red' | 'blue' | 'slate';
  description?: string;
  columns: string[];
}
