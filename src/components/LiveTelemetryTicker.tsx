import { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Sparkles, 
  Radio, 
  AlertCircle,
  Thermometer,
  Gauge
} from 'lucide-react';

interface LiveTelemetryTickerProps {
  isDarkTheme: boolean;
  onOpenCommandPalette: () => void;
}

export default function LiveTelemetryTicker({ isDarkTheme, onOpenCommandPalette }: LiveTelemetryTickerProps) {
  const [tickerTime, setTickerTime] = useState<string>('');
  const [pulsePing, setPulsePing] = useState(18);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTickerTime(now.toLocaleTimeString('es-PE', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slight jitter in ping for hyper-real telemetry
  useEffect(() => {
    const pingInterval = setInterval(() => {
      setPulsePing(Math.floor(16 + Math.random() * 6));
    }, 4000);
    return () => clearInterval(pingInterval);
  }, []);

  return (
    <div className={`w-full border-b transition-colors ${
      isDarkTheme 
        ? 'bg-slate-950/90 border-slate-800 text-slate-300' 
        : 'bg-slate-900 text-slate-200 border-slate-800'
    } py-1.5 px-4 text-[11px] font-mono select-none overflow-x-auto scrollbar-none`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left items: Live beacon and Plant status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-bold tracking-wider">LIVE TELEMETRY</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>PLANTA BUREO:</span>
            <span className="text-cyan-400 font-semibold">PAITA / CHIMBOTE</span>
          </div>

          <div className="h-3 w-px bg-slate-700 hidden md:block"></div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span>GAS API:</span>
            <span className="text-emerald-400">{pulsePing}ms</span>
          </div>
        </div>

        {/* Center scrolling / stat pills */}
        <div className="hidden lg:flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-blue-400" />
            <span className="text-slate-400">ICG:</span>
            <span className="text-white font-bold">94.8%</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-teal-400" />
            <span className="text-slate-400">NetPositiva:</span>
            <span className="text-teal-300 font-bold">842.6 Ton</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400">Extrusora #1:</span>
            <span className="text-amber-300 font-medium">214°C</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span className="text-slate-400">Alerta:</span>
            <span className="text-rose-400 font-bold">NC-004 Criba #2</span>
          </div>
        </div>

        {/* Right: Realtime Clock & Command bar trigger */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-cyan-500/50 text-[10px]"
            title="Abrir Command Deck (Ctrl+K / ⌘K)"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Comandos</span>
            <kbd className="px-1 py-0.2 bg-slate-900 rounded border border-slate-700 text-[9px] text-slate-400">⌘K</kbd>
          </button>

          <div className="text-slate-400 font-mono">
            {tickerTime || '10:00:00'}
          </div>
        </div>
      </div>
    </div>
  );
}
