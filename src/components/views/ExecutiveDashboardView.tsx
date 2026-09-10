import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Award, 
  Calendar, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  CheckSquare, 
  Eye, 
  Sparkles,
  ArrowUpRight,
  Filter,
  Play,
  Maximize2
} from 'lucide-react';
import { 
  QualityRecord, 
  CapaCase, 
  CorrectiveActionItem, 
  IndicatorMetric, 
  AreaRanking, 
  DigitalEvidence, 
  AuditLogEntry, 
  UserProfile, 
  ActiveTab 
} from '../../types';

interface ExecutiveDashboardViewProps {
  currentUser: UserProfile;
  qualityRecords: QualityRecord[];
  capaCases: CapaCase[];
  correctiveActions: CorrectiveActionItem[];
  indicators: IndicatorMetric[];
  areaRankings: AreaRanking[];
  evidences: DigitalEvidence[];
  auditLogs: AuditLogEntry[];
  monthlyQualityTrends: { month: string; contaminationPercent: number; conformityPercent: number; target: number }[];
  paretoCauses: { cause: string; contaminationKg: number; sharePercent: number; cumulativePercent: number }[];
  traceabilityRankings: { traceability: string; processedKg: number; contaminationKg: number; contaminationPercent: number; status: string }[];
  heatmapData: { area: string; monthlyContamination: number[] }[];
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenEvidence: (evidence: DigitalEvidence) => void;
  onSelectRecord: (record: QualityRecord) => void;
  isDarkTheme?: boolean;
}

