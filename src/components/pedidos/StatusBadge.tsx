import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pendente: {
      label: 'Pendente',
      className: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/30 dark:text-orange-400',
      icon: '⏳'
    },
    pago: {
      label: 'Pago',
      className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-400',
      icon: '✅'
    },
    cancelado: {
      label: 'Cancelado',
      className: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400',
      icon: '❌'
    },
    reembolsado: {
      label: 'Reembolsado',
      className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-950/30 dark:text-gray-400',
      icon: '💸'
    }
  };

  const statusLower = status.toLowerCase();
  const statusConfig = config[statusLower as keyof typeof config] || config.pendente;

  return (
    <Badge variant="outline" className={statusConfig.className}>
      <span className="mr-1">{statusConfig.icon}</span>
      {statusConfig.label}
    </Badge>
  );
}
