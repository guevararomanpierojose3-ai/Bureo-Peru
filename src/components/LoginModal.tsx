import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2,
  X
} from 'lucide-react';
import { CompanyConfig, UserProfile, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  companyConfig: CompanyConfig;
  users: UserProfile[];
  onLoginAsUser: (user: UserProfile) => void;
  isDarkTheme?: boolean;
}

export default function LoginModal({
  isOpen,
  onClose,
  companyConfig,
  users,
  onLoginAsUser,
  isDarkTheme = false
}: LoginModalProps) {
  const [username, setUsername] = useState('marcos.salinas@bureo.co');
  const [password, setPassword] = useState('********');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find(u => u.email.toLowerCase() === username.toLowerCase()) || users[0];
    setMessage(`Iniciando sesión como ${matched.name} (${matched.role})...`);
    setTimeout(() => {
      onLoginAsUser(matched);
      if (onClose) onClose();
      setMessage(null);
    }, 600);
  };

  const handleQuickRole = (role: UserRole) => {
    const userForRole = users.find(u => u.role === role) || users[0];
    onLoginAsUser(userForRole);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isDarkTheme 
          ? 'bg-slate-900 border-slate-700 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-center relative bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="mx-auto w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shadow-md mb-3">
            {companyConfig.logoUrl ? (
              <img 
                src={companyConfig.logoUrl} 
                alt={companyConfig.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Building2 className="w-8 h-8 text-blue-600" />
            )}
          </div>

          <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
            {companyConfig.name}
          </h3>
          <p className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 mt-0.5">
            SISTEMA WEB DE GESTIÓN DE CALIDAD
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Control de Calidad, Contaminación, Trazabilidad, NC y CAPA
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Usuario o Correo Corporativo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: marcos.salinas@bureo.co"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 font-sans"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Para restablecer contraseña, comunícate con el Administrador del sistema: calidad.peru@bureo.co')}
              className="text-blue-600 dark:text-cyan-400 hover:underline font-bold text-xs"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {message && (
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 animate-spin" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Role Tester Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-[10px] font-bold uppercase text-slate-500 font-mono mb-2 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            Acceso Rápido por Rol (Simulación Empresarial):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRole('GERENTE')}
              className="px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px]">👔 GERENTE</div>
              <div className="text-[9px] text-slate-500">Dashboard & Análisis</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('SUPERVISOR DE CALIDAD')}
              className="px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px]">🔬 SUPERVISOR QA</div>
              <div className="text-[9px] text-slate-500">Registro, NC & Planta</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('ADMINISTRADOR')}
              className="px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px]">🛡️ ADMINISTRADOR</div>
              <div className="text-[9px] text-slate-500">Control total & Sheets</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('CONSULTA')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px]">👁️ AUDITOR CONSULTA</div>
              <div className="text-[9px] text-slate-500">Solo lectura autorizada</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
