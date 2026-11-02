import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Notification / Alert Banner Component
 */
export const Notification = ({
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  title,
  message,
  onClose,
  className = '',
}) => {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
  };

  const styleMap = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-sky-50 border-sky-200 text-sky-900',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm shadow-sm ${styleMap[type] || styleMap.info} ${className}`}>
      {iconMap[type] || iconMap.info}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        {message && <p className="opacity-90 leading-relaxed text-xs sm:text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 opacity-70 hover:opacity-100 transition"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Notification;
