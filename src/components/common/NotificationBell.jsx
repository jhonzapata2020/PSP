import React, { useState } from 'react';
import { Bell, Check, Sparkles, Building2, MessageSquare, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nueva iniciativa en Puerto Antioquia',
      description: 'Convocatoria abierta para proveedores locales de logística y transporte en Urabá.',
      icon: Building2,
      time: 'Hace 10 min',
      unread: true
    },
    {
      id: 2,
      title: 'Comentario en Foro Social',
      description: 'Ing. Carmen Rosa respondió a la propuesta de Sostenibilidad Agro-industrial.',
      icon: MessageSquare,
      time: 'Hace 1 hora',
      unread: true
    },
    {
      id: 3,
      title: 'Capacitación SENA Urabá',
      description: 'Taller presencial gratuito de E-commerce y Marketing este viernes en Apartadó.',
      icon: Sparkles,
      time: 'Hace 3 horas',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-psp-cyan rounded-full animate-ping" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-psp-cyan rounded-full" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-psp-dark-card border border-slate-700/60 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-800/80 flex items-center justify-between border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-psp-cyan" />
              <span className="text-sm font-bold text-white">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-psp-cyan text-slate-900 rounded-full">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-psp-cyan hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`p-4 transition-colors ${
                    n.unread ? 'bg-psp-cyan/5 hover:bg-psp-cyan/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-xl bg-slate-800 text-psp-cyan flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] text-slate-500 mt-2 block">{n.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
