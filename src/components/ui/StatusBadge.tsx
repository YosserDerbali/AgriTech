import { cn } from '@/lib/utils';
import { DiagnosisStatus } from '@/types/diagnosis';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: DiagnosisStatus;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    icon: Clock,
    className: 'status-pending',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'status-approved',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    className: 'status-rejected',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
