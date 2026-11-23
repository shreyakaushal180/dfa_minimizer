import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'magic';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type = 'info', duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, title, description, type, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-[#f4faee] border-[#a3d99e] text-[#1c5421]',
            info: 'bg-[#f4f7fe] border-[#b5c7f7] text-[#1c2e60]',
            warning: 'bg-[#fffbeb] border-[#fde68a] text-[#854d0e]',
            magic: 'bg-[#faf5ff] border-[#e9d5ff] text-[#581c87]',
          }[toast.type || 'info'];

          const icon = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
            warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
            magic: <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />,
          }[toast.type || 'info'];

          return (
            <div
              key={toast.id}
              className={`animate-toast pointer-events-auto relative overflow-hidden flex items-start gap-3 p-3.5 rounded-xl border shadow-xl transition-all duration-200 ${typeStyles}`}
              style={{
                boxShadow: '0 8px 24px -3px rgba(0, 0, 0, 0.25), 0 3px 6px -2px rgba(0, 0, 0, 0.1)',
              }}
            >
              {icon}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs opacity-90 mt-0.5 font-normal leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 transition p-0.5 rounded-md -mr-1 -mt-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