export default function ExecutiveDashboardView({
  currentUser,
  qualityRecords,
  capaCases,
  correctiveActions,
  indicators,
  areaRankings,
  evidences,
  auditLogs,
  monthlyQualityTrends,
  paretoCauses,
  traceabilityRankings,
  heatmapData,
  onNavigateToTab,
  onOpenEvidence,
  onSelectRecord,
  isDarkTheme = false
}: ExecutiveDashboardViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoy' | 'semana' | 'mes' | 'año' | 'personalizado'>('mes');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-10');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(8); // Setiembre
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = useState<{ area: string; month: string; val: number } | null>(null);
  const [heatmapPeriodFilter, setHeatmapPeriodFilter] = useState<'ALL' | 'YTD' | 'S1' | 'S2'>('ALL');

  // Month metadata definitions (evita traducciones erróneas y soporta 12 meses completos)
  const MONTH_DEFS = useMemo(() => [
    { index: 0, short: 'Ene', full: 'Enero', quarter: 'Q1' },
    { index: 1, short: 'Feb', full: 'Febrero', quarter: 'Q1' },
    { index: 2, short: 'Mar', full: 'Marzo', quarter: 'Q1' },
    { index: 3, short: 'Abr', full: 'Abril', quarter: 'Q2' },
    { index: 4, short: 'May', full: 'Mayo', quarter: 'Q2' },
    { index: 5, short: 'Jun', full: 'Junio', quarter: 'Q2' },
    { index: 6, short: 'Jul', full: 'Julio', quarter: 'Q3' },
    { index: 7, short: 'Ago', full: 'Agosto', quarter: 'Q3' },
    { index: 8, short: 'Set', full: 'Setiembre', quarter: 'Q3' },
    { index: 9, short: 'Oct', full: 'Octubre', quarter: 'Q4' },
    { index: 10, short: 'Nov', full: 'Noviembre', quarter: 'Q4' },
    { index: 11, short: 'Dic', full: 'Diciembre', quarter: 'Q4' },
  ], []);

  // Meses activos para la vista actual del mapa térmico
  const activeMonths = useMemo(() => {
    if (heatmapPeriodFilter === 'YTD') return MONTH_DEFS.slice(0, 9); // Ene a Set
    if (heatmapPeriodFilter === 'S1') return MONTH_DEFS.slice(0, 6);  // Ene a Jun
    if (heatmapPeriodFilter === 'S2') return MONTH_DEFS.slice(6, 12); // Jul a Dic
    return MONTH_DEFS; // Los 12 meses completos
  }, [heatmapPeriodFilter, MONTH_DEFS]);

  // Promedio mensual consolidado de todas las áreas para el mapa térmico
  const monthlyPlantAverages = useMemo(() => {
    return activeMonths.map(m => {
      let sum = 0;
      let count = 0;
      heatmapData.forEach(row => {
        const val = row.monthlyContamination[m.index];
        if (typeof val === 'number') {
          sum += val;
          count++;
        }
      });
      return count > 0 ? sum / count : 0;
    });
  }, [activeMonths, heatmapData]);

  // Dynamic calculations reactive to selectedPeriod and custom date range
  const periodStats = useMemo(() => {
    if (selectedPeriod === 'hoy') {
      return {
        label: 'Hoy',
        fullLabel: 'Hoy • 10 de Setiembre 2026',
        subtext: 'Operaciones del turno activo en planta',
        processedKg: 1480,
        contaminationKg: 13.5,
        contaminationPercent: 0.91,
        conformityPercent: 99.09,
        openNcsCount: 0,
        expiredNcsCount: 0,
        totalNcsCount: 1,
        activeActionsCount: 1,
        closedActionsCount: 1,
        totalActionsCount: 1,
        efficacyPercent: 98.2,
        icg: 96.5,
        trendText: '+3.8% vs promedio diario',
        trendIsGood: true,
        contaminationStatus: 'Excelente (≤ 1.0%)',
        corteKg: 7.5,
        corteShare: 55.6,
        donutDist: { closed: 100, inProgress: 0, open: 0, expired: 0 },
        areaRankings: [
          { id: 'ar-corte', area: 'Corte', name: 'Corte', processedKg: 420, contaminationKg: 7.5, contaminationPercent: 1.79, position: 6 },
          { id: 'ar-lavado', area: 'Lavado', name: 'Lavado', processedKg: 380, contaminationKg: 2.9, contaminationPercent: 0.76, position: 2 },
          { id: 'ar-tendido', area: 'Tendido', name: 'Tendido', processedKg: 290, contaminationKg: 1.6, contaminationPercent: 0.55, position: 3 },
          { id: 'ar-secado', area: 'Secado', name: 'Secado', processedKg: 180, contaminationKg: 0.8, contaminationPercent: 0.44, position: 4 },
          { id: 'ar-recogido', area: 'Recogido', name: 'Recogido', processedKg: 130, contaminationKg: 0.5, contaminationPercent: 0.38, position: 5 },
          { id: 'ar-empaque', area: 'Empaque', name: 'Empaque', processedKg: 80, contaminationKg: 0.2, contaminationPercent: 0.25, position: 1 },
        ],
        paretoCauses: [
          { cause: 'Mezcla de material', contaminationKg: 6.8, sharePercent: 50.4, cumulativePercent: 50.4 },
          { cause: 'Arena marina y sedimento fino', contaminationKg: 3.4, sharePercent: 25.2, cumulativePercent: 75.6 },
          { cause: 'Selección incorrecta', contaminationKg: 2.1, sharePercent: 15.6, cumulativePercent: 91.2 },
          { cause: 'Otros', contaminationKg: 1.2, sharePercent: 8.8, cumulativePercent: 100.0 },
        ],
        traceabilityRankings: [
          { traceability: 'Austral', processedKg: 580, contaminationKg: 7.8, contaminationPercent: 1.34, status: 'Conforme' },
          { traceability: 'Pacífico-B', processedKg: 520, contaminationKg: 3.9, contaminationPercent: 0.75, status: 'Conforme' },
          { traceability: 'Mar del Sur', processedKg: 380, contaminationKg: 1.8, contaminationPercent: 0.47, status: 'Conforme' },
        ]
      };
    }

    if (selectedPeriod === 'semana') {
      return {
        label: 'Esta Semana',
        fullLabel: 'Esta Semana • Semana 37 (07 al 13 Set 2026)',
        subtext: 'Acumulado semanal en 6 líneas operativas',
        processedKg: 8760,
        contaminationKg: 98.4,
        contaminationPercent: 1.12,
        conformityPercent: 98.88,
        openNcsCount: 1,
        expiredNcsCount: 0,
        totalNcsCount: 2,
        activeActionsCount: 2,
        closedActionsCount: 2,
        totalActionsCount: 3,
        efficacyPercent: 95.8,
        icg: 95.6,
        trendText: '-0.24% merma vs semana previa',
        trendIsGood: true,
        contaminationStatus: 'Cumple meta (≤ 1.50%)',
        corteKg: 54.0,
        corteShare: 54.9,
        donutDist: { closed: 50, inProgress: 50, open: 0, expired: 0 },
        areaRankings: [
          { id: 'ar-corte', area: 'Corte', name: 'Corte', processedKg: 2450, contaminationKg: 54.0, contaminationPercent: 2.20, position: 6 },
          { id: 'ar-lavado', area: 'Lavado', name: 'Lavado', processedKg: 2280, contaminationKg: 21.5, contaminationPercent: 0.94, position: 2 },
          { id: 'ar-tendido', area: 'Tendido', name: 'Tendido', processedKg: 1740, contaminationKg: 11.2, contaminationPercent: 0.64, position: 3 },
          { id: 'ar-secado', area: 'Secado', name: 'Secado', processedKg: 1120, contaminationKg: 5.8, contaminationPercent: 0.52, position: 4 },
          { id: 'ar-recogido', area: 'Recogido', name: 'Recogido', processedKg: 730, contaminationKg: 3.8, contaminationPercent: 0.52, position: 5 },
          { id: 'ar-empaque', area: 'Empaque', name: 'Empaque', processedKg: 440, contaminationKg: 2.1, contaminationPercent: 0.48, position: 1 },
        ],
        paretoCauses: [
          { cause: 'Mezcla de material', contaminationKg: 46.2, sharePercent: 47.0, cumulativePercent: 47.0 },
          { cause: 'Arena marina y sedimento fino', contaminationKg: 28.5, sharePercent: 29.0, cumulativePercent: 76.0 },
          { cause: 'Selección incorrecta', contaminationKg: 14.8, sharePercent: 15.0, cumulativePercent: 91.0 },
          { cause: 'Otros', contaminationKg: 8.9, sharePercent: 9.0, cumulativePercent: 100.0 },
        ],
        traceabilityRankings: [
          { traceability: 'Austral', processedKg: 3450, contaminationKg: 48.2, contaminationPercent: 1.40, status: 'Conforme' },
          { traceability: 'Pacífico-B', processedKg: 3120, contaminationKg: 32.4, contaminationPercent: 1.04, status: 'Conforme' },
          { traceability: 'Mar del Sur', processedKg: 2190, contaminationKg: 17.8, contaminationPercent: 0.81, status: 'Conforme' },
        ]
      };
    }

    if (selectedPeriod === 'año') {
      return {
        label: 'Este Año',
        fullLabel: 'Consolidado Anual 2026 (Ene - Dic)',
        subtext: 'Masa auditada acumulada en el ejercicio 2026',
        processedKg: 418200,
        contaminationKg: 5938.4,
        contaminationPercent: 1.42,
        conformityPercent: 98.58,
        openNcsCount: 2,
        expiredNcsCount: 1,
        totalNcsCount: 18,
        activeActionsCount: 3,
        closedActionsCount: 21,
        totalActionsCount: 24,
        efficacyPercent: 93.8,
        icg: 94.5,
        trendText: '+8.4% volumen acumulado vs 2025',
        trendIsGood: true,
        contaminationStatus: 'Meta Anual SGC (≤ 1.50%)',
        corteKg: 2668.0,
        corteShare: 44.9,
        donutDist: { closed: 78, inProgress: 11, open: 6, expired: 5 },
        areaRankings: [
          { id: 'ar-corte', area: 'Corte', name: 'Corte', processedKg: 112500, contaminationKg: 2668.0, contaminationPercent: 2.37, position: 6 },
          { id: 'ar-lavado', area: 'Lavado', name: 'Lavado', processedKg: 108200, contaminationKg: 1420.0, contaminationPercent: 1.31, position: 2 },
          { id: 'ar-tendido', area: 'Tendido', name: 'Tendido', processedKg: 82400, contaminationKg: 850.0, contaminationPercent: 1.03, position: 3 },
          { id: 'ar-secado', area: 'Secado', name: 'Secado', processedKg: 56100, contaminationKg: 510.0, contaminationPercent: 0.91, position: 4 },
          { id: 'ar-recogido', area: 'Recogido', name: 'Recogido', processedKg: 36000, contaminationKg: 310.0, contaminationPercent: 0.86, position: 5 },
          { id: 'ar-empaque', area: 'Empaque', name: 'Empaque', processedKg: 23000, contaminationKg: 180.4, contaminationPercent: 0.78, position: 1 },
        ],
        paretoCauses: [
          { cause: 'Mezcla de material', contaminationKg: 2820.0, sharePercent: 47.5, cumulativePercent: 47.5 },
          { cause: 'Arena marina y sedimento fino', contaminationKg: 1710.0, sharePercent: 28.8, cumulativePercent: 76.3 },
          { cause: 'Selección incorrecta', contaminationKg: 840.0, sharePercent: 14.1, cumulativePercent: 90.4 },
          { cause: 'Otros', contaminationKg: 568.4, sharePercent: 9.6, cumulativePercent: 100.0 },
        ],
        traceabilityRankings: [
          { traceability: 'Austral', processedKg: 168000, contaminationKg: 2790.0, contaminationPercent: 1.66, status: 'Observación' },
          { traceability: 'Pacífico-B', processedKg: 145000, contaminationKg: 1860.0, contaminationPercent: 1.28, status: 'Conforme' },
          { traceability: 'Mar del Sur', processedKg: 105200, contaminationKg: 1288.4, contaminationPercent: 1.22, status: 'Conforme' },
        ]
      };
    }

    if (selectedPeriod === 'personalizado') {
      const start = new Date(customStartDate || '2026-09-01').getTime();
      const end = new Date(customEndDate || '2026-09-10').getTime();
      const diffDays = Math.max(1, Math.round(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
      
      const calcProcessedKg = diffDays * 1260;
      const calcContamKg = Math.round(calcProcessedKg * 0.0134 * 10) / 10;
      const contamPct = (calcContamKg / calcProcessedKg) * 100;
      const confPct = 100 - contamPct;
      const corteKg = Math.round(calcContamKg * 0.49 * 10) / 10;

      return {
        label: 'Personalizado',
        fullLabel: `Rango Personalizado: ${customStartDate} al ${customEndDate} (${diffDays} días)`,
        subtext: `Consolidado de ${diffDays} días operativos seleccionados`,
        processedKg: calcProcessedKg,
        contaminationKg: calcContamKg,
        contaminationPercent: contamPct,
        conformityPercent: confPct,
        openNcsCount: Math.min(2, Math.max(0, Math.floor(diffDays / 6))),
        expiredNcsCount: diffDays > 14 ? 1 : 0,
        totalNcsCount: Math.max(1, Math.floor(diffDays / 4)),
        activeActionsCount: Math.min(3, Math.max(1, Math.floor(diffDays / 5))),
        closedActionsCount: Math.max(1, Math.floor(diffDays / 3)),
        totalActionsCount: Math.max(1, Math.floor(diffDays / 2)),
        efficacyPercent: 94.6,
        icg: Math.round((95.0 - (contamPct - 1.34) * 2) * 10) / 10,
        trendText: `${diffDays} días operativos en análisis`,
        trendIsGood: contamPct <= 1.5,
        contaminationStatus: contamPct <= 1.5 ? 'Cumple Meta (≤ 1.50%)' : 'Excede Tolerancia',
        corteKg: corteKg,
        corteShare: 49.0,
        donutDist: { closed: 60, inProgress: 25, open: 15, expired: 0 },
        areaRankings: [
          { id: 'ar-corte', area: 'Corte', name: 'Corte', processedKg: Math.round(calcProcessedKg * 0.27), contaminationKg: corteKg, contaminationPercent: (corteKg / (calcProcessedKg * 0.27)) * 100, position: 6 },
          { id: 'ar-lavado', area: 'Lavado', name: 'Lavado', processedKg: Math.round(calcProcessedKg * 0.26), contaminationKg: Math.round(calcContamKg * 0.24 * 10) / 10, contaminationPercent: 1.25, position: 2 },
          { id: 'ar-tendido', area: 'Tendido', name: 'Tendido', processedKg: Math.round(calcProcessedKg * 0.20), contaminationKg: Math.round(calcContamKg * 0.14 * 10) / 10, contaminationPercent: 0.95, position: 3 },
          { id: 'ar-secado', area: 'Secado', name: 'Secado', processedKg: Math.round(calcProcessedKg * 0.13), contaminationKg: Math.round(calcContamKg * 0.08 * 10) / 10, contaminationPercent: 0.83, position: 4 },
          { id: 'ar-recogido', area: 'Recogido', name: 'Recogido', processedKg: Math.round(calcProcessedKg * 0.09), contaminationKg: Math.round(calcContamKg * 0.05 * 10) / 10, contaminationPercent: 0.75, position: 5 },
          { id: 'ar-empaque', area: 'Empaque', name: 'Empaque', processedKg: Math.round(calcProcessedKg * 0.05), contaminationKg: Math.round(calcContamKg * 0.01 * 10) / 10, contaminationPercent: 0.27, position: 1 },
        ],
        paretoCauses: [
          { cause: 'Mezcla de material', contaminationKg: Math.round(calcContamKg * 0.47 * 10) / 10, sharePercent: 47.0, cumulativePercent: 47.0 },
          { cause: 'Arena marina y sedimento fino', contaminationKg: Math.round(calcContamKg * 0.29 * 10) / 10, sharePercent: 29.0, cumulativePercent: 76.0 },
          { cause: 'Selección incorrecta', contaminationKg: Math.round(calcContamKg * 0.14 * 10) / 10, sharePercent: 14.0, cumulativePercent: 90.0 },
          { cause: 'Otros', contaminationKg: Math.round(calcContamKg * 0.10 * 10) / 10, sharePercent: 10.0, cumulativePercent: 100.0 },
        ],
        traceabilityRankings: [
          { traceability: 'Austral', processedKg: Math.round(calcProcessedKg * 0.40), contaminationKg: Math.round(calcContamKg * 0.49 * 10) / 10, contaminationPercent: 1.66, status: 'Observación' },
          { traceability: 'Pacífico-B', processedKg: Math.round(calcProcessedKg * 0.35), contaminationKg: Math.round(calcContamKg * 0.31 * 10) / 10, contaminationPercent: 1.20, status: 'Conforme' },
          { traceability: 'Mar del Sur', processedKg: Math.round(calcProcessedKg * 0.25), contaminationKg: Math.round(calcContamKg * 0.20 * 10) / 10, contaminationPercent: 1.08, status: 'Conforme' },
        ]
      };
    }

    // Default: 'mes' (Setiembre 2026)
    return {
      label: 'Este Mes',
      fullLabel: 'Este Mes • Setiembre 2026',
      subtext: 'Resumen consolidado de mermas y calidad de Setiembre',
      processedKg: 36450,
      contaminationKg: 492.0,
      contaminationPercent: 1.35,
      conformityPercent: 98.65,
      openNcsCount: 2,
      expiredNcsCount: 1,
      totalNcsCount: 4,
      activeActionsCount: 3,
      closedActionsCount: 3,
      totalActionsCount: 6,
      efficacyPercent: 94.0,
      icg: 94.8,
      trendText: '-0.15% merma vs mes anterior (Mejora continua)',
      trendIsGood: true,
      contaminationStatus: 'Cumple meta (≤ 1.50%)',
      corteKg: 265.0,
      corteShare: 53.8,
      donutDist: { closed: 50, inProgress: 25, open: 15, expired: 10 },
      areaRankings: [
        { id: 'ar-corte', area: 'Corte', name: 'Corte', processedKg: 9850, contaminationKg: 265.0, contaminationPercent: 2.69, position: 6 },
        { id: 'ar-lavado', area: 'Lavado', name: 'Lavado', processedKg: 9420, contaminationKg: 118.0, contaminationPercent: 1.25, position: 2 },
        { id: 'ar-tendido', area: 'Tendido', name: 'Tendido', processedKg: 7150, contaminationKg: 56.5, contaminationPercent: 0.79, position: 3 },
        { id: 'ar-secado', area: 'Secado', name: 'Secado', processedKg: 4890, contaminationKg: 28.2, contaminationPercent: 0.58, position: 4 },
        { id: 'ar-recogido', area: 'Recogido', name: 'Recogido', processedKg: 3120, contaminationKg: 16.4, contaminationPercent: 0.53, position: 5 },
        { id: 'ar-empaque', area: 'Empaque', name: 'Empaque', processedKg: 2020, contaminationKg: 7.9, contaminationPercent: 0.39, position: 1 },
      ],
      paretoCauses: [
        { cause: 'Mezcla de material', contaminationKg: 235.0, sharePercent: 47.8, cumulativePercent: 47.8 },
        { cause: 'Arena marina y sedimento fino', contaminationKg: 141.0, sharePercent: 28.7, cumulativePercent: 76.5 },
        { cause: 'Selección incorrecta', contaminationKg: 72.0, sharePercent: 14.6, cumulativePercent: 91.1 },
        { cause: 'Otros', contaminationKg: 44.0, sharePercent: 8.9, cumulativePercent: 100.0 },
      ],
      traceabilityRankings: [
        { traceability: 'Austral', processedKg: 14800, contaminationKg: 242.0, contaminationPercent: 1.63, status: 'Observación' },
        { traceability: 'Pacífico-B', processedKg: 12900, contaminationKg: 154.0, contaminationPercent: 1.19, status: 'Conforme' },
        { traceability: 'Mar del Sur', processedKg: 8750, contaminationKg: 96.0, contaminationPercent: 1.10, status: 'Conforme' },
      ]
    };
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Aggregations from real state
  const totalProcessedKg = periodStats.processedKg;
  const totalContaminationKg = periodStats.contaminationKg;
  const globalContaminationPercent = periodStats.contaminationPercent;
  const globalConformityPercent = periodStats.conformityPercent;

  const openNcs = capaCases.filter(nc => nc.status === 'Abierta' || nc.status === 'En proceso');
  const expiredNcs = capaCases.filter(nc => nc.status === 'Vencida');
  const closedNcs = capaCases.filter(nc => nc.status === 'Cerrada');

  const pendingActions = correctiveActions.filter(a => a.status === 'Pendiente' || a.status === 'En proceso');
  const expiredActions = correctiveActions.filter(a => a.status === 'Vencida');
  const closedActions = correctiveActions.filter(a => a.status === 'Cerrada');

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  // Global Quality Index (ICG)
  const icgVal = periodStats.icg;
  const icgMetric = {
    result: periodStats.icg,
    target: 95.0,
    compliancePercent: Math.round((periodStats.icg / 95.0) * 1000) / 10,
    gap: Math.round((periodStats.icg - 95.0) * 10) / 10
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Executive Welcome & Period Selector Bar */}
      <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-white via-blue-50/40 to-slate-50 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-md shrink-0">
              <img 
                src={currentUser.avatarUrl || '/assets/marcos-salinas.svg'} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                  Panel Gerencial • Vista Directiva
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                  Planta Operativa
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Buenos días, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Resumen consolidado de calidad, contaminación por mermas y cumplimiento de acciones correctivas.
              </p>
            </div>
          </div>

          {/* Period Filter Buttons (#9) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 self-start md:self-auto">
            {(['hoy', 'semana', 'mes', 'año', 'personalizado'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Esta semana' : p === 'mes' ? 'Este mes' : p === 'año' ? 'Este año' : 'Personalizado'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Selector (when 'personalizado' is active) */}
        {selectedPeriod === 'personalizado' && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Desde:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200 focus:outline-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Hasta:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200 focus:outline-blue-500"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => { setCustomStartDate('2026-09-03'); setCustomEndDate('2026-09-10'); }}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 cursor-pointer font-bold transition-colors"
              >
                7 Días
              </button>
              <button
                type="button"
                onClick={() => { setCustomStartDate('2026-08-26'); setCustomEndDate('2026-09-10'); }}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 cursor-pointer font-bold transition-colors"
              >
                15 Días
              </button>
              <button
                type="button"
                onClick={() => { setCustomStartDate('2026-08-11'); setCustomEndDate('2026-09-10'); }}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 cursor-pointer font-bold transition-colors"
              >
                30 Días
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Active Period Status Banner */}
      <div className={`px-4 py-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/90 border-blue-900/60 text-slate-200' 
          : 'bg-blue-50/80 border-blue-200/80 text-blue-950 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">
            Filtro Activo: <span className="text-blue-700 dark:text-cyan-300 font-black">{periodStats.fullLabel}</span>
          </span>
          <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-400 font-normal">
            • {periodStats.subtext}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Volumen: <strong className="text-slate-800 dark:text-white font-bold">{periodStats.processedKg.toLocaleString()} kg</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Merma: <strong className="text-rose-600 dark:text-rose-400 font-bold">{periodStats.contaminationKg.toLocaleString()} kg ({periodStats.contaminationPercent.toFixed(2)}%)</strong>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            En vivo
          </span>
        </div>
      </div>

      {/* FILA 1: 8 KPIs Clave con el Gran Gauge Circular ICG (#10, #50, #61) */}
      <div key={selectedPeriod + customStartDate + customEndDate} className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 animate-fadeIn">
        {/* KPI 1: Material Procesado */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Material Procesado</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {periodStats.processedKg.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {periodStats.trendText}
          </p>
        </div>

        {/* KPI 2: Contaminación */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Contaminación</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {periodStats.contaminationKg.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Merma segregada en planta
          </p>
        </div>

        {/* KPI 3: % Contaminación */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>% Contaminación</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
              periodStats.contaminationPercent <= 1.50
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {periodStats.contaminationPercent <= 1.50 ? 'Cumple' : 'Alerta'}
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-xl sm:text-2xl font-black font-mono ${
              periodStats.contaminationPercent <= 1.50 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {periodStats.contaminationPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≤ 1.50%
          </p>
        </div>

        {/* KPI 4: % Conforme */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>% Conforme</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {periodStats.conformityPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≥ 98.50%
          </p>
        </div>

        {/* KPI 5: No Conformidades */}
        <div 
          onClick={() => onNavigateToTab('ncs')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-amber-400 ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>No Conformidades</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {periodStats.totalNcsCount}
            </span>
            <span className="text-[10px] text-rose-600 font-mono font-bold">
              {periodStats.expiredNcsCount} vencida
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {periodStats.openNcsCount} activas en planta
          </p>
        </div>

        {/* KPI 6: Acciones Correctivas */}
        <div 
          onClick={() => onNavigateToTab('acciones')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-blue-400 ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Acciones (CAPA)</span>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {periodStats.totalActionsCount}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">
              {periodStats.closedActionsCount} cerradas
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {periodStats.activeActionsCount} en seguimiento
          </p>
        </div>

        {/* KPI 7: Eficacia */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Eficacia Acciones</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              {periodStats.efficacyPercent.toFixed(0)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≥ 90%
          </p>
        </div>

        {/* KPI 8: Gran Gauge Circular ICG (#50) */}
        <div 
          onClick={() => onNavigateToTab('indicadores')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-cyan-400 relative overflow-hidden ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Índice ICG</span>
            <span className="text-[9px] font-mono text-blue-600 dark:text-cyan-400">Global</span>
          </div>

          <div className="mt-1 flex flex-col items-center justify-center">
            {/* SVG Semicircular / Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 dark:text-cyan-400"
                  strokeDasharray={`${periodStats.icg}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                  {periodStats.icg.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              Meta 95% • {((periodStats.icg / 95.0) * 100).toFixed(1)}% Cumpl.
            </p>
          </div>
        </div>
      </div>

      {/* FILA 2: Evolución de la Calidad (#11) & Contaminación por Área (#12, #51) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Evolución Mensual de la Calidad (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Evolución Mensual de la Calidad
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                % Contaminación vs Línea Meta (1.50%) y % Conformidad del producto
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> % Contaminación
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-3 h-0.5 bg-rose-500 inline-block border-t border-dashed" /> Meta (1.5%)
              </span>
            </div>
          </div>

          {/* Interactive Bar/Line Chart */}
          <div className="h-60 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800 relative">
            {/* Meta horizontal dashed guide line at 1.50% */}
            <div className="absolute left-0 right-0 top-[60%] border-t-2 border-dashed border-rose-400/80 z-10 pointer-events-none flex items-center justify-end pr-2">
              <span className="text-[9px] font-mono bg-rose-50 dark:bg-rose-950 text-rose-600 px-1 rounded font-bold">
                META 1.50%
              </span>
            </div>

            {monthlyQualityTrends.map((trend, idx) => {
              const isSelected = selectedMonthIndex === idx;
              // Normalize height: max 4%
              const heightPercent = Math.min(100, (trend.contaminationPercent / 3.0) * 100);
              const isOverTarget = trend.contaminationPercent > trend.target;

              return (
                <div
                  key={trend.month}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover or selected */}
                  {(isSelected || undefined) && (
                    <div className="absolute -top-7 z-20 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap shadow-md">
                      {trend.contaminationPercent.toFixed(2)}%
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isOverTarget 
                        ? 'bg-rose-500 hover:bg-rose-600' 
                        : isSelected
                          ? 'bg-blue-600 ring-2 ring-blue-400'
                          : 'bg-blue-500/80 hover:bg-blue-600'
                    }`}
                  />
                  <span 
                    translate="no"
                    className={`notranslate text-[10px] font-mono mt-2 font-bold ${
                      isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'
                    }`}
                    title={MONTH_DEFS[idx]?.full || trend.month}
                  >
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected month details footer */}
          {selectedMonthIndex !== null && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Mes seleccionado: <strong className="text-slate-900 dark:text-white">{monthlyQualityTrends[selectedMonthIndex].month}</strong>
              </span>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>Contam: <strong className="text-blue-600 dark:text-cyan-400">{monthlyQualityTrends[selectedMonthIndex].contaminationPercent.toFixed(2)}%</strong></span>
                <span>Conforme: <strong className="text-emerald-600">{monthlyQualityTrends[selectedMonthIndex].conformityPercent.toFixed(2)}%</strong></span>
                <span>Estado: <strong className={monthlyQualityTrends[selectedMonthIndex].contaminationPercent <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}>
                  {monthlyQualityTrends[selectedMonthIndex].contaminationPercent <= 1.5 ? 'Cumple Meta' : 'Excedido'}
                </strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico 2: Contaminación por Área con Alerta Crítica Corte (#12, #51) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contaminación por Área
              </h3>
              <p className="text-xs text-slate-500">
                Masa de merma segregada y porcentaje de incidencia
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('contaminacion')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver detalle</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prominent High-Impact Callout: CORTE MAYOR CONTAMINACIÓN (#51) */}
          <div className="my-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-600 text-white animate-pulse">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase text-rose-700 dark:text-rose-300 tracking-wider font-mono">
                  🚨 CORTE — MAYOR CONTAMINACIÓN
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {periodStats.corteKg.toLocaleString()} kg merma acumulada • {periodStats.corteShare}% del total
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('registro')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              Ver Registros
            </button>
          </div>

          {/* Area bars list */}
          <div className="space-y-2.5 mt-2">
            {periodStats.areaRankings.map((ar) => {
              const areaName = ar.area || ar.name;
              const isCritical = areaName === 'Corte';
              const contamPct = ar.contaminationPercent ?? ar.contaminationRate ?? 0;
              const maxAreaKg = Math.max(...periodStats.areaRankings.map(a => a.contaminationKg), 1);
              return (
                <div 
                  key={ar.id || areaName} 
                  onClick={() => onNavigateToTab('registro')}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {areaName}
                      {isCritical && <span className="text-[9px] px-1 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded font-mono font-bold">Crítico</span>}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {ar.contaminationKg.toLocaleString()} kg ({contamPct.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (ar.contaminationKg / maxAreaKg) * 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : contamPct <= 1.5 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 3: Pareto de Causas (#13, #52) & Estado de NC Donut (#18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto 80/20 (#13, #52) (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Análisis de Pareto de Causas Raíz
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                  Principio 80/20
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Barras: kg contaminación • Línea roja: % acumulado
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total: {periodStats.contaminationKg.toFixed(1)} kg
            </span>
          </div>

          {/* Pareto Visual representation */}
          <div className="space-y-3">
            {periodStats.paretoCauses.map((cause, i) => (
              <div key={cause.cause} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] flex items-center justify-center font-mono font-bold">
                      {i + 1}
                    </span>
                    {cause.cause}
                  </span>
                  <div className="font-mono text-[11px] flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">{cause.contaminationKg.toFixed(1)} kg ({cause.sharePercent.toFixed(1)}%)</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Acum: {cause.cumulativePercent.toFixed(1)}%</span>
                  </div>
                </div>
                {/* Dual bar: Blue is kg share, subtle overlay is cumulative % */}
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex relative">
                  <div 
                    style={{ width: `${cause.sharePercent}%` }} 
                    className="h-full bg-blue-600 rounded-l-full" 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>El 80% de la merma se concentra en las dos primeras causas: <strong>Mezcla de material</strong> y <strong>Plástico no separable</strong>.</span>
          </div>
        </div>

        {/* Donut Estado de No Conformidades (#18) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Estado de No Conformidades
              </h3>
              <p className="text-xs text-slate-500">
                Distribución por ciclo de vida operacional
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('ncs')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todas ({periodStats.totalNcsCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donut diagram with legend */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Donut SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                {/* Cerradas */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray={`${periodStats.donutDist.cerradas} 100`} strokeDashoffset="0" />
                {/* En proceso */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="5" strokeDasharray={`${periodStats.donutDist.enProceso} 100`} strokeDashoffset={`-${periodStats.donutDist.cerradas}`} />
                {/* Abiertas */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray={`${periodStats.donutDist.abiertas} 100`} strokeDashoffset={`-${periodStats.donutDist.cerradas + periodStats.donutDist.enProceso}`} />
                {/* Vencidas */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f43f5e" strokeWidth="5" strokeDasharray={`${periodStats.donutDist.vencidas} 100`} strokeDashoffset={`-${periodStats.donutDist.cerradas + periodStats.donutDist.enProceso + periodStats.donutDist.abiertas}`} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {periodStats.totalNcsCount}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Casos NC
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-2 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Cerradas</span>
                </span>
                <span className="font-mono font-bold">
                  {Math.round((periodStats.donutDist.cerradas / 100) * periodStats.totalNcsCount)} ({periodStats.donutDist.cerradas}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>En Proceso</span>
                </span>
                <span className="font-mono font-bold">
                  {Math.round((periodStats.donutDist.enProceso / 100) * periodStats.totalNcsCount)} ({periodStats.donutDist.enProceso}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Abiertas</span>
                </span>
                <span className="font-mono font-bold">
                  {Math.round((periodStats.donutDist.abiertas / 100) * periodStats.totalNcsCount)} ({periodStats.donutDist.abiertas}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Vencidas</span>
                </span>
                <span className="font-mono font-bold text-rose-600">
                  {periodStats.expiredNcsCount} ({periodStats.donutDist.vencidas}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 4: Heatmap de Áreas x Meses (#14) & Ranking de Áreas (#15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap 6 áreas x 12 meses (#14) (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Mapa Térmico de Contaminación (Áreas × Meses)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {activeMonths.length} Meses
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Intensidad semafórica de merma: Verde (≤1.0%), Amarillo (1.0–1.5%), Rojo (&gt;1.5%)
              </p>
            </div>

            {/* Scale legend & Period Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setHeatmapPeriodFilter('ALL')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    heatmapPeriodFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Ver los 12 meses del año (Enero a Diciembre)"
                >
                  12 Meses
                </button>
                <button
                  type="button"
                  onClick={() => setHeatmapPeriodFilter('YTD')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    heatmapPeriodFilter === 'YTD'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Año a la fecha (Ene - Set)"
                >
                  YTD
                </button>
                <button
                  type="button"
                  onClick={() => setHeatmapPeriodFilter('S1')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    heatmapPeriodFilter === 'S1'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Primer Semestre (Enero - Junio)"
                >
                  S1
                </button>
                <button
                  type="button"
                  onClick={() => setHeatmapPeriodFilter('S2')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    heatmapPeriodFilter === 'S2'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Segundo Semestre (Julio - Diciembre)"
                >
                  S2
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">&lt;1%</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-bold">1.5%</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">&gt;2%</span>
              </div>
            </div>
          </div>

          {/* Matrix table */}
          <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-xl p-2 bg-slate-50/40 dark:bg-slate-900/40">
            <table className="w-full text-xs notranslate" translate="no">
              <thead>
                <tr>
                  <th className="text-left font-bold text-slate-500 dark:text-slate-400 pb-2 text-[10px] font-mono uppercase pl-1 w-24 sm:w-28">
                    Área
                  </th>
                  {activeMonths.map(m => (
                    <th 
                      key={m.index} 
                      translate="no"
                      className="notranslate text-center font-mono font-bold text-slate-600 dark:text-slate-300 pb-2 px-0.5 text-[11px]"
                      title={`${m.full} (${m.quarter})`}
                    >
                      <div className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{m.short}</span>
                        <span className="text-[8px] text-slate-400 font-mono leading-none mt-0.5">{m.quarter}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {heatmapData.map((row) => (
                  <tr key={row.area} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 pr-2 pl-1 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap text-xs">
                      {row.area}
                    </td>
                    {activeMonths.map(m => {
                      const val = row.monthlyContamination[m.index] ?? 0;
                      // color calc
                      let bgClass = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-200 border border-emerald-300/50';
                      if (val > 1.50) {
                        bgClass = 'bg-rose-500 text-white font-bold shadow-xs';
                      } else if (val > 1.00) {
                        bgClass = 'bg-amber-300 text-amber-950 font-bold dark:bg-amber-600 dark:text-amber-50 border border-amber-400/50';
                      }

                      return (
                        <td key={m.index} className="p-0.5 text-center">
                          <div
                            translate="no"
                            onMouseEnter={() => setHoveredHeatmapCell({ area: row.area, month: m.full, val })}
                            onMouseLeave={() => setHoveredHeatmapCell(null)}
                            onClick={() => onNavigateToTab('registro')}
                            className={`notranslate p-1.5 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-110 hover:shadow-md cursor-pointer ${bgClass}`}
                            title={`${row.area} en ${m.full}: ${val.toFixed(2)}% de merma`}
                          >
                            {val.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold">
                  <td className="py-2 pr-2 pl-1 font-mono text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Promedio
                  </td>
                  {activeMonths.map((m, idx) => {
                    const avg = monthlyPlantAverages[idx] ?? 0;
                    return (
                      <td key={m.index} className="p-0.5 text-center">
                        <div
                          translate="no"
                          className={`notranslate py-1 px-0.5 rounded-md text-[9px] font-mono font-bold ${
                            avg > 1.50 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' 
                              : avg > 1.00 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' 
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                          title={`Promedio global de planta en ${m.full}: ${avg.toFixed(2)}%`}
                        >
                          {avg.toFixed(1)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {hoveredHeatmapCell ? (
            <div className="mt-2.5 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 animate-fadeIn">
              <span>
                Área: <strong>{hoveredHeatmapCell.area}</strong> • Mes: <strong>{hoveredHeatmapCell.month}</strong>
              </span>
              <span className="font-mono font-bold">
                Contaminación: <span className={hoveredHeatmapCell.val > 1.5 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{hoveredHeatmapCell.val.toFixed(2)}%</span>
              </span>
            </div>
          ) : (
            <div className="mt-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>* Pasa el cursor sobre cualquier celda para ver el mes completo y haz clic para auditar registros.</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold">Meta SGC: ≤ 1.50%</span>
            </div>
          )}
        </div>

        {/* Ranking de Áreas con Medallas (#15) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranking de Eficiencia por Área
              </h3>
              <p className="text-xs text-slate-500">
                Ordenado de menor a mayor contaminación
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              6 Áreas
            </span>
          </div>

          <div className="space-y-2">
            {periodStats.areaRankings.map((rank, idx) => {
              const rankName = rank.area || rank.name;
              const pos = rank.position || (idx + 1);
              const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}º`;
              const isBest = pos === 1;
              const isWorst = pos === 6 || rankName === 'Corte';
              const contamPct = rank.contaminationPercent ?? rank.contaminationRate ?? 0;

              return (
                <div
                  key={rank.id || rankName}
                  onClick={() => onNavigateToTab('registro')}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isBest 
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : isWorst 
                        ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-mono w-6 text-center">{medal}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        {rankName}
                        {isBest && <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800">Líder</span>}
                        {isWorst && <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-100 text-rose-800">Crítico</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {rank.processedKg.toLocaleString()} kg proc. • {rank.contaminationKg} kg merma
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-xs font-black ${
                      contamPct <= 1.5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {contamPct.toFixed(2)}%
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {contamPct <= 1.5 ? 'Cumple' : 'Alerta'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 5: Acciones Correctivas y Alertas Gerenciales (#19, #20, #21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Acciones Correctivas & Calendario (#19, #20) (6 cols) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compromisos & Acciones Correctivas (CAPA)
              </h3>
              <p className="text-xs text-slate-500">
                Calendario operacional y seguimiento de vencimientos
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('acciones')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Pendientes</span>
              <p className="text-lg font-black font-mono text-amber-800 dark:text-amber-300">2</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">En Proceso</span>
              <p className="text-lg font-black font-mono text-blue-800 dark:text-blue-300">2</p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">Vencidas</span>
              <p className="text-lg font-black font-mono text-rose-800 dark:text-rose-300">{expiredActions.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">% Cierre</span>
              <p className="text-lg font-black font-mono text-emerald-800 dark:text-emerald-300">78%</p>
            </div>
          </div>

          {/* Upcoming commitments list */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
              Próximos Vencimientos SLA:
            </div>
            {correctiveActions.slice(0, 3).map((act) => (
              <div 
                key={act.id} 
                onClick={() => onNavigateToTab('acciones')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{act.id}</span>
                    <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">{act.description}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Resp: {act.responsibleName} • Área: {act.area}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    act.status === 'Vencida' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    act.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {act.commitmentDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Gerenciales Que Requieren Atención (#21) (6 cols) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Alertas Gerenciales Que Requieren Atención
              </h3>
              <p className="text-xs text-slate-500">
                Puntos críticos que demandan intervención o visto bueno de Gerencia
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              6 Avisos
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Alert 1 */}
            <div 
              onClick={() => onNavigateToTab('acciones')}
              className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20 flex items-start gap-3 cursor-pointer hover:bg-rose-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0 animate-ping" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-300">🔴 Acción Correctiva Vencida: CAPA-AC-088</span>
                  <span className="text-[10px] font-mono text-rose-600">Vencida hace 6 días</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Área Corte: Recambio de mallas de cribado desgastadas. Responsable: Carlos Mendoza.
                </p>
              </div>
            </div>

            {/* Alert 2 */}
            <div 
              onClick={() => onNavigateToTab('ncs')}
              className="p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 flex items-start gap-3 cursor-pointer hover:bg-amber-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300">🟠 No Conformidad próxima a vencer: NC-2026-006</span>
                  <span className="text-[10px] font-mono text-amber-600">Vence en 3 días</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Área Lavado: Desviación en temperatura de tinas. Lote Pacífico-B.
                </p>
              </div>
            </div>

            {/* Alert 3 */}
            <div 
              onClick={() => onNavigateToTab('contaminacion')}
              className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20 flex items-start gap-3 cursor-pointer hover:bg-rose-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-300">🔴 Área sobre la meta mensual: CORTE (3.45%)</span>
                  <span className="text-[10px] font-mono text-rose-600">Meta: 1.50%</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Generó 2,668 kg de merma acumulada. Se requiere auditoría de proceso en turno nocturno.
                </p>
              </div>
            </div>

            {/* Alert 4 */}
            <div 
              onClick={() => onNavigateToTab('registro')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">🟡 3 Registros de Calidad pendientes de visto bueno</span>
                  <span className="text-[10px] font-mono text-slate-400">Turno de hoy</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supervisores Elena Torres y Roberto Díaz ingresaron datos de tara en Secado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 6: Matriz de Riesgo 5x5 (#17) & Ranking de Trazabilidad (#16) & Actividad Reciente (#22) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matriz 5x5 (#17) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Matriz de Riesgo 5×5
              </h3>
              <p className="text-xs text-slate-500">
                Probabilidad × Severidad de desvíos
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
              1 Crítico
            </span>
          </div>

          {/* 5x5 Visual Grid */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-slate-400 text-right">Probabilidad ↑ / Severidad →</div>
            {[5, 4, 3, 2, 1].map((prob) => (
              <div key={prob} className="flex items-center gap-1">
                <span className="w-3 text-[10px] font-mono font-bold text-slate-400 text-center">{prob}</span>
                {[1, 2, 3, 4, 5].map((sev) => {
                  const score = prob * sev;
                  let cellColor = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300';
                  if (score >= 15) {
                    cellColor = 'bg-rose-500 text-white font-bold';
                  } else if (score >= 10) {
                    cellColor = 'bg-amber-400 text-amber-950 font-bold';
                  } else if (score >= 6) {
                    cellColor = 'bg-yellow-200 text-yellow-900';
                  }

                  // Sample badge on cell (prob=4, sev=4)
                  const hasIncident = prob === 4 && sev === 4;

                  return (
                    <div
                      key={sev}
                      onClick={() => onNavigateToTab('ncs')}
                      className={`flex-1 h-7 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-transform hover:scale-105 ${cellColor}`}
                      title={`Prob: ${prob}, Sev: ${sev} (Score: ${score})`}
                    >
                      {hasIncident ? '1' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> Bajo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-300" /> Medio</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> Alto</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Crítico</span>
          </div>
        </div>

        {/* Ranking de Trazabilidad (#16) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranking de Trazabilidad
              </h3>
              <p className="text-xs text-slate-500">
                Calidad por origen de red de pesca recuperada
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('trazabilidad')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Ver lotes
            </button>
          </div>

          <div className="space-y-2.5">
            {periodStats.traceabilityRankings.map((t, idx) => (
              <div 
                key={t.traceability}
                onClick={() => onNavigateToTab('trazabilidad')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{t.traceability}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.processedKg.toLocaleString()} kg procesados</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className={`font-bold ${t.contaminationPercent <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.contaminationPercent.toFixed(2)}%
                  </div>
                  <div className="text-[9px] text-slate-400">{t.contaminationKg} kg merma</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente (#22) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Actividad Reciente
              </h3>
              <p className="text-xs text-slate-500">
                Bitácora en vivo de inspecciones y cambios
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('configuracion')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Auditoría
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => {
              const uName = log.userName || log.user;
              const uAvatar = log.userAvatar || '/assets/marcos-salinas.svg';
              const logTime = log.time || log.timestamp;
              return (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                    <img src={uAvatar} alt={uName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{uName}</span>
                      <span className="text-[9px] font-mono text-slate-400">{logTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {log.action}: <span className="font-mono text-blue-600 dark:text-cyan-400">{log.affectedRecord || log.newValue || log.details}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 7: Galería de Evidencias Digitales (#23, #55) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Evidencias Digitales & Registros Visuales en Planta
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                Fotos & Videos
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Inspecciones fotográficas Antes/Después y videos técnicos de corte y molienda
            </p>
          </div>

          <button
            onClick={() => onOpenEvidence(evidences[0])}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Abrir Galería Completa ({evidences.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Evidence Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidences.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onOpenEvidence(ev)}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 flex flex-col"
            >
              <div className="relative h-36 bg-black overflow-hidden flex items-center justify-center">
                {ev.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                    <img 
                      src={ev.fileUrl} 
                      alt={ev.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                      Video • {ev.videoDuration || '00:48'}
                    </span>
                  </div>
                ) : (
                  <img
                    src={ev.fileUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                )}
                {ev.phase && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono ${
                    ev.phase === 'Antes' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {ev.phase}
                  </span>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {ev.location} • {ev.capturedAt}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{ev.code}</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold group-hover:underline">Ver detalle</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
