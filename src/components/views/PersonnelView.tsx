import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Award,
  UserCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface PersonnelViewProps {
  users: UserProfile[];
  onAddUser?: (user: UserProfile) => void;
  isDarkTheme?: boolean;
}

export default function PersonnelView({
  users,
  onAddUser,
  isDarkTheme = false
}: PersonnelViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('TODOS');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'TODOS' || u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                  Talento Humano & Competencias
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
                  ISO 9001: 7.2
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Directorio de Personal & Responsables de Calidad
              </h2>
              <p className="text-xs text-slate-500">
                Supervisores en planta, analistas de laboratorio y auditores líderes con asignación de roles RBAC.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Personal</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cargo, departamento..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
        >
          <option value="TODOS">Todos los Roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="GERENTE">Gerente</option>
          <option value="SUPERVISOR DE CALIDAD">Supervisor de Calidad</option>
          <option value="CONSULTA">Consulta / Auditor Externo</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${
              isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/30"
                  referrerPolicy="no-referrer"
                />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  user.role === 'ADMINISTRADOR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                  user.role === 'GERENTE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  user.role === 'SUPERVISOR DE CALIDAD' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {user.jobTitle}
                </p>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  {user.department}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 truncate" title={user.email}>
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px]">{user.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.status}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{user.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New User Modal */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
            isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">Registrar Nuevo Colaborador</h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Nombre Completo</label>
                <input type="text" placeholder="ej: Ing. Mario Delgado" className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Cargo / Puesto</label>
                  <input type="text" placeholder="ej: Inspector de Línea" className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Rol en Sistema</label>
                  <select className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold">
                    <option value="SUPERVISOR DE CALIDAD">Supervisor de Calidad</option>
                    <option value="CONSULTA">Consulta</option>
                    <option value="GERENTE">Gerente</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Correo Corporativo</label>
                <input type="email" placeholder="mario.delgado@bureo.co" className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button onClick={() => setIsNewUserModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs">
                Cancelar
              </button>
              <button onClick={() => setIsNewUserModalOpen(false)} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
