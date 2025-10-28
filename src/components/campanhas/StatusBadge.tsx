import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Ativo' | 'Suspensa' | 'Cancelada' | 'Concluída' | 'Agendada';
}

const statusColors = {
  Ativo: 'bg-green-500 hover:bg-green-600',
  Suspensa: 'bg-orange-500 hover:bg-orange-600',
  Cancelada: 'bg-red-500 hover:bg-red-600',
  Concluída: 'bg-gray-500 hover:bg-gray-600',
  Agendada: 'bg-blue-500 hover:bg-blue-600',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={`${statusColors[status]} text-white font-semibold uppercase text-xs px-3 py-1 rounded-full`}
    >
      {status}
    </Badge>
  );
}
