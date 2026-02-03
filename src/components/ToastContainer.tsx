import { useToastContext } from '@/contexts/ToastContext';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`glass-card px-4 py-3 flex items-center gap-3 animate-fade-in ${
            toast.type === 'success' ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-destructive'
          }`}
        >
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
